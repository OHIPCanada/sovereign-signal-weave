import { useRef, useCallback, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ─── AI CORTEX ─── neural mesh with convergence to massive core */
const CortexViz = () => (
  <svg viewBox="0 0 640 220" className="w-full h-full block">
    <defs>
      <radialGradient id="coreGlow" cx="50%" cy="50%" r="55%">
        <stop offset="0%" stopColor="rgba(255,255,255,0.70)" />
        <stop offset="35%" stopColor="rgba(199,163,255,0.55)" />
        <stop offset="70%" stopColor="rgba(129,83,255,0.25)" />
        <stop offset="100%" stopColor="rgba(129,83,255,0.0)" />
      </radialGradient>
    </defs>

    {/* Core glow */}
    <circle cx="330" cy="88" r="42" fill="url(#coreGlow)" style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.22))" }} />

    {/* Edges */}
    <g className="s2-cortex-edges">
      <line x1="150" y1="90" x2="250" y2="45" />
      <line x1="250" y1="45" x2="330" y2="88" />
      <line x1="330" y1="88" x2="420" y2="40" />
      <line x1="420" y1="40" x2="520" y2="85" />
      <line x1="520" y1="85" x2="420" y2="145" />
      <line x1="420" y1="145" x2="330" y2="88" />
      <line x1="330" y1="88" x2="240" y2="145" />
      <line x1="240" y1="145" x2="150" y2="90" />
      <line x1="250" y1="45" x2="420" y2="40" />
      <line x1="240" y1="145" x2="420" y2="145" />
    </g>

    {/* Nodes */}
    <g className="s2-cortex-nodes">
      <circle cx="150" cy="90" r="7" />
      <circle cx="250" cy="45" r="6" />
      <circle cx="420" cy="40" r="6" />
      <circle cx="520" cy="85" r="7" />
      <circle cx="420" cy="145" r="7" />
      <circle cx="240" cy="145" r="7" />
      {/* micro spark nodes */}
      <circle className="s2-micro" cx="285" cy="62" r="3" />
      <circle className="s2-micro" cx="470" cy="60" r="3" />
      <circle className="s2-micro" cx="475" cy="120" r="3" />
    </g>

    {/* Pulses converging to center */}
    {[
      { cx: 150, cy: 90, delay: 0 },
      { cx: 420, cy: 40, delay: 3.5 },
      { cx: 520, cy: 85, delay: 7 },
      { cx: 240, cy: 145, delay: 10.5 },
    ].map((p, i) => (
      <g key={i}>
        <circle r="5" fill="rgba(220,210,255,1)" style={{ filter: "drop-shadow(0 0 6px rgba(186,145,255,0.4))" }}>
          <animate attributeName="cx" values={`${p.cx};330`} dur="2.5s" begin={`${p.delay}s`} repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.2 1" />
          <animate attributeName="cy" values={`${p.cy};88`} dur="2.5s" begin={`${p.delay}s`} repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.2 1" />
          <animate attributeName="opacity" values="0;0.9;0.8;0" keyTimes="0;0.1;0.8;1" dur="2.5s" begin={`${p.delay}s`} repeatCount="indefinite" />
        </circle>
        <circle cx="330" cy="88" r="22" fill="rgba(220,210,255,1)" opacity="0">
          <animate attributeName="opacity" values="0;0;0.3;0" keyTimes="0;0.75;0.9;1" dur="2.5s" begin={`${p.delay}s`} repeatCount="indefinite" />
        </circle>
      </g>
    ))}
  </svg>
);

/* ─── WORKFLOW ORCHESTRATION ─── 3 lanes with offset nodes + pulses */
const WorkflowViz = () => (
  <div className="absolute inset-0" style={{ padding: 18 }}>
    {/* 3 horizontal lines */}
    <div className="s2-wf-line" style={{ top: 36 }} />
    <div className="s2-wf-line" style={{ top: 62, opacity: 0.8 }} />
    <div className="s2-wf-line" style={{ top: 88, opacity: 0.65 }} />

    {/* Checkpoint nodes */}
    <span className="s2-wf-node" style={{ top: 31, left: "28%" }} />
    <span className="s2-wf-node" style={{ top: 57, left: "55%" }} />
    <span className="s2-wf-node" style={{ top: 83, left: "78%" }} />

    {/* Moving pulses */}
    <span className="s2-wf-pulse s2-wf-pulse-1" style={{ top: 31 }} />
    <span className="s2-wf-pulse s2-wf-pulse-2" style={{ top: 57 }} />
  </div>
);

/* ─── SOVEREIGN DATA PLANE ─── heavy spine with gate nodes */
const DataPlaneViz = () => (
  <div className="absolute inset-0" style={{ padding: 18 }}>
    {/* Heavy horizontal rail */}
    <div className="s2-dp-rail" />

    {/* Gate nodes */}
    <span className="s2-dp-gate" style={{ left: "30%", animationDelay: "0s" }} />
    <span className="s2-dp-gate" style={{ left: "57%", animationDelay: "0.6s" }} />
    <span className="s2-dp-gate" style={{ left: "82%", animationDelay: "1.2s" }} />
  </div>
);

/* ─── Card hierarchy styles ─── */
const cardStyles = [
  { // Cortex — brightest
    bg: "linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.06))",
    border: "1px solid rgba(255,255,255,0.15)",
    shadow: "0 24px 70px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.10), inset 0 0 120px rgba(123,97,255,0.18)",
  },
  { // Orchestration — neutral
    bg: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
    border: "1px solid rgba(255,255,255,0.12)",
    shadow: "0 24px 70px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 120px rgba(123,97,255,0.15)",
  },
  { // Sovereign — darkest, heaviest
    bg: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
    border: "1px solid rgba(255,255,255,0.09)",
    shadow: "0 24px 70px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 0 120px rgba(123,97,255,0.10)",
  },
];

const layers = [
  { label: "AI Cortex", subtitle: "Reasoning · Context · Decision Support", Viz: CortexViz, vizHeight: "h-[140px]" },
  { label: "Workflow Orchestration", subtitle: "Routing · Decisions · Clinical Ops", Viz: WorkflowViz, vizHeight: "h-[126px]" },
  { label: "Sovereign Data Plane", subtitle: "Storage · Policy · Jurisdictional Control", Viz: DataPlaneViz, vizHeight: "h-[126px]" },
];

const ManifestoSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [cardTransforms, setCardTransforms] = useState<string[]>(["", "", ""]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const headlineOpacity = useTransform(scrollYProgress, [0.06, 0.22], [0, 1]);
  const headlineY = useTransform(scrollYProgress, [0.06, 0.22], [36, 0]);

  // Micro-parallax on cards
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;

    setCardTransforms(
      [0, 1, 2].map((i) => {
        const depth = (i + 1) * 0.6;
        return `perspective(1200px) rotateY(${x * 3 * depth}deg) rotateX(${-y * 2 * depth}deg) translateY(${y * 6}px)`;
      })
    );
  }, []);

  const handleMouseLeave = useCallback(() => {
    setCardTransforms(["", "", ""]);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return (
    <section
      ref={containerRef}
      id="intelligence-layer"
      className="relative overflow-hidden"
      style={{ padding: "clamp(64px, 7vw, 110px) 0" }}
    >
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(900px 600px at 18% 38%, rgba(143,83,255,0.45), transparent 60%),
            radial-gradient(700px 520px at 78% 22%, rgba(255,192,174,0.18), transparent 62%),
            radial-gradient(900px 700px at 70% 75%, rgba(212,97,107,0.14), transparent 66%),
            linear-gradient(135deg, #1A0630 0%, #3A0B6E 48%, #5B1FA6 120%)
          `,
          filter: "saturate(1.08)",
        }}
      />

      <div className="relative z-10" style={{ width: "min(1180px, calc(100% - 48px))", margin: "0 auto" }}>
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] items-start" style={{ gap: "clamp(24px, 4vw, 64px)" }}>
          {/* Left — Copy */}
          <motion.div style={{ opacity: headlineOpacity, y: headlineY }}>
            <p className="mb-5 mono-label" style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, letterSpacing: "0.22em" }}>
              [ THE INTELLIGENCE LAYER ]
            </p>
            <h2
              className="mb-5"
              style={{
                color: "rgba(255,255,255,0.92)",
                fontWeight: 800,
                lineHeight: 0.95,
                fontSize: "clamp(44px, 5.2vw, 84px)",
                textShadow: "0 10px 40px rgba(0,0,0,0.22)",
              }}
            >
              Healthcare<br />runs on<br />intelligence<br />now.
            </h2>
            <p style={{ color: "rgba(255,255,255,0.72)", fontWeight: 400, fontSize: "clamp(15px, 1.25vw, 18px)", lineHeight: 1.55, maxWidth: "46ch" }}>
              Three system planes running beneath every clinical workflow — reasoning, orchestration, and sovereign data governance — engineered as infrastructure, not features.
            </p>
          </motion.div>

          {/* Right — Cards */}
          <div ref={cardsRef} className="relative">
            {/* Ambient glow */}
            <div
              className="absolute pointer-events-none"
              style={{
                top: "-10%", left: "5%", width: "90%", height: "120%",
                background: "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(160,130,240,0.12) 0%, transparent 65%)",
              }}
            />
            <div className="relative z-10 flex flex-col gap-[18px]">
              {layers.map((layer, i) => (
                <motion.article
                  key={layer.label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
                  whileHover={{
                    y: -4,
                    borderColor: "rgba(255,255,255,0.20)",
                  }}
                  className="relative rounded-[22px] overflow-hidden transition-colors duration-300"
                  style={{
                    background: cardStyles[i].bg,
                    border: cardStyles[i].border,
                    backdropFilter: "blur(18px)",
                    WebkitBackdropFilter: "blur(18px)",
                    boxShadow: cardStyles[i].shadow,
                    padding: "18px 18px 16px",
                    transform: cardTransforms[i] || "none",
                    transition: "transform 0.15s ease-out",
                  }}
                >
                  {/* Inner light gradient */}
                  <div className="absolute inset-[-1px] pointer-events-none" style={{ background: "radial-gradient(480px 220px at 12% 18%, rgba(255,255,255,0.10), transparent 60%)" }} />

                  {/* Header */}
                  <div className="relative flex justify-between items-start gap-3 mb-2.5">
                    <div>
                      <div style={{ fontWeight: 650, fontSize: 18, color: "rgba(255,255,255,0.92)" }}>{layer.label}</div>
                      <div style={{ fontWeight: 450, fontSize: 13, color: "rgba(255,255,255,0.55)", marginTop: 4 }}>{layer.subtitle}</div>
                    </div>
                  </div>

                  {/* Visualization area */}
                  <div
                    className={`relative ${layer.vizHeight} rounded-2xl overflow-hidden`}
                    style={{ background: "rgba(0,0,0,0.10)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <layer.Viz />
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManifestoSection;
