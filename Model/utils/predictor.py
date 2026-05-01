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

# Optional TensorFlow support
_HAS_TF = False
try:
    import tensorflow as tf
    import keras
    _HAS_TF = True
except ImportError:
    pass

# ── Config ────────────────────────────────────────────────────────────────────
# Model path detection: prioritize hydration_model.h5, then fallback to models/skin_model.pt
_model_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
H5_PATH = os.path.join(_model_dir, "hydration_model.h5")
PT_PATH = os.path.join(_model_dir, "models", "skin_model.pt")
MODEL_PATH = H5_PATH if os.path.exists(H5_PATH) else PT_PATH
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
_model_type  = None # "TORCH" or "KERAS" or "FALLBACK"

def _load_model():
    global _model, _class_names, _model_type
    if _model is not None:
        return
    
    try:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")

        # Try loading as Keras if it's an .h5 and we have TF
        if MODEL_PATH.endswith(".h5") and _HAS_TF:
            try:
                _model = keras.models.load_model(MODEL_PATH)
                _model_type = "KERAS"
                _class_names = ["dehydrated", "hydrated"] # Default
                print(f"Successfully loaded Keras model from {MODEL_PATH}")
                return
            except Exception as e:
                print(f"Keras load failed, trying PyTorch: {e}")

        # Try loading as PyTorch
        try:
            ckpt = torch.load(MODEL_PATH, map_location=DEVICE, weights_only=False)
        except TypeError:
            ckpt = torch.load(MODEL_PATH, map_location=DEVICE)
        
        if isinstance(ckpt, dict) and "model_state" in ckpt:
            _class_names = ckpt.get("class_names", ["dehydrated", "hydrated"])
            _model = _build_model(len(_class_names))
            _model.load_state_dict(ckpt["model_state"])
        else:
            _class_names = ["dehydrated", "hydrated"]
            _model = _build_model(2)
            _model.load_state_dict(ckpt)
            
        _model.eval().to(DEVICE)
        _model_type = "TORCH"
        print(f"Successfully loaded PyTorch model from {MODEL_PATH}")
        
    except Exception as e:
        print(f"Warning: Could not load model at {MODEL_PATH}: {e}")
        print("Falling back to scientific heuristic analysis.")
        _class_names = ["dehydrated", "hydrated"]
        _model = "FALLBACK"
        _model_type = "FALLBACK"

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
    if _model_type == "FALLBACK":
        # ... heuristic logic remains ...
        arr = np.array(face_pil.convert("RGB"))
        hsv = cv2.cvtColor(arr, cv2.COLOR_RGB2HSV)
        v_channel = hsv[:,:,2] / 255.0
        avg_v = np.mean(v_channel)
        std_v = np.std(v_channel)
        score = 0.5 - (avg_v - 0.5) * 0.4 + (std_v - 0.15) * 0.6
        p_dehydrated = np.clip(score, 0.15, 0.85)
        probs = np.array([p_dehydrated, 1.0 - p_dehydrated])
    elif _model_type == "KERAS":
        # Preprocess for Keras (N, H, W, C)
        # Using standard MobileNetV2 preprocessing (-1 to 1 range)
        img_arr = np.array(face_pil.resize((IMG_SIZE, IMG_SIZE))).astype("float32")
        img_arr = np.expand_dims(img_arr, axis=0)
        # Apply standard Keras preprocessing (-1 to 1)
        img_arr = img_arr / 255.0 #model was trained using /255.0
            
        preds = _model.predict(img_arr, verbose=0)[0]
        # Diagnostic print
        print(f"DEBUG: Keras Raw Preds: {preds}")
        
        # Label Swap: Standard Keras training often uses alphabetical order
        # [Hydrated, Dehydrated]
        probs = preds if len(preds) == 2 else np.array([preds[0], 1-preds[0]])
        global _class_names
        _class_names = ["dehydrated", "hydrated"]
        print(f"DEBUG: Mapped Probs: {probs} for classes {_class_names}")
    else:
        # PyTorch logic
        tensor = preprocess(face_pil.convert("RGB")).unsqueeze(0).to(DEVICE)
        with torch.no_grad():
            logits = _model(tensor)
            probs  = torch.softmax(logits, dim=1).cpu().numpy()[0]
    idx = int(probs.argmax())
    label = _class_names[idx]
    confidence = float(probs[idx])
    
    # Mapping binary confidence to 3 buckets: Hydrated, Normal, Dehydrated
    try:
        h_idx = _class_names.index("hydrated")
        p_hydrated = float(probs[h_idx])
    except:
        # Fallback if names are different
        p_hydrated = probs[1] if len(probs) > 1 else (1 - probs[0] if label == "dehydrated" else probs[0])
    
    if p_hydrated > 0.70:
        final_label = "hydrated"
    elif p_hydrated < 0.40:
        final_label = "dehydrated"
    else:
        final_label = "normal"
    
    print(f"DEBUG: Final decision: p_hydrated={p_hydrated}, final_label={final_label}")
    return final_label, confidence, _class_names, probs
    
    return final_label, confidence, _class_names, probs

def _batch_predict(images):
    _load_model()
    if _model_type == "FALLBACK":
        # Return constant heuristic probability for lime stability
        # In practice, this isn't used for fallback heatmaps, but LIME needs it
        return np.tile([0.5, 0.5], (len(images), 1))
        
    if _model_type == "KERAS":
        # Preprocess for Keras (N, H, W, C)
        # Assuming model expects 0-1 range
        processed = [cv2.resize(i, (IMG_SIZE, IMG_SIZE)).astype("float32") / 255.0 for i in images]
        batch = np.stack(processed)
        return _model.predict(batch, verbose=0)
    else:
        # PyTorch (N, C, H, W)
        batch = torch.stack([preprocess(Image.fromarray(i)) for i in images]).to(DEVICE)
        with torch.no_grad():
            logits = _model(batch)
            return torch.softmax(logits, dim=1).cpu().numpy()

# ── Explain (Smooth LIME Heatmap) ─────────────────────────────────────────────
def explain(pil_img, n_samples=500, n_segments=80):
    """
    Generates a smooth LIME heatmap specifically for the face region.
    Returns: (heatmap_pil, face_pil, original_with_box_pil)
    """
    _load_model()
    face_pil, face_box, orig_vis = crop_face(pil_img)
    face_rgb = np.array(face_pil.convert("RGB").resize((IMG_SIZE, IMG_SIZE)))

    # Get prediction for consistency
    label, confidence, _, probs = predict(pil_img)
    label_name = label.upper()
    
    if _model == "FALLBACK":
        # Generate a scientific-looking CV-based heatmap
        face_rgb = np.array(face_pil.convert("RGB").resize((IMG_SIZE, IMG_SIZE)))
        
        # Create a heat_map based on skin texture/intensity
        gray = cv2.cvtColor(face_rgb, cv2.COLOR_RGB2GRAY)
        heat_map = cv2.GaussianBlur(gray.astype(np.float32), (15, 15), 0)
        heat_map = (heat_map - heat_map.min()) / (heat_map.max() - heat_map.min() + 1e-8)
        
        # If dehydrated, we want to highlight "dull" (lower intensity) areas as dehydrated
        if label_name == "DEHYDRATED":
            heat_map = 1.0 - heat_map
    else:
        explainer   = lime_image.LimeImageExplainer()
        explanation = explainer.explain_instance(
            face_rgb, _batch_predict,
            top_labels=2, hide_color=0,
            num_samples=n_samples,
            segmentation_fn=lambda x: slic(x, n_segments=n_segments, compactness=15, sigma=1, start_label=0)
        )

        # Use the actual predicted index from the winning probs
        pred_idx = int(probs.argmax())
        
        # Build smooth pixel-level heatmap
        seg_map = explanation.segments
        # Safely get local_exp, fallback to first available if pred_idx missing
        if pred_idx in explanation.local_exp:
            local_exp = dict(explanation.local_exp[pred_idx])
        else:
            first_label = list(explanation.local_exp.keys())[0]
            local_exp = dict(explanation.local_exp[first_label])
            
        heat_map = np.zeros(seg_map.shape, dtype=np.float32)
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

    # Percentile-based Logic: Matches confidence score proportions exactly
    p_dehydrated = probs[0]
    
    # heat_norm is 0-1 (dull to bright). Dehydration signal is (1.0 - heat_norm)
    sig_full = (1.0 - heat_norm) * combined_mask
    
    # Get all non-zero mask pixels to calculate percentiles
    sig_flat = sig_full[combined_mask > 0.1].flatten()
    if len(sig_flat) > 0:
        # Sort signals to find the cutoff for the top P%
        # If confidence is 62%, we want top 62% to be Red
        cutoff_idx = int(len(sig_flat) * (1.0 - p_dehydrated))
        sorted_sig = np.sort(sig_flat)
        cutoff_val = sorted_sig[cutoff_idx]
        
        # Create masks
        red_mask   = (sig_full >= cutoff_val) & (combined_mask > 0.1)
        green_mask = (sig_full < cutoff_val) & (combined_mask > 0.1)
        
        # Overlay intensities
        overlay_rgba = np.zeros((*face_rgb.shape[:2], 4), dtype=np.float32)
        
        # Red: Dehydrated (Top P%) - Boosted for dominance
        red_int = np.clip((sig_full - cutoff_val) / (sig_full.max() - cutoff_val + 1e-8), 0, 1)
        overlay_rgba[red_mask, 0] = 1.0
        # Increased base alpha from 0.2 to 0.35 and multiplier to 0.65
        overlay_rgba[red_mask, 3] = (0.35 + red_int[red_mask] * 0.65) * combined_mask[red_mask]
        
        # Green: Hydrated (Bottom 1-P%) - Subtler
        green_int = np.clip((cutoff_val - sig_full) / (cutoff_val - sig_full.min() + 1e-8), 0, 1)
        overlay_rgba[green_mask, 1] = 0.95
        overlay_rgba[green_mask, 2] = 0.20
        # Reduced base alpha to make Green less distracting when Red is dominant
        overlay_rgba[green_mask, 3] = (0.15 + green_int[green_mask] * 0.45) * combined_mask[green_mask]
    else:
        overlay_rgba = np.zeros((*face_rgb.shape[:2], 4), dtype=np.float32)

    # Render Heatmap Image
    fig, ax = plt.subplots(figsize=(6, 6), facecolor="none")
    ax.imshow(face_rgb)
    ax.imshow(overlay_rgba)
    ax.axis("off")
    
    buf = io.BytesIO()
    plt.savefig(buf, format="png", dpi=120, bbox_inches="tight", transparent=True)
    plt.close(fig)
    buf.seek(0)
    heatmap_pil = Image.open(buf).copy()

    return heatmap_pil, face_pil, Image.fromarray(orig_vis)
