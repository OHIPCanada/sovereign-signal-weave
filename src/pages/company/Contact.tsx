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
            radial-gradient(ellipse 900px 500px at 15% 20%, rgba(232,150,124,0.08), transparent 60%),
            radial-gradient(ellipse 700px 400px at 85% 80%, rgba(242,193,174,0.12), transparent 60%),
            linear-gradient(180deg, #F9F8FC 0%, #FDFBFF 100%)
          `,
          padding: "clamp(80px,8vw,130px) 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Floating organic shapes */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div
            className="absolute"
            style={{
              top: "10%",
              right: "5%",
              width: 300,
              height: 300,
              borderRadius: "40% 60% 60% 40% / 50% 50% 50% 50%",
              background: "radial-gradient(circle, rgba(232,150,124,0.3), transparent 70%)",
              filter: "blur(60px)",
            }}
          />
          <div
            className="absolute"
            style={{
              bottom: "15%",
              left: "8%",
              width: 250,
              height: 250,
              borderRadius: "60% 40% 40% 60% / 60% 60% 40% 40%",
              background: "radial-gradient(circle, rgba(212,97,107,0.2), transparent 70%)",
              filter: "blur(50px)",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto px-6 md:px-12" style={{ width: "min(1400px,94vw)" }}>
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <p
              className="font-mono uppercase mb-3"
              style={{ color: "rgba(26,6,48,0.35)", fontSize: 11, letterSpacing: "0.22em" }}
            >
              [ REACH OUT ]
            </p>
            <h2
              style={{
                color: "#1A0630",
                fontWeight: 800,
                fontSize: "clamp(32px,4vw,56px)",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              Every signal matters
            </h2>
          </motion.div>

          {/* Bento Grid */}
          <div
            className="grid gap-6"
            style={{
              gridTemplateColumns: "repeat(12, 1fr)",
            }}
          >
            {/* Email - Hero card with gradient */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="col-span-12 lg:col-span-8 relative overflow-hidden group"
              style={{
                background: `
                  radial-gradient(circle at 10% 20%, rgba(232,150,124,0.15), transparent 50%),
                  radial-gradient(circle at 90% 80%, rgba(212,97,107,0.12), transparent 50%),
                  linear-gradient(135deg, #FFFFFF 0%, #FFF7F4 100%)
                `,
                borderRadius: 28,
                border: "2px solid rgba(212,97,107,0.15)",
                padding: "clamp(40px,4.5vw,64px)",
                minHeight: 280,
                position: "relative",
              }}
            >
              {/* Subtle line decoration */}
              <div
                className="absolute top-0 left-0 right-0"
                style={{
                  height: 2,
                  background: "linear-gradient(90deg, transparent, rgba(232,150,124,0.4), transparent)",
                }}
              />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "#E8967C",
                      boxShadow: "0 0 20px rgba(232,150,124,0.6), 0 0 40px rgba(232,150,124,0.3)",
                    }}
                  />
                  <span className="font-mono uppercase" style={{ color: "rgba(26,6,48,0.4)", fontSize: 10, letterSpacing: "0.2em" }}>
                    PRIMARY
                  </span>
                </div>
                <p style={{ color: "rgba(26,6,48,0.45)", fontSize: 13, marginBottom: 10, letterSpacing: "0.05em" }}>
                  Direct line
                </p>
                <a
                  href="mailto:contact@docg.ai"
                  className="group/link inline-block"
                  style={{
                    textDecoration: "none",
                  }}
                >
                  <h3
                    style={{
                      background: "linear-gradient(135deg, #1A0630 0%, #D4616B 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontWeight: 800,
                      fontSize: "clamp(32px,4vw,56px)",
                      letterSpacing: "-0.03em",
                      lineHeight: 1,
                      marginBottom: 16,
                    }}
                  >
                    contact@docg.ai
                  </h3>
                </a>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ADE80" }} />
                    <span style={{ color: "rgba(26,6,48,0.5)", fontSize: 14 }}>
                      Enterprise: &lt;4 hours
                    </span>
                  </div>
                  <div style={{ width: 1, height: 16, background: "rgba(26,6,48,0.1)" }} />
                  <div className="flex items-center gap-2">
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#60A5FA" }} />
                    <span style={{ color: "rgba(26,6,48,0.5)", fontSize: 14 }}>
                      General: &lt;24 hours
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating accent circle */}
              <div
                className="absolute pointer-events-none"
                style={{
                  bottom: -40,
                  right: -40,
                  width: 200,
                  height: 200,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(242,193,174,0.4), transparent 70%)",
                  filter: "blur(40px)",
                }}
              />
            </motion.div>

            {/* Phone - Clean minimal card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="col-span-12 sm:col-span-6 lg:col-span-4 relative"
              style={{
                background: "#FFFFFF",
                borderRadius: 28,
                border: "1px solid rgba(26,6,48,0.06)",
                padding: "clamp(32px,3vw,48px)",
                boxShadow: "0 4px 20px rgba(26,6,48,0.03)",
              }}
            >
              <div
                className="inline-flex items-center justify-center mb-6"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: "rgba(26,6,48,0.04)",
                }}
              >
                <Phone size={22} style={{ color: "#1A0630" }} />
              </div>
              <p className="font-mono uppercase" style={{ color: "rgba(26,6,48,0.35)", fontSize: 10, letterSpacing: "0.18em", marginBottom: 10 }}>
                CALL
              </p>
              <p style={{ color: "#1A0630", fontWeight: 700, fontSize: 20, marginBottom: 12, letterSpacing: "-0.01em" }}>
                +1 (800) 555-DOCG
              </p>
              <p style={{ color: "rgba(26,6,48,0.45)", fontSize: 13, lineHeight: 1.6 }}>
                Mon – Fri<br />9 AM – 6 PM EST
              </p>
              <div
                className="mt-6 pt-5"
                style={{ borderTop: "1px solid rgba(26,6,48,0.06)" }}
              >
                <span style={{ color: "#D4616B", fontSize: 12, fontWeight: 600, letterSpacing: "0.03em" }}>
                  24/7 critical support
                </span>
              </div>
            </motion.div>

            {/* Location - Image-style card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="col-span-12 sm:col-span-6 lg:col-span-5 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #1A0630 0%, #3A0B6E 100%)",
                borderRadius: 28,
                padding: "clamp(32px,3vw,48px)",
              }}
            >
              {/* Topographic lines */}
              <svg
                className="absolute inset-0 w-full h-full opacity-10"
                viewBox="0 0 400 300"
                preserveAspectRatio="xMidYMid slice"
              >
                {[30, 50, 70, 90, 110].map((y, i) => (
                  <path
                    key={i}
                    d={`M 0 ${y} Q 100 ${y + 10} 200 ${y} T 400 ${y}`}
                    fill="none"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="1"
                  />
                ))}
              </svg>

              <div className="relative z-10">
                <MapPin size={28} style={{ color: "#E8967C", marginBottom: 16 }} />
                <p className="font-mono uppercase" style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, letterSpacing: "0.18em", marginBottom: 10 }}>
                  HQ
                </p>
                <p style={{ color: "#FFFFFF", fontWeight: 700, fontSize: 26, marginBottom: 8, letterSpacing: "-0.02em" }}>
                  Toronto, ON
                </p>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.6 }}>
                  Canada-sovereign
                  <br />
                  infrastructure
                </p>
              </div>
            </motion.div>

            {/* Support - Stats card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="col-span-12 lg:col-span-7 relative overflow-hidden"
              style={{
                background: "rgba(26,6,48,0.02)",
                borderRadius: 28,
                border: "1px solid rgba(26,6,48,0.05)",
                padding: "clamp(32px,3vw,48px)",
              }}
            >
              <div className="flex items-start justify-between gap-8 flex-wrap">
                <div>
                  <Clock size={24} style={{ color: "#D4616B", marginBottom: 12 }} />
                  <p style={{ color: "#1A0630", fontWeight: 700, fontSize: 22, marginBottom: 6 }}>
                    24/7 Critical Support
                  </p>
                  <p style={{ color: "rgba(26,6,48,0.4)", fontSize: 14 }}>
                    Enterprise SLA available
                  </p>
                </div>

                <div className="flex gap-8">
                  {[
                    { val: "99.99%", label: "Uptime" },
                    { val: "&lt;15m", label: "Response" },
                    { val: "SOC 2", label: "Certified" },
                  ].map((stat, i) => (
                    <div key={stat.label}>
                      <p style={{ color: "#1A0630", fontWeight: 800, fontSize: 28, lineHeight: 1, marginBottom: 6 }}>
                        {stat.val}
                      </p>
                      <p className="font-mono uppercase" style={{ color: "rgba(26,6,48,0.35)", fontSize: 9, letterSpacing: "0.15em" }}>
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom line accent */}
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: 3,
                  background: "linear-gradient(90deg, transparent, #E8967C, transparent)",
                  opacity: 0.6,
                }}
              />
            </motion.div>
          </div>
        </div>
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
