import requests
import os
from dotenv import load_dotenv

load_dotenv()

WEBHOOKS = {
    "ubereats": os.getenv("MAKE_WEBHOOK_UBEREATS"),
    "calendar": os.getenv("MAKE_WEBHOOK_CALENDAR"),
}

def trigger(action: str):
    """Fire a Make.com webhook. Silently fails so demo never crashes."""
    url = WEBHOOKS.get(action)
    if url:
        try:
            requests.post(url, json={"action": action}, timeout=3)
            print(f"[Pulse] Triggered: {action}")
        except Exception as e:
            print(f"[Pulse] Webhook failed: {action} — {e}")
