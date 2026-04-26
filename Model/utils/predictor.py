"""
utils/predictor.py
==================
Loads the trained CNN and exposes:
  • predict(pil_image)  → (label, confidence, class_names, probs)
  • explain(pil_image)  → (heatmap_pil, face_pil, detections_pil)
"""

import os
import io
import numpy as np
import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image
import cv2
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from scipy.ndimage import gaussian_filter

# LIME
from lime import lime_image
from skimage.segmentation import slic

# ── Config ────────────────────────────────────────────────────────────────────
MODEL_PATH  = os.path.join(os.path.dirname(__file__), "..", "models", "skin_model.pt")
DEVICE      = "cuda" if torch.cuda.is_available() else "cpu"
IMG_SIZE    = 224

_NORM_MEAN = [0.485, 0.456, 0.406]
_NORM_STD  = [0.229, 0.224, 0.225]

preprocess = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(_NORM_MEAN, _NORM_STD),
])

# ── Build model architecture ──────────────────────────────────────────────────
def _build_model(num_classes: int) -> nn.Module:
    model = models.mobilenet_v2(weights=None)
    in_features = model.classifier[1].in_features
    model.classifier = nn.Sequential(
        nn.Dropout(0.3),
        nn.Linear(in_features, 256),
        nn.ReLU(),
        nn.Dropout(0.2),
        nn.Linear(256, num_classes),
    )
    return model

# ── Lazy singleton ─────────────────────────────────────────────────────────────
_model       = None
_class_names = None

def _load_model():
    global _model, _class_names
    if _model is not None:
        return
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model file not found at {MODEL_PATH}. Run train_model.py first.")
    
    ckpt = torch.load(MODEL_PATH, map_location=DEVICE)
    _class_names = ckpt["class_names"]
    _model = _build_model(len(_class_names))
    _model.load_state_dict(ckpt["model_state"])
    _model.eval().to(DEVICE)

# ── Face Detection ────────────────────────────────────────────────────────────
def crop_face(pil_img, pad=0.20):
    arr  = np.array(pil_img.convert("RGB"))
    gray = cv2.cvtColor(arr, cv2.COLOR_RGB2GRAY)
    det  = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    faces = det.detectMultiScale(gray, 1.1, 5, minSize=(60,60))
    if len(faces) == 0:
        faces = det.detectMultiScale(gray, 1.05, 3, minSize=(40,40))
    
    if len(faces) == 0:
        return pil_img, None, arr          # fallback: full image
        
    x,y,w,h = max(faces, key=lambda f: f[2]*f[3])
    H,W     = arr.shape[:2]
    px,py   = int(w*pad), int(h*pad)
    x1,y1   = max(0,x-px), max(0,y-py)
    x2,y2   = min(W,x+w+px), min(H,y+h+py)
    
    vis = arr.copy()
    cv2.rectangle(vis,(x1,y1),(x2,y2),(0,220,170),max(2,W//180))
    
    return Image.fromarray(arr[y1:y2,x1:x2]), (x1,y1,x2-x1,y2-y1), vis

# ── Predict ───────────────────────────────────────────────────────────────────
def predict(pil_image: Image.Image):
    _load_model()
    face_pil, face_box, _ = crop_face(pil_image)
    tensor = preprocess(face_pil.convert("RGB")).unsqueeze(0).to(DEVICE)
    with torch.no_grad():
        logits = _model(tensor)
        probs  = torch.softmax(logits, dim=1).cpu().numpy()[0]
    idx = int(probs.argmax())
    label = _class_names[idx]
    confidence = float(probs[idx])
    
    # ── 3-Category Logic ──────────────────────────────────────────────────────
    # Mapping binary confidence to 3 buckets: Hydrated, Normal, Dehydrated
    # hydrated index is usually 1, dehydrated is 0.
    p_hydrated = probs[1] if len(probs) > 1 else (1 - probs[0] if label == "dehydrated" else probs[0])
    
    if p_hydrated > 0.80:
        final_label = "hydrated"
    elif p_hydrated < 0.45:
        final_label = "dehydrated"
    else:
        final_label = "normal"
    
    return final_label, confidence, _class_names, probs

def _batch_predict(np_images: np.ndarray) -> np.ndarray:
    _load_model()
    tensors = []
    for img in np_images:
        pil = Image.fromarray(img.astype(np.uint8))
        tensors.append(preprocess(pil))
    batch = torch.stack(tensors).to(DEVICE)
    with torch.no_grad():
        logits = _model(batch)
        probs  = torch.softmax(logits, dim=1).cpu().numpy()
    return probs

# ── Explain (Smooth LIME Heatmap) ─────────────────────────────────────────────
def explain(pil_img, n_samples=500, n_segments=80):
    """
    Generates a smooth LIME heatmap specifically for the face region.
    Returns: (heatmap_pil, face_pil, original_with_box_pil)
    """
    _load_model()
    face_pil, face_box, orig_vis = crop_face(pil_img)
    face_rgb = np.array(face_pil.convert("RGB").resize((IMG_SIZE, IMG_SIZE)))

    explainer   = lime_image.LimeImageExplainer()
    explanation = explainer.explain_instance(
        face_rgb, _batch_predict,
        top_labels=1, hide_color=0,
        num_samples=n_samples,
        segmentation_fn=lambda x: slic(x, n_segments=n_segments, compactness=15, sigma=1, start_label=0)
    )

    pred_probs = _batch_predict(face_rgb[None])[0]
    pred_idx   = int(pred_probs.argmax())
    label_name = _class_names[pred_idx].upper()
    confidence = float(pred_probs[pred_idx])

    # Build smooth pixel-level heatmap
    seg_map   = explanation.segments
    local_exp = dict(explanation.local_exp[pred_idx])
    heat_map  = np.zeros(seg_map.shape, dtype=np.float32)
    for seg_id, weight in local_exp.items():
        heat_map[seg_map == seg_id] = weight

    heat_smooth = gaussian_filter(heat_map, sigma=12)
    vmax = np.abs(heat_smooth).max() + 1e-8
    heat_norm = heat_smooth / vmax

    # Skin detection for masking
    hsv  = cv2.cvtColor(face_rgb, cv2.COLOR_RGB2HSV)
    skin_mask = ((hsv[:,:,0] <= 25) & (hsv[:,:,1] >= 20) & (hsv[:,:,2] >= 40)).astype(np.float32)
    
    # Soft ellipse mask
    H, W = face_rgb.shape[:2]
    yy, xx = np.ogrid[:H, :W]
    ellipse = np.clip(1.2 - ((xx-W*0.5)/(W*0.45))**2 - ((yy-H*0.48)/(H*0.55))**2, 0, 1)
    
    combined_mask = gaussian_filter(skin_mask * ellipse, sigma=9)
    combined_mask /= (combined_mask.max() + 1e-8)
    heat_norm *= combined_mask

    # Define color logic
    pos, neg = np.where(heat_norm > 0, heat_norm, 0), np.where(heat_norm < 0, -heat_norm, 0)
    if label_name == "DEHYDRATED":
        dehydrated_heat, healthy_heat = pos, neg
    else:
        dehydrated_heat, healthy_heat = neg, pos

    # Boost contrast
    dehydrated_heat = np.power(dehydrated_heat, 0.55) * combined_mask
    healthy_heat    = np.power(healthy_heat, 0.55) * combined_mask

    # Confidence-aware logic
    conf_strength = np.clip((confidence - 0.5) * 2.0, 0.0, 1.0)
    dominant_alpha, opponent_alpha = 0.45 + conf_strength * 0.45, 0.55 - conf_strength * 0.50
    
    if label_name == "HYDRATED":
        green_alpha, red_alpha = dominant_alpha, opponent_alpha
    else:
        red_alpha, green_alpha = dominant_alpha, opponent_alpha

    # Create RGBA overlays
    red_rgba = np.zeros((*face_rgb.shape[:2], 4), dtype=np.float32)
    red_rgba[..., 0], red_rgba[..., 3] = 1.0, np.clip(dehydrated_heat * red_alpha, 0, 1)
    
    green_rgba = np.zeros((*face_rgb.shape[:2], 4), dtype=np.float32)
    green_rgba[..., 1], green_rgba[..., 2], green_rgba[..., 3] = 0.95, 0.20, np.clip(healthy_heat * green_alpha, 0, 1)

    # Render Heatmap Image
    fig, ax = plt.subplots(figsize=(6, 6), facecolor="none")
    ax.imshow(face_rgb)
    ax.imshow(red_rgba)
    ax.imshow(green_rgba)
    ax.axis("off")
    
    buf = io.BytesIO()
    plt.savefig(buf, format="png", dpi=120, bbox_inches="tight", transparent=True)
    plt.close(fig)
    buf.seek(0)
    heatmap_pil = Image.open(buf).copy()

    return heatmap_pil, face_pil, Image.fromarray(orig_vis)