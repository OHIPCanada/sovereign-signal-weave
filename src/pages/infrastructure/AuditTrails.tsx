import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import FloatingOrbs from "@/components/hero-backgrounds/FloatingOrbs";
import auditOrb from "@/assets/audit-trails-hero-orb.png";
import { FileText, Clock, Link2, Eye, Database, Shield } from "lucide-react";

const auditFeatures = [
  {
    icon: Clock,
    title: "Real-time Logging",
    desc: "Every clinical signal, AI inference, and user action is logged in real-time with millisecond precision timestamps.",
  },
  {
    icon: Link2,
    title: "Immutable Records",
    desc: "Cryptographically signed audit entries that cannot be modified or deleted. Full chain of custody for regulatory review.",
  },
  {
    icon: Eye,
    title: "Access Transparency",
    desc: "Complete visibility into who accessed what data, when, and why. Patient-facing audit reports available on demand.",
  },
  {
    icon: Database,
    title: "Long-term Retention",
    desc: "Configurable retention policies meeting provincial requirements. Secure archival with instant retrieval capability.",
  },
];

const logTypes = [
  { type: "ACCESS_LOG", desc: "User authentication, session management, role changes", color: "#7B61FF" },
  { type: "DATA_LOG", desc: "Record views, edits, exports, and deletions", color: "#D4616B" },
  { type: "AI_INFERENCE", desc: "Model inputs, outputs, confidence scores, overrides", color: "#E8967C" },
  { type: "SYSTEM_EVENT", desc: "API calls, integrations, scheduled tasks", color: "#4ade80" },
  { type: "CONSENT_LOG", desc: "Patient consent grants, revocations, expiries", color: "#00CED1" },
];

const stats = [
  { value: "100%", label: "Event capture rate" },
  { value: "<10ms", label: "Log latency" },
  { value: "7+ years", label: "Retention support" },
  { value: "Immutable", label: "Cryptographic signing" },
];

const AuditTrails = () => (
  <div className="relative overflow-x-hidden">
    <Navigation darkMode />

    {/* HERO */}
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
      <FloatingOrbs />
      <div className="relative z-10 mx-auto px-6 md:px-12" style={{ width: "min(1400px, 94vw)" }}>
        <div className="grid grid-cols-1 md:grid-cols-[0.55fr_1.45fr] items-center split-layout-gap">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-5"
          >
            <p className="font-mono uppercase" style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, letterSpacing: "0.22em" }}>
              [ INFRASTRUCTURE / AUDIT TRAILS ]
            </p>
            <h1 style={{
              color: "rgba(255,255,255,0.95)",
              fontWeight: 800,
              lineHeight: 0.95,
              fontSize: "clamp(44px, 5.2vw, 84px)",
              letterSpacing: "-0.02em",
              textShadow: "0 10px 40px rgba(0,0,0,0.22)",
            }}>
              Every signal
              <br />logged.
              <br />Forever.
            </h1>
            <p style={{ color: "rgba(255,255,255,0.72)", fontWeight: 400, fontSize: "clamp(15px, 1.25vw, 18px)", lineHeight: 1.55, maxWidth: "46ch" }}>
              Immutable, cryptographically signed audit trails for every clinical interaction. Full traceability for regulators, clinicians, and patients.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center justify-center"
          >
            <img
              src={auditOrb}
              alt="Audit Trails"
              className="w-full max-w-[500px] object-contain"
              style={{ filter: "drop-shadow(0 20px 60px rgba(123,97,255,0.3))" }}
            />
          </motion.div>
        </div>
      </div>
    </section>

    {/* FEATURES */}
    <section
      className="relative overflow-hidden"
      style={{
        padding: "clamp(64px, 7vw, 110px) 0",
        background: `
          radial-gradient(1200px 600px at 20% 50%, rgba(212,97,107,0.15), transparent 60%),
          radial-gradient(1000px 700px at 85% 30%, rgba(123,97,255,0.15), transparent 65%),
          linear-gradient(180deg, #F9F8FC 0%, #F1EEF8 100%)
        `,
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{
        background: "linear-gradient(90deg, transparent 5%, rgba(123, 97, 255, 0.5) 30%, rgba(0, 255, 255, 0.3) 60%, rgba(212, 97, 107, 0.4) 85%, transparent 95%)",
      }} />

      <div className="relative z-10 mx-auto px-6 md:px-12" style={{ width: "min(1400px, 94vw)" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <p className="font-mono uppercase" style={{ color: "rgba(17,17,17,0.45)", fontSize: 12, letterSpacing: "0.22em" }}>
            [ AUDIT CAPABILITIES ]
          </p>
          <h2 style={{
            color: "#111111",
            fontWeight: 800,
            fontSize: "clamp(36px, 4vw, 64px)",
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            marginTop: 16,
          }}>
            Complete accountability.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {auditFeatures.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ y: -4 }}
              className="rounded-[20px]"
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.8), rgba(255,255,255,0.5))",
                border: "1px solid rgba(90,70,160,0.12)",
                boxShadow: "0 20px 60px rgba(60,40,120,0.1), inset 0 1px 0 rgba(255,255,255,0.8)",
                padding: "28px 24px",
              }}
            >
              <div className="mb-4 w-12 h-12 rounded-xl flex items-center justify-center" style={{
                background: "linear-gradient(135deg, rgba(123,97,255,0.15), rgba(212,97,107,0.1))",
              }}>
                <f.icon className="w-6 h-6" style={{ color: "#5B1FA6" }} />
              </div>
              <div style={{ fontWeight: 700, fontSize: 17, color: "#111", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                {f.title}
              </div>
              <div style={{ fontWeight: 400, fontSize: 13, color: "rgba(30,30,30,0.65)", marginTop: 10, lineHeight: 1.55 }}>
                {f.desc}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* LOG TYPES */}
    <section
      className="relative overflow-hidden"
      style={{
        padding: "clamp(64px, 7vw, 110px) 0",
        background: `
          radial-gradient(900px 500px at 50% 30%, rgba(91,29,179,.25), transparent 60%),
          radial-gradient(700px 500px at 80% 70%, rgba(232,150,124,.12), transparent 65%),
          linear-gradient(180deg, #140022 0%, #2A0B4E 100%)
        `,
      }}
    >
      <div className="relative z-10 mx-auto px-6 md:px-12" style={{ width: "min(1400px, 94vw)" }}>
        <div className="grid grid-cols-1 md:grid-cols-[0.4fr_1.6fr] items-start split-layout-gap">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="font-mono uppercase" style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, letterSpacing: "0.22em" }}>
              [ LOG TAXONOMY ]
            </p>
            <h2 style={{
              color: "rgba(255,255,255,0.95)",
              fontWeight: 800,
              fontSize: "clamp(32px, 3.5vw, 56px)",
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
              marginTop: 16,
            }}>
              Structured
              <br />signal capture.
            </h2>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.6, marginTop: 16, maxWidth: "32ch" }}>
              Every event is categorized, timestamped, and linked to its originating context for instant search and compliance reporting.
            </p>
          </motion.div>

          <div className="flex flex-col gap-3">
            {logTypes.map((log, i) => (
              <motion.div
                key={log.type}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="rounded-[14px] px-5 py-4 flex items-center gap-4"
                style={{
                  background: "linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: log.color, boxShadow: `0 0 12px ${log.color}40` }} />
                <code style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)", minWidth: 140 }}>
                  {log.type}
                </code>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>{log.desc}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* STATS */}
    <section
      className="relative overflow-hidden"
      style={{
        padding: "clamp(64px, 7vw, 110px) 0",
        background: `
          radial-gradient(1000px 600px at 30% 50%, rgba(212,97,107,0.15), transparent 60%),
          radial-gradient(800px 600px at 70% 40%, rgba(123,97,255,0.12), transparent 65%),
          linear-gradient(180deg, #F7F3FF 0%, #FFFFFF 100%)
        `,
      }}
    >
      <div className="relative z-10 mx-auto px-6 md:px-12" style={{ width: "min(1200px, 92vw)" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <p className="font-mono uppercase" style={{ color: "rgba(17,17,17,0.45)", fontSize: 12, letterSpacing: "0.22em" }}>
            [ AUDIT PERFORMANCE ]
          </p>
          <h2 style={{
            color: "#111",
            fontWeight: 800,
            fontSize: "clamp(36px, 4vw, 64px)",
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            marginTop: 16,
          }}>
            Built for scale.
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="rounded-[20px] text-center"
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.8), rgba(255,255,255,0.5))",
                border: "1px solid rgba(90,70,160,0.1)",
                boxShadow: "0 16px 48px rgba(60,40,120,0.08)",
                padding: "32px 20px",
              }}
            >
              <div style={{ fontSize: "clamp(20px, 2vw, 28px)", fontWeight: 800, color: "#111", letterSpacing: "-0.02em" }}>
                {s.value}
              </div>
              <div style={{ fontSize: 12, color: "rgba(30,30,30,0.55)", marginTop: 6 }}>
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default AuditTrails;
