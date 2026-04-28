"""
utils/chatbot.py
================
Skin‑wellness chatbot powered by Groq's FREE API (LLaMA 3.3).
"""

import os
import requests
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_URL     = "https://api.groq.com/openai/v1/chat/completions"
MODEL        = "llama-3.3-70b-versatile"

SYSTEM_PROMPT = """You are DermaSense AI, a professional dermatology assistant. Your goal is to provide a 'human-in-the-loop' skin assessment.

WORKFLOW:
1. When you see a Scan Result, acknowledge it (e.g., 'I've analyzed your skin and it looks [Status]').
2. IMMEDIATELY prompt the user for 'human sensory validation'. Ask them to touch the highlighted heatmap areas on their face.
3. Specifically ask if the skin feels 'Tight', 'Rough', 'Smooth', or 'Irritated'.
4. Once the user provides this feedback, refine your assessment:
   - If AI says Dehydrated and User feels Tight/Rough -> Confirm Dehydration with high confidence.
   - If AI says Dehydrated and User feels Smooth -> Acknowledge possible misclassification, ask about recent routine.
   - If AI says Hydrated and User feels Tight -> Suggest it might be early-stage or internal dehydration.
5. Provide personalized recommendations (Indian brands: Minimalist, Dot & Key, Plum, etc.) based on this combined insight.

Always maintain a warm, expert tone. Keep responses concise."""

def chat(history, user_message, skin_status=None):
    """
    history: list of {"role": "user"|"assistant", "content": str}
    user_message: str
    skin_status: dict (optional scan results)
    """
    if not GROQ_API_KEY:
        return "⚠️ No Groq API key found. Please set GROQ_API_KEY in your .env file.", history

    # Inject scan results into system context if available
    context_msgs = [{"role": "system", "content": SYSTEM_PROMPT}]
    if skin_status and len(history) == 0:
        results_str = (
            f"User Scan Results: {skin_status.get('status', 'Unknown')} "
            f"({skin_status.get('hydrationPercent', 0)}% hydrated). "
            "Please start by asking the user to touch the highlighted areas on the heatmap to confirm how their skin feels."
        )
        context_msgs.append({"role": "system", "content": results_str})

    updated_history = history + [{"role": "user", "content": user_message}]
    
    payload = {
        "model": MODEL,
        "messages": context_msgs + updated_history,
        "max_tokens": 512,
        "temperature": 0.7,
    }

    try:
        resp = requests.post(
            GROQ_URL,
            headers={"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"},
            json=payload,
            timeout=30
        )
        resp.raise_for_status()
        reply = resp.json()["choices"][0]["message"]["content"].strip()
    except Exception as e:
        reply = f"⚠️ Chatbot error: {str(e)}"

    return reply, updated_history + [{"role": "assistant", "content": reply}]