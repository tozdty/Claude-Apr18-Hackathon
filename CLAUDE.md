# Pulse
Real-time contextual health agent for Maya Chen, national correspondent.

## Stack
Python/Flask backend, single-page HTML frontend, Anthropic Claude API, Make.com webhooks

## Commands
flask run          # Start dev server (http://localhost:5000)
python app.py      # Alternative start

## Structure
app.py             # Flask app, Claude API calls, chat routes
actions.py         # Make.com webhook triggers
.env               # API keys (never commit)
requirements.txt   # Dependencies

## Key conventions
- All Claude calls use claude-sonnet-4-6
- Conversation history stored in memory (resets on server restart — fine for demo)
- Actions parsed from Claude response text (ACTION: ubereats / ACTION: calendar)
- trigger() never raises exceptions — demo must not crash

## Make.com webhooks
- MAKE_WEBHOOK_UBEREATS — sends fake Uber Eats confirmation email
- MAKE_WEBHOOK_CALENDAR — creates Google Calendar event "Protein + hydration window"

## Demo flow
1. Open http://localhost:5000
2. Use quick-action buttons or type situation in plain text
3. Beat 2: click "Pre-hit scenario" → Claude responds → click "Fire Uber Eats"
4. Beat 3: click "Post-show scenario" → Claude responds → click "Fire Calendar"
