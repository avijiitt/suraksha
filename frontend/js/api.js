/**
 * ============================================================
 * Sangyan Investor Shield - API Service & Hooks
 * ============================================================
 * 
 * WHERE TO CHANGE API BASE:
 * - Update `CONFIG.API_BASE` in `js/config.js` (default: http://localhost:8000).
 */

const ApiService = {

  /**
   * Check if Demo Mode is currently activated
   */
  isDemoMode: function() {
    const val = localStorage.getItem(CONFIG.STORAGE_KEYS.DEMO_MODE);
    return val === null ? true : val === "true"; // Default to ON for hackathon safety
  },

  /**
   * Set Demo Mode state
   */
  setDemoMode: function(enabled) {
    localStorage.setItem(CONFIG.STORAGE_KEYS.DEMO_MODE, enabled ? "true" : "false");
  },

  /**
   * POST /analyze - Scans input message and returns risk level and explanation
   * 
   * Expected Backend Response:
   * {
   *   "risk_level": "High" | "Medium" | "Low",
   *   "explanation": "Simple Hindi bullet points or summary",
   *   "flags": ["Flag 1", "Flag 2"]
   * }
   */
  analyzeMessage: async function(text, link) {
    const combinedContent = (text || "") + " " + (link || "");

    // 1. If DEMO MODE is ON -> bypass network and use internal classified demo data
    if (this.isDemoMode()) {
      console.log("[Demo Mode Active] Classifying locally with keyword patterns...");
      // Simulate realistic network latency for believable hackathon demo
      await new Promise(resolve => setTimeout(resolve, 800));
      const demoResult = matchDemoRisk(combinedContent);
      return {
        success: true,
        isDemo: true,
        data: demoResult
      };
    }

    // 2. If DEMO MODE is OFF -> Make actual POST request to backend API
    const endpoint = `${CONFIG.API_BASE}/analyze`;
    console.log(`[API Call] Sending POST to ${endpoint}...`);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: text,
          link: link || ""
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      const json = await response.json();
      return {
        success: true,
        isDemo: false,
        data: {
          risk_level: json.risk_level || "Medium",
          verdict_summary: json.explanation || "Review findings carefully.",
          explanation_bullets: Array.isArray(json.explanation) 
            ? json.explanation 
            : (json.explanation ? [json.explanation] : []),
          flags: json.flags || []
        }
      };
    } catch (error) {
      console.error("[API Error] Failed to reach backend:", error);
      return {
        success: false,
        error: error.message || "Network Error"
      };
    }
  },

  /**
   * POST /report - Submits citizen scam report
   * 
   * Expected Payload:
   * {
   *   "name": string (optional),
   *   "city": string (optional),
   *   "platform": string,
   *   "message": string
   * }
   */
  submitReport: async function(reportData) {
    if (this.isDemoMode()) {
      console.log("[Demo Mode Active] Simulating report submission:", reportData);
      await new Promise(resolve => setTimeout(resolve, 700));
      return { success: true, isDemo: true };
    }

    const endpoint = `${CONFIG.API_BASE}/report`;
    console.log(`[API Call] Submitting report to ${endpoint}...`);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: reportData.name || "Anonymous",
          city: reportData.city || "Unspecified",
          platform: reportData.platform,
          message: reportData.message
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const json = await response.json();
      return { success: true, isDemo: false, data: json };
    } catch (error) {
      console.error("[API Error] Failed to submit report:", error);
      return {
        success: false,
        error: error.message || "Failed to submit report"
      };
    }
  }

};
