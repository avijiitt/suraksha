/**
 * ============================================================
 * Sangyan Investor Shield - Main Logic & Navigation Controller
 * ============================================================
 */

// UI Translations for Bharat-first Language Toggle (Hindi / English)
const I18N_LABELS = {
  en: {
    langBtn: "अ / A",
    headerSub: "Investor Safety •",
    headerAction: "Verify Scam",
    homeTitle: "Investor Safety – Scam Check",
    homeSubtitle: "Check WhatsApp and Telegram financial messages for scams",
    ctaCheck: "Check Message / Link",
    ctaHow: "How it works",
    highRiskBadge: "High Risk",
    mediumRiskBadge: "Medium Risk",
    lowRiskBadge: "Low Risk",
    reportScamBtn: "Report This Scam",
    privacyNote1: "We do not access your SMS, OTP, or contacts.",
    privacyNote2: "This app does not give investment advice. It only protects against fraud."
  },
  hi: {
    langBtn: "English",
    headerSub: "इन्वेस्टर सुरक्षा •",
    headerAction: "स्कैम जांच",
    homeTitle: "निवेशक सुरक्षा – स्कैम जांच",
    homeSubtitle: "व्हाट्सएप व टेलीग्राम के संदिग्ध वित्तीय संदेशों की जांच करें",
    ctaCheck: "मैसेज / लिंक जाँचें (Check Message / Link)",
    ctaHow: "यह कैसे काम करता है (How it works)",
    highRiskBadge: "बहुत ज्यादा जोखिम (Bahut Zyada Jokhim)",
    mediumRiskBadge: "कुछ जोखिम (Kuch Jokhim)",
    lowRiskBadge: "कम जोखिम (Kam Jokhim)",
    reportScamBtn: "इस स्कैम की शिकायत करें (Report This Scam)",
    privacyNote1: "हम आपके एसएमएस, ओटीपी या संपर्कों को कभी एक्सेस नहीं करते।",
    privacyNote2: "यह ऐप निवेश सलाह नहीं देता। यह केवल धोखाधड़ी से आपकी रक्षा करता है।"
  }
};

const MainApp = {

  // Current language
  getLanguage: function() {
    return localStorage.getItem(CONFIG.STORAGE_KEYS.LANGUAGE) || "hi";
  },

  setLanguage: function(lang) {
    localStorage.setItem(CONFIG.STORAGE_KEYS.LANGUAGE, lang);
    this.applyTranslations();
  },

  toggleLanguage: function() {
    const nextLang = this.getLanguage() === "hi" ? "en" : "hi";
    this.setLanguage(nextLang);
  },

  applyTranslations: function() {
    const lang = this.getLanguage();
    const labels = I18N_LABELS[lang] || I18N_LABELS["hi"];

    // Update Language Button in Header
    const langBtn = document.getElementById("header-lang-btn");
    if (langBtn) {
      langBtn.textContent = lang === "hi" ? "अ / A" : "A / अ";
      langBtn.title = lang === "hi" ? "Switch to English" : "हिन्दी में बदलें";
    }

    // Apply generic data-i18n elements
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (labels[key]) {
        el.textContent = labels[key];
      }
    });
  },

  /**
   * Initialize Global components (Header language toggle, Helpline)
   */
  initGlobal: function() {
    this.applyTranslations();

    const langBtn = document.getElementById("header-lang-btn");
    if (langBtn) {
      langBtn.addEventListener("click", () => this.toggleLanguage());
    }
  },

  /**
   * ============================================================
   * PAGE 1: HOME PAGE (index.html)
   * ============================================================
   */
  initHomePage: function() {
    this.initGlobal();

    const checkBtn = document.getElementById("btn-go-input");
    if (checkBtn) {
      checkBtn.addEventListener("click", () => {
        window.location.href = "input.html";
      });
    }

    const howBtn = document.getElementById("btn-go-how");
    if (howBtn) {
      howBtn.addEventListener("click", () => {
        window.location.href = "how-it-works.html";
      });
    }
  },

  /**
   * ============================================================
   * PAGE 2: INPUT SCANNER (input.html)
   * ============================================================
   */
  initInputPage: function() {
    this.initGlobal();

    const messageInput = document.getElementById("scam-message-input");
    const linkInput = document.getElementById("scam-link-input");
    const pasteBtn = document.getElementById("clipboard-paste-btn");
    const clearBtn = document.getElementById("clear-text-btn");
    const charHint = document.getElementById("char-hint");
    const checkBtn = document.getElementById("check-scam-btn");
    const errorBox = document.getElementById("input-error-msg");
    const demoCheckbox = document.getElementById("demo-mode-checkbox");
    const voiceBtn = document.getElementById("voice-record-btn");
    const listeningIndicator = document.getElementById("listening-indicator");

    // Demo Mode toggle setup
    if (demoCheckbox) {
      demoCheckbox.checked = ApiService.isDemoMode();
      demoCheckbox.addEventListener("change", (e) => {
        ApiService.setDemoMode(e.target.checked);
      });
    }

    // Character counter & clear button visibility
    function updateCounter() {
      if (!messageInput) return;
      const len = messageInput.value.length;
      if (charHint) charHint.textContent = `${len} character${len === 1 ? '' : 's'}`;
      if (clearBtn) {
        if (len > 0) clearBtn.classList.remove("hidden");
        else clearBtn.classList.add("hidden");
      }
    }

    if (messageInput) {
      messageInput.addEventListener("input", updateCounter);
    }

    if (clearBtn && messageInput) {
      clearBtn.addEventListener("click", () => {
        messageInput.value = "";
        updateCounter();
        messageInput.focus();
      });
    }

    // Clipboard Paste Helper
    if (pasteBtn && messageInput) {
      pasteBtn.addEventListener("click", async () => {
        try {
          if (navigator.clipboard && navigator.clipboard.readText) {
            const clipText = await navigator.clipboard.readText();
            if (clipText) {
              if (clipText.startsWith("http://") || clipText.startsWith("https://")) {
                if (linkInput) linkInput.value = clipText;
              } else {
                messageInput.value = clipText;
                updateCounter();
              }
              return;
            }
          }
        } catch (err) {
          console.warn("Clipboard access denied or unavailable", err);
        }
        messageInput.focus();
        messageInput.placeholder = "Please press and hold here to paste message...";
      });
    }

    // Quick Sample Chips
    document.querySelectorAll(".example-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        const text = chip.getAttribute("data-example");
        if (messageInput && text) {
          messageInput.value = text;
          updateCounter();
          messageInput.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      });
    });

    // Voice Input Integration (Web Speech API)
    if (voiceBtn && messageInput) {
      let isListening = false;
      voiceBtn.addEventListener("click", () => {
        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRec) {
          const rec = new SpeechRec();
          rec.lang = "hi-IN";
          rec.interimResults = false;

          try {
            rec.start();
            isListening = true;
            if (listeningIndicator) listeningIndicator.classList.remove("hidden");
            voiceBtn.classList.add("bg-primary-fixed");
          } catch(e) {
            console.warn("Speech recognition already active", e);
          }

          rec.onresult = (evt) => {
            const spoken = evt.results[0][0].transcript;
            messageInput.value = (messageInput.value ? messageInput.value + " " : "") + spoken;
            updateCounter();
          };

          rec.onend = () => {
            isListening = false;
            if (listeningIndicator) listeningIndicator.classList.add("hidden");
            voiceBtn.classList.remove("bg-primary-fixed");
          };

          rec.onerror = () => {
            isListening = false;
            if (listeningIndicator) listeningIndicator.classList.add("hidden");
            voiceBtn.classList.remove("bg-primary-fixed");
          };
        } else {
          // Simulation fallback for unsupported browsers
          if (listeningIndicator) listeningIndicator.classList.remove("hidden");
          setTimeout(() => {
            messageInput.value = "सर मुझे व्हाट्सएप पर गारंटीड 300% रिटर्न का मैसेज आया है क्या यह सही है?";
            updateCounter();
            if (listeningIndicator) listeningIndicator.classList.add("hidden");
          }, 1200);
        }
      });
    }

    // Check Now Action
    if (checkBtn) {
      checkBtn.addEventListener("click", async () => {
        const text = messageInput ? messageInput.value.trim() : "";
        const link = linkInput ? linkInput.value.trim() : "";

        if (errorBox) errorBox.classList.add("hidden");

        if (!text && !link) {
          if (errorBox) {
            errorBox.textContent = "कृपया जांच के लिए कोई संदेश या लिंक दर्ज करें (Please enter a message or link)";
            errorBox.classList.remove("hidden");
          }
          if (messageInput) messageInput.focus();
          return;
        }

        // Show analyzing spinner
        checkBtn.disabled = true;
        checkBtn.innerHTML = `
          <span class="material-symbols-outlined text-[24px] animate-spin">progress_activity</span>
          <span class="font-label-xl text-label-xl">Analyzing with SEBI Registry...</span>
        `;

        const result = await ApiService.analyzeMessage(text, link);

        // Restore button state
        checkBtn.disabled = false;
        checkBtn.innerHTML = `
          <span class="material-symbols-outlined text-[26px]">search_check_2</span>
          <span class="font-label-xl text-label-xl tracking-wide">Check Now (जाँच करें)</span>
        `;

        if (result.success && result.data) {
          // Store analysis data for result.html
          sessionStorage.setItem(CONFIG.STORAGE_KEYS.LAST_ANALYSIS, JSON.stringify(result.data));
          sessionStorage.setItem(CONFIG.STORAGE_KEYS.LAST_SNIPPET, text || link);
          // Navigate to result.html
          window.location.href = "result.html";
        } else {
          // Failure handling: show simple error and stay on input page
          if (errorBox) {
            errorBox.textContent = "Something went wrong. Please try again. (कुछ गड़बड़ हुई, कृपया दोबारा प्रयास करें)";
            errorBox.classList.remove("hidden");
          }
        }
      });
    }
  },

  /**
   * ============================================================
   * PAGE 3: RESULT PAGE (result.html)
   * ============================================================
   */
  initResultPage: function() {
    this.initGlobal();

    const storedAnalysis = sessionStorage.getItem(CONFIG.STORAGE_KEYS.LAST_ANALYSIS);
    const storedSnippet = sessionStorage.getItem(CONFIG.STORAGE_KEYS.LAST_SNIPPET);

    // Fallback if accessed directly without scanning
    let data;
    try {
      data = storedAnalysis ? JSON.parse(storedAnalysis) : DEMO_SAMPLES.HIGH;
    } catch(e) {
      data = DEMO_SAMPLES.HIGH;
    }

    const snippetText = storedSnippet || "“Sir, guaranteed 400% profit in 24 hours! Only 3 VIP slots left. Send ₹5,000 on GooglePay now to confirm VIP portfolio access...”";

    // Populate Snippet Quote
    const snippetEl = document.getElementById("result-snippet");
    if (snippetEl) snippetEl.textContent = `“${snippetText}”`;

    // Render Badge & Styling according to risk level
    const risk = (data.risk_level || "Medium").toUpperCase();
    const heroCard = document.getElementById("result-hero-card");
    const riskTitle = document.getElementById("result-risk-title");
    const riskSubtitle = document.getElementById("result-risk-subtitle");
    const riskMatchPill = document.getElementById("result-match-pill");
    const matchText = document.getElementById("result-match-text");
    const elderAdvisory = document.getElementById("result-elder-advisory");

    if (risk === "HIGH") {
      if (heroCard) heroCard.className = "mt-4 w-full rounded-2xl bg-error-container p-6 text-on-error-container shadow-sm flex flex-col items-center text-center relative overflow-hidden";
      if (riskTitle) { riskTitle.textContent = "High Risk"; riskTitle.className = "text-2xl font-bold text-error tracking-tight"; }
      if (riskSubtitle) riskSubtitle.textContent = "बहुत ज्यादा जोखिम (Critical Danger)";
      if (matchText) matchText.textContent = `${data.match_percentage || '95%'} Scam Match Pattern`;
      if (elderAdvisory) elderAdvisory.textContent = data.verdict_summary || "Do not deposit any funds. This scheme violates securities laws.";
    } else if (risk === "LOW") {
      if (heroCard) heroCard.className = "mt-4 w-full rounded-2xl bg-secondary-container p-6 text-on-secondary-container shadow-sm flex flex-col items-center text-center relative overflow-hidden";
      if (riskTitle) { riskTitle.textContent = "Low Risk"; riskTitle.className = "text-2xl font-bold text-secondary tracking-tight"; }
      if (riskSubtitle) riskSubtitle.textContent = "कम जोखिम (सुरक्षित प्रतीत होता है)";
      if (matchText) matchText.textContent = `${data.match_percentage || '12%'} Pattern Match (Clean)`;
      if (elderAdvisory) elderAdvisory.textContent = data.verdict_summary || "No strong red flags or fraudulent markers detected.";
    } else {
      // Medium
      if (heroCard) heroCard.className = "mt-4 w-full rounded-2xl bg-tertiary-fixed p-6 text-on-tertiary-fixed shadow-sm flex flex-col items-center text-center relative overflow-hidden";
      if (riskTitle) { riskTitle.textContent = "Medium Risk"; riskTitle.className = "text-2xl font-bold text-tertiary tracking-tight"; }
      if (riskSubtitle) riskSubtitle.textContent = "कुछ जोखिम (सावधानी बरतें)";
      if (matchText) matchText.textContent = `${data.match_percentage || '68%'} Caution Indicators`;
      if (elderAdvisory) elderAdvisory.textContent = data.verdict_summary || "Exercise caution before taking action or transferring money.";
    }

    // Populate Explanation Bullets
    const bulletsList = document.getElementById("result-bullets-list");
    if (bulletsList) {
      bulletsList.innerHTML = "";
      const items = (data.explanation_bullets && data.explanation_bullets.length) 
        ? data.explanation_bullets 
        : [data.verdict_summary];

      items.forEach(point => {
        const li = document.createElement("li");
        li.className = "flex items-start gap-3 p-3 rounded-xl bg-surface-container-low text-on-surface text-sm leading-relaxed";
        li.innerHTML = `
          <span class="material-symbols-outlined text-[20px] ${risk === 'HIGH' ? 'text-error' : (risk === 'LOW' ? 'text-secondary' : 'text-tertiary')} shrink-0 mt-0.5">
            ${risk === 'HIGH' ? 'priority_high' : (risk === 'LOW' ? 'check_circle' : 'warning')}
          </span>
          <span>${point}</span>
        `;
        bulletsList.appendChild(li);
      });
    }

    // Navigation Buttons Wireup
    const homeBtn = document.getElementById("btn-result-home");
    if (homeBtn) {
      homeBtn.addEventListener("click", () => {
        window.location.href = "index.html";
      });
    }

    const reportBtn = document.getElementById("btn-result-report");
    if (reportBtn) {
      reportBtn.addEventListener("click", () => {
        // Carry snippet forward into report form
        sessionStorage.setItem("sangyan_report_prefill", snippetText);
        window.location.href = "report.html";
      });
    }

    const sebiBtn = document.getElementById("btn-result-sebi");
    if (sebiBtn) {
      sebiBtn.addEventListener("click", () => {
        window.open(CONFIG.SEBI_PORTAL_URL, "_blank", "noopener,noreferrer");
      });
    }
  },

  /**
   * ============================================================
   * PAGE 4: REPORT SCAM (report.html)
   * ============================================================
   */
  initReportPage: function() {
    this.initGlobal();

    const form = document.getElementById("scam-report-form");
    const nameInput = document.getElementById("reporter-name");
    const cityInput = document.getElementById("reporter-city");
    const platformSelect = document.getElementById("scam-source");
    const messageArea = document.getElementById("scam-content");
    const submitBtn = document.getElementById("submit-report-btn");
    const cancelBtn = document.getElementById("cancel-report-btn");
    const errorBox = document.getElementById("report-error-msg");
    const successModal = document.getElementById("success-overlay");

    // Pre-fill message if passed from result screen
    const prefill = sessionStorage.getItem("sangyan_report_prefill");
    if (prefill && messageArea) {
      messageArea.value = prefill;
    }

    // Platform quick chips
    document.querySelectorAll(".source-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        const val = chip.getAttribute("data-source");
        if (platformSelect && val) {
          platformSelect.value = val;
        }
      });
    });

    // Cancel Button
    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        window.location.href = "index.html";
      });
    }

    // Form Submission
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (errorBox) errorBox.classList.add("hidden");

        const payload = {
          name: nameInput ? nameInput.value.trim() : "",
          city: cityInput ? cityInput.value.trim() : "",
          platform: platformSelect ? platformSelect.value : "other",
          message: messageArea ? messageArea.value.trim() : ""
        };

        if (!payload.platform || !payload.message) {
          if (errorBox) {
            errorBox.textContent = "Please select a platform and provide the scam message details.";
            errorBox.classList.remove("hidden");
          }
          return;
        }

        // Show spinner
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `
            <span class="material-symbols-outlined text-[22px] animate-spin">progress_activity</span>
            <span>Submitting...</span>
          `;
        }

        const res = await ApiService.submitReport(payload);

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `
            <span class="material-symbols-outlined text-[24px]">send</span>
            <span>Submit Report (रिपोर्ट जमा करें)</span>
          `;
        }

        if (res.success) {
          // Show Success Modal
          if (successModal) successModal.classList.remove("hidden");
          // Clear prefill
          sessionStorage.removeItem("sangyan_report_prefill");
          // Redirect to Home after 2 seconds
          setTimeout(() => {
            window.location.href = "index.html";
          }, 2000);
        } else {
          // Failure handling
          if (errorBox) {
            errorBox.textContent = "Could not send report. Please try again later. (रिपोर्ट भेजने में विफल, कृपया बाद में प्रयास करें)";
            errorBox.classList.remove("hidden");
          }
        }
      });
    }
  },

  /**
   * ============================================================
   * PAGE 5: HOW IT WORKS (how-it-works.html)
   * ============================================================
   */
  initHowItWorksPage: function() {
    this.initGlobal();

    const gotItBtn = document.getElementById("btn-how-gotit");
    if (gotItBtn) {
      gotItBtn.addEventListener("click", () => {
        window.location.href = "input.html";
      });
    }
  }

};
