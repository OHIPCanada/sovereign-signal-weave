import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Cookie, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";

interface ConsentPreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

const CONSENT_KEY = "docg_cookie_consent";

const defaultPreferences: ConsentPreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  timestamp: "",
};

export const getConsentPreferences = (): ConsentPreferences | null => {
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return null;
};

export const hasConsent = (type: keyof Omit<ConsentPreferences, "timestamp">): boolean => {
  const prefs = getConsentPreferences();
  return prefs?.[type] ?? false;
};

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>(defaultPreferences);

  useEffect(() => {
    const existing = getConsentPreferences();
    if (!existing) {
      // Delay showing banner for better UX
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const savePreferences = (prefs: ConsentPreferences) => {
    const withTimestamp = { ...prefs, timestamp: new Date().toISOString() };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(withTimestamp));
    setVisible(false);
  };

  const acceptAll = () => {
    savePreferences({ necessary: true, analytics: true, marketing: true, timestamp: "" });
  };

  const acceptSelected = () => {
    savePreferences(preferences);
  };

  const rejectNonEssential = () => {
    savePreferences({ necessary: true, analytics: false, marketing: false, timestamp: "" });
  };

  const togglePreference = (key: keyof Omit<ConsentPreferences, "timestamp" | "necessary">) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
        >
          <div
            className="mx-auto max-w-3xl rounded-2xl shadow-2xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.97)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            {/* Header */}
            <div className="px-6 pt-5 pb-4 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, var(--coral-soft), var(--coral-mid))",
                  }}
                >
                  <Cookie className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-foreground font-bold text-base">Cookie & Privacy Preferences</h3>
                  <p className="text-muted-foreground text-sm mt-0.5">
                    We respect your privacy under Canadian law
                  </p>
                </div>
              </div>
              <button
                onClick={rejectNonEssential}
                className="p-2 rounded-lg hover:bg-foreground/5 transition-colors"
                aria-label="Close and reject non-essential"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 pb-4">
              <p className="text-sm text-foreground/70 leading-relaxed">
                DocG AI uses cookies and similar technologies to provide essential functionality, analyze usage, and deliver relevant communications. In accordance with{" "}
                <strong>PIPEDA</strong> and <strong>CASL</strong> (Canada's Anti-Spam Legislation), we seek your meaningful consent before collecting non-essential data. 
                You can customize your preferences below. See our{" "}
                <Link to="/privacy" className="text-accent hover:underline font-medium">
                  Privacy Policy
                </Link>{" "}
                for details.
              </p>

              {/* Expandable Details */}
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-2 mt-4 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                Customize preferences
              </button>

              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 space-y-3">
                      {/* Necessary */}
                      <div
                        className="flex items-center justify-between p-4 rounded-xl"
                        style={{ background: "rgba(120,150,210,0.06)" }}
                      >
                        <div>
                          <p className="font-semibold text-sm text-foreground">Strictly Necessary</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Required for basic site functionality. Cannot be disabled.
                          </p>
                        </div>
                        <div
                          className="w-10 h-6 rounded-full flex items-center px-1"
                          style={{ background: "var(--coral-mid)" }}
                        >
                          <div className="w-4 h-4 bg-white rounded-full ml-auto shadow" />
                        </div>
                      </div>

                      {/* Analytics */}
                      <label
                        className="flex items-center justify-between p-4 rounded-xl cursor-pointer hover:bg-foreground/[0.02] transition-colors"
                        style={{ background: "rgba(120,150,210,0.04)" }}
                      >
                        <div>
                          <p className="font-semibold text-sm text-foreground">Analytics</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Help us understand how you use our site to improve the experience.
                          </p>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={preferences.analytics}
                          onClick={() => togglePreference("analytics")}
                          className="w-10 h-6 rounded-full flex items-center px-1 transition-colors"
                          style={{
                            background: preferences.analytics ? "var(--coral-mid)" : "rgba(0,0,0,0.15)",
                          }}
                        >
                          <div
                            className="w-4 h-4 bg-white rounded-full shadow transition-transform"
                            style={{
                              transform: preferences.analytics ? "translateX(16px)" : "translateX(0)",
                            }}
                          />
                        </button>
                      </label>

                      {/* Marketing */}
                      <label
                        className="flex items-center justify-between p-4 rounded-xl cursor-pointer hover:bg-foreground/[0.02] transition-colors"
                        style={{ background: "rgba(120,150,210,0.04)" }}
                      >
                        <div>
                          <p className="font-semibold text-sm text-foreground">Marketing & Communications</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Receive product updates and relevant information. CASL-compliant — unsubscribe anytime.
                          </p>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={preferences.marketing}
                          onClick={() => togglePreference("marketing")}
                          className="w-10 h-6 rounded-full flex items-center px-1 transition-colors"
                          style={{
                            background: preferences.marketing ? "var(--coral-mid)" : "rgba(0,0,0,0.15)",
                          }}
                        >
                          <div
                            className="w-4 h-4 bg-white rounded-full shadow transition-transform"
                            style={{
                              transform: preferences.marketing ? "translateX(16px)" : "translateX(0)",
                            }}
                          />
                        </button>
                      </label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Actions */}
            <div
              className="px-6 py-4 flex flex-wrap gap-3 justify-end"
              style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
            >
              <button
                onClick={rejectNonEssential}
                className="px-5 py-2.5 text-sm font-semibold rounded-full transition-colors hover:bg-foreground/5"
                style={{ color: "var(--muted-foreground)" }}
              >
                Reject Non-Essential
              </button>
              {showDetails && (
                <button
                  onClick={acceptSelected}
                  className="px-5 py-2.5 text-sm font-semibold rounded-full transition-colors"
                  style={{
                    background: "rgba(120,150,210,0.12)",
                    color: "hsl(var(--foreground))",
                  }}
                >
                  Save Preferences
                </button>
              )}
              <button
                onClick={acceptAll}
                className="px-5 py-2.5 text-sm font-semibold rounded-full transition-all hover:-translate-y-px"
                style={{
                  background: "linear-gradient(90deg, var(--coral-strong), var(--coral-mid))",
                  color: "white",
                }}
              >
                Accept All
              </button>
            </div>

            {/* Legal note */}
            <div
              className="px-6 py-3 text-center"
              style={{ background: "rgba(0,0,0,0.02)", borderTop: "1px solid rgba(0,0,0,0.04)" }}
            >
              <p className="text-xs text-muted-foreground">
                By using this site, you agree to our{" "}
                <Link to="/terms" className="hover:underline">
                  Terms of Service
                </Link>
                . Compliant with PIPEDA, PHIPA & CASL.
                <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: "rgba(232,150,124,0.12)", color: "var(--coral-mid)" }}>
                  🇨🇦 Canada
                </span>
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
