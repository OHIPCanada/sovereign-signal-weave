import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion, useInView } from "framer-motion";
import FloatingOrbs from "@/components/hero-backgrounds/FloatingOrbs";
import interopOrb from "@/assets/interoperability-hero-orb.png";
import { Plug, FileJson, RefreshCw, Layers, CheckCircle2, ArrowRight } from "lucide-react";
import { useRef } from "react";

const standards = [
  { icon: FileJson, title: "HL7 FHIR R4", desc: "Native FHIR R4 support for modern healthcare data exchange. RESTful APIs, resource bundles, and subscription-based updates.", features: ["Patient resources", "Observation mapping", "Medication records", "Clinical documents"] },
  { icon: Layers, title: "HL7 v2.x", desc: "Legacy HL7 v2 message parsing and transformation. Seamless bridging between older systems and modern FHIR endpoints.", features: ["ADT messages", "ORU/ORM support", "Custom segment mapping", "Batch processing"] },
  { icon: RefreshCw, title: "CDA/C-CDA", desc: "Clinical Document Architecture support for continuity of care documents. Import, export, and transformation capabilities.", features: ["CCD documents", "Discharge summaries", "Referral notes", "Lab reports"] },
  { icon: Plug, title: "Custom APIs", desc: "Vendor-specific API adapters for major Canadian EMR systems. Oscar, Accuro, Telus Health, and more.", features: ["Oscar EMR", "Accuro", "Med Access", "PS Suite"] },
];

const integrationFlow = [
  { step: "01", title: "Connect", desc: "Secure handshake with source system credentials" },
  { step: "02", title: "Map", desc: "Auto-detect schema and configure field mappings" },
  { step: "03", title: "Transform", desc: "Normalize data to canonical format" },
  { step: "04", title: "Validate", desc: "Schema validation and business rule checks" },
  { step: "05", title: "Route", desc: "Deliver to target systems with confirmation" },
];

const stats = [
  { value: "50+", label: "EMR integrations" },
  { value: "FHIR R4", label: "Native support" },
  { value: "<100ms", label: "Transform latency" },
  { value: "99.99%", label: "Message delivery" },
];

/* ── Interoperability: FloatingOrbs bg + rotateY card flips + sequential pipeline lighting ── */

const Interoperability = () => {
  const pipelineRef = useRef<HTMLDivElement>(null);
  const pipelineInView = useInView(pipelineRef, { once: true, margin: "-80px" });

  return (
    <div className="relative overflow-x-hidden">
      <Navigation darkMode />

      {/* HERO — FloatingOrbs + elastic text bounce + spinning orb */}
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
            <div className="flex flex-col gap-5">
              <motion.p
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                className="font-mono uppercase"
                style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, letterSpacing: "0.22em" }}
              >
                [ INFRASTRUCTURE / INTEROPERABILITY ]
              </motion.p>
              {/* Elastic bounce heading */}
              <motion.h1
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 12, delay: 0.2 }}
                style={{
                  color: "rgba(255,255,255,0.95)", fontWeight: 800, lineHeight: 0.95,
                  fontSize: "clamp(44px, 5.2vw, 84px)", letterSpacing: "-0.02em",
                  textShadow: "0 10px 40px rgba(0,0,0,0.22)",
                }}
              >
                Connect<br />everything.<br />Seamlessly.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                style={{ color: "rgba(255,255,255,0.72)", fontWeight: 400, fontSize: "clamp(15px, 1.25vw, 18px)", lineHeight: 1.55, maxWidth: "46ch" }}
              >
                Native HL7 FHIR, v2.x, and CDA support. Pre-built connectors for major Canadian EMRs.
              </motion.p>
            </div>

            {/* Orb — continuous slow Y rotation */}
            <motion.div
              initial={{ opacity: 0, rotateY: -30 }}
              animate={{ opacity: 1, rotateY: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-center"
              style={{ perspective: 900 }}
            >
              <motion.img
                src={interopOrb}
                alt="Interoperability"
                className="w-full max-w-[500px] object-contain"
                style={{ filter: "drop-shadow(0 20px 60px rgba(123,97,255,0.3))" }}
                animate={{ rotateY: [0, 8, 0, -8, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* STANDARDS — rotateY flip-in cards */}
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
              [ SUPPORTED STANDARDS ]
            </p>
            <h2 style={{ color: "#111111", fontWeight: 800, fontSize: "clamp(36px, 4vw, 64px)", lineHeight: 0.95, letterSpacing: "-0.02em", marginTop: 16 }}>
              Speak every language.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ perspective: 1200 }}>
            {standards.map((std, i) => (
              <motion.div
                key={std.title}
                initial={{ opacity: 0, rotateY: i % 2 === 0 ? -25 : 25 }}
                whileInView={{ opacity: 1, rotateY: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.15, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="rounded-[20px]"
                style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.8), rgba(255,255,255,0.5))",
                  border: "1px solid rgba(90,70,160,0.12)",
                  boxShadow: "0 20px 60px rgba(60,40,120,0.1), inset 0 1px 0 rgba(255,255,255,0.8)",
                  padding: "28px 24px", transformStyle: "preserve-3d",
                }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <motion.div
                    className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, rgba(123,97,255,0.15), rgba(212,97,107,0.1))" }}
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20 + i * 3, repeat: Infinity, ease: "linear" }}
                  >
                    <std.icon className="w-6 h-6" style={{ color: "#5B1FA6" }} />
                  </motion.div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 18, color: "#111", letterSpacing: "-0.01em" }}>{std.title}</div>
                    <div style={{ fontWeight: 400, fontSize: 13, color: "rgba(30,30,30,0.65)", marginTop: 4, lineHeight: 1.5 }}>{std.desc}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {std.features.map((f, fi) => (
                    <motion.div
                      key={f}
                      className="flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + i * 0.15 + fi * 0.08 }}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "#D4616B" }} />
                      <span style={{ fontSize: 12, color: "rgba(30,30,30,0.7)" }}>{f}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* INTEGRATION FLOW — sequential pipeline lighting */}
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
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <p className="font-mono uppercase" style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, letterSpacing: "0.22em" }}>
              [ INTEGRATION PIPELINE ]
            </p>
            <h2 style={{ color: "rgba(255,255,255,0.95)", fontWeight: 800, fontSize: "clamp(32px, 3.5vw, 56px)", lineHeight: 0.95, letterSpacing: "-0.02em", marginTop: 16 }}>
              Five steps to unified data.
            </h2>
          </motion.div>

          <div ref={pipelineRef} className="flex flex-col md:flex-row items-stretch gap-4 justify-center">
            {integrationFlow.map((flow, i) => (
              <motion.div
                key={flow.step}
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                animate={pipelineInView ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{
                  delay: i * 0.25,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex-1 rounded-[16px] p-5 relative overflow-hidden"
                style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.025))",
                  border: "1px solid rgba(255,255,255,0.1)",
                  minWidth: 160,
                }}
              >
                {/* Sequential glow sweep */}
                <motion.div
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={pipelineInView ? { opacity: [0, 0.4, 0] } : {}}
                  transition={{ delay: i * 0.25 + 0.3, duration: 0.8 }}
                  style={{ background: "radial-gradient(circle at 50% 50%, rgba(232,150,124,0.25), transparent 70%)" }}
                />
                <div className="relative z-10">
                  <motion.div
                    style={{ fontFamily: "monospace", fontSize: 11, color: "rgba(232,150,124,0.8)", fontWeight: 700, marginBottom: 8 }}
                    animate={pipelineInView ? { color: ["rgba(232,150,124,0.4)", "rgba(232,150,124,1)", "rgba(232,150,124,0.8)"] } : {}}
                    transition={{ delay: i * 0.25, duration: 0.8 }}
                  >
                    {flow.step}
                  </motion.div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: "rgba(255,255,255,0.95)", marginBottom: 4 }}>{flow.title}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{flow.desc}</div>
                </div>
                {i < integrationFlow.length - 1 && (
                  <motion.div
                    className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-20"
                    animate={pipelineInView ? { opacity: [0, 1], x: [8, 0] } : {}}
                    transition={{ delay: i * 0.25 + 0.4, duration: 0.4 }}
                  >
                    <ArrowRight className="w-5 h-5 text-white/40" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS — wave stagger from center outward */}
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
              [ INTEGRATION METRICS ]
            </p>
            <h2 style={{ color: "#111", fontWeight: 800, fontSize: "clamp(36px, 4vw, 64px)", lineHeight: 0.95, letterSpacing: "-0.02em", marginTop: 16 }}>
              Enterprise-ready.
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => {
              // Wave from center: indices 1,2 appear first, then 0,3
              const waveDelay = [0.15, 0, 0, 0.15][i];
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: waveDelay + i * 0.06, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -6, boxShadow: "0 24px 60px rgba(60,40,120,0.15)" }}
                  className="rounded-[20px] text-center"
                  style={{
                    background: "linear-gradient(180deg, rgba(255,255,255,0.8), rgba(255,255,255,0.5))",
                    border: "1px solid rgba(90,70,160,0.1)",
                    boxShadow: "0 16px 48px rgba(60,40,120,0.08)", padding: "32px 20px",
                  }}
                >
                  <div style={{ fontSize: "clamp(20px, 2vw, 28px)", fontWeight: 800, color: "#111", letterSpacing: "-0.02em" }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: "rgba(30,30,30,0.55)", marginTop: 6 }}>{s.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Interoperability;
