import { useRef, useCallback, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ─── AI CORTEX ─── structured pulsing network with signal transmission */
const CortexViz = () => (
  <svg viewBox="0 0 640 200" className="w-full h-full block">
    <defs>
      <radialGradient id="cortexCore" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(176,140,255,0.6)" />
        <stop offset="60%" stopColor="rgba(176,140,255,0.2)" />
        <stop offset="100%" stopColor="rgba(176,140,255,0)" />
      </radialGradient>
    </defs>

    {/* Core glow — subtle, not overpowering */}
    <circle cx="320" cy="100" r="32" fill="url(#cortexCore)" />

    {/* Network edges — dashed signal lines */}
    <g className="s2-cortex-edges">
      <line x1="120" y1="100" x2="220" y2="55" />
      <line x1="220" y1="55" x2="320" y2="100" />
      <line x1="320" y1="100" x2="430" y2="50" />
      <line x1="430" y1="50" x2="530" y2="95" />
      <line x1="530" y1="95" x2="430" y2="155" />
      <line x1="430" y1="155" x2="320" y2="100" />
      <line x1="320" y1="100" x2="210" y2="150" />
      <line x1="210" y1="150" x2="120" y2="100" />
      <line x1="220" y1="55" x2="430" y2="50" />
      <line x1="210" y1="150" x2="430" y2="155" />
      {/* Secondary connections */}
      <line x1="170" y1="75" x2="270" y2="40" style={{ opacity: 0.5 }} />
      <line x1="480" y1="70" x2="380" y2="45" style={{ opacity: 0.5 }} />
    </g>

    {/* Nodes — lavender glow, not white */}
    <g className="s2-cortex-nodes">
      <circle cx="120" cy="100" r="5" />
      <circle cx="220" cy="55" r="4.5" />
      <circle cx="430" cy="50" r="4.5" />
      <circle cx="530" cy="95" r="5" />
      <circle cx="430" cy="155" r="5" />
      <circle cx="210" cy="150" r="5" />
      {/* Core node — larger */}
      <circle cx="320" cy="100" r="8" className="s2-core-node" />
      {/* Micro sparks */}
      <circle cx="270" cy="72" r="2.5" className="s2-micro" />
      <circle cx="480" cy="70" r="2.5" className="s2-micro" />
      <circle cx="370" cy="130" r="2.5" className="s2-micro" />
    </g>

    {/* Signal pulses converging to core */}
    {[
      { cx: 120, cy: 100, delay: 0 },
      { cx: 430, cy: 50, delay: 4 },
      { cx: 530, cy: 95, delay: 8 },
      { cx: 210, cy: 150, delay: 12 },
    ].map((p, i) => (
      <g key={i}>
        <circle r="3.5" fill="#B08CFF" style={{ filter: "drop-shadow(0 0 6px rgba(176,140,255,0.6))" }}>
          <animate attributeName="cx" values={`${p.cx};320`} dur="2.8s" begin={`${p.delay}s`} repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.2 1" />
          <animate attributeName="cy" values={`${p.cy};100`} dur="2.8s" begin={`${p.delay}s`} repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.2 1" />
          <animate attributeName="opacity" values="0;0.85;0.7;0" keyTimes="0;0.12;0.82;1" dur="2.8s" begin={`${p.delay}s`} repeatCount="indefinite" />
        </circle>
        {/* Core flash on arrival */}
        <circle cx="320" cy="100" r="18" fill="#B08CFF" opacity="0">
          <animate attributeName="opacity" values="0;0;0.2;0" keyTimes="0;0.78;0.92;1" dur="2.8s" begin={`${p.delay}s`} repeatCount="indefinite" />
        </circle>
      </g>
    ))}
  </svg>
);

/* ─── WORKFLOW ORCHESTRATION ─── calm data routing, no glow */
const WorkflowViz = () => (
  <div className="absolute inset-0" style={{ padding: 18 }}>
    {/* 3 horizontal lines — quiet, no glow */}
    <div className="s2-wf-line" style={{ top: 42 }} />
    <div className="s2-wf-line" style={{ top: 72 }} />
    <div className="s2-wf-line" style={{ top: 102 }} />

    {/* Checkpoint nodes — offset positions */}
    <span className="s2-wf-node" style={{ top: 37, left: "26%" }} />
    <span className="s2-wf-node" style={{ top: 67, left: "52%" }} />
    <span className="s2-wf-node" style={{ top: 97, left: "76%" }} />

    {/* Moving packets — different speeds */}
    <span className="s2-wf-pulse s2-wf-pulse-1" style={{ top: 37 }} />
    <span className="s2-wf-pulse s2-wf-pulse-2" style={{ top: 67 }} />
    <span className="s2-wf-pulse s2-wf-pulse-3" style={{ top: 97 }} />
  </div>
);

/* ─── SOVEREIGN DATA PLANE ─── coral anchors, authoritative */
const DataPlaneViz = () => (
  <div className="absolute inset-0" style={{ padding: 18 }}>
    {/* Heavy horizontal spine */}
    <div className="s2-dp-rail" />

    {/* Coral anchor nodes */}
    <span className="s2-dp-gate" style={{ left: "25%", animationDelay: "0s" }} />
    <span className="s2-dp-gate" style={{ left: "50%", animationDelay: "0.8s" }} />
    <span className="s2-dp-gate" style={{ left: "75%", animationDelay: "1.6s" }} />
  </div>
);

/* ─── Card hierarchy ─── */
const layers = [
  { label: "AI Cortex", subtitle: "Reasoning · Context · Decision Support", Viz: CortexViz, vizHeight: "h-[160px]" },
  { label: "Workflow Orchestration", subtitle: "Routing · Decisions · Clinical Ops", Viz: WorkflowViz, vizHeight: "h-[140px]" },
  { label: "Sovereign Data Plane", subtitle: "Storage · Policy · Jurisdictional Control", Viz: DataPlaneViz, vizHeight: "h-[130px]" },
];

const ManifestoSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardTransforms, setCardTransforms] = useState<string[]>(["", "", ""]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const headlineOpacity = useTransform(scrollYProgress, [0.06, 0.22], [0, 1]);
  const headlineY = useTransform(scrollYProgress, [0.06, 0.22], [36, 0]);

  // Micro-parallax
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    setCardTransforms(
      [0, 1, 2].map((i) => {
        const depth = (i + 1) * 0.5;
        return `perspective(1200px) rotateY(${x * 2.5 * depth}deg) rotateX(${-y * 1.8 * depth}deg) translateY(${y * 4}px)`;
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
      style={{ padding: "clamp(72px, 8vw, 120px) 0" }}
    >
      {/* Background — deep, quiet gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(1200px 800px at 70% 40%, #5E2CA5 0%, #3D0E6F 40%, #140022 100%)",
        }}
      />
      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          opacity: 0.06,
        }}
      />

      <div className="relative z-10" style={{ width: "min(1180px, calc(100% - 48px))", margin: "0 auto" }}>
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] items-start" style={{ gap: "clamp(32px, 5vw, 72px)" }}>
          {/* Left — Copy */}
          <motion.div style={{ opacity: headlineOpacity, y: headlineY }}>
            <p className="mb-6 mono-label" style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, letterSpacing: "0.18em" }}>
              [ THE INTELLIGENCE LAYER ]
            </p>
            <h2
              style={{
                color: "#ffffff",
                fontWeight: 800,
                lineHeight: 1.05,
                fontSize: "clamp(60px, 7vw, 96px)",
                margin: "0 0 24px 0",
              }}
            >
              Healthcare<br />runs on<br />intelligence<br />now.
            </h2>
            <p style={{
              color: "rgba(255,255,255,0.7)",
              fontWeight: 400,
              fontSize: 18,
              lineHeight: 1.6,
              maxWidth: "520px",
              margin: 0,
            }}>
              Three system planes running beneath every clinical workflow — reasoning, orchestration, and sovereign data governance — engineered as infrastructure, not features.
            </p>
          </motion.div>

          {/* Right — Cards with Z-depth */}
          <div className="relative" style={{ perspective: "1200px" }}>
            <div className="relative z-10 flex flex-col gap-5">
              {layers.map((layer, i) => (
                <motion.article
                  key={layer.label}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
                  className="s2-plane-card relative overflow-hidden"
                  style={{
                    transform: cardTransforms[i] || `translateZ(${-i * 10}px)`,
                    transition: "transform 0.2s ease-out, border-color 0.2s ease",
                  }}
                >
                  {/* Header */}
                  <div className="relative flex justify-between items-start gap-3 mb-3">
                    <div>
                      <div style={{ fontWeight: 650, fontSize: 18, color: "rgba(255,255,255,0.92)" }}>{layer.label}</div>
                      <div style={{ fontWeight: 400, fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>{layer.subtitle}</div>
                    </div>
                  </div>

                  {/* Visualization */}
                  <div
                    className={`relative ${layer.vizHeight} rounded-2xl overflow-hidden`}
                    style={{ background: "rgba(0,0,0,0.15)", border: "1px solid rgba(255,255,255,0.05)" }}
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
