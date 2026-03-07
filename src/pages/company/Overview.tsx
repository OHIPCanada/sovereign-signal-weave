import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import aiCortexOrb from "@/assets/ai-cortex-orb-new.png";
import clinicOsOrb from "@/assets/clinic-os-orb-new.png";
import sovereignOrb from "@/assets/sovereign-data-orb.png";
import auditOrb from "@/assets/audit-integrity-orb.png";

const pillars = [
  {
    label: "AI Cortex",
    desc: "Context-aware reasoning that operates across the full clinical signal chain — not a chatbot bolted onto a dashboard.",
    orb: aiCortexOrb,
  },
  {
    label: "Clinic OS",
    desc: "A unified operating layer for scheduling, charting, billing, and care coordination — wired into the intelligence layer from day one.",
    orb: clinicOsOrb,
  },
  {
    label: "Sovereign Data",
    desc: "Jurisdictional data governance built at the infrastructure level. Canadian data stays in Canada — by architecture, not by policy.",
    orb: sovereignOrb,
  },
  {
    label: "Audit Integrity",
    desc: "Every signal, decision, and override is logged immutably. Full traceability for regulators, clinicians, and patients.",
    orb: auditOrb,
  },
];

const timeline = [
  { year: "2023", event: "Founded in Canada with a mandate to rebuild clinical infrastructure from first principles." },
  { year: "2024", event: "AI Cortex v1 operational — context-aware reasoning across EMR, scheduling, and care pathways." },
  { year: "2025", event: "Sovereign data layer deployed. Multi-jurisdictional governance live across pilot clinics." },
  { year: "2026", event: "Full Clinic OS rollout — intelligence-first operations across primary and specialty care." },
];

const stats = [
  { value: "100%", label: "Canada-hosted infrastructure" },
  { value: "Zero", label: "Third-party data exposure" },
  { value: "Real-time", label: "Audit trail generation" },
  { value: "3", label: "Core intelligence planes" },
];

const Overview = () => (
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
      <div className="relative z-10 mx-auto px-6 md:px-12" style={{ width: "min(1400px, 94vw)" }}>
        <div className="grid grid-cols-1 md:grid-cols-[0.55fr_1.45fr] items-center split-layout-gap">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-5"
          >
            <p className="font-mono uppercase" style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, letterSpacing: "0.22em" }}>
              [ COMPANY OVERVIEW ]
            </p>
            <h1 style={{
              color: "rgba(255,255,255,0.95)",
              fontWeight: 800,
              lineHeight: 0.95,
              fontSize: "clamp(44px, 5.2vw, 84px)",
              letterSpacing: "-0.02em",
              textShadow: "0 10px 40px rgba(0,0,0,0.22)",
            }}>
              Intelligence-first
              <br />clinical
              <br />infrastructure.
            </h1>
            <p style={{ color: "rgba(255,255,255,0.72)", fontWeight: 400, fontSize: "clamp(15px, 1.25vw, 18px)", lineHeight: 1.55, maxWidth: "46ch" }}>
              DocG AI is a Canadian healthcare infrastructure company. We build the intelligence layer that sits beneath clinical operations — sovereign, auditable, and designed to enhance the systems already in place.
            </p>
          </motion.div>

          {/* Stats grid */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
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
                <div style={{ fontSize: "clamp(28px, 3vw, 42px)", fontWeight: 800, color: "rgba(255,255,255,0.95)", letterSpacing: "-0.02em", lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 8, fontWeight: 500, letterSpacing: "0.02em" }}>
                  {s.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>

    {/* ─── MISSION ─── */}
    <section
      className="relative overflow-hidden"
      style={{
        padding: "clamp(64px, 7vw, 110px) 0",
        background: `
          radial-gradient(1200px 600px at 20% 50%, rgba(212,97,107,0.25), transparent 60%),
          radial-gradient(1000px 700px at 85% 30%, rgba(123,97,255,0.25), transparent 65%),
          linear-gradient(180deg, #F9F8FC 0%, #F1EEF8 100%)
        `,
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{
        background: "linear-gradient(90deg, transparent 5%, rgba(123, 97, 255, 0.5) 30%, rgba(0, 255, 255, 0.3) 60%, rgba(212, 97, 107, 0.4) 85%, transparent 95%)",
      }} />

      <div className="relative z-10 mx-auto px-6 md:px-12" style={{ width: "min(1400px, 94vw)" }}>
        <div className="grid grid-cols-1 md:grid-cols-[0.55fr_1.45fr] items-start split-layout-gap">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-5"
          >
            <p className="font-mono uppercase" style={{ color: "rgba(17,17,17,0.45)", fontSize: 12, letterSpacing: "0.22em" }}>
              [ OUR MISSION ]
            </p>
            <h2 style={{
              color: "#111111",
              fontWeight: 800,
              fontSize: "clamp(36px, 4vw, 64px)",
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
            }}>
              Healthcare
              <br />deserves real
              <br />infrastructure.
            </h2>
            <p style={{
              color: "rgba(30,30,30,0.72)",
              fontSize: "clamp(15px, 1.25vw, 18px)",
              fontWeight: 400,
              lineHeight: 1.55,
              maxWidth: "46ch",
            }}>
              We don't build features on top of broken systems. We replace the foundation — with intelligence, sovereignty, and auditability wired in from the start.
            </p>
          </motion.div>

          {/* Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pillars.map((p, i) => (
              <motion.article
                key={p.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ y: -4 }}
                style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.45) 100%)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  borderRadius: 20,
                  border: "1px solid rgba(90,70,160,0.12)",
                  boxShadow: "0 20px 60px rgba(60,40,120,0.1), inset 0 1px 0 rgba(255,255,255,0.7)",
                  padding: 20,
                  transition: "transform 0.2s ease-out",
                }}
              >
                <div className="rounded-xl overflow-hidden mb-3 flex items-center justify-center" style={{
                  height: 120,
                  background: "radial-gradient(ellipse at center, rgba(123,97,255,0.06), transparent 70%)",
                }}>
                  <img src={p.orb} alt={p.label} className="w-20 h-20 object-contain" style={{ filter: "drop-shadow(0 4px 20px rgba(123,97,255,0.2))" }} />
                </div>
                <div style={{ fontWeight: 600, fontSize: 16, color: "#111", letterSpacing: "-0.01em" }}>
                  {p.label}
                </div>
                <div style={{ fontWeight: 400, fontSize: 13, color: "rgba(30,30,30,0.6)", marginTop: 6, lineHeight: 1.5 }}>
                  {p.desc}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* ─── TIMELINE ─── */}
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
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{
        background: "linear-gradient(90deg, transparent 5%, rgba(212,97,107,0.4) 30%, rgba(123,97,255,0.5) 70%, transparent 95%)",
      }} />

      <div className="relative z-10 mx-auto px-6 md:px-12" style={{ width: "min(1400px, 94vw)" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <p className="font-mono uppercase" style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, letterSpacing: "0.22em" }}>
            [ TRAJECTORY ]
          </p>
          <h2 style={{
            color: "rgba(255,255,255,0.95)",
            fontWeight: 800,
            fontSize: "clamp(36px, 4vw, 64px)",
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            marginTop: 16,
          }}>
            Building layer by layer.
          </h2>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[22px] md:left-[28px] top-0 bottom-0 w-px" style={{
            background: "linear-gradient(180deg, rgba(212,97,107,0.4), rgba(123,97,255,0.3), transparent)",
          }} />

          <div className="flex flex-col gap-6">
            {timeline.map((t, i) => (
              <motion.div
                key={t.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                className="flex gap-6 items-start pl-2"
              >
                {/* Node */}
                <div className="relative flex-shrink-0 mt-1">
                  <div style={{
                    width: 14, height: 14, borderRadius: "50%",
                    background: i === timeline.length - 1
                      ? "linear-gradient(135deg, #D4616B, #E8967C)"
                      : "rgba(200,185,255,0.6)",
                    boxShadow: i === timeline.length - 1
                      ? "0 0 16px 6px rgba(212,97,107,0.3)"
                      : "0 0 8px 3px rgba(160,130,255,0.15)",
                  }} />
                </div>

                {/* Content */}
                <div className="rounded-[16px] flex-1" style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.025))",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(16px)",
                  padding: "20px 24px",
                }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "rgba(232,150,124,0.9)", letterSpacing: "0.06em", fontFamily: "monospace" }}>
                    {t.year}
                  </div>
                  <div style={{ fontWeight: 400, fontSize: 15, color: "rgba(255,255,255,0.72)", marginTop: 6, lineHeight: 1.55, maxWidth: "56ch" }}>
                    {t.event}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* ─── PRINCIPLES ─── */}
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
            [ PRINCIPLES ]
          </p>
          <h2 style={{
            color: "#111",
            fontWeight: 800,
            fontSize: "clamp(36px, 4vw, 64px)",
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            marginTop: 16,
          }}>
            What we believe.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Sovereignty by architecture", body: "Data governance is not a toggle. It's built into how we store, route, and process every clinical signal." },
            { title: "Intelligence, not automation", body: "We don't replace clinicians. We give them contextual reasoning that operates at system speed." },
            { title: "Infrastructure over features", body: "Features age. Infrastructure compounds. We build the layer that everything else runs on." },
          ].map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="rounded-[20px]"
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.8), rgba(255,255,255,0.5))",
                border: "1px solid rgba(90,70,160,0.1)",
                boxShadow: "0 16px 48px rgba(60,40,120,0.08), inset 0 1px 0 rgba(255,255,255,0.8)",
                padding: "32px 28px",
              }}
            >
              <div className="mb-4" style={{
                width: 40, height: 4, borderRadius: 2,
                background: "linear-gradient(90deg, #D4616B, #E8967C)",
              }} />
              <div style={{ fontWeight: 700, fontSize: 18, color: "#111", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                {p.title}
              </div>
              <div style={{ fontWeight: 400, fontSize: 15, color: "rgba(30,30,30,0.65)", marginTop: 10, lineHeight: 1.55 }}>
                {p.body}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default Overview;
