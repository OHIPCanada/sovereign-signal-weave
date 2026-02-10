import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface LayerConfig {
  label: string;
  subtitle: string;
}

const layers: LayerConfig[] = [
  { label: "AI Cortex", subtitle: "Reasoning · Context · Decision Support" },
  { label: "Workflow Orchestration", subtitle: "Routing · Decisions · Clinical Ops" },
  { label: "Sovereign Data Plane", subtitle: "Storage · Policy · Jurisdictional Control" },
];

/* ─── AI CORTEX ─── compact neural mesh, thinking pulses toward center */
const CortexMesh = () => {
  const center = { cx: 320, cy: 55 };
  const satellites = [
    { cx: 240, cy: 30 },
    { cx: 260, cy: 80 },
    { cx: 310, cy: 22 },
    { cx: 340, cy: 85 },
    { cx: 380, cy: 25 },
    { cx: 400, cy: 75 },
    { cx: 420, cy: 45 },
  ];
  const edges: [number, number][] = [
    [0, 2], [2, 4], [4, 6], [6, 5], [5, 3], [3, 1], [1, 0],
    [0, 3], [2, 5], [4, 5],
  ];

  const lineColor = "rgba(230, 230, 250, 0.75)";
  const nodeBase = "rgba(255, 255, 255, 0.65)";
  const nodeCore = "rgba(255, 255, 255, 0.85)";
  const pulseColor = "rgba(255, 255, 255, 0.9)";

  // Pulses travel from satellites toward center, one at a time
  const pulses = satellites.map((s, i) => ({
    from: s, to: center, delay: i * 3,
  }));
  const totalCycle = pulses.length * 3;

  return (
    <svg viewBox="0 0 640 110" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
      {/* Connections: center to each satellite */}
      {satellites.map((s, i) => (
        <line key={`r-${i}`} x1={center.cx} y1={center.cy} x2={s.cx} y2={s.cy}
          stroke={lineColor} strokeWidth="2.5" strokeLinecap="round" />
      ))}
      {/* Cross-connections */}
      {edges.map(([a, b], i) => (
        <line key={`x-${i}`} x1={satellites[a].cx} y1={satellites[a].cy}
          x2={satellites[b].cx} y2={satellites[b].cy}
          stroke={lineColor} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      ))}

      {/* Core node — largest */}
      <circle cx={center.cx} cy={center.cy} r="10" fill={nodeCore} />

      {/* Satellite nodes */}
      {satellites.map((s, i) => (
        <circle key={`n-${i}`} cx={s.cx} cy={s.cy} r="5" fill={nodeBase} />
      ))}

      {/* Signal pulses — one at a time, traveling toward center */}
      {pulses.map((p, i) => (
        <g key={`p-${i}`}>
          <circle r="4" fill={pulseColor}>
            <animate attributeName="cx" values={`${p.from.cx};${p.to.cx}`}
              dur="2.5s" begin={`${p.delay}s`} repeatCount="indefinite"
              calcMode="spline" keySplines="0.4 0 0.2 1" />
            <animate attributeName="cy" values={`${p.from.cy};${p.to.cy}`}
              dur="2.5s" begin={`${p.delay}s`} repeatCount="indefinite"
              calcMode="spline" keySplines="0.4 0 0.2 1" />
            <animate attributeName="opacity" values="0;0.9;0.9;0"
              keyTimes="0;0.1;0.8;1" dur="2.5s" begin={`${p.delay}s`}
              repeatCount="indefinite" />
          </circle>
          {/* Center brightens on arrival */}
          <circle cx={center.cx} cy={center.cy} r="10" fill={pulseColor} opacity="0">
            <animate attributeName="opacity" values="0;0;0.5;0"
              keyTimes="0;0.75;0.9;1" dur="2.5s" begin={`${p.delay}s`}
              repeatCount="indefinite" />
          </circle>
        </g>
      ))}
    </svg>
  );
};

/* ─── WORKFLOW ORCHESTRATION ─── 3 parallel lanes, left→right routing */
const OrchestrationMesh = () => {
  const lanes = [
    { y: 28 },
    { y: 55 },
    { y: 82 },
  ];
  const lineColor = "rgba(230, 230, 250, 0.70)";
  const nodeColor = "rgba(255, 255, 255, 0.75)";
  const pulseColor = "rgba(255, 255, 255, 0.85)";

  // Handoff columns — vertical connectors between lanes
  const handoffX = [180, 340, 500];

  return (
    <svg viewBox="0 0 640 110" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
      {/* Horizontal lanes */}
      {lanes.map((l, i) => (
        <line key={`lane-${i}`} x1="60" y1={l.y} x2="600" y2={l.y}
          stroke={lineColor} strokeWidth="2" strokeLinecap="round" />
      ))}

      {/* Vertical handoff connectors */}
      {handoffX.map((x, i) => (
        <line key={`v-${i}`} x1={x} y1={lanes[0].y} x2={x} y2={lanes[2].y}
          stroke={lineColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      ))}

      {/* Handoff nodes at intersections */}
      {handoffX.map((x, hi) =>
        lanes.map((l, li) => (
          <circle key={`hn-${hi}-${li}`} cx={x} cy={l.y} r="5" fill={nodeColor} />
        ))
      )}

      {/* Left→right traveling pulses, staggered per lane */}
      {lanes.map((l, i) => (
        <circle key={`pulse-${i}`} r="4" fill={pulseColor} cy={l.y}>
          <animate attributeName="cx" values="60;600" dur="4.5s"
            begin={`${i * 0.8}s`} repeatCount="indefinite"
            calcMode="linear" />
          <animate attributeName="opacity" values="0;0.85;0.85;0"
            keyTimes="0;0.05;0.9;1" dur="4.5s"
            begin={`${i * 0.8}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
};

/* ─── SOVEREIGN DATA PLANE ─── single heavy spine, near-static */
const SovereignMesh = () => {
  const lineColor = "rgba(230, 230, 250, 0.60)";
  const nodeColor = "rgba(255, 255, 255, 0.70)";
  const pulseColor = "rgba(255, 255, 255, 0.55)";

  const nodes = [
    { cx: 200, cy: 55, r: 11 },
    { cx: 380, cy: 55, r: 10 },
    { cx: 520, cy: 55, r: 8 },
  ];

  return (
    <svg viewBox="0 0 640 110" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
      {/* Single heavy horizontal spine */}
      <line x1="100" y1="55" x2="580" y2="55"
        stroke={lineColor} strokeWidth="3" strokeLinecap="round" />

      {/* Nodes — heavy, monolithic */}
      {nodes.map((n, i) => (
        <circle key={`sn-${i}`} cx={n.cx} cy={n.cy} r={n.r} fill={nodeColor} />
      ))}

      {/* Very slow brightness pulse — 7s, near-static */}
      {nodes.map((n, i) => (
        <circle key={`glow-${i}`} cx={n.cx} cy={n.cy} r={n.r + 4} fill="none"
          stroke={pulseColor} strokeWidth="2" opacity="0">
          <animate attributeName="opacity" values="0;0.4;0"
            dur="7s" begin={`${i * 2.5}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
};

/* ─── CARD STYLES per layer ─── */
const cardStyles = [
  {
    // AI Cortex — brightest
    bg: "rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(230, 230, 250, 0.26)",
    shadow: "0 20px 60px rgba(10, 5, 25, 0.35)",
  },
  {
    // Orchestration — neutral
    bg: "rgba(255, 255, 255, 0.06)",
    border: "1px solid rgba(230, 230, 250, 0.18)",
    shadow: "0 18px 55px rgba(10, 5, 25, 0.38)",
  },
  {
    // Sovereign — darkest
    bg: "rgba(255, 255, 255, 0.025)",
    border: "1px solid rgba(230, 230, 250, 0.1)",
    shadow: "0 18px 60px rgba(10, 5, 25, 0.48)",
  },
];

const labelColors = [
  "rgba(235, 230, 255, 0.95)",
  "rgba(225, 220, 250, 0.9)",
  "rgba(210, 205, 240, 0.85)",
];

const LayerPanel = ({ layer, index }: { layer: LayerConfig; index: number }) => {
  const style = cardStyles[index];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
      className="relative rounded-[18px] overflow-hidden"
      style={{
        background: style.bg,
        border: style.border,
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        boxShadow: style.shadow,
      }}
    >
      {/* Mesh visualization */}
      <div className="relative h-[140px] md:h-[150px] overflow-hidden">
        {index === 0 && <CortexMesh />}
        {index === 1 && <OrchestrationMesh />}
        {index === 2 && <SovereignMesh />}
      </div>

      {/* Label */}
      <div className="relative px-5 pb-5 pt-1.5 flex items-center justify-between">
        <div>
          <span
            className="text-[14px] md:text-[16px] font-semibold tracking-[0.04em]"
            style={{ color: labelColors[index] }}
          >
            {layer.label}
          </span>
          <p
            className="text-[10px] md:text-[11px] mt-0.5 tracking-wide"
            style={{ color: "rgba(190, 180, 220, 0.75)" }}
          >
            {layer.subtitle}
          </p>
        </div>
        <div
          className="px-2.5 py-1 rounded-full text-[9px] md:text-[10px] font-medium tracking-wider uppercase"
          style={{
            background: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(230, 230, 250, 0.12)",
            color: "rgba(200, 190, 240, 0.6)",
          }}
        >
          Active
        </div>
      </div>
    </motion.div>
  );
};

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
          radial-gradient(50% 50% at 70% 45%, rgba(230,230,250,0.18), transparent 65%),
          linear-gradient(135deg, #2D1B4E 0%, #3A1F6B 100%)
        `,
        color: "rgba(237, 235, 255, 0.92)",
      }}
    >
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20 items-center">
          {/* Left column — text */}
          <motion.div style={{ opacity: headlineOpacity, y: headlineY }}>
            <p className="mono-label mb-5" style={{ color: "rgba(160, 150, 200, 0.5)" }}>
              THE INTELLIGENCE LAYER
            </p>
            <h2
              className="text-[26px] md:text-[34px] lg:text-[42px] font-bold leading-[1.15] tracking-tight mb-6"
              style={{ color: "rgba(235, 230, 255, 0.95)" }}
            >
              We are the layer
              <br />
              under everything.
            </h2>
            <p
              className="text-[14px] md:text-[16px] leading-relaxed max-w-md"
              style={{ color: "rgba(190, 180, 220, 0.7)" }}
            >
              Three system planes running beneath every clinical workflow —
              reasoning, orchestration, and sovereign data governance — engineered
              as infrastructure, not features.
            </p>
          </motion.div>

          {/* Right column — layer stack */}
          <div className="relative">
            <div
              className="absolute pointer-events-none"
              style={{
                top: "-10%", left: "5%", width: "90%", height: "120%",
                background: "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(160, 130, 240, 0.12) 0%, transparent 65%)",
              }}
            />
            {/* Increased spacing: space-y-6 */}
            <div className="relative z-10 space-y-6 md:space-y-7">
              {layers.map((layer, i) => (
                <LayerPanel key={layer.label} layer={layer} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManifestoSection;
