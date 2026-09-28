<div align="center">

# 🛡️ BHARAT SURAKSHA (संज्ञान)
### *Your AI Elder Brother Against WhatsApp & Telegram Scams. No Cap. fr fr.* 🧢🚫

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![SEBI Compliant](https://img.shields.io/badge/SEBI-Advisory_Grounded-0F4C81?style=for-the-badge)](https://www.sebi.gov.in)
[![Hackathon](https://img.shields.io/badge/Sangyan-Investor_Resilience_Hackathon-22C55E?style=for-the-badge)](https://sangyan.copsiitbhu.co.in/)

<br/>

> **"2 din mein paisa double?" — Bro, that's not an investment, that's a direct ticket to financial heartbreak.** 💀💸  
> Built for **first-time Indian retail investors**, Tier-2/3 households, and your family WhatsApp group that believes every *"SEBI VIP Institutional"* message.

</div>

---

## ⚡ The Vibe Check (Why We Exist)

Look, uncles and aunties across Bharat are losing their hard-earned retirement savings to random *"HR Priya"* on WhatsApp promising ₹5,000/day for liking YouTube videos, or fake Telegram admins guaranteeing **400% profit in 24 hours** via personal GooglePay accounts.

**Bharat Suraksha (संज्ञान)** is here to change that with maximum aura:
- 🚫 **No confusing jargon.**
- 🗣️ **Speaks your language:** Hindi, English, Tamil, Telugu, and 4 more.
- 🎙️ **Voice input:** For elders who find typing hard (*"बोलकर बताएं"*).
- 🔒 **100% Private:** We don't touch your SMS, OTP, or contacts. Period.

---

## ✨ What We Cooked (Features)

| Feature | What It Does | Vibe |
| :--- | :--- | :---: |
| 🔍 **AI Scam Scanner** | Paste any shady Telegram tip, WhatsApp forward, or suspicious APK link. | 🧠 Big Brain |
| 🚦 **Traffic Light Risk Verdict** | Instant **High Risk (Red)**, **Medium Risk (Amber)**, or **Low Risk (Green)** status. | 🛑 Simple AF |
| 📜 **Hindi Breakdown Bullets** | Tells you *exactly* why it’s a scam in simple, dignified Hindi (SEBI rules grounded). | 👴 Elder Wisdom |
| 🎙️ **Voice Search (बोलकर बताएं)** | Web Speech API integration — just speak and it transcribes instantly. | 🎙️ Hands Free |
| 🛡️ **Demo Mode (Hackathon Safe Net)** | Instant offline keyword detection if you don't have internet or backend running. | 🛟 Lifesaver |
| 🚩 **Citizen Scam Reporting** | Report fraud in 1 click, logs directly to the registry, and alerts authorities. | 👮 Citizen Hero |
| 🌐 **Bharat-First Language Toggle** | Switch between Hindi and English seamlessly with one tap (`अ / A`). | 🇮🇳 Swadeshi |
| 🚨 **Direct 1930 Emergency Helpline** | 1-tap call to the National Cyber Crime emergency desk to freeze fraudulent transfers. | ⚡ Instant Save |

---

## 🏗️ Architecture & Tech Stack

```text
       ┌────────────────────────────────────────────────────────┐
       │             Client Browser (Mobile / Desktop)          │
       │   Atkinson Hyperlegible Next + Material Symbols + HTML5 │
       └───────────────────────────┬────────────────────────────┘
                                   │
              ┌────────────────────┴────────────────────┐
              ▼                                         ▼
   [Demo Mode = ON (Offline)]             [Demo Mode = OFF (Live)]
   Instant Keyword Classifier              POST /analyze & POST /report
   (js/demo-data.js)                                    │
                                                        ▼
                                       ┌────────────────────────────────┐
                                       │   FastAPI Backend (Python)     │
                                       │   - CORS Middleware Enabled    │
                                       │   - Rule-Based NLP & RegEx     │
                                       │   - Future: Google Gemini API  │
                                       └────────────────────────────────┘
```

- **Frontend**: Plain HTML5, CSS3, Modern JavaScript (ES6+), Tailwind CSS, Atkinson Hyperlegible Next Typography.
- **Backend**: FastAPI (Python), Uvicorn ASGI, Pydantic data schemas.
- **Future AI Hook**: Ready for Google Gemini Flash (`google-genai` client).

---

## 🚀 Quickstart (Run It In 5 Seconds)

### Option 1: The Master 1-Click Way (Windows)
Double-click:
```bash
start_full_app.bat
```
*BAM!* It automatically starts the FastAPI backend on port 8000, fires up the frontend on port 3000, and opens your default browser! 🎉

---

### Option 2: The Terminal Chad Way

#### 1. Start Backend API:
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
- API is live at: `http://localhost:8000`
- Interactive Swagger UI: `http://localhost:8000/docs`

#### 2. Start Frontend Server:
In another terminal:
```bash
cd frontend
python -m http.server 3000
```
Open **`http://localhost:3000`** in your browser!

---

## 🧪 Testing The Flow Like A Pro

1. **Test High Risk (Scam)**:
   - Click chip: `📈 Fake VIP Trading`
   - Hit **"Check Now (जाँच करें)"**
   - Result: 🚨 **95% High Risk Alert** + 4 Red Flags + Direct *"Report This Scam"* button.

2. **Test Medium Risk (Caution)**:
   - Click chip: `⚡ Electricity / Jackpot Alert`
   - Result: ⚠️ **Medium Risk Alert** + Promotional Hype Warnings.

3. **Test Low Risk (Safe)**:
   - Click chip: `✅ Safe Index Fund`
   - Result: 🟢 **Low Risk (Clean)** + SIP Discipline Breakdown.

---

## 📂 Project Structure

```text
suraksha/
├── frontend/                     # Pure client-side application
│   ├── index.html                # Home dashboard with trust banner & CTAs
│   ├── input.html                # Voice input, clipboard paste, demo toggle
│   ├── result.html               # Dynamic High/Medium/Low badge & Hindi explanation
│   ├── report.html               # Citizen reporting form & success modal
│   ├── how-it-works.html         # 3-step visual guide & traffic light signals
│   ├── css/styles.css            # Custom theme tokens & mobile frame container
│   ├── js/
│   │   ├── config.js             # API_BASE ("http://localhost:8000")
│   │   ├── demo-data.js          # Offline demo keywords & samples
│   │   ├── api.js                # Fetch hooks for /analyze & /report
│   │   └── main.js               # Navigation & Hindi/English live toggle
│   └── assets/logo.svg           # Official Bharat Safety Shield SVG
│
├── backend/                      # Production FastAPI Microservice
│   ├── main.py                   # REST endpoints, CORS, Rule-based Engine & Gemini hook
│   ├── requirements.txt          # fastapi, uvicorn, pydantic
│   └── run_backend.bat           # 1-click backend launcher
│
├── start_full_app.bat            # 🚀 Master Launcher (Frontend + Backend + Browser)
├── WORKFLOW.md                   # Complete architectural and data flow breakdown
└── README.md                     # You are here, King 👑
```

---

## 🇮🇳 Bharat-First Usability Checklist

- [x] **No-App-Store Friction**: Works directly in the browser as a lightweight PWA.
- [x] **Large Touch Targets**: 54px–58px buttons for older fingers.
- [x] **High Contrast Accessibility**: Built with Atkinson Hyperlegible Next font for low-vision users.
- [x] **Zero Data Leaks**: Zero storage of personal passwords, OTPs, or chat history.
- [x] **SEBI & Cyber Cell Grounded**: Direct compliance reminders + 1930 toll-free integration.

---

## 🤝 Hackathon Context

Built for the **Sangyan Investor Resilience Hackathon** by **Avijiit & Team**.  
Let’s make Indian retail investors un-scammable. 🇮🇳🛡️

*Got ideas or want to contribute? Star the repo and drop a PR!*
