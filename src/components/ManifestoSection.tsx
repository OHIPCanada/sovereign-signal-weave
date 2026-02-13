import { useRef, useCallback, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ─── AI CORTEX ─── Particle Ring (from Section 4) */
const CortexViz = () => {
  const dots = Array.from({ length: 100 }, (_, i) => {
    const angle = (i / 100) * Math.PI * 2;
    const r = 70;
    const x = 100 + Math.cos(angle) * r;
    const y = 100 + Math.sin(angle) * r;
    const isGap = i % 12 === 0 || i % 17 === 0;
    const isCoral = i === 23 || i === 67;
    return { x, y, isGap, isCoral };
  });

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div
        className="absolute"
        style={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(123,97,255,.45), rgba(123,97,255,.1) 60%, transparent 80%)",
          animation: "glowPulse 3.5s ease-in-out infinite",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
      <svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        style={{ animation: "slowSpin 50s linear infinite" }}
      >
        {dots.map((d, i) =>
          d.isGap ? null : (
            <circle
              key={i}
              cx={d.x}
              cy={d.y}
              r={d.isCoral ? 2.2 : 1.6}
              fill={d.isCoral ? "rgba(212,97,107,.85)" : "rgba(123,97,255,.7)"}
              opacity={0.5 + Math.random() * 0.4}
            />
          )
        )}
      </svg>
    </div>
  );
};

/* ─── WORKFLOW ORCHESTRATION ─── Rails with packets (from Section 4) */
const WorkflowViz = () => {
  const rails = [
    { y: 40, packets: [{ delay: 0, dur: 10 }, { delay: 4, dur: 10 }, { delay: 7.5, dur: 10 }] },
    { y: 70, packets: [{ delay: 1, dur: 12 }, { delay: 6, dur: 12 }] },
    { y: 100, packets: [{ delay: 2, dur: 8 }, { delay: 5, dur: 8 }, { delay: 9, dur: 8 }] },
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg width="100%" height="100%" viewBox="0 0 400 140" preserveAspectRatio="xMidYMid meet">
        {rails.map((rail, ri) => (
          <g key={ri}>
            <line x1="20" y1={rail.y} x2="380" y2={rail.y} stroke="rgba(255,255,255,.08)" strokeWidth="1" />
            {rail.packets.map((pkt, pi) => (
              <circle key={pi} r="4" cy={rail.y} fill="rgba(123,97,255,.65)">
                <animate attributeName="cx" values="20;380" dur={`${pkt.dur}s`} begin={`${pkt.delay}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;.7;.7;0" dur={`${pkt.dur}s`} begin={`${pkt.delay}s`} repeatCount="indefinite" />
              </circle>
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
};

/* ─── SOVEREIGN DATA PLANE ─── Vault Field (from Section 4) */
const DataPlaneViz = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    <div
      className="absolute"
      style={{
        width: 100,
        height: 100,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(212,97,107,.45), rgba(232,150,124,.2), rgba(242,193,174,0))",
        filter: "blur(18px)",
        opacity: 0.5,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    />
    <svg width="220" height="170" viewBox="0 0 280 220">
      <rect x="30" y="20" width="220" height="180" rx="20" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="1" />
      {Array.from({ length: 9 }, (_, i) => (
        <line key={`v${i}`} x1={30 + (i + 1) * 22} y1="20" x2={30 + (i + 1) * 22} y2="200" stroke="rgba(255,255,255,.04)" strokeWidth="1" />
      ))}
      {Array.from({ length: 7 }, (_, i) => (
        <line key={`h${i}`} x1="30" y1={20 + (i + 1) * 22.5} x2="250" y2={20 + (i + 1) * 22.5} stroke="rgba(255,255,255,.04)" strokeWidth="1" />
      ))}
      <circle cx="140" cy="110" r="8" fill="rgba(212,97,107,.6)">
        <animate attributeName="opacity" values=".5;.85;.5" dur="3.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="140" cy="110" r="18" fill="none" stroke="rgba(212,97,107,.2)" strokeWidth="1" />
    </svg>
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
