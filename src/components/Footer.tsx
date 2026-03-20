import { reopenConsentBanner, useConsentStatus } from "./CookieConsent";
import { Link } from "react-router-dom";
import { useContactModal } from "./contact/ContactModalContext";


const footerLinks = {
  company: [
    { label: "Overview", to: "/company/overview" },
    { label: "Leadership", to: "/company/leadership" },
    { label: "Careers", to: "/company/careers" },
  ],
  platform: [
    { label: "AI Cortex", to: "/platform/ai-cortex" },
    { label: "EMR Layer", to: "/platform/emr-layer" },
    { label: "Virtual Care", to: "/platform/virtual-care" },
    { label: "Patient Access", to: "/platform/patient-access" },
  ],
  infrastructure: [
    { label: "Deployment", to: "/infrastructure/deployment" },
    { label: "Governance", to: "/infrastructure/governance" },
    { label: "Audit Trails", to: "/infrastructure/audit-trails" },
    { label: "Interoperability", to: "/infrastructure/interoperability" },
  ],
};

const linkStyle = {
  color: "rgba(255,255,255,.72)",
  fontSize: 14,
  padding: "6px 0",
};

const Footer = () => {
  const consentStatus = useConsentStatus();
  const { openModal } = useContactModal();
  return (
    <footer
      className="relative overflow-hidden"
      style={{
        background: `
          radial-gradient(900px 500px at 20% 10%, rgba(91,29,179,.25), transparent 60%),
          radial-gradient(900px 600px at 80% 60%, rgba(232,150,124,.10), transparent 65%),
          linear-gradient(180deg, #16002A 0%, #0B0613 100%)`,
        color: "rgba(255,255,255,.88)",
      }}
    >
      {/* Animated accent line */}
      <div
        className="w-full"
        style={{
          height: 4,
          background: "linear-gradient(90deg, #D4616B, #E8967C, #F2C1AE)",
          backgroundSize: "200% 100%",
          animation: "accentShift 10s ease-in-out infinite",
          opacity: 0.9,
        }}
      />

      {/* Content wrap */}
      <div
        className="relative z-[2] mx-auto"
        style={{ width: "min(1180px, 92vw)", padding: "clamp(48px, 8vw, 90px) 0 clamp(24px, 4vw, 40px)" }}
      >
        {/* CTA Section */}
        <div>
          <h3
            style={{
              fontSize: "clamp(34px, 3vw, 46px)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              margin: "0 0 14px",
              color: "rgba(255,255,255,0.95)",
              fontWeight: 800,
            }}
          >
            The next layer of
            <br />
            healthcare.
          </h3>
          <p
            style={{
              maxWidth: "62ch",
              fontSize: 16,
              lineHeight: 1.7,
              color: "rgba(255,255,255,.70)",
              margin: "0 0 22px",
            }}
          >
            DocG AI is Canada-first infrastructure. We turn messy clinical
            signals into verified, coordinated action for the whole healthcare system.
          </p>

          {/* Buttons */}
          <div className="flex gap-3 flex-wrap">
            <button
              type="button"
              onClick={openModal}
              className="inline-block no-underline transition-all duration-200 hover:-translate-y-px"
              style={{
                background:
                  "linear-gradient(90deg, rgba(189,166,255,.24), rgba(255,255,255,.08))",
                border: "1px solid rgba(189,166,255,.30)",
                color: "rgba(255,255,255,.92)",
                padding: "12px 16px",
                borderRadius: 999,
                backdropFilter: "blur(10px)",
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "0.04em",
                cursor: "pointer",
              }}
            >
              Request Investor Deck
            </button>
            <button
              type="button"
              onClick={openModal}
              className="inline-block no-underline transition-all duration-200 hover:-translate-y-px"
              style={{
                background: "rgba(255,255,255,.04)",
                border: "1px solid rgba(255,255,255,.14)",
                color: "rgba(255,255,255,.80)",
                padding: "12px 16px",
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "0.04em",
                cursor: "pointer",
              }}
            >
              Contact
            </button>
          </div>
        </div>

        {/* 4-Column Grid */}
        <div
          className="grid gap-5 mt-14 pt-8 footer-grid-responsive"
          style={{
            gridTemplateColumns: "repeat(4, minmax(0,1fr))",
            borderTop: "1px solid rgba(255,255,255,.10)",
          }}
        >
          {/* Company */}
          <div>
            <div
              className="font-mono uppercase mb-3.5"
              style={{ fontSize: 12, letterSpacing: "0.22em", color: "rgba(255,255,255,.55)" }}
            >
              Company
            </div>
            {footerLinks.company.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="block no-underline transition-colors duration-200 hover:!text-white/90"
                style={linkStyle}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Platform */}
          <div>
            <div
              className="font-mono uppercase mb-3.5"
              style={{ fontSize: 12, letterSpacing: "0.22em", color: "rgba(255,255,255,.55)" }}
            >
              Platform
            </div>
            {footerLinks.platform.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="block no-underline transition-colors duration-200 hover:!text-white/90"
                style={linkStyle}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Infrastructure */}
          <div>
            <div
              className="font-mono uppercase mb-3.5"
              style={{ fontSize: 12, letterSpacing: "0.22em", color: "rgba(255,255,255,.55)" }}
            >
              Infrastructure
            </div>
            {footerLinks.infrastructure.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="block no-underline transition-colors duration-200 hover:!text-white/90"
                style={linkStyle}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <div
              className="font-mono uppercase mb-3.5"
              style={{ fontSize: 12, letterSpacing: "0.22em", color: "rgba(255,255,255,.55)" }}
            >
              Contact
            </div>
            <a
              href="mailto:hello@docg.ai"
              className="block no-underline transition-colors duration-200 hover:!text-white/90"
              style={linkStyle}
            >
              hello@docg.ai
            </a>
            <a
              href="https://www.linkedin.com/company/98831917"
              target="_blank"
              rel="noopener noreferrer"
              className="block no-underline transition-colors duration-200 hover:!text-white/90"
              style={linkStyle}
            >
              LinkedIn
            </a>
            <Link
              to="/company/contact"
              className="block no-underline transition-colors duration-200 hover:!text-white/90"
              style={linkStyle}
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Bottom band */}
        <div
          className="flex justify-between gap-3 flex-wrap mt-8 pt-4"
          style={{
            borderTop: "1px solid rgba(255,255,255,.10)",
            color: "rgba(255,255,255,.55)",
            fontSize: 13,
          }}
        >
          <span>© {new Date().getFullYear()} DocG AI. All rights reserved.</span>
          <div className="flex gap-3.5 items-center flex-wrap">
            <Link
              to="/privacy"
              className="no-underline transition-colors duration-200 hover:!text-white/80"
              style={{ color: "rgba(255,255,255,.55)" }}
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="no-underline transition-colors duration-200 hover:!text-white/80"
              style={{ color: "rgba(255,255,255,.55)" }}
            >
              Terms
            </Link>
            <button
              onClick={reopenConsentBanner}
              className="inline-flex items-center gap-1.5 no-underline transition-colors duration-200 hover:!text-white/80 bg-transparent border-0 cursor-pointer p-0"
              style={{ color: "rgba(255,255,255,.55)", font: "inherit", fontSize: 13 }}
            >
              {consentStatus !== null && (
                <span
                  className="relative flex h-2 w-2"
                  title={
                    consentStatus === "all" ? "All cookies accepted"
                    : consentStatus === "partial" ? "Some cookies accepted"
                    : "Only essential cookies"
                  }
                >
                  {consentStatus === "all" && (
                    <span
                      className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-50"
                      style={{ background: "#4ade80" }}
                    />
                  )}
                  <span
                    className="relative inline-flex rounded-full h-2 w-2"
                    style={{
                      background:
                        consentStatus === "all" ? "#4ade80"
                        : consentStatus === "partial" ? "#facc15"
                        : "rgba(255,255,255,0.35)",
                    }}
                  />
                </span>
              )}
              Manage Cookies
            </button>
            <span
              style={{
                padding: "6px 12px",
                borderRadius: 999,
                border: "1px solid rgba(220,38,38,.3)",
                background: "rgba(220,38,38,.08)",
                color: "#ef4444",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#ef4444">
                <path d="M12 2L9.5 7.5L4 6l2 5-4 3h5.5l-1 5 5.5-3.5L17.5 19l-1-5H22l-4-3 2-5-5.5 1.5z"/>
              </svg>
              Built in Canada.
            </span>
          </div>
        </div>
      </div>

      {/* Watermark */}
      <div
        className="absolute left-1/2 pointer-events-none z-[1]"
        style={{
          bottom: -20,
          transform: "translateX(-50%)",
          fontSize: "clamp(80px, 10vw, 160px)",
          fontWeight: 900,
          letterSpacing: "-0.03em",
          color: "rgba(189,166,255,.10)",
        }}
      >
        INTELLIGENCE
      </div>

      {/* Keyframe for accent animation */}
      <style>{`
        @keyframes accentShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @media (max-width: 980px) {
          .footer-grid-responsive { grid-template-columns: repeat(2, minmax(0,1fr)) !important; }
        }
        @media (max-width: 560px) {
          .footer-grid-responsive { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;