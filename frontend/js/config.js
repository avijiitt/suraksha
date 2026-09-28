/**
 * ============================================================
 * Sangyan Investor Shield - Configuration
 * ============================================================
 * 
 * Change API_BASE to your deployed backend or local server URL.
 * Example for local FastAPI: "http://localhost:8000"
 * Example for Render: "https://your-backend-app.onrender.com"
 */
const CONFIG = {
  // Backend API Base URL (Used when Demo Mode is OFF)
  API_BASE: "http://localhost:8000",

  // Local storage keys
  STORAGE_KEYS: {
    DEMO_MODE: "sangyan_demo_mode",
    LANGUAGE: "sangyan_lang",
    LAST_ANALYSIS: "sangyan_last_analysis",
    LAST_SNIPPET: "sangyan_last_snippet"
  },

  // Emergency contact links
  HELPLINE_NUMBER: "1930",
  SEBI_PORTAL_URL: "https://www.sebi.gov.in",
  CYBERCRIME_PORTAL_URL: "https://cybercrime.gov.in"
};
