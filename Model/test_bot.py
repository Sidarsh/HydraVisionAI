import os
from dotenv import load_dotenv

# Ensure we're in the right directory or append path
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from utils.chatbot import chat

def main():
    print("========================================")
    print("💧 DermaSense AI - Terminal Tester 💧")
    print("========================================")
    print("Type 'exit' or 'quit' to stop.\n")
    
    # Check if Groq API Key is set
    load_dotenv()
    if not os.getenv("GROQ_API_KEY"):
        print("⚠️ Warning: GROQ_API_KEY is not set in your .env file!")
        print("Please set it before using the chatbot.")
        return

    history = []
    
    # Optional: Mock a skin scan result
    mock_scan = {
        "status": "Dehydrated",
        "hydrationPercent": 45
    }
    print(f"[System]: Mocking an initial skin scan result: {mock_scan['status']} ({mock_scan['hydrationPercent']}%)\n")
    
    while True:
        try:
            user_input = input("You: ")
            if user_input.lower() in ['exit', 'quit']:
                break
                
            if not user_input.strip():
                continue
                
            print("\nDermaSense AI is thinking (and searching the knowledge base)...")
            
            # Pass skin_status only on the first turn
            current_status = mock_scan if len(history) == 0 else None
            
            reply, history = chat(history, user_input, skin_status=current_status)
            print(f"\nDermaSense AI: {reply}\n")
            
        except KeyboardInterrupt:
            break

if __name__ == "__main__":
    main()
