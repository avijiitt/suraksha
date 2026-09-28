/**
 * ============================================================
 * Sangyan Investor Shield - Configuration (Vercel & Local Ready)
 * ============================================================
 * 
 * Auto-detects environment:
 * - Localhost (port 3000) -> calls http://localhost:8000
 * - Vercel / Production    -> calls same-origin serverless API (window.location.origin)
 */
const CONFIG = {
  API_BASE: (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") && window.location.port === "3000"
    ? "http://localhost:8000"
    : window.location.origin,

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
