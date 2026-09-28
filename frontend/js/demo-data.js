/**
 * ============================================================
 * Sangyan Investor Shield - Demo Mode Data & Matching Logic
 * ============================================================
 * 
 * Hackathon Safety Net:
 * If the backend is down or not running, Demo Mode enables instant,
 * realistic responses with keyword matching.
 * 
 * CUSTOMIZATION NOTE:
 * You can modify or add new keywords, explanation bullets,
 * and danger flags directly in the DEMO_SAMPLES object below.
 */

const DEMO_SAMPLES = {
  // Sample A: HIGH RISK (Guaranteed returns, double money, UPI transfers, Telegram VIP)
  HIGH: {
    risk_level: "High",
    badge_label_hi: "बहुत ज्यादा जोखिम",
    badge_label_en: "High Risk",
    match_percentage: "95%",
    verdict_summary: "Do not deposit any funds. This scheme violates securities laws.",
    verdict_summary_hi: "कोई भी राशि जमा न करें। यह योजना प्रतिभूति कानूनों का खुला उल्लंघन करती है।",
    explanation_bullets: [
      "SEBI के नियमों के तहत शेयर बाजार या क्रिप्टोकरेंसी में किसी भी प्रकार का 'गारंटीड रिटर्न' देना पूर्णतः गैर-कानूनी है।",
      "मैसेज में '15 मिनट में निवेश करें' या 'सीमित स्लॉट' जैसे दबाव डालकर सोचने का समय नहीं दिया जा रहा।",
      "व्यक्तिगत UPI आईडी या निजी बैंक खाते में पैसे मंगाए जा रहे हैं, जो सीधे तौर पर वित्तीय धोखाधड़ी का संकेत है।",
      "ग्रुप एडमिन या एडवाइजर के पास कोई भी प्रमाणित SEBI या NISM रजिस्ट्रेशन नंबर मौजूद नहीं है।"
    ],
    flags: [
      "Guaranteed High Returns (गारंटीड मुनाफा)",
      "Artificial Urgency (कृत्रिम जल्दबाजी)",
      "Unverified Private UPI (निजी यूपीआई ट्रांसफर)",
      "Anonymous Telegram Admin (अज्ञात एडमिन)"
    ]
  },

  // Sample B: MEDIUM RISK (Promotional hype, limited seats, unverified intraday tips)
  MEDIUM: {
    risk_level: "Medium",
    badge_label_hi: "कुछ जोखिम (सावधानी बरतें)",
    badge_label_en: "Medium Risk",
    match_percentage: "68%",
    verdict_summary: "Exercise caution before taking action or transferring money.",
    verdict_summary_hi: "पैसे ट्रांसफर करने से पहले पूरी जांच-पड़ताल और सावधानी बरतें।",
    explanation_bullets: [
      "मैसेज में बहुत अधिक प्रचार और अवास्तविक दावों (जैकपॉट कॉल, श्योर-शॉट टिप्स) का उपयोग किया गया है।",
      "सर्टिफाइड रिसर्च एनालिस्ट (RA) या इनवेस्टमेंट एडवाइजर (RIA) की वैध जानकारी नहीं दी गई है।",
      "कानूनी रूप से अनिवार्य 'मार्केट रिस्क' डिस्क्लेमर मैसेज में पूरी तरह गायब है।"
    ],
    flags: [
      "Heavy Promotional Hype (अत्यधिक प्रचार)",
      "Missing SEBI Registration Number (सेबी रजिस्ट्रेशन नंबर अनुपस्थित)",
      "No Risk Disclosure (जोखिम चेतावनी का अभाव)"
    ]
  },

  // Sample C: LOW RISK (Generic safe message, Index funds, SIP, educational)
  LOW: {
    risk_level: "Low",
    badge_label_hi: "कम जोखिम (सुरक्षित प्रतीत होता है)",
    badge_label_en: "Low Risk",
    match_percentage: "12%",
    verdict_summary: "No strong red flags or fraudulent markers detected.",
    verdict_summary_hi: "इस संदेश में किसी भी प्रकार की धोखाधड़ी के लक्षण नहीं पाए गए।",
    explanation_bullets: [
      "मैसेज में किसी अवास्तविक मुनाफे या फिक्स्ड रिटर्न का झूठा दावा नहीं किया गया है।",
      "तत्काल पैसे भेजने या जल्दबाजी करने का कोई दबाव नहीं डाला गया।",
      "सामग्री सामान्य और जिम्मेदार वित्तीय साक्षरता (इंडेक्स फंड/एसआईपी) के अनुरूप है।"
    ],
    flags: [
      "No Guaranteed Return Claim (मुनाफे का झूठा वादा नहीं)",
      "No Artificial Urgency (कोई हड़बड़ी या दबाव नहीं)",
      "Responsible Literacy Tone (जिम्मेदार वित्तीय मार्गदर्शन)"
    ]
  }
};

/**
 * Keyword-based classifier used when Demo Mode is ON
 */
function matchDemoRisk(inputText) {
  const text = (inputText || "").toLowerCase();

  // High Risk Keywords
  const highKeywords = [
    'guarantee', 'guaranteed', 'double money', 'double', 'fixed return', '400%', '200%', '300%',
    '50% in 2 days', 'vip', 'telegram', 'googlepay', 'phonepe', 'upi', 'like youtube',
    'part time job', 'earn rs', 'disconnected tonight', 'unpaid bill', 'institutional ipo', 'sure-shot'
  ];

  // Medium Risk Keywords
  const mediumKeywords = [
    'limited seats', 'hurry', 'exclusive tip', 'jackpot', 'bumper', 'intraday tip', 'diwali call',
    'multibagger', 'secret tip', 'free call'
  ];

  // Low Risk Keywords
  const lowKeywords = [
    'index fund', 'sip', 'passively', 'nifty', 'mutual fund', 'discipline', 'long term', 'diversified', 'sebi registered'
  ];

  const hasHigh = highKeywords.some(k => text.includes(k));
  if (hasHigh) return DEMO_SAMPLES.HIGH;

  const hasMedium = mediumKeywords.some(k => text.includes(k));
  if (hasMedium) return DEMO_SAMPLES.MEDIUM;

  const hasLow = lowKeywords.some(k => text.includes(k));
  if (hasLow) return DEMO_SAMPLES.LOW;

  // Default to Medium risk if text is ambiguous but entered
  return DEMO_SAMPLES.MEDIUM;
}
