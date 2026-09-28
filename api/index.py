"""
============================================================
Sangyan Investor Shield - Vercel Serverless Entrypoint
FastAPI Backend for Vercel Serverless Functions
============================================================
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List
import datetime
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("sangyan-vercel-backend")

app = FastAPI(
    title="Sangyan Investor Safety Shield API",
    description="Backend service for detecting financial frauds, WhatsApp/Telegram stock tips scams, and citizen fraud reporting.",
    version="1.0.0"
)

# Enable CORS for all domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

REPORT_DATABASE = []

# -------------------------------------------------------------
# Schemas
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
# Classification Logic
# -------------------------------------------------------------
def classify_message_rules(text: str, link: str = "") -> dict:
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

    # Low Risk Indicators
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
        return {
            "risk_level": "Medium",
            "explanation": "संदेश के दावों की पूरी पुष्टि नहीं हो सकी है। किसी भी प्रकार के लेनदेन से पहले सेबी पोर्टल पर एडवाइजर की आधिकारिक जांच अवश्य करें।",
            "flags": [
                "Unverified Investment Claim (अपुष्ट दावा)",
                "Verify Registration on sebi.gov.in (सेबी पोर्टल पर जांच आवश्यक)"
            ]
        }

# -------------------------------------------------------------
# Endpoints
# -------------------------------------------------------------
@app.get("/")
def read_root():
    return {
        "service": "Sangyan Investor Safety Shield Vercel API",
        "status": "online"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.datetime.now().isoformat()
    }

@app.post("/analyze", response_model=AnalyzeResponse)
def analyze_message(req: AnalyzeRequest):
    if not req.text.strip() and not req.link.strip():
        raise HTTPException(status_code=400, detail="Text or link must be provided for analysis.")

    result = classify_message_rules(req.text, req.link)
    return AnalyzeResponse(
        risk_level=result["risk_level"],
        explanation=result["explanation"],
        flags=result["flags"]
    )

@app.post("/report", response_model=ReportResponse)
def report_scam(req: ReportRequest):
    record = {
        "id": len(REPORT_DATABASE) + 1,
        "name": req.name or "Anonymous",
        "city": req.city or "Unspecified",
        "platform": req.platform,
        "message": req.message,
        "timestamp": datetime.datetime.now().isoformat()
    }
    REPORT_DATABASE.append(record)
    return ReportResponse(
        status="ok",
        message="Report logged successfully for citizen protection.",
        report_id=record["id"]
    )
