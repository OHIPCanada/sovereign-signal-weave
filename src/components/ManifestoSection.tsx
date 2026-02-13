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

/* ─── AI CORTEX ─── prominent neural mesh, all paths converge to center */
const CortexMesh = () => {
  const center = { cx: 320, cy: 55 };
  // 8 peripheral nodes in a single ring around center
  const nodes = [
    { cx: 240, cy: 30 },
    { cx: 260, cy: 82 },
    { cx: 310, cy: 95 },
    { cx: 370, cy: 92 },
    { cx: 400, cy: 55 },
    { cx: 385, cy: 20 },
    { cx: 320, cy: 12 },
    { cx: 255, cy: 18 },
  ];

  const lineColor = "rgba(235, 230, 255, 0.85)";
  const nodeColor = "rgba(255, 255, 255, 0.95)";
  const coreColor = "rgba(255, 255, 255, 0.95)";
  const pulseColor = "rgba(220, 210, 255, 1)";

  // Cross-connections between adjacent peripheral nodes
  const crossEdges: [number, number][] = [
    [0, 7], [7, 6], [6, 5], [5, 4], [4, 3], [3, 2], [2, 1], [1, 0],
    [0, 6], [1, 3], [5, 7], [2, 4],
  ];

  // Pulses: only 4 nodes pulse, staggered, infrequent
  const pulseIndices = [0, 2, 4, 6];

  return (
    <svg viewBox="0 0 640 110" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="cortex-glow">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* All nodes connect to center — strong convergence */}
      {nodes.map((n, i) => (
        <line key={`cc-${i}`} x1={center.cx} y1={center.cy} x2={n.cx} y2={n.cy}
          stroke={lineColor} strokeWidth="2.5" strokeLinecap="round" />
      ))}
      {/* Cross-connections between peripherals */}
      {crossEdges.map(([a, b], i) => (
        <line key={`ce-${i}`} x1={nodes[a].cx} y1={nodes[a].cy}
          x2={nodes[b].cx} y2={nodes[b].cy}
          stroke={lineColor} strokeWidth="2" strokeLinecap="round" opacity="0.65" />
      ))}

      {/* Center core — large, 30-40% bigger than before (r=18) */}
      <circle cx={center.cx} cy={center.cy} r="18" fill={coreColor} filter="url(#cortex-glow)" />
      <circle cx={center.cx} cy={center.cy} r="10" fill="rgba(200, 190, 255, 0.5)" />

      {/* Peripheral nodes */}
      {nodes.map((n, i) => (
        <circle key={`n-${i}`} cx={n.cx} cy={n.cy} r="6" fill={nodeColor} />
      ))}

      {/* Pulses toward center — only 4, staggered every 3.5s */}
      {pulseIndices.map((idx, i) => (
        <g key={`p-${i}`}>
          <circle r="5" fill={pulseColor} filter="url(#cortex-glow)">
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
          {/* Center flash on arrival */}
          <circle cx={center.cx} cy={center.cy} r="22" fill={pulseColor} opacity="0">
            <animate attributeName="opacity" values="0;0;0.3;0"
              keyTimes="0;0.75;0.9;1" dur="2.5s" begin={`${i * 3.5}s`}
              repeatCount="indefinite" />
          </circle>
        </g>
      ))}
    </svg>
  );
};

/* ─── WORKFLOW ORCHESTRATION ─── 3 lanes with offset handoffs + divergence */
const OrchestrationMesh = () => {
  const lanes = [
    { y: 28 },
    { y: 55 },
    { y: 82 },
  ];
  const lineColor = "rgba(235, 230, 255, 0.85)";
  const nodeColor = "rgba(255, 255, 255, 0.95)";
  const pulseColor = "rgba(255, 255, 255, 0.85)";

  // Offset node positions per lane (not vertically aligned)
  const laneNodes = [
    [{ x: 150 }, { x: 320 }, { x: 490 }],        // lane 1
    [{ x: 190 }, { x: 360 }, { x: 530 }],        // lane 2
    [{ x: 130 }, { x: 280 }, { x: 460 }],        // lane 3
  ];

  // Decision divergence: lane 1 node 2 → lane 2 node 2
  const divergeFrom = { x: 320, y: lanes[0].y };
  const divergeTo = { x: 360, y: lanes[1].y };

  // Lane speeds: slow, medium, slowest
  const laneSpeeds = ["6s", "4.5s", "7.5s"];

  return (
    <svg viewBox="0 0 640 110" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
      {/* Horizontal lanes */}
      {lanes.map((l, i) => (
        <line key={`lane-${i}`} x1="60" y1={l.y} x2="600" y2={l.y}
          stroke={lineColor} strokeWidth="2" strokeLinecap="round" />
      ))}

      {/* Decision divergence line (lane 1 → lane 2) */}
      <line x1={divergeFrom.x} y1={divergeFrom.y} x2={divergeTo.x} y2={divergeTo.y}
        stroke={lineColor} strokeWidth="2" strokeLinecap="round" strokeDasharray="6 4" />

      {/* Nodes at offset positions */}
      {laneNodes.map((nodes, li) =>
        nodes.map((n, ni) => (
          <circle key={`n-${li}-${ni}`} cx={n.x} cy={lanes[li].y} r="5" fill={nodeColor} />
        ))
      )}

      {/* Divergence node highlight */}
      <circle cx={divergeFrom.x} cy={divergeFrom.y} r="6" fill={nodeColor} />
      <circle cx={divergeTo.x} cy={divergeTo.y} r="6" fill={nodeColor} />

      {/* Left→right pulses, different speeds per lane */}
      {lanes.map((l, i) => (
        <circle key={`pulse-${i}`} r="4" fill={pulseColor} cy={l.y}>
          <animate attributeName="cx" values="60;600" dur={laneSpeeds[i]}
            begin={`${i * 0.6}s`} repeatCount="indefinite" calcMode="linear" />
          <animate attributeName="opacity" values="0;0.85;0.85;0"
            keyTimes="0;0.05;0.9;1" dur={laneSpeeds[i]}
            begin={`${i * 0.6}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
};

/* ─── SOVEREIGN DATA PLANE ─── heavy immovable spine, near-static */
const SovereignMesh = () => {
  const lineColor = "rgba(235, 230, 255, 0.85)";
  const nodeColor = "rgba(255, 255, 255, 0.95)";

  const nodes = [
    { cx: 200, cy: 55, r: 13 },
    { cx: 380, cy: 55, r: 12 },
    { cx: 530, cy: 55, r: 10 },
  ];

  return (
    <svg viewBox="0 0 640 110" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
      {/* Single heavy spine — 4px, thickest of all */}
      <line x1="100" y1="55" x2="580" y2="55"
        stroke={lineColor} strokeWidth="4" strokeLinecap="round" />

      {/* Heavy nodes — larger for gravitas */}
      {nodes.map((n, i) => (
        <circle key={`sn-${i}`} cx={n.cx} cy={n.cy} r={n.r + 2} fill={nodeColor} />
      ))}

      {/* Very slow opacity pulse — 9s, minimal glow */}
      {nodes.map((n, i) => (
        <circle key={`glow-${i}`} cx={n.cx} cy={n.cy} r={n.r + 3} fill="none"
          stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.5" opacity="0">
          <animate attributeName="opacity" values="0;0.3;0"
            dur="9s" begin={`${i * 3}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
};

/* ─── CARD STYLES per layer ─── */
const cardStyles = [
  {
    // AI Cortex — smartest: brightest glass, lightest feel
    bg: "rgba(100, 60, 155, 0.42)",
    border: "1px solid rgba(255, 255, 255, 0.14)",
    shadow: "0 20px 60px rgba(10, 5, 25, 0.3)",
  },
  {
    // Orchestration — busiest: neutral mid-tone
    bg: "rgba(85, 48, 135, 0.45)",
    border: "1px solid rgba(255, 255, 255, 0.11)",
    shadow: "0 18px 55px rgba(10, 5, 25, 0.38)",
  },
  {
    // Sovereign — heaviest: darkest, densest
    bg: "rgba(70, 38, 120, 0.52)",
    border: "1px solid rgba(255, 255, 255, 0.09)",
    shadow: "0 22px 65px rgba(10, 5, 25, 0.55)",
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
