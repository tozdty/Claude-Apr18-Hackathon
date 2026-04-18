from flask import Flask, request, jsonify, render_template_string
import anthropic
import os
from dotenv import load_dotenv
from actions import trigger

load_dotenv()

app = Flask(__name__)
client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

# Maya's state — accumulated throughout the day
maya_context = {
    "meals": [],
    "location": "Denver, CO",
    "upcoming": "Live broadcast at 3:00 PM",
    "sleep": "4.5 hours",
    "hydration": "low",
}

SYSTEM_PROMPT = """You are Pulse, a personal health agent for Maya Chen, a national correspondent.
Maya is currently in Denver. She slept 4.5 hours last night (red-eye from LAX).
She has a live broadcast at 3:00 PM and a red-eye flight home tonight.
She is dehydrated and running on coffee.

Your job: give short, specific, actionable advice based on her situation.
Never give generic tips. Always factor in what she has eaten today and what's coming up.

When you decide to take a real-world action, end your response with exactly:
ACTION: ubereats
or
ACTION: calendar

Only include an ACTION line when the user confirms they want you to do something.
Keep responses under 3 sentences. Speak like a sharp, trusted friend — not a wellness app."""

conversation_history = []

@app.route("/")
def index():
    return render_template_string(HTML)

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message", "")
    
    # Add to history
    conversation_history.append({
        "role": "user",
        "content": user_message
    })
    
    # Build context-aware system prompt
    meals_str = ", ".join(maya_context["meals"]) if maya_context["meals"] else "nothing logged yet"
    full_system = SYSTEM_PROMPT + f"\n\nToday's meals so far: {meals_str}"
    
    # Call Claude
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=300,
        system=full_system,
        messages=conversation_history
    )
    
    assistant_message = response.content[0].text
    
    # Check for action trigger
    action_fired = None
    if "ACTION: ubereats" in assistant_message:
        trigger("ubereats")
        action_fired = "ubereats"
        assistant_message = assistant_message.replace("ACTION: ubereats", "").strip()
    elif "ACTION: calendar" in assistant_message:
        trigger("calendar")
        action_fired = "calendar"
        assistant_message = assistant_message.replace("ACTION: calendar", "").strip()
    
    # Add assistant response to history
    conversation_history.append({
        "role": "assistant",
        "content": assistant_message
    })
    
    # Log meals if user described eating
    if any(word in user_message.lower() for word in ["ate", "had", "grabbed", "eating", "just had"]):
        maya_context["meals"].append(user_message)
    
    return jsonify({
        "response": assistant_message,
        "action_fired": action_fired
    })

@app.route("/trigger/<action>", methods=["POST"])
def manual_trigger(action):
    """Manual trigger endpoint for demo — call this directly to fire webhooks."""
    if action in ["ubereats", "calendar"]:
        trigger(action)
        return jsonify({"status": "triggered", "action": action})
    return jsonify({"status": "unknown action"}), 400

# Simple single-page UI
HTML = """
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Pulse — Health Agent</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #0a0a0f; color: #e2e8f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; height: 100vh; display: flex; flex-direction: column; }
  header { padding: 20px 24px; border-bottom: 1px solid #1e293b; display: flex; justify-content: space-between; align-items: center; }
  .logo { font-size: 20px; font-weight: 600; color: #38bdf8; letter-spacing: -0.5px; }
  .status { font-size: 13px; color: #64748b; }
  .status span { color: #22c55e; }
  .context-bar { background: #0f172a; padding: 10px 24px; font-size: 12px; color: #64748b; display: flex; gap: 24px; border-bottom: 1px solid #1e293b; }
  .context-bar b { color: #94a3b8; }
  .chat { flex: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 16px; }
  .message { max-width: 680px; }
  .message.user { align-self: flex-end; }
  .message.assistant { align-self: flex-start; }
  .bubble { padding: 12px 16px; border-radius: 12px; font-size: 15px; line-height: 1.6; }
  .user .bubble { background: #1e40af; color: #e0f2fe; border-radius: 12px 12px 2px 12px; }
  .assistant .bubble { background: #1e293b; color: #e2e8f0; border-radius: 12px 12px 12px 2px; }
  .action-badge { margin-top: 8px; font-size: 12px; color: #22c55e; display: flex; align-items: center; gap: 6px; }
  .action-badge::before { content: "✓"; }
  .input-area { padding: 16px 24px; border-top: 1px solid #1e293b; display: flex; gap: 12px; }
  input { flex: 1; background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 12px 16px; color: #e2e8f0; font-size: 15px; outline: none; }
  input:focus { border-color: #38bdf8; }
  input::placeholder { color: #475569; }
  button { background: #0ea5e9; color: white; border: none; border-radius: 8px; padding: 12px 20px; font-size: 15px; cursor: pointer; font-weight: 500; }
  button:hover { background: #38bdf8; }
  .demo-buttons { padding: 0 24px 16px; display: flex; gap: 8px; }
  .demo-btn { background: #1e293b; color: #94a3b8; border: 1px solid #334155; border-radius: 6px; padding: 6px 12px; font-size: 12px; cursor: pointer; }
  .demo-btn:hover { background: #334155; color: #e2e8f0; }
</style>
</head>
<body>
<header>
  <div class="logo">Pulse</div>
  <div class="status">Maya Chen · Denver, CO · <span>Active</span></div>
</header>
<div class="context-bar">
  <div><b>Sleep</b> 4.5h</div>
  <div><b>Hydration</b> Low</div>
  <div><b>Next</b> Live broadcast 3:00 PM</div>
  <div><b>Tonight</b> Red-eye flight</div>
</div>
<div class="chat" id="chat">
  <div class="message assistant">
    <div class="bubble">Hey — checked your day. You're on in a few hours, running on 4.5 hours of sleep and you're dehydrated from the flight. Tell me what's around you and I'll tell you exactly what to do.</div>
  </div>
</div>
<div class="demo-buttons">
  <button class="demo-btn" onclick="sendMessage('At airport, 2 hours before red-eye, haven't eaten since lunch')">✈️ Airport scenario</button>
  <button class="demo-btn" onclick="sendMessage('20 minutes to live hit, running on coffee')">📺 Pre-hit scenario</button>
  <button class="demo-btn" onclick="sendMessage('Just filed the story, heading back to hotel')">✅ Post-show scenario</button>
  <button class="demo-btn" onclick="fireAction('ubereats')">🍱 Fire Uber Eats</button>
  <button class="demo-btn" onclick="fireAction('calendar')">📅 Fire Calendar</button>
</div>
<div class="input-area">
  <input id="input" placeholder="Describe your situation..." onkeydown="if(event.key==='Enter') send()">
  <button onclick="send()">Send</button>
</div>
<script>
  async function send() {
    const input = document.getElementById('input');
    const msg = input.value.trim();
    if (!msg) return;
    input.value = '';
    sendMessage(msg);
  }

  async function sendMessage(msg) {
    addMessage('user', msg);
    const res = await fetch('/chat', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({message: msg})
    });
    const data = await res.json();
    addMessage('assistant', data.response, data.action_fired);
  }

  async function fireAction(action) {
    await fetch('/trigger/' + action, {method: 'POST'});
    addMessage('assistant', action === 'ubereats' 
      ? "Ordered the salmon bowl from Modmarket — 14 minutes, meeting you at the hotel. Eat before 6, you need 3 hours before the red-eye."
      : "Blocked 2:20–2:40 PM on your calendar: Protein + hydration window. Use it.", 
      action);
  }

  function addMessage(role, text, action) {
    const chat = document.getElementById('chat');
    const div = document.createElement('div');
    div.className = 'message ' + role;
    div.innerHTML = '<div class="bubble">' + text + '</div>';
    if (action) {
      const badge = document.createElement('div');
      badge.className = 'action-badge';
      badge.textContent = action === 'ubereats' ? 'Uber Eats order confirmation sent' : 'Calendar event created';
      div.appendChild(badge);
    }
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
  }
</script>
</body>
</html>
"""

if __name__ == "__main__":
    app.run(debug=True, port=5000)
