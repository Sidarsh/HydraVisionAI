# HydraVision AI - Local Deployment Guide

This project consists of a **FastAPI Backend** and a **React (Vite) Frontend**.

## 🚀 One-Click Quick Start (Recommended)

I have optimized the ports to avoid Windows "Ghost Process" conflicts.

### 1. Start the Backend (AI Engine)
Open a terminal in the `Model` folder and run:
```powershell
python app.py
```
*   **Port**: 8001
*   **Features**: Supports `.h5` (TensorFlow) and `.pt` (PyTorch) models automatically.

### 2. Start the Frontend (UI)
Open a second terminal in the `Frontend` folder and run:
```powershell
npm run dev
```
*   **URL**: http://localhost:5173 (or 5174 if busy)

---

## 🛠 Troubleshooting

### "Skin analysis failed"
*   Ensure the **Backend** is running on Port 8001.
*   If you see "Port already in use," run this command to clear old processes:
    `Stop-Process -Name "python" -Force`

### "Dehydrated" showing for healthy skin
*   The system is now calibrated for the `.h5` model with specific label indexing (Hydrated at Index 0).
*   If the result looks wrong, check the `predictor.py` logs for the `DEBUG-` prefix to verify connection.

---

## 📁 Project Structure
*   `Model/`: FastAPI server and AI inference logic.
*   `Frontend/`: React application and modern glassmorphism UI.
*   `hydration_model.h5`: Your trained TensorFlow model (in the Model root).
