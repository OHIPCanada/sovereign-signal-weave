import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ─── AI CORTEX ─── neural mesh with converging pulses */
const CortexPlane = () => {
  const center = { cx: 280, cy: 55 };
  const nodes = [
    { cx: 130, cy: 25 }, { cx: 180, cy: 85 },
    { cx: 240, cy: 20 }, { cx: 340, cy: 90 },
    { cx: 390, cy: 30 }, { cx: 430, cy: 70 },
    { cx: 200, cy: 55 }, { cx: 360, cy: 50 },
    { cx: 300, cy: 90 }, { cx: 260, cy: 65 },
  ];

  const edges: [number, number][] = [
    [0, 2], [2, 4], [4, 5], [0, 6], [6, 1],
    [1, 8], [8, 3], [3, 7], [7, 5], [9, 6],
    [9, 8], [2, 9], [7, 4],
  ];

  const pulseIndices = [0, 3, 5];

  return (
    <svg viewBox="0 0 500 110" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="cortex-glow-v3">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <radialGradient id="cortex-core-grad-v3" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#7B61FF" />
        </radialGradient>
      </defs>

      {nodes.map((n, i) => (
        <line key={`cc-${i}`} x1={center.cx} y1={center.cy} x2={n.cx} y2={n.cy}
          stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" strokeLinecap="round">
          <animate attributeName="opacity" values="0.4;0.7;0.4" dur="6s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
        </line>
      ))}

      {edges.map(([a, b], i) => (
        <line key={`ce-${i}`} x1={nodes[a].cx} y1={nodes[a].cy}
          x2={nodes[b].cx} y2={nodes[b].cy}
          stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" strokeLinecap="round" />
      ))}

      <circle cx={center.cx} cy={center.cy} r="14" fill="url(#cortex-core-grad-v3)" filter="url(#cortex-glow-v3)">
        <animate attributeName="r" values="14;16;14" dur="4s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
      </circle>

      {nodes.map((n, i) => (
        <circle key={`n-${i}`} cx={n.cx} cy={n.cy} r="3.5" fill="rgba(255,255,255,0.75)" />
      ))}

      {pulseIndices.map((idx, i) => (
        <circle key={`p-${i}`} r="3" fill="rgba(255,255,255,0.85)" filter="url(#cortex-glow-v3)">
          <animate attributeName="cx" values={`${nodes[idx].cx};${center.cx}`}
            dur="2.5s" begin={`${i * 4}s`} repeatCount="indefinite"
            calcMode="spline" keySplines="0.4 0 0.2 1" />
          <animate attributeName="cy" values={`${nodes[idx].cy};${center.cy}`}
            dur="2.5s" begin={`${i * 4}s`} repeatCount="indefinite"
            calcMode="spline" keySplines="0.4 0 0.2 1" />
          <animate attributeName="opacity" values="0;0.9;0.8;0"
            keyTimes="0;0.1;0.8;1" dur="2.5s" begin={`${i * 4}s`}
            repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
};

/* ─── WORKFLOW ORCHESTRATION ─── 3 rails with traveling nodes */
const OrchestrationPlane = () => {
  const rails = [
    { y: 25, speed: "18s" },
    { y: 55, speed: "22s" },
    { y: 85, speed: "26s" },
  ];

  const railNodes = [
    [{ x: 100 }, { x: 260 }, { x: 420 }],
    [{ x: 160 }, { x: 320 }, { x: 450 }],
    [{ x: 130 }, { x: 290 }],
  ];

  return (
    <svg viewBox="0 0 500 110" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="orch-glow-v3">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {rails.map((r, i) => (
        <line key={`rail-${i}`} x1="30" y1={r.y} x2="480" y2={r.y}
          stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" />
      ))}

      {/* Divergence */}
      <line x1="260" y1="25" x2="320" y2="55"
        stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeDasharray="6 4" />

      {railNodes.map((nodes, ri) =>
        nodes.map((n, ni) => (
          <circle key={`n-${ri}-${ni}`} cx={n.x} cy={rails[ri].y} r="4.5"
            fill="rgba(255,255,255,0.85)" filter="url(#orch-glow-v3)" />
        ))
      )}

      {rails.map((r, i) => (
        <circle key={`pulse-${i}`} r="3.5" fill="rgba(255,255,255,0.75)" cy={r.y}>
          <animate attributeName="cx" values="30;480" dur={r.speed}
            begin={`${i * 1.5}s`} repeatCount="indefinite" calcMode="linear" />
          <animate attributeName="opacity" values="0;0.8;0.8;0"
            keyTimes="0;0.05;0.9;1" dur={r.speed}
            begin={`${i * 1.5}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
};

/* ─── SOVEREIGN DATA PLANE ─── single heavy spine */
const SovereignPlane = () => {
  const nodes = [
    { cx: 100, cy: 55, r: 7 },
    { cx: 260, cy: 55, r: 9 },
    { cx: 420, cy: 55, r: 6 },
  ];

  return (
    <svg viewBox="0 0 500 110" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <line x1="50" y1="55" x2="460" y2="55"
        stroke="rgba(255,255,255,0.75)" strokeWidth="3" strokeLinecap="round" />

      {nodes.map((n, i) => (
        <g key={`sn-${i}`}>
          <circle cx={n.cx} cy={n.cy} r={n.r} fill="rgba(255,255,255,0.9)" />
          <circle cx={n.cx} cy={n.cy} r={n.r + 4} fill="none"
            stroke="rgba(255,255,255,0.3)" strokeWidth="1.5">
            <animate attributeName="opacity" values="0.6;0.9;0.6"
              dur="5s" begin={`${i * 1.7}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
    </svg>
  );
};

/* ─── LAYER DATA ─── */
const layerData = [
  { label: "AI Cortex", subtitle: "Reasoning · Context · Decision Support", Plane: CortexPlane },
  { label: "Workflow Orchestration", subtitle: "Routing · Decisions · Clinical Ops", Plane: OrchestrationPlane },
  { label: "Sovereign Data Plane", subtitle: "Storage · Policy · Jurisdictional Control", Plane: SovereignPlane },
];

/* ─── SYSTEM PLANE ROW ─── label left, visualization right, inside unified frame */
const SystemPlaneRow = ({ label, subtitle, Plane, index }: {
  label: string; subtitle: string; Plane: React.FC; index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-30px" }}
    transition={{ delay: index * 0.15, duration: 0.5, ease: "easeOut" }}
    className="flex items-center gap-6"
    style={{
      padding: "40px 48px",
      ...(index > 0 ? { borderTop: "1px solid rgba(255,255,255,0.08)" } : {}),
    }}
  >
    {/* Label */}
    <div className="flex-shrink-0 w-[130px] md:w-[160px]">
      <p style={{ color: "#FFFFFF", fontWeight: 600, fontSize: "18px", lineHeight: 1.3, fontFamily: "Inter, sans-serif" }}>
        {label}
      </p>
      <p style={{ color: "rgba(255,255,255,0.65)", fontWeight: 400, fontSize: "13px", marginTop: "4px", fontFamily: "Inter, sans-serif" }}>
        {subtitle}
      </p>
    </div>

    {/* Visualization */}
    <div className="flex-1" style={{ height: "110px" }}>
      <Plane />
    </div>
  </motion.div>
);

/* ─── MAIN SECTION ─── */
const ManifestoSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const headlineOpacity = useTransform(scrollYProgress, [0.06, 0.22], [0, 1]);
  const headlineY = useTransform(scrollYProgress, [0.06, 0.22], [36, 0]);

  return (
    <section
      ref={containerRef}
      className="relative py-32 md:py-40 lg:py-48 overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at 70% 50%, rgba(123,97,255,0.25) 0%, transparent 60%),
          radial-gradient(circle at 60% 50%, #5B2D91 0%, #3B0E70 40%, #1E0033 100%)
        `,
        backgroundSize: '120% 120%',
        animation: 'backgroundShift 18s ease-in-out infinite alternate',
      }}
    >
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-12 lg:gap-16 items-center">
          {/* Left — editorial text */}
          <motion.div style={{ opacity: headlineOpacity, y: headlineY }}>
            <p className="mb-10" style={{
              color: "rgba(255,255,255,0.6)",
              letterSpacing: "0.18em",
              fontSize: "12px",
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              textTransform: "uppercase",
            }}>
              THE INTELLIGENCE LAYER
            </p>
            <h2 style={{
              color: "#F8F6FF",
              fontWeight: 800,
              fontSize: "clamp(42px, 5vw, 78px)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              fontFamily: "Inter, sans-serif",
            }}>
              Healthcare runs on
              <br />
              intelligence now.
            </h2>
            <p style={{
              color: "rgba(255,255,255,0.88)",
              fontWeight: 400,
              fontSize: "18px",
              lineHeight: 1.6,
              maxWidth: "520px",
              marginTop: "28px",
              fontFamily: "Inter, sans-serif",
            }}>
              Three system planes running beneath every clinical workflow —
              reasoning, orchestration, and sovereign data governance — engineered
              as infrastructure, not features.
            </p>
          </motion.div>

          {/* Right — unified system frame */}
          <div className="relative flex items-center justify-center">
            <div
              style={{
                width: "100%",
                minHeight: "70vh",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "28px",
                background: "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              {layerData.map((layer, i) => (
                <SystemPlaneRow
                  key={layer.label}
                  label={layer.label}
                  subtitle={layer.subtitle}
                  Plane={layer.Plane}
                  index={i}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManifestoSection;
