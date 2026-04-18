#### Claude-Apr18-Hackathon

### NutriBytes 🥦

> A personal health agent that watches, decides, and acts — without you ever opening an app.

## What is Pulse?

Pulse is a proactive AI health agent built for high-performance people whose body is their instrument. It maintains a living model of your health and your day, generates a rolling 12-hour forecast, and intervenes through whatever channel fits the moment — a phone call when you're driving, a text when you're in a meeting, a Slack DM when you're decompressing, a haptic tap when you're on a plane.

You never open Pulse. Pulse comes to you.

---

## The Four Organs

### 🧠 The Brain (Forecast Engine)
Continuously maintains a model of the user — sleep, HRV, hydration, calories, calendar, location, stress signals. Generates a rolling 12-hour forecast: energy curve, crash windows, hunger windows, performance risk. Every intervention reads from this shared state.

### 👁 The Senses (Data Layer)
Reads silently from tools already in your life:
- Apple Health / Google Fit — HRV, sleep, heart rate, SpO₂
- Google Calendar — what's coming and how high-stakes
- Gmail — travel confirmations, delivery receipts, food patterns
- Location — city, hotel vs home, proximity to food
- Uber Eats / DoorDash history — real food patterns, no logging required
- iMessage patterns — sentiment signals (with permission)

### 🗣 The Voice (Multi-Channel Presence)
Pulse picks the right channel for the moment:
- **Phone call** — driving, walking, 20 min before a live hit
- **SMS** — in a meeting, single-sentence interventions
- **Email** — morning briefings, travel game plans
- **Slack DM** — post-event decompression
- **Apple Watch haptic** — hands busy, eyes unavailable, on a plane
- **Push notification** — non-urgent nudges
- **Dashboard** — full picture, at your desk

### 🤝 The Hands (Action Layer)
Pulse doesn't just advise — it executes:
- Orders food through your existing Uber Eats / DoorDash account
- Texts your assistant or producer on your behalf
- Blocks or reschedules calendar events
- Sets Apple Watch sleep mode and alarms
- Sends Slack DMs
- Every action is confirmed out loud, logged, and reversible
