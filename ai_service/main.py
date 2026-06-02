"""
============================================================
  DENT AI — FastAPI Production Microservice Layer
  Project : DENT AI Smart Dental Diagnosis (P24F25)
  Author  : Faran Khalil (SE221057)
  Version : 2.5
============================================================
"""

import os
import io
import base64
import cv2
import numpy as np
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO

app = FastAPI(title="DENT AI Inference Engine", version="2.5")

# Enabling Global Access via CORS for secure internal micro-routing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auto-resolve relative model weight pathways safely
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(CURRENT_DIR, "models", "BEST_model.pt")

if not os.path.exists(MODEL_PATH):
    raise RuntimeError(f"CRITICAL ERROR: Weight metrics profile not found at {MODEL_PATH}")

model = YOLO(MODEL_PATH)

# Clinical Stage Explanations Map
stage_explanations = {
    "enamel_caries"   : "Early stage. Only the outer tooth layer (enamel) is affected. Treatment is simple and the cavity can still be reversed with fluoride.",
    "dentin_caries"   : "Middle stage. Decay has passed through enamel into the softer layer (dentin). You may feel sensitivity to hot/cold.",
    "advanced_lesion" : "Advanced stage. Decay is very deep and close to the nerve. See a dentist urgently to save the tooth.",
    "pulp_involvement": "Severe stage. Infection has reached the nerve (pulp). This usually causes severe pain and a Root Canal (RCT) may be needed."
}

def check_image_quality(img_gray):
    warnings = []
    h, w = img_gray.shape
    
    laplacian_var = cv2.Laplacian(img_gray, cv2.CV_64F).var()
    if laplacian_var < 50:
        warnings.append("Image appears blurry — results may be less accurate")
        
    mean_brightness = np.mean(img_gray)
    if mean_brightness < 40:
        warnings.append("Image is too dark — auto-brightened via correction lookup")
    elif mean_brightness > 215:
        warnings.append("Image is overexposed — auto-darkened via inverse lookup")

    contrast = img_gray.std()
    if contrast < 20:
        warnings.append("Low contrast detected — adaptive CLAHE profile applied")

    if w < 200 or h < 200:
        warnings.append("Image matrix dimension scale is too low — processing accuracy degraded")

    return warnings, laplacian_var, mean_brightness, contrast

def deskew_image(img_gray):
    edges = cv2.Canny(img_gray, 50, 150, apertureSize=3)
    lines = cv2.HoughLines(edges, 1, np.pi / 180, threshold=100)
    if lines is None or len(lines) < 5:
        return img_gray, 0.0

    angles = []
    for line in lines[:20]:
        rho, theta = line[0]
        angle = (theta * 180 / np.pi) - 90
        if -45 <= angle <= 45:
            angles.append(angle)

    if not angles:
        return img_gray, 0.0

    median_angle = np.median(angles)
    if abs(median_angle) < 2.0:
        return img_gray, median_angle

    h, w = img_gray.shape
    center = (w // 2, h // 2)
    M = cv2.getRotationMatrix2D(center, median_angle, 1.0)
    corrected = cv2.warpAffine(img_gray, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
    return corrected, median_angle

def fix_brightness(img_gray, mean_brightness):
    if mean_brightness < 40:
        table = np.array([((i / 255.0) ** 0.5) * 255 for i in np.arange(0, 256)]).astype("uint8")
        return cv2.LUT(img_gray, table)
    elif mean_brightness > 215:
        table = np.array([((i / 255.0) ** 1.8) * 255 for i in np.arange(0, 256)]).astype("uint8")
        return cv2.LUT(img_gray, table)
    return img_gray

def normalize_size(img, target_size=640):
    h, w = img.shape[:2]
    scale = target_size / max(h, w)
    new_w, new_h = int(w * scale), int(h * scale)
    resized = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_AREA)

    pad_top    = (target_size - new_h) // 2
    pad_bottom = target_size - new_h - pad_top
    pad_left   = (target_size - new_w) // 2
    pad_right  = target_size - new_w - pad_left

    if len(resized.shape) == 2:
        return cv2.copyMakeBorder(resized, pad_top, pad_bottom, pad_left, pad_right, cv2.BORDER_CONSTANT, value=0)
    return cv2.copyMakeBorder(resized, pad_top, pad_bottom, pad_left, pad_right, cv2.BORDER_CONSTANT, value=(0, 0, 0))

def preprocess_xray(img_bgr):
    img_gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY) if len(img_bgr.shape) == 3 else img_bgr.copy()
    warnings, blur_score, brightness, contrast = check_image_quality(img_gray)

    quality_info = {
        "blur_score": round(float(blur_score), 2),
        "brightness": round(float(brightness), 2),
        "contrast": round(float(contrast), 2),
        "original_size": f"{img_bgr.shape[1]}x{img_bgr.shape[0]}"
    }

    img_gray = fix_brightness(img_gray, brightness)
    img_gray, angle = deskew_image(img_gray)
    if abs(angle) > 2.0:
        quality_info["tilt_corrected"] = f"{angle:.1f}°"

    img_gray = cv2.fastNlMeansDenoising(img_gray, h=10, templateWindowSize=7, searchWindowSize=21)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    img_gray = clahe.apply(img_gray)
    img_gray = normalize_size(img_gray, target_size=640)
    processed_bgr = cv2.cvtColor(img_gray, cv2.COLOR_GRAY2BGR)

    return processed_bgr, warnings, quality_info

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File payload configuration type mismatch.")

    contents = await file.read()
    nparr    = np.frombuffer(contents, np.uint8)
    img_bgr  = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if img_bgr is None:
        raise HTTPException(status_code=400, detail="Failed to decode matrix target layout.")

    # 1. Image Optimization Pipeline
    processed_img, warnings, quality_info = preprocess_xray(img_bgr)

    # 2. Deep Vision Inference Evaluation
    results = model(processed_img, conf=0.25, iou=0.20) # Low IoU value clears out dirty duplicate blocks
    display_img = processed_img.copy()

    detections = []
    severity_order = {"enamel_caries": 1, "dentin_caries": 2, "advanced_lesion": 3, "pulp_involvement": 4}
    color_map = {
        "enamel_caries": (255, 191, 0),    
        "dentin_caries": (0, 165, 255),    
        "advanced_lesion": (0, 0, 255),    
        "pulp_involvement": (50, 0, 130)   
    }

    if results[0].boxes:
        for box in results[0].boxes:
            cls_id = int(box.cls[0])
            label  = model.names[cls_id]
            conf   = float(box.conf[0])
            x1, y1, x2, y2 = [round(c) for c in box.xyxy[0].tolist()]

            detections.append({
                "stage"      : label.replace('_', ' ').upper(),
                "label_raw"  : label,
                "confidence" : f"{conf * 100:.1f}%",
                "conf_value" : round(conf, 4),
                "explanation": stage_explanations.get(label, ""),
                "severity"   : severity_order.get(label, 0),
                "bbox"       : {"x1": x1, "y1": y1, "x2": x2, "y2": y2}
            })

            # Custom Overlay Annotation Rendering Layer
            box_color = color_map.get(label, (0, 255, 0))
            cv2.rectangle(display_img, (x1, y1), (x2, y2), box_color, 2)
            
            tag_text = f"{label.split('_')[0].upper()} {conf*100:.0f}%"
            (text_w, text_h), _ = cv2.getTextSize(tag_text, cv2.FONT_HERSHEY_SIMPLEX, 0.4, 1)
            cv2.rectangle(display_img, (x1, y1 - text_h - 6), (x1 + text_w + 6, y1), box_color, -1)
            cv2.putText(display_img, tag_text, (x1 + 3, y1 - 4), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 255, 255), 1, cv2.LINE_AA)

    detections.sort(key=lambda x: x["severity"], reverse=True)

    if detections:
        max_sev = max(d["severity"] for d in detections)
        sev_label = {
            4: "SEVERE — Root Canal may be needed",
            3: "ADVANCED — See dentist urgently",
            2: "MODERATE — Schedule a filling soon",
            1: "MILD — Early treatment recommended"
        }.get(max_sev, "Detected")
    else:
        sev_label = "No cavities detected"

    _, buffer     = cv2.imencode('.jpg', display_img, [cv2.IMWRITE_JPEG_QUALITY, 90])
    img_base64    = base64.b64encode(buffer).decode('utf-8')
    
    _, pre_buffer = cv2.imencode('.jpg', processed_img)
    pre_base64    = base64.b64encode(pre_buffer).decode('utf-8')

    return {
        "success"         : True,
        "image"           : img_base64,
        "preprocessed_img": pre_base64,
        "detections"      : detections,
        "total_found"     : len(detections),
        "overall_severity": sev_label,
        "quality_warnings": warnings,
        "quality_info"    : quality_info,
        "model_info"      : {
            "name"   : "YOLOv8n DentAI",
            "map50"  : "84.2%",
            "classes": 4
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=5000)