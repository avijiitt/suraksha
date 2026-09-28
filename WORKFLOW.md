# 🔄 BHARAT SURAKSHA (संज्ञान) — SYSTEM WORKFLOW & ARCHITECTURE

This document details the end-to-end data flow, system architecture, integration contracts, and operational workflows for the **Bharat Suraksha (संज्ञान)** Investor Safety application.

---

## 1. High-Level System Architecture

```text
 ┌────────────────────────────────────────────────────────────────────────┐
 │                              USER INTERFACE                            │
 │                                                                        │
 │  ┌─────────────┐       ┌─────────────┐       ┌──────────────────────┐  │
 │  │ Home Screen │ ────► │ Input / Mic │ ────► │ Result View          │  │
 │  │ (index.html)│       │ (input.html)│       │ (High/Medium/Low)    │  │
 │  └─────────────┘       └─────────────┘       └──────────┬───────────┘  │
 │         ▲                     ▲                         │              │
 │         │                     │                         ▼              │
 │  ┌──────┴──────┐              │              ┌──────────────────────┐  │
 │  │ How It Works│ ─────────────┘              │ Report Scam Form     │  │
 │  │ (Guide)     │                             │ (report.html)        │  │
 │  └─────────────┘                             └──────────┬───────────┘  │
 └─────────────────────────────────────────────────────────┼──────────────┘
                                                           │
                                                           ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │                      DATA & PROCESSING LAYER                           │
 │                                                                        │
 │      ┌─────────────────────────────────┐                               │
 │      │  Demo Mode Switch Active?       │                               │
 │      └────────────────┬────────────────┘                               │
 │                       │                                                │
 │             YES ──────┴────── NO                                       │
 │              ▼                ▼                                        │
 │   ┌────────────────────┐   ┌──────────────────────────────────────┐    │
 │   │ Offline Keyword    │   │ FastAPI Microservice (Port 8000)     │    │
 │   │ Pattern Engine     │   │ - POST /analyze                      │    │
 │   │ (js/demo-data.js)  │   │ - POST /report                       │    │
 │   └────────────────────┘   │ - Rule-Based Engine & RegEx          │    │
 │                            │ - Future AI (Google Gemini API Hook) │    │
 │                            └──────────────────────────────────────┘    │
 └────────────────────────────────────────────────────────────────────────┘
```

---

## 2. End-to-End User Journeys

### 🟢 Flow 1: Scam Verification Journey

1. **Discovery & Ingestion (`index.html`)**:
   - The user opens the web app and taps **"Check Message / Link (मैसेज / लिंक जाँचें)"**.
   - Navigation routes them to `input.html`.

2. **Input Capture (`input.html`)**:
   - The user pastes text from the clipboard via the **"Paste from Clipboard"** button, enters an optional Telegram/website link, OR taps **"Tap to Speak (बोलकर बताएं)"** using the integrated browser Speech Recognition API.
   - Alternatively, the user taps one of the popular scam chips (*Video Liking Fraud*, *Fake VIP Trading*, *Electricity Bill*, or *Safe Index Fund*).

3. **Analysis Dispatch (`js/api.js`)**:
   - When the user taps **"Check Now (जाँच करें)"**, a tactile loading spinner displays *"Analyzing with SEBI Registry..."*.
   - **Branch A (Demo Mode ON)**: `ApiService.analyzeMessage()` runs client-side keyword pattern matching from `js/demo-data.js` without network overhead.
   - **Branch B (Demo Mode OFF)**: A `POST` request is sent to `http://localhost:8000/analyze` with JSON `{ text, link }`.

4. **Dynamic Verdict Rendering (`result.html`)**:
   - The user is redirected to `result.html`.
   - The page dynamically adjusts to the verdict:
     - 🔴 **High Risk**: Red alert card, 95% scam pattern badge, 4 explicit violation indicators, and immediate action buttons.
     - 🟠 **Medium Risk**: Amber caution card, missing SEBI registration warnings, and market risk disclaimers.
     - 🟢 **Low Risk**: Green verified pattern badge, educational literacy breakdown, and passive investment reassurance.

---

### 🚩 Flow 2: Citizen Scam Reporting Journey

1. **Initiation from Result**:
   - On `result.html`, the user taps **"Report This Scam (धोखाधड़ी रिपोर्ट करें)"**.
   - The suspicious message snippet is stored in `sessionStorage` and transferred to `report.html`.

2. **Form Completion (`report.html`)**:
   - The flagged text is pre-filled into the textarea.
   - The user selects the platform (WhatsApp, Telegram, SMS, or Social Media) and optionally enters their Name and City.
   - The user checks the statutory declaration: *"I confirm this submission contains no private banking passwords, PINs, or confidential personal IDs."*

3. **Submission & Dispatch**:
   - When tapping **"Submit Report"**, a payload is sent to `POST /report`:
     ```json
     {
       "name": "Anonymous",
       "city": "Indore",
       "platform": "whatsapp",
       "message": "Flagged scam text..."
     }
     ```
   - On response, a celebratory modal opens: **"Report Submitted. Thank you! (रिपोर्ट सफलतापूर्वक दर्ज की गई)"**.
   - After a 2-second timeout, the app automatically redirects back to `index.html`.

---

### 📖 Flow 3: Educational Literacy Journey (`how-it-works.html`)

1. User clicks **"How it works"** from the home screen.
2. The user sees a 3-step numbered card stack:
   - Step 1: Copy suspicious message.
   - Step 2: Paste and tap 'Check Now'.
   - Step 3: Get clear guidance in your language.
3. Interactive traffic light signals (Safe / Caution / Danger) provide instant visual cues.
4. Tapping **"Got it (समझ गए)"** returns the user to the scanner.

---

## 3. Data Contracts & API Specification

### Endpoint 1: `POST /analyze`
Analyzes text or links and returns risk classification with Hindi explanations.

- **Request**:
  ```http
  POST /analyze HTTP/1.1
  Host: localhost:8000
  Content-Type: application/json

  {
    "text": "Sir guaranteed 400% profit in 24 hours, join VIP telegram!",
    "link": "https://t.me/fake-vip-channel"
  }
  ```

- **Response (200 OK)**:
  ```json
  {
    "risk_level": "High",
    "explanation": "SEBI के नियमों के तहत शेयर बाजार में 'गारंटीड रिटर्न' का वादा करना पूर्णतः गैर-कानूनी है। किसी भी अज्ञात टेलीग्राम एडमिन या निजी UPI आईडी पर धनराशि ट्रांसफर न करें।",
    "flags": [
      "Guaranteed High Returns (मुनाफे का झूठा वादा)",
      "Artificial Urgency (कृत्रिम जल्दबाजी व दबाव)",
      "Unverified Private UPI / Telegram VIP Group (निजी यूपीआई / अज्ञात एडमिन)",
      "Violation of SEBI Investment Adviser Regulations (सेबी नियमों का उल्लंघन)"
    ]
  }
  ```

---

### Endpoint 2: `POST /report`
Accepts and stores citizen reports for community screening.

- **Request**:
  ```http
  POST /report HTTP/1.1
  Host: localhost:8000
  Content-Type: application/json

  {
    "name": "Pooja Verma",
    "city": "Kanpur",
    "platform": "telegram",
    "message": "Fake institutional trading pool asking for Rs 10000"
  }
  ```

- **Response (200 OK)**:
  ```json
  {
    "status": "ok",
    "message": "Report logged successfully for citizen protection.",
    "report_id": 1
  }
  ```

---

## 4. Multi-Language (i18n) Strategy

- **Design Philosophy**: Static UI elements adapt to the selected language, while core diagnostic advice is grounded in simple, accessible Hindi.
- **Language Switcher**: Tapping `अ / A` in the top header switches between Hindi and English:
  - English: *"Check Message / Link"*, *"High Risk"*, *"Report This Scam"*
  - Hindi: *"मैसेज / लिंक जाँचें"*, *"बहुत ज्यादा जोखिम"*, *"इस स्कैम की शिकायत करें"*
- **Storage**: Preference is saved in `localStorage["sangyan_lang"]` and persists across page reloads.

---

## 5. Future AI Roadmap: Google Gemini API Integration

The backend is architected with a dedicated hook inside `classify_message_rules()` in `backend/main.py`:

```python
# To enable Google Gemini AI analysis:
from google import genai

client = genai.Client()

def analyze_with_gemini(text: str, link: str):
    prompt = f"""
    You are an expert Indian SEBI compliance and financial fraud investigator.
    Analyze this message: '{text}' and link: '{link}'.
    Classify into: 'High', 'Medium', or 'Low' risk.
    Provide a 2-3 sentence explanation in simple conversational Hindi suitable for a Tier-2/3 Indian citizen.
    List detected red flags.
    """
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt
    )
    return response.text
```

---

## 6. Cloud Deployment Guide

### Deploying Backend on Render / Railway
1. Push this repository to GitHub.
2. Create a new **Web Service** on [Render.com](https://render.com).
3. Connect your repository and configure:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Copy the live Render service URL (e.g. `https://suraksha-backend.onrender.com`).
5. Open `frontend/js/config.js` and update:
   ```javascript
   CONFIG.API_BASE = "https://suraksha-backend.onrender.com";
   ```

### Deploying Frontend on GitHub Pages / Vercel
1. Set the publish directory to `frontend`.
2. All routes are static HTML/JS and will run globally with zero server overhead!
