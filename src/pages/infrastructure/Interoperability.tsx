import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion, useInView } from "framer-motion";
import interopOrb from "@/assets/interoperability-hero-orb.png";
import { Plug, FileJson, RefreshCw, Layers, CheckCircle2, ArrowRight, Zap } from "lucide-react";
import { useRef, useState, useEffect } from "react";

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

/* ── Data Flow Lines Background ── */
const DataFlowLines = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.3 }}>
        {mounted && Array.from({ length: 8 }).map((_, i) => {
          const startY = 10 + i * 12;
          return (
            <g key={i}>
              <motion.path
                d={`M0 ${startY}% Q 25% ${startY + (i % 2 === 0 ? 5 : -5)}%, 50% ${startY}% T 100% ${startY}%`}
                fill="none"
                stroke="rgba(123,97,255,0.15)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: i * 0.2, ease: "easeInOut" }}
              />
              <motion.circle
                r="3"
                fill="#C084FC"
                initial={{ offsetDistance: "0%" }}
                animate={{ offsetDistance: "100%" }}
                transition={{ duration: 4, delay: i * 0.3, repeat: Infinity, ease: "linear" }}
                style={{ offsetPath: `path("M0 ${startY * 6} Q ${window.innerWidth * 0.25} ${(startY + (i % 2 === 0 ? 5 : -5)) * 6}, ${window.innerWidth * 0.5} ${startY * 6} T ${window.innerWidth} ${startY * 6}")` }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const Interoperability = () => {
  const pipelineRef = useRef<HTMLDivElement>(null);
  const pipelineInView = useInView(pipelineRef, { once: true, margin: "-100px" });
  const [activeStep, setActiveStep] = useState(-1);

  useEffect(() => {
    if (pipelineInView) {
      const interval = setInterval(() => {
        setActiveStep((prev) => (prev < 4 ? prev + 1 : prev));
      }, 400);
      return () => clearInterval(interval);
    }
  }, [pipelineInView]);

  return (
    <div className="relative overflow-x-hidden">
      <Navigation darkMode />

      {/* HERO — Dark */}
      <section
        className="relative overflow-hidden flex items-end md:items-center"
        style={{
          minHeight: "80vh",
          padding: "clamp(120px, 14vw, 200px) 0 clamp(64px, 7vw, 110px)",
          background: `
            radial-gradient(600px 400px at 40% 50%, rgba(192,132,252,0.15), transparent 50%),
            radial-gradient(500px 350px at 60% 50%, rgba(91,31,166,0.25), transparent 50%),
            linear-gradient(175deg, #0B0613 0%, #16002A 50%, #1A0630 100%)
          `,
        }}
      >
        <DataFlowLines />
        <div className="relative z-10 mx-auto px-6 md:px-12" style={{ width: "min(1400px, 94vw)" }}>
          <div className="grid grid-cols-1 md:grid-cols-[0.55fr_1.45fr] items-center split-layout-gap">
            <div className="flex flex-col gap-5">
              <motion.div
                className="flex items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="flex items-center gap-2 px-3 py-1.5 rounded"
                  style={{ background: "rgba(123,97,255,0.1)", border: "1px solid rgba(123,97,255,0.2)" }}
                  animate={{ boxShadow: ["0 0 0 rgba(123,97,255,0)", "0 0 20px rgba(123,97,255,0.2)", "0 0 0 rgba(123,97,255,0)"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Zap className="w-4 h-4" style={{ color: "rgba(255,255,255,0.6)" }} />
                  <span className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>Connected</span>
                </motion.div>
              </motion.div>
              
              <h1 style={{ color: "rgba(255,255,255,0.95)", fontWeight: 800, lineHeight: 0.95, fontSize: "clamp(44px, 5.2vw, 84px)", letterSpacing: "-0.02em" }}>
                {["Connect", "everything.", "Seamlessly."].map((line, li) => (
                  <motion.span
                    key={li}
                    className="block"
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + li * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {line}
                  </motion.span>
                ))}
              </h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                style={{ color: "rgba(255,255,255,0.6)", fontSize: "clamp(15px, 1.25vw, 18px)", lineHeight: 1.55, maxWidth: "46ch" }}
              >
                Native HL7 FHIR, v2.x, and CDA support. Pre-built connectors for major Canadian EMRs.
              </motion.p>
            </div>

            <div className="relative flex items-center justify-center">
              <motion.img
                src={interopOrb}
                alt="Interoperability"
                className="w-full max-w-[450px] object-contain"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                style={{ filter: "drop-shadow(0 30px 80px rgba(91,31,166,0.3))" }}
              />
              {[45, 135, 225, 315].map((angle, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    background: "#C084FC",
                    left: `calc(50% + ${Math.cos((angle * Math.PI) / 180) * 180}px)`,
                    top: `calc(50% + ${Math.sin((angle * Math.PI) / 180) * 180}px)`,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0.6] }}
                  transition={{ delay: 1 + i * 0.2, duration: 0.6 }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STANDARDS — Light studio */}
      <section
        className="relative overflow-hidden"
        style={{
          padding: "clamp(64px, 7vw, 110px) 0",
          background: `
            radial-gradient(1000px 600px at 20% 40%, rgba(192,132,252,0.15), transparent 55%),
            radial-gradient(800px 500px at 85% 70%, rgba(232,150,124,0.18), transparent 55%),
            linear-gradient(180deg, #F9F8FC 0%, #F4EFFA 100%)
          `,
        }}
      >
        <div className="relative z-10 mx-auto px-6 md:px-12" style={{ width: "min(1400px, 94vw)" }}>
          <motion.div
            className="mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <span className="font-mono text-xs px-3 py-1.5 rounded" style={{ background: "rgba(212,97,107,0.08)", color: "#D4616B", border: "1px solid rgba(212,97,107,0.12)" }}>
              Protocols
            </span>
            <h2 className="mt-4" style={{ color: "#111", fontWeight: 700, fontSize: "clamp(32px, 4vw, 56px)", lineHeight: 1.1 }}>
              Speak every language.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {standards.map((std, i) => (
              <motion.div
                key={std.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4, boxShadow: "0 20px 60px rgba(123,97,255,0.1)" }}
                className="relative p-6 rounded-2xl overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.5))",
                  border: "1px solid rgba(123,97,255,0.1)",
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 8px 40px rgba(60,40,120,0.06)",
                }}
              >
                {/* Accent line on hover */}
                <motion.div
                  className="absolute top-0 left-0 w-full h-1"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  style={{ background: "linear-gradient(90deg, transparent, #C084FC, transparent)", transformOrigin: "left" }}
                />
                
                <div className="flex items-start gap-4">
                  <motion.div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(192,132,252,0.08)" }}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <std.icon className="w-6 h-6" style={{ color: "#D4616B" }} />
                  </motion.div>
                  <div className="flex-1">
                    <div style={{ fontWeight: 700, fontSize: 18, color: "#1B0F2E", marginBottom: 4 }}>{std.title}</div>
                    <div style={{ fontSize: 14, color: "rgba(30,20,50,0.55)", lineHeight: 1.6, marginBottom: 12 }}>{std.desc}</div>
                    <div className="grid grid-cols-2 gap-2">
                      {std.features.map((f, fi) => (
                        <motion.div
                          key={f}
                          className="flex items-center gap-2"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.4 + i * 0.12 + fi * 0.08 }}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "#C084FC" }} />
                          <span style={{ fontSize: 12, color: "rgba(30,20,50,0.5)" }}>{f}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* INTEGRATION FLOW — Light warm atmospheric */}
      <section
        className="relative overflow-hidden"
        style={{
          padding: "clamp(64px, 7vw, 110px) 0",
          background: `
            radial-gradient(900px 500px at 70% 40%, rgba(242,193,174,0.25), transparent 55%),
            radial-gradient(800px 500px at 20% 60%, rgba(205,188,232,0.3), transparent 55%),
            linear-gradient(180deg, #F4EFFA 0%, #F7F3FF 50%, #FFFAF8 100%)
          `,
        }}
      >
        <div ref={pipelineRef} className="relative z-10 mx-auto px-6 md:px-12" style={{ width: "min(1400px, 94vw)" }}>
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 style={{ color: "#1B0F2E", fontWeight: 700, fontSize: "clamp(32px, 4vw, 56px)" }}>
              Five steps to unified data.
            </h2>
          </motion.div>

          <div className="flex flex-col md:flex-row items-stretch gap-3 justify-center">
            {integrationFlow.map((flow, i) => {
              const isActive = i <= activeStep;
              const isCurrent = i === activeStep;
              
              return (
                <motion.div
                  key={flow.step}
                  className="flex-1 rounded-2xl p-5 relative overflow-hidden"
                  initial={{ opacity: 0.3 }}
                  animate={{ 
                    opacity: isActive ? 1 : 0.4,
                    borderColor: isCurrent ? "rgba(192,132,252,0.4)" : isActive ? "rgba(123,97,255,0.15)" : "rgba(123,97,255,0.06)",
                  }}
                  transition={{ duration: 0.4 }}
                  style={{
                    background: isActive
                      ? "rgba(255,255,255,0.8)"
                      : "rgba(255,255,255,0.4)",
                    border: "1px solid",
                    backdropFilter: "blur(10px)",
                    boxShadow: isActive ? "0 8px 32px rgba(60,40,120,0.08)" : "none",
                    minWidth: 140,
                  }}
                >
                  {isCurrent && (
                    <motion.div
                      className="absolute inset-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.2, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      style={{ background: "radial-gradient(circle at center, rgba(192,132,252,0.15), transparent 70%)" }}
                    />
                  )}
                  
                  <div className="relative z-10">
                    <div className="font-mono text-xs mb-2" style={{ color: isActive ? "#7B61FF" : "rgba(30,20,50,0.3)" }}>
                      {flow.step}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: isActive ? "#1B0F2E" : "rgba(30,20,50,0.35)", marginBottom: 4 }}>
                      {flow.title}
                    </div>
                    <div style={{ fontSize: 12, color: isActive ? "rgba(30,20,50,0.6)" : "rgba(30,20,50,0.25)", lineHeight: 1.5 }}>
                      {flow.desc}
                    </div>
                  </div>
                  
                  {i < integrationFlow.length - 1 && (
                    <motion.div
                      className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-20"
                      animate={{ opacity: isActive ? 1 : 0.2 }}
                    >
                      <ArrowRight className="w-4 h-4" style={{ color: isActive ? "#C084FC" : "rgba(30,20,50,0.2)" }} />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* STATS — Dark closing */}
      <section
        className="relative overflow-hidden"
        style={{
          padding: "clamp(64px, 7vw, 110px) 0",
          background: "linear-gradient(180deg, #0D001A 0%, #16002A 100%)",
        }}
      >
        <div className="relative z-10 mx-auto px-6 md:px-12" style={{ width: "min(1200px, 94vw)" }}>
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 style={{ color: "#fff", fontWeight: 700, fontSize: "clamp(32px, 4vw, 56px)" }}>Enterprise-ready.</h2>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ borderColor: "rgba(192,132,252,0.3)", y: -4 }}
                className="p-6 rounded-xl text-center"
                style={{ background: "rgba(123,97,255,0.04)", border: "1px solid rgba(123,97,255,0.1)" }}
              >
                <div className="font-mono" style={{ fontSize: "clamp(24px, 2.5vw, 36px)", fontWeight: 700, color: "#fff" }}>{s.value}</div>
                <div className="font-mono mt-2" style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Interoperability;
