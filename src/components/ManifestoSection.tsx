import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ─── AI CORTEX ─── neural mesh with converging pulses */
const CortexPlane = () => {
  const center = { cx: 300, cy: 60 };
  const nodes = [
    { cx: 140, cy: 25 }, { cx: 180, cy: 85 }, { cx: 230, cy: 30 },
    { cx: 260, cy: 90 }, { cx: 340, cy: 90 }, { cx: 370, cy: 30 },
    { cx: 420, cy: 85 }, { cx: 460, cy: 25 }, { cx: 200, cy: 55 },
    { cx: 400, cy: 55 }, { cx: 280, cy: 20 }, { cx: 320, cy: 95 },
  ];

  const crossEdges: [number, number][] = [
    [0, 2], [2, 10], [10, 5], [5, 7], [7, 9], [9, 5],
    [0, 8], [8, 1], [1, 3], [3, 11], [11, 4], [4, 6], [6, 9],
    [8, 2], [3, 8], [4, 9], [11, 3], [10, 11],
  ];

  const pulseIndices = [0, 3, 7, 10];

  return (
    <svg viewBox="0 0 600 120" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="cortex-glow-v2">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Connections to center */}
      {nodes.map((n, i) => (
        <line key={`cc-${i}`} x1={center.cx} y1={center.cy} x2={n.cx} y2={n.cy}
          stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round">
          <animate attributeName="opacity" values="0.4;0.7;0.4" dur="6s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
        </line>
      ))}

      {/* Cross connections */}
      {crossEdges.map(([a, b], i) => (
        <line key={`ce-${i}`} x1={nodes[a].cx} y1={nodes[a].cy}
          x2={nodes[b].cx} y2={nodes[b].cy}
          stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      ))}

      {/* Center core with glow */}
      <circle cx={center.cx} cy={center.cy} r="16" fill="url(#cortex-core-grad)" filter="url(#cortex-glow-v2)">
        <animate attributeName="r" values="16;18.5;16" dur="4s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
      </circle>
      <defs>
        <radialGradient id="cortex-core-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#7B61FF" />
        </radialGradient>
      </defs>

      {/* Peripheral nodes */}
      {nodes.map((n, i) => (
        <circle key={`n-${i}`} cx={n.cx} cy={n.cy} r="4" fill="rgba(255,255,255,0.8)" />
      ))}

      {/* Converging pulses */}
      {pulseIndices.map((idx, i) => (
        <circle key={`p-${i}`} r="3.5" fill="rgba(255,255,255,0.85)" filter="url(#cortex-glow-v2)">
          <animate attributeName="cx" values={`${nodes[idx].cx};${center.cx}`}
            dur="2.5s" begin={`${i * 3.5}s`} repeatCount="indefinite"
            calcMode="spline" keySplines="0.4 0 0.2 1" />
          <animate attributeName="cy" values={`${nodes[idx].cy};${center.cy}`}
            dur="2.5s" begin={`${i * 3.5}s`} repeatCount="indefinite"
            calcMode="spline" keySplines="0.4 0 0.2 1" />
          <animate attributeName="opacity" values="0;0.9;0.8;0"
            keyTimes="0;0.1;0.8;1" dur="2.5s" begin={`${i * 3.5}s`}
            repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
};

/* ─── WORKFLOW ORCHESTRATION ─── 3 horizontal rails with traveling nodes */
const OrchestrationPlane = () => {
  const rails = [
    { y: 25, speed: "18s" },
    { y: 60, speed: "22s" },
    { y: 95, speed: "26s" },
  ];

  const railNodes = [
    [{ x: 120 }, { x: 260 }, { x: 400 }, { x: 520 }],
    [{ x: 80 }, { x: 200 }, { x: 350 }, { x: 480 }],
    [{ x: 150 }, { x: 300 }, { x: 430 }],
  ];

  // Decision divergence path
  const diverge = { from: { x: 260, y: 25 }, to: { x: 200, y: 60 } };

  return (
    <svg viewBox="0 0 600 120" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="orch-node-glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Horizontal rails */}
      {rails.map((r, i) => (
        <line key={`rail-${i}`} x1="40" y1={r.y} x2="570" y2={r.y}
          stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" />
      ))}

      {/* Divergence path */}
      <line x1={diverge.from.x} y1={diverge.from.y} x2={diverge.to.x} y2={diverge.to.y}
        stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeDasharray="6 4" />

      {/* Fixed nodes */}
      {railNodes.map((nodes, ri) =>
        nodes.map((n, ni) => (
          <circle key={`n-${ri}-${ni}`} cx={n.x} cy={rails[ri].y} r="5"
            fill="rgba(255,255,255,0.9)" filter="url(#orch-node-glow)" />
        ))
      )}

      {/* Traveling pulses at different speeds */}
      {rails.map((r, i) => (
        <circle key={`pulse-${i}`} r="4" fill="rgba(255,255,255,0.8)" cy={r.y}>
          <animate attributeName="cx" values="40;570" dur={r.speed}
            begin={`${i * 1.2}s`} repeatCount="indefinite" calcMode="linear" />
          <animate attributeName="opacity" values="0;0.85;0.85;0"
            keyTimes="0;0.05;0.9;1" dur={r.speed}
            begin={`${i * 1.2}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
};

/* ─── SOVEREIGN DATA PLANE ─── single heavy spine, near-static */
const SovereignPlane = () => {
  const nodes = [
    { cx: 120, cy: 60, r: 7 },
    { cx: 300, cy: 60, r: 9 },
    { cx: 480, cy: 60, r: 6 },
  ];

  return (
    <svg viewBox="0 0 600 120" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      {/* Heavy spine */}
      <line x1="60" y1="60" x2="540" y2="60"
        stroke="rgba(255,255,255,0.75)" strokeWidth="3" strokeLinecap="round" />

      {/* Anchor nodes */}
      {nodes.map((n, i) => (
        <g key={`sn-${i}`}>
          <circle cx={n.cx} cy={n.cy} r={n.r} fill="rgba(255,255,255,0.9)" />
          {/* Slow glow pulse */}
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

/* ─── INFRASTRUCTURE BAND ─── label left, plane right, no card */
const InfrastructureBand = ({ label, subtitle, Plane, index }: {
  label: string; subtitle: string; Plane: React.FC; index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ delay: index * 0.18, duration: 0.6, ease: "easeOut" }}
    className="flex items-center gap-6 md:gap-10"
    style={{ height: "120px" }}
  >
    {/* Label — left of plane */}
    <div className="flex-shrink-0 w-[140px] md:w-[180px]">
      <p style={{ color: "#FFFFFF", fontWeight: 600, fontSize: "20px", lineHeight: 1.3 }}>
        {label}
      </p>
      <p style={{ color: "rgba(255,255,255,0.65)", fontWeight: 400, fontSize: "14px", marginTop: "4px" }}>
        {subtitle}
      </p>
    </div>

    {/* Plane visualization — no border, no card, no container */}
    <div className="flex-1 h-full">
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
              fontSize: "clamp(48px, 6vw, 96px)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              fontFamily: "Inter, sans-serif",
            }}>
              Healthcare runs on
              <br />
              intelligence now.
            </h2>
            <p style={{
              color: "rgba(255,255,255,0.82)",
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

          {/* Right — three infrastructure planes */}
          <div className="relative flex flex-col justify-center" style={{ gap: "120px" }}>
            {layerData.map((layer, i) => (
              <InfrastructureBand
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
    </section>
  );
};

export default ManifestoSection;
