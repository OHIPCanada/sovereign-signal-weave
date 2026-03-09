import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import DriftingGrid from "@/components/hero-backgrounds/DriftingGrid";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Send, ArrowRight } from "lucide-react";

const channels = [
  { label: "Email", value: "contact@docg.ai", sub: "Response within 24 hours", href: "mailto:contact@docg.ai" },
  { label: "Phone", value: "+1 (800) 555-DOCG", sub: "Mon – Fri, 9 AM – 6 PM EST", href: "tel:+18005553624" },
  { label: "Headquarters", value: "Toronto, Ontario", sub: "Canada-sovereign infrastructure", href: undefined },
  { label: "Support", value: "24/7 Critical", sub: "Enterprise SLA available", href: undefined },
];

const inquiryTypes = [
  "Enterprise Partnership",
  "Platform Demo",
  "Technical Integration",
  "Media & Press",
  "Careers",
  "General Inquiry",
];

const responseProtocol = [
  { label: "General inquiries", time: "< 24 hours" },
  { label: "Enterprise & partnership", time: "< 4 hours" },
  { label: "Technical support", time: "< 2 hours" },
  { label: "Critical infrastructure", time: "Immediate" },
];

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", type: "", org: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast({ title: "Message received", description: "Our team will respond within 24 hours." });
      setForm({ name: "", email: "", type: "", org: "", message: "" });
    }, 1400);
  };

  const fieldStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 18px",
    background: "rgba(255,255,255,0.7)",
    border: "1px solid rgba(90,70,160,0.12)",
    borderRadius: 10,
    color: "#1a1a2e",
    fontSize: 15,
    outline: "none",
    transition: "border-color 0.2s",
    fontFamily: "inherit",
  };

  return (
    <div className="relative overflow-x-hidden">
      <Navigation darkMode />

      {/* ─── HERO ─── */}
      <section
        className="relative overflow-hidden flex items-end md:items-center"
        style={{
          minHeight: "80vh",
          padding: "clamp(120px, 14vw, 200px) 0 clamp(64px, 7vw, 110px)",
          background: `
            radial-gradient(900px 600px at 18% 38%, rgba(143,83,255,0.45), transparent 60%),
            radial-gradient(700px 520px at 78% 22%, rgba(255,192,174,0.18), transparent 62%),
            radial-gradient(900px 700px at 70% 75%, rgba(212,97,107,0.14), transparent 66%),
            linear-gradient(135deg, #1A0630 0%, #3A0B6E 48%, #5B1FA6 120%)
          `,
        }}
      >
        <DriftingGrid />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 mx-auto px-6 md:px-12" style={{ width: "min(1400px, 94vw)" }}>
          <div className="grid grid-cols-1 md:grid-cols-[0.55fr_1.45fr] items-center" style={{ gap: "clamp(40px, 6vw, 100px)" }}>
            {/* Left — headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="flex flex-col gap-5"
            >
              <p className="font-mono uppercase" style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, letterSpacing: "0.22em" }}>
                [ CONTACT ]
              </p>
              <h1
                style={{
                  color: "rgba(255,255,255,0.95)",
                  fontWeight: 800,
                  lineHeight: 0.95,
                  fontSize: "clamp(44px, 5.2vw, 84px)",
                  letterSpacing: "-0.02em",
                  textShadow: "0 10px 40px rgba(0,0,0,0.22)",
                }}
              >
                Start the
                <br />
                <span
                  style={{
                    background: "linear-gradient(135deg, #D4616B, #E8967C, #F2C1AE)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  conversation.
                </span>
              </h1>
              <p
                style={{
                  color: "rgba(255,255,255,0.72)",
                  fontWeight: 400,
                  fontSize: "clamp(15px, 1.25vw, 18px)",
                  lineHeight: 1.55,
                  maxWidth: "46ch",
                }}
              >
                Whether you're exploring enterprise integration, requesting a platform demo, or joining the team — we're ready to listen.
              </p>
            </motion.div>

            {/* Right — channel glass cards */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              {channels.map((ch, i) => (
                <motion.div
                  key={ch.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                  className="rounded-[20px] overflow-hidden"
                  style={{
                    background: "linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.025))",
                    border: "1px solid rgba(255,255,255,0.12)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
                    padding: "28px 24px",
                  }}
                >
                  <p
                    className="font-mono uppercase"
                    style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, letterSpacing: "0.2em", marginBottom: 12 }}
                  >
                    {ch.label}
                  </p>
                  {ch.href ? (
                    <a
                      href={ch.href}
                      style={{ textDecoration: "none" }}
                    >
                      <p
                        style={{
                          fontSize: "clamp(14px, 1.2vw, 17px)",
                          fontWeight: 700,
                          color: "rgba(255,255,255,0.95)",
                          letterSpacing: "-0.01em",
                          lineHeight: 1.2,
                          marginBottom: 8,
                        }}
                      >
                        {ch.value}
                      </p>
                    </a>
                  ) : (
                    <p
                      style={{
                        fontSize: "clamp(14px, 1.2vw, 17px)",
                        fontWeight: 700,
                        color: "rgba(255,255,255,0.95)",
                        letterSpacing: "-0.01em",
                        lineHeight: 1.2,
                        marginBottom: 8,
                      }}
                    >
                      {ch.value}
                    </p>
                  )}
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>
                    {ch.sub}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── FORM SECTION — LIGHT THEME ─── */}
      <section
        className="relative overflow-hidden"
        style={{
          padding: "clamp(80px, 8vw, 130px) 0",
          background: `
            radial-gradient(1200px 600px at 20% 40%, rgba(123,97,255,0.06), transparent 60%),
            radial-gradient(800px 500px at 80% 60%, rgba(212,97,107,0.05), transparent 60%),
            linear-gradient(180deg, #F7F3FF 0%, #F1EEF8 50%, #FAFAFA 100%)
          `,
        }}
      >
        {/* Top separator */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background: "linear-gradient(90deg, transparent 5%, rgba(212,97,107,0.3) 30%, rgba(123,97,255,0.35) 70%, transparent 95%)",
          }}
        />

        <div className="mx-auto px-6 md:px-12" style={{ width: "min(1400px, 94vw)" }}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.65fr] gap-12 lg:gap-20 items-start">

            {/* Form */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{
                background: "rgba(255,255,255,0.18)",
                border: "1px solid rgba(255,255,255,0.25)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                borderRadius: 20,
                padding: "clamp(32px, 4vw, 56px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.4)",
              }}
            >
              <p
                className="font-mono uppercase"
                style={{ color: "rgba(90,70,160,0.5)", fontSize: 12, letterSpacing: "0.22em", marginBottom: 12 }}
              >
                [ SEND A MESSAGE ]
              </p>
              <h2
                style={{
                  color: "#1a1a2e",
                  fontWeight: 800,
                  fontSize: "clamp(28px, 3vw, 44px)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.02em",
                  marginBottom: 36,
                }}
              >
                Let's build together.
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <input
                  placeholder="Full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={fieldStyle}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(123,97,255,0.4)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(90,70,160,0.12)")}
                  required
                />
                <input
                  placeholder="Email address"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={fieldStyle}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(123,97,255,0.4)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(90,70,160,0.12)")}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  style={{ ...fieldStyle, appearance: "none" as const, cursor: "pointer" }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(123,97,255,0.4)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(90,70,160,0.12)")}
                >
                  <option value="" style={{ background: "#fff" }}>Inquiry type</option>
                  {inquiryTypes.map((t) => (
                    <option key={t} value={t} style={{ background: "#fff" }}>{t}</option>
                  ))}
                </select>
                <input
                  placeholder="Organization (optional)"
                  value={form.org}
                  onChange={(e) => setForm({ ...form, org: e.target.value })}
                  style={fieldStyle}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(123,97,255,0.4)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(90,70,160,0.12)")}
                />
              </div>

              <textarea
                placeholder="Your message"
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                style={{ ...fieldStyle, resize: "vertical" as const, minHeight: 120 }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(123,97,255,0.4)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(90,70,160,0.12)")}
                required
              />

              <motion.button
                type="submit"
                disabled={sending}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-8 flex items-center gap-3"
                style={{
                  background: "linear-gradient(135deg, #D4616B, #E8967C)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  padding: "16px 36px",
                  borderRadius: 12,
                  border: "none",
                  cursor: sending ? "wait" : "pointer",
                  opacity: sending ? 0.7 : 1,
                  transition: "opacity 0.2s",
                  fontFamily: "inherit",
                }}
              >
                {sending ? "Sending…" : "Send message"}
                <Send size={16} />
              </motion.button>
            </motion.form>

            {/* Right sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex flex-col gap-6"
            >
              {/* Response protocol */}
              <div
                style={{
                  background: "rgba(255,255,255,0.18)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  borderRadius: 20,
                  padding: "36px 30px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.4)",
                }}
              >
                <p
                  className="font-mono uppercase"
                  style={{ color: "rgba(90,70,160,0.5)", fontSize: 12, letterSpacing: "0.22em", marginBottom: 20 }}
                >
                  [ RESPONSE PROTOCOL ]
                </p>
                <div className="flex flex-col gap-5">
                  {responseProtocol.map((r, i) => (
                    <div
                      key={r.label}
                      className="flex items-center justify-between"
                      style={{
                        paddingBottom: i < responseProtocol.length - 1 ? 16 : 0,
                        borderBottom: i < responseProtocol.length - 1 ? "1px solid rgba(90,70,160,0.08)" : "none",
                      }}
                    >
                      <span style={{ color: "#3a3a5c", fontSize: 15 }}>{r.label}</span>
                      <span className="font-mono" style={{ color: "#D4616B", fontSize: 13, letterSpacing: "0.05em" }}>
                        {r.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Demo CTA */}
              <div
                style={{
                  background: "rgba(255,255,255,0.18)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  borderRadius: 20,
                  padding: "36px 30px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.4)",
                }}
              >
                <h3
                  style={{
                    color: "#1a1a2e",
                    fontWeight: 700,
                    fontSize: 20,
                    letterSpacing: "-0.01em",
                    marginBottom: 10,
                  }}
                >
                  Schedule a platform demo
                </h3>
                <p style={{ color: "#5a5a7c", fontSize: 15, lineHeight: 1.6, marginBottom: 20 }}>
                  See how DocG's intelligence layer integrates with your existing clinical infrastructure.
                </p>
                <motion.a
                  href="#"
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-2"
                  style={{
                    color: "#D4616B",
                    fontWeight: 700,
                    fontSize: 13,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                  }}
                >
                  Request demo <ArrowRight size={15} />
                </motion.a>
              </div>

              {/* Compliance */}
              <div
                className="flex items-center gap-4"
                style={{
                  background: "rgba(255,255,255,0.18)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  borderRadius: 14,
                  padding: "20px 24px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.4)",
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#4ADE80",
                    boxShadow: "0 0 12px rgba(74,222,128,0.4)",
                    flexShrink: 0,
                  }}
                />
                <div>
                  <p style={{ color: "#1a1a2e", fontSize: 14, fontWeight: 600 }}>
                    SOC 2 Type II & PIPEDA compliant
                  </p>
                  <p style={{ color: "#7a7a9c", fontSize: 13 }}>
                    All communications encrypted end-to-end
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
