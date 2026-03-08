import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Mail, MapPin, Phone, Clock, Send, ArrowRight } from "lucide-react";

const contactChannels = [
  {
    icon: Mail,
    label: "Email",
    value: "contact@docg.ai",
    sub: "Response within 24 hours",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+1 (800) 555-DOCG",
    sub: "Mon – Fri, 9 AM – 6 PM EST",
  },
  {
    icon: MapPin,
    label: "Headquarters",
    value: "Toronto, Ontario",
    sub: "Canada-sovereign infrastructure",
  },
  {
    icon: Clock,
    label: "Support Hours",
    value: "24 / 7 Critical",
    sub: "Enterprise SLA available",
  },
];

const inquiryTypes = [
  "Enterprise Partnership",
  "Platform Demo",
  "Technical Integration",
  "Media & Press",
  "Careers",
  "General Inquiry",
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
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10,
    color: "rgba(255,255,255,0.92)",
    fontSize: 15,
    outline: "none",
    transition: "border-color 0.2s",
  };

  return (
    <div className="relative overflow-x-hidden">
      <Navigation darkMode />

      {/* ─── HERO ─── */}
      <section
        className="relative overflow-hidden flex items-end md:items-center"
        style={{
          minHeight: "70vh",
          padding: "clamp(120px,14vw,200px) 0 clamp(64px,7vw,100px)",
          background: `
            radial-gradient(900px 600px at 18% 38%, rgba(143,83,255,0.45), transparent 60%),
            radial-gradient(700px 520px at 78% 22%, rgba(255,192,174,0.14), transparent 62%),
            radial-gradient(900px 700px at 70% 75%, rgba(212,97,107,0.12), transparent 66%),
            linear-gradient(135deg, #1A0630 0%, #3A0B6E 48%, #5B1FA6 120%)
          `,
        }}
      >
        {/* Subtle grid overlay */}
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

        <div className="relative z-10 mx-auto px-6 md:px-12" style={{ width: "min(1400px,94vw)" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto"
          >
            <p
              className="font-mono uppercase mb-6"
              style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, letterSpacing: "0.22em" }}
            >
              [ CONTACT ]
            </p>
            <h1
              style={{
                color: "rgba(255,255,255,0.95)",
                fontWeight: 800,
                lineHeight: 0.95,
                fontSize: "clamp(44px,5.2vw,84px)",
                letterSpacing: "-0.02em",
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
                conversation
              </span>
            </h1>
            <p
              className="mt-6"
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: "clamp(15px,1.25vw,18px)",
                lineHeight: 1.6,
                maxWidth: "52ch",
                margin: "24px auto 0",
              }}
            >
              Whether you're exploring enterprise integration, requesting a platform demo,
              or joining the team — we're ready to listen.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── SIGNAL MATRIX ─── */}
      <section
        style={{
          background: `
            radial-gradient(ellipse 800px 400px at 20% 50%, rgba(123,97,255,0.08), transparent 60%),
            radial-gradient(ellipse 600px 400px at 80% 30%, rgba(212,97,107,0.06), transparent 60%),
            linear-gradient(180deg, #F9F8FC 0%, #F4EFFA 100%)
          `,
          padding: "clamp(80px,8vw,130px) 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Floating grid lines */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full" style={{ opacity: 0.4 }}>
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="50%" stopColor="#7B61FF" stopOpacity="0.3" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <line x1="0" y1="33%" x2="100%" y2="33%" stroke="url(#lineGrad)" strokeWidth="1" />
            <line x1="0" y1="66%" x2="100%" y2="66%" stroke="url(#lineGrad)" strokeWidth="1" />
          </svg>
        </div>

        <div className="relative z-10 mx-auto px-6 md:px-12" style={{ width: "min(1400px,94vw)" }}>
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p
              className="font-mono uppercase mb-4"
              style={{ color: "rgba(26,6,48,0.4)", fontSize: 11, letterSpacing: "0.22em" }}
            >
              [ SIGNAL CHANNELS ]
            </p>
            <h2
              style={{
                color: "#1A0630",
                fontWeight: 800,
                fontSize: "clamp(32px,4vw,52px)",
                letterSpacing: "-0.02em",
              }}
            >
              Multiple entry points
            </h2>
          </motion.div>

          {/* Bento Grid */}
          <div
            className="grid gap-5"
            style={{
              gridTemplateColumns: "repeat(12, 1fr)",
              gridTemplateRows: "auto auto",
            }}
          >
            {/* Email - Large card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="col-span-12 md:col-span-7 relative group overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #1A0630 0%, #2A0B4E 100%)",
                borderRadius: 24,
                padding: "clamp(36px,4vw,56px)",
                minHeight: 260,
              }}
            >
              {/* Animated pulse ring */}
              <div
                className="absolute top-8 right-8"
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(123,97,255,0.3) 0%, transparent 70%)",
                  animation: "pulse 3s ease-in-out infinite",
                }}
              />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: "#4ADE80",
                      boxShadow: "0 0 20px rgba(74,222,128,0.6)",
                      animation: "blink 2s ease-in-out infinite",
                    }}
                  />
                  <span className="font-mono uppercase" style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, letterSpacing: "0.2em" }}>
                    PRIMARY CHANNEL • ACTIVE
                  </span>
                </div>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginBottom: 8 }}>
                  Direct line
                </p>
                <a
                  href="mailto:contact@docg.ai"
                  className="group/link"
                  style={{
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "clamp(28px,3.5vw,42px)",
                    letterSpacing: "-0.02em",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  contact@docg.ai
                  <motion.span
                    className="inline-block"
                    whileHover={{ x: 6 }}
                    style={{ color: "#E8967C" }}
                  >
                    →
                  </motion.span>
                </a>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginTop: 16 }}>
                  Enterprise response within 4 hours • General inquiries within 24 hours
                </p>
              </div>
            </motion.div>

            {/* Phone - Vertical card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="col-span-12 md:col-span-5 relative overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(20px)",
                borderRadius: 24,
                border: "1px solid rgba(26,6,48,0.08)",
                padding: "clamp(32px,3vw,44px)",
                minHeight: 260,
              }}
            >
              {/* Signal wave decoration */}
              <svg
                className="absolute bottom-0 right-0 opacity-10"
                width="180"
                height="120"
                viewBox="0 0 180 120"
              >
                {[0, 1, 2, 3].map((i) => (
                  <circle
                    key={i}
                    cx="180"
                    cy="120"
                    r={40 + i * 30}
                    fill="none"
                    stroke="#7B61FF"
                    strokeWidth="1"
                  />
                ))}
              </svg>
              <div className="relative z-10">
                <Phone size={28} style={{ color: "#7B61FF", marginBottom: 20 }} />
                <p className="font-mono uppercase" style={{ color: "rgba(26,6,48,0.4)", fontSize: 11, letterSpacing: "0.18em", marginBottom: 8 }}>
                  VOICE CHANNEL
                </p>
                <p style={{ color: "#1A0630", fontWeight: 700, fontSize: 24, marginBottom: 8 }}>
                  +1 (800) 555-DOCG
                </p>
                <p style={{ color: "rgba(26,6,48,0.5)", fontSize: 14, lineHeight: 1.6 }}>
                  Mon – Fri, 9 AM – 6 PM EST
                  <br />
                  <span style={{ color: "#D4616B" }}>24/7 critical support available</span>
                </p>
              </div>
            </motion.div>

            {/* Location - Wide card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="col-span-12 md:col-span-5 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(123,97,255,0.08) 0%, rgba(212,97,107,0.04) 100%)",
                backdropFilter: "blur(20px)",
                borderRadius: 24,
                border: "1px solid rgba(123,97,255,0.1)",
                padding: "clamp(32px,3vw,44px)",
              }}
            >
              <div className="flex items-start gap-5">
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: "linear-gradient(135deg, #7B61FF, #9B87F5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <MapPin size={24} style={{ color: "#fff" }} />
                </div>
                <div>
                  <p className="font-mono uppercase" style={{ color: "rgba(26,6,48,0.4)", fontSize: 11, letterSpacing: "0.18em", marginBottom: 8 }}>
                    HEADQUARTERS
                  </p>
                  <p style={{ color: "#1A0630", fontWeight: 700, fontSize: 22, marginBottom: 6 }}>
                    Toronto, Ontario
                  </p>
                  <div className="flex items-center gap-2">
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#7B61FF",
                      }}
                    />
                    <span style={{ color: "rgba(26,6,48,0.6)", fontSize: 14 }}>
                      Canada-sovereign infrastructure
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* SLA Badge - Compact */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="col-span-12 md:col-span-7 relative overflow-hidden"
              style={{
                background: "#1A0630",
                borderRadius: 24,
                padding: "clamp(28px,3vw,40px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 24,
              }}
            >
              {/* Animated gradient bar */}
              <div
                className="absolute top-0 left-0 right-0"
                style={{
                  height: 3,
                  background: "linear-gradient(90deg, #D4616B, #E8967C, #F2C1AE, #E8967C, #D4616B)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 3s linear infinite",
                }}
              />
              <div className="flex items-center gap-4">
                <Clock size={24} style={{ color: "#E8967C" }} />
                <div>
                  <p style={{ color: "#fff", fontWeight: 700, fontSize: 20 }}>
                    24 / 7 Critical Support
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>
                    Enterprise SLA available
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                {[
                  { val: "99.99%", label: "Uptime" },
                  { val: "<15min", label: "Response" },
                  { val: "SOC 2", label: "Compliant" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p style={{ color: "#E8967C", fontWeight: 800, fontSize: 20 }}>{stat.val}</p>
                    <p className="font-mono uppercase" style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, letterSpacing: "0.1em" }}>
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <style>{`
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.6; }
            50% { transform: scale(1.15); opacity: 0.3; }
          }
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </section>

      {/* ─── FORM + MAP SECTION ─── */}
      <section
        style={{
          background: `
            radial-gradient(900px 600px at 30% 30%, rgba(91,29,179,0.22), transparent 60%),
            radial-gradient(800px 500px at 70% 70%, rgba(212,97,107,0.1), transparent 60%),
            linear-gradient(180deg, #140022 0%, #2A0B4E 100%)
          `,
          padding: "clamp(80px,8vw,130px) 0",
        }}
      >
        <div className="mx-auto px-6 md:px-12" style={{ width: "min(1400px,94vw)" }}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.7fr] gap-12 lg:gap-20 items-start">
            {/* Form */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 20,
                padding: "clamp(32px,4vw,56px)",
                backdropFilter: "blur(16px)",
              }}
            >
              <p
                className="font-mono uppercase mb-3"
                style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, letterSpacing: "0.2em" }}
              >
                [ SEND A MESSAGE ]
              </p>
              <h2
                style={{
                  color: "rgba(255,255,255,0.95)",
                  fontWeight: 800,
                  fontSize: "clamp(28px,3vw,42px)",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                  marginBottom: 36,
                }}
              >
                Let's build together
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <input
                  placeholder="Full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={fieldStyle}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(123,97,255,0.5)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                  required
                />
                <input
                  placeholder="Email address"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={fieldStyle}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(123,97,255,0.5)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  style={{ ...fieldStyle, appearance: "none" as const, cursor: "pointer" }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(123,97,255,0.5)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                >
                  <option value="" style={{ background: "#1A0630" }}>
                    Inquiry type
                  </option>
                  {inquiryTypes.map((t) => (
                    <option key={t} value={t} style={{ background: "#1A0630" }}>
                      {t}
                    </option>
                  ))}
                </select>
                <input
                  placeholder="Organization (optional)"
                  value={form.org}
                  onChange={(e) => setForm({ ...form, org: e.target.value })}
                  style={fieldStyle}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(123,97,255,0.5)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                />
              </div>

              <textarea
                placeholder="Your message"
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                style={{ ...fieldStyle, resize: "vertical" as const, minHeight: 120 }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(123,97,255,0.5)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
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
                }}
              >
                {sending ? "Sending…" : "Send message"}
                <Send size={16} />
              </motion.button>
            </motion.form>

            {/* Right info column */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex flex-col gap-10"
            >
              {/* Signal card */}
              <div
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 20,
                  padding: "36px 30px",
                }}
              >
                <p
                  className="font-mono uppercase mb-4"
                  style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, letterSpacing: "0.2em" }}
                >
                  [ RESPONSE PROTOCOL ]
                </p>
                <div className="flex flex-col gap-5">
                  {[
                    { label: "General inquiries", time: "< 24 hours" },
                    { label: "Enterprise & partnership", time: "< 4 hours" },
                    { label: "Technical support", time: "< 2 hours" },
                    { label: "Critical infrastructure", time: "Immediate" },
                  ].map((r, i) => (
                    <div
                      key={r.label}
                      className="flex items-center justify-between"
                      style={{
                        paddingBottom: i < 3 ? 16 : 0,
                        borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none",
                      }}
                    >
                      <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 15 }}>{r.label}</span>
                      <span
                        className="font-mono"
                        style={{ color: "#E8967C", fontSize: 13, letterSpacing: "0.05em" }}
                      >
                        {r.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA card */}
              <div
                style={{
                  background: "linear-gradient(135deg, rgba(123,97,255,0.12), rgba(212,97,107,0.08))",
                  border: "1px solid rgba(123,97,255,0.15)",
                  borderRadius: 20,
                  padding: "36px 30px",
                }}
              >
                <h3 style={{ color: "rgba(255,255,255,0.95)", fontWeight: 700, fontSize: 20, marginBottom: 12 }}>
                  Schedule a platform demo
                </h3>
                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, lineHeight: 1.6, marginBottom: 20 }}>
                  See how DocG's intelligence layer integrates with your existing clinical infrastructure.
                </p>
                <motion.a
                  href="#"
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-2"
                  style={{
                    color: "#E8967C",
                    fontWeight: 700,
                    fontSize: 14,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                  }}
                >
                  Request demo <ArrowRight size={16} />
                </motion.a>
              </div>

              {/* Compliance badge */}
              <div
                className="flex items-center gap-4"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 14,
                  padding: "20px 24px",
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#4ADE80",
                    boxShadow: "0 0 12px rgba(74,222,128,0.4)",
                  }}
                />
                <div>
                  <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: 600 }}>
                    SOC 2 Type II & PIPEDA compliant
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
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
