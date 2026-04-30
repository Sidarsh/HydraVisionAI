import os
import sys
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional, Any

import base64
from io import BytesIO
from PIL import Image

# Ensure utils can be imported
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from utils.chatbot import chat
from utils.predictor import predict, explain

app = FastAPI(title="DermaSense AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    history: List[Dict[str, str]]
    user_message: str
    skin_status: Optional[Dict[str, Any]] = None

class AnalyzeRequest(BaseModel):
    image: str  # Base64 string

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        reply, updated_history = chat(
            history=request.history,
            user_message=request.user_message,
            skin_status=request.skin_status
        )
        return {"reply": reply, "history": updated_history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze")
async def analyze_endpoint(request: AnalyzeRequest):
    try:
        # 1. Decode base64 image
        header, encoded = request.image.split(",", 1) if "," in request.image else ("", request.image)
        img_data = base64.b64decode(encoded)
        pil_img  = Image.open(BytesIO(img_data)).convert("RGB")

        # 2. Run prediction
        label, confidence, class_names, probs = predict(pil_img)
        
        # 3. Generate XAI explanation
        heatmap_pil, face_pil, _ = explain(pil_img)

        # 4. Convert results back to base64
        def to_b64(img):
            buffered = BytesIO()
            img.save(buffered, format="PNG")
            return "data:image/png;base64," + base64.b64encode(buffered.getvalue()).decode()

        return {
            "status": "DEBUG-" + label,
            "hydrationPercent": int((1 - probs[0] if label == "dehydrated" else probs[0]) * 100) if len(probs) > 1 else int(confidence * 100),
            "moistureLevel": "low" if label == "dehydrated" else "good",
            "confidence": int(confidence * 100),
            "heatmap": to_b64(heatmap_pil),
            "face": to_b64(face_pil),
            "tips": [
                "Drink 2-3 liters of water daily.",
                "Use a hyaluronic acid serum on damp skin.",
                "Apply a ceramide-rich moisturizer to lock in moisture."
            ]
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
