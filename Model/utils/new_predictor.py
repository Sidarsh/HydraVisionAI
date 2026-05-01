# utils/predictor.py (PRODUCTION-READY + CONSISTENT), in case previous fails

import os
import io
import logging
import numpy as np
import cv2
from PIL import Image
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from scipy.ndimage import gaussian_filter

from lime import lime_image
from skimage.segmentation import slic

import tensorflow as tf
from tensorflow import keras

# ── Logging ───────────────────────────────────────────────────────────────────

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ── Config ────────────────────────────────────────────────────────────────────

_model_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(_model_dir, "hydration_model.h5")

IMG_SIZE = 224

_model = None
_class_names = ["dehydrated", "hydrated"]

# ── Load Model ────────────────────────────────────────────────────────────────

def _load_model():
    global _model

    if _model is not None:
        return

    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model not found at {MODEL_PATH}")

    try:
        _model = keras.models.load_model(MODEL_PATH)
        logger.info("✅ Model loaded successfully (Keras)")
    except Exception as e:
        logger.exception("❌ Failed to load model")
        raise e

# ── Face Detection ────────────────────────────────────────────────────────────

def crop_face(pil_img):
    try:
        arr = np.array(pil_img)
        gray = cv2.cvtColor(arr, cv2.COLOR_RGB2GRAY)

        det = cv2.CascadeClassifier(
            cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
        )

        faces = det.detectMultiScale(gray, 1.3, 5)

        if len(faces) == 0:
            logger.warning("No face detected, using full image")
            return pil_img, None, arr

        x, y, w, h = faces[0]
        face = arr[y:y+h, x:x+w]

        return Image.fromarray(face), (x, y, w, h), arr

    except Exception as e:
        logger.exception("Face detection failed, fallback to full image")
        return pil_img, None, np.array(pil_img)

# ── Preprocess ────────────────────────────────────────────────────────────────

def _preprocess(pil_img):
    try:
        img = pil_img.convert("RGB")
        img = img.resize((IMG_SIZE, IMG_SIZE))
        arr = np.array(img) / 255.0
        arr = np.expand_dims(arr, axis=0)
        if arr.min() < 0 or arr.max() > 1:
            logger.warning(f"Input out of range: {arr.min()}–{arr.max()}")

        return arr

    except Exception as e:
        logger.exception("Preprocessing failed")
        raise e

# ── Predict ───────────────────────────────────────────────────────────────────

def predict(pil_image: Image.Image):
    _load_model()
    try:
        face_pil, _, _ = crop_face(pil_image)
        processed = _preprocess(face_pil)

        pred = _model.predict(processed, verbose=0)[0][0]

        hydrated_prob = float(pred)
        dehydrated_prob = 1 - hydrated_prob

        probs = np.array([dehydrated_prob, hydrated_prob])

        # Hydration scoring
        hydration_score = hydrated_prob * 100

        if hydration_score >= 70:
            final_label = "hydrated"
        elif hydration_score < 40:
            final_label = "dehydrated"
        else:
            final_label = "normal"

        logger.info(f"Prediction: {final_label} ({hydrated_prob:.3f})")

        return final_label, hydrated_prob, _class_names, probs

    except Exception as e:
        logger.exception("Prediction failed")

        # Safe fallback
        return "Error", 0.0, _class_names, np.array([0.5, 0.5])

# ── Batch Predict (LIME SAFE) ─────────────────────────────────────────────────

def _batch_predict(images):
    _load_model()

    processed = []
    for img in images:
        try:
            pil = Image.fromarray(img).convert("RGB")
            pil = pil.resize((IMG_SIZE, IMG_SIZE))
            arr = np.array(pil) / 255.0
            processed.append(arr)
        except Exception as e:
            logger.warning("Bad image in batch, using zeros")
            processed.append(np.zeros((IMG_SIZE, IMG_SIZE, 3)))

    batch = np.stack(processed)

    preds = _model.predict(batch, verbose=0)

    probs = []
    for p in preds:
        hydrated = float(p[0])
        dehydrated = 1 - hydrated
        probs.append([dehydrated, hydrated])

    return np.array(probs)


# ── Explain (LIME) ────────────────────────────────────────────────────────────

def explain(pil_img, n_samples=500, n_segments=80):
    _load_model()

    try:
        face_pil, _, orig_vis = crop_face(pil_img)
        face_rgb = np.array(face_pil.convert("RGB").resize((IMG_SIZE, IMG_SIZE)))

        label, _, _, probs = predict(pil_img)
        pred_idx = int(probs.argmax())

        explainer = lime_image.LimeImageExplainer()

        explanation = explainer.explain_instance(
            face_rgb,
            _batch_predict,
            top_labels=2,
            hide_color=0,
            num_samples=n_samples,
            segmentation_fn=lambda x: slic(
                x,
                n_segments=n_segments,
                compactness=15,
                sigma=1,
                start_label=0,
            ),
        )

        seg_map = explanation.segments
        local_exp = dict(explanation.local_exp[pred_idx])

        heat_map = np.zeros(seg_map.shape, dtype=np.float32)
        for seg_id, weight in local_exp.items():
            heat_map[seg_map == seg_id] = weight

        heat_smooth = gaussian_filter(heat_map, sigma=12)
        vmax = np.abs(heat_smooth).max() + 1e-8
        heat_norm = heat_smooth / vmax

        fig, ax = plt.subplots(figsize=(6, 6), facecolor="none")
        ax.imshow(face_rgb)
        ax.imshow(heat_norm, cmap="jet", alpha=0.5)
        ax.axis("off")

        buf = io.BytesIO()
        plt.savefig(buf, format="png", dpi=120, bbox_inches="tight", transparent=True)
        plt.close(fig)
        buf.seek(0)

        heatmap_pil = Image.open(buf).copy()

        return heatmap_pil, face_pil, Image.fromarray(orig_vis)

    except Exception as e:
        logger.exception("Explain failed")

        # Safe fallback image
        blank = Image.new("RGB", (IMG_SIZE, IMG_SIZE), color="gray")
        return blank, pil_img, pil_img
