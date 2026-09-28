"""
============================================================
Sangyan Investor Shield - Backend API (FastAPI)
Built for Sangyan Investor Resilience Hackathon
============================================================

Endpoints:
  - GET  /           : API Status & Info
  - GET  /health     : Health check
  - POST /analyze    : Analyzes text/link and returns risk_level, explanation, flags
  - POST /report     : Collects & logs citizen scam reports
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List
import datetime
import logging

# Configure Logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("sangyan-backend")

app = FastAPI(
    title="Sangyan Investor Safety Shield API",
    description="Backend service for detecting financial frauds, WhatsApp/Telegram stock tips scams, and citizen fraud reporting.",
    version="1.0.0"
)

# -------------------------------------------------------------
# CORS Middleware: Allows frontend on port 3000 (or any origin) to connect
# -------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for reported scams during session
REPORT_DATABASE = []

# -------------------------------------------------------------
# Pydantic Request & Response Schemas
# -------------------------------------------------------------
class AnalyzeRequest(BaseModel):
    text: str = Field(..., description="Message content from WhatsApp/Telegram/SMS")
    link: Optional[str] = Field("", description="Optional URL or channel invite link")

class AnalyzeResponse(BaseModel):
    risk_level: str = Field(..., description="'High', 'Medium', or 'Low'")
    explanation: str = Field(..., description="Clear Hindi explanation summary and guidance")
    flags: List[str] = Field(default_factory=list, description="List of detected red flag indicators")

class ReportRequest(BaseModel):
    name: Optional[str] = Field("Anonymous", description="Reporter's name (optional)")
    city: Optional[str] = Field("Unspecified", description="Reporter's city or town")
    platform: str = Field(..., description="Platform where scam occurred (whatsapp, telegram, etc.)")
    message: str = Field(..., description="Scam message or URL details")

class ReportResponse(BaseModel):
    status: str
    message: str
    report_id: int

# -------------------------------------------------------------
# Rule-Based Scam Analysis Engine
# (Ready to be augmented with Google Gemini API)
# -------------------------------------------------------------
def classify_message_rules(text: str, link: str = "") -> dict:
    """
    Analyzes message and link against known cyber fraud patterns in India.
    
    FUTURE AI EXTENSION HOOK:
    --------------------------
    To integrate Google Gemini API:
      from google import genai
      client = genai.Client()
      response = client.models.generate_content(
          model='gemini-2.5-flash',
          contents=f"Analyze this Indian financial message for scams: {text} {link}"
      )
    """
    combined = (f"{text} {link}").lower()

    # High Risk Indicators
    high_risk_patterns = [
        "guarantee", "guaranteed", "400%", "200%", "300%", "50% in 2 days",
        "double your money", "double money", "fixed return", "vip telegram",
        "vip group", "vip channel", "personal upi", "googlepay", "phonepe", "paytm",
        "send money now", "like youtube", "part time job", "earn rs",
        "electricity disconnected", "unpaid bill", "institutional ipo", "sure-shot", "sure shot"
    ]

    # Medium Risk Indicators
    medium_risk_patterns = [
        "limited seats", "hurry", "exclusive tip", "jackpot", "bumper",
        "intraday tip", "diwali call", "multibagger", "secret tip", "free call",
        "limited slot", "act within", "offer expires"
    ]

    # Low Risk (Safe) Indicators
    low_risk_patterns = [
        "index fund", "sip", "passively", "nifty", "sensex", "mutual fund",
        "discipline", "long term", "diversified", "sebi registered", "sebi.gov.in"
    ]

    detected_high = [p for p in high_risk_patterns if p in combined]
    detected_medium = [p for p in medium_risk_patterns if p in combined]
    detected_low = [p for p in low_risk_patterns if p in combined]

    if detected_high:
        return {
            "risk_level": "High",
            "explanation": "SEBI के नियमों के तहत शेयर बाजार में 'गारंटीड रिटर्न' का वादा करना पूर्णतः गैर-कानूनी है। किसी भी अज्ञात टेलीग्राम एडमिन या निजी UPI आईडी पर धनराशि ट्रांसफर न करें।",
            "flags": [
                "Guaranteed High Returns (मुनाफे का झूठा वादा)",
                "Artificial Urgency (कृत्रिम जल्दबाजी व दबाव)",
                "Unverified Private UPI / Telegram VIP Group (निजी यूपीआई / अज्ञात एडमिन)",
                "Violation of SEBI Investment Adviser Regulations (सेबी नियमों का उल्लंघन)"
            ]
        }
    elif detected_medium:
        return {
            "risk_level": "Medium",
            "explanation": "इस संदेश में बहुत अधिक प्रचार और अवास्तविक दावों का उपयोग किया गया है। वैध सेबी रजिस्ट्रेशन नंबर के बिना किसी भी एडवाइजर को पैसे न भेजें।",
            "flags": [
                "Heavy Promotional Hype (अत्यधिक प्रचार)",
                "Missing SEBI Registration Number (सेबी रजिस्ट्रेशन नंबर अनुपस्थित)",
                "Absence of Statutory Market Risk Warnings (जोखिम चेतावनी का अभाव)"
            ]
        }
    elif detected_low:
        return {
            "risk_level": "Low",
            "explanation": "इस संदेश में किसी भी प्रकार की धोखाधड़ी या असंभव मुनाफे के लक्षण नहीं पाए गए। सामान्य व जिम्मेदार वित्तीय मार्गदर्शन के अनुरूप है।",
            "flags": [
                "No False Return Claims (झूठे रिटर्न का दावा नहीं)",
                "No Artificial Pressure (कोई हड़बड़ी या दबाव नहीं)",
                "Educational Literacy Tone (जिम्मेदार निवेश मार्गदर्शन)"
            ]
        }
    else:
        # Default fallback if unclassified
        return {
            "risk_level": "Medium",
            "explanation": "संदेश के दावों की पूरी पुष्टि नहीं हो सकी है। किसी भी प्रकार के लेनदेन से पहले सेबी पोर्टल पर एडवाइजर की आधिकारिक जांच अवश्य करें।",
            "flags": [
                "Unverified Investment Claim (अपुष्ट दावा)",
                "Verify Registration on sebi.gov.in (सेबी पोर्टल पर जांच आवश्यक)"
            ]
        }

# -------------------------------------------------------------
# API Endpoints
# -------------------------------------------------------------
@app.get("/")
def read_root():
    return {
        "service": "Sangyan Investor Safety Shield Backend",
        "status": "online",
        "endpoints": {
            "analyze": "POST /analyze",
            "report": "POST /report",
            "docs": "/docs"
        },
        "docs_url": "http://localhost:8000/docs"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.datetime.now().isoformat(),
        "total_reports_logged": len(REPORT_DATABASE)
    }

@app.post("/analyze", response_model=AnalyzeResponse)
def analyze_message(req: AnalyzeRequest):
    """
    Analyzes a suspicious financial message or link.
    Returns: risk_level ('High', 'Medium', 'Low'), Hindi explanation, and flags.
    """
    logger.info(f"Incoming /analyze request: text='{req.text[:60]}...', link='{req.link}'")
    
    if not req.text.strip() and not req.link.strip():
        raise HTTPException(status_code=400, detail="Text or link must be provided for analysis.")

    result = classify_message_rules(req.text, req.link)
    logger.info(f"Analysis result: Risk={result['risk_level']}")
    
    return AnalyzeResponse(
        risk_level=result["risk_level"],
        explanation=result["explanation"],
        flags=result["flags"]
    )

@app.post("/report", response_model=ReportResponse)
def report_scam(req: ReportRequest):
    """
    Accepts and logs citizen fraud reports.
    """
    report_record = {
        "id": len(REPORT_DATABASE) + 1,
        "name": req.name or "Anonymous",
        "city": req.city or "Unspecified",
        "platform": req.platform,
        "message": req.message,
        "timestamp": datetime.datetime.now().isoformat()
    }
    REPORT_DATABASE.append(report_record)
    logger.info(f"Report #{report_record['id']} received from {report_record['city']} via {report_record['platform']}")

    return ReportResponse(
        status="ok",
        message="Report logged successfully for citizen protection.",
        report_id=report_record["id"]
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
