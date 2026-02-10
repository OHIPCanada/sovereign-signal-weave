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

/* ─── AI CORTEX ─── compact neural cluster, thinking pulses */
const CortexMesh = () => {
  // Central node + 5 surrounding — compact logic shape
  const center = { cx: 320, cy: 45 };
  const satellites = [
    { cx: 260, cy: 28 },
    { cx: 280, cy: 68 },
    { cx: 360, cy: 25 },
    { cx: 370, cy: 65 },
    { cx: 400, cy: 42 },
  ];
  // Cross-connections between satellites for mesh density
  const extraEdges: [number, number][] = [[0, 2], [1, 3], [2, 4]];

  const lineColor = "rgba(215, 205, 250, 0.28)";
  const nodeBase = "rgba(215, 205, 250, 0.4)";
  const nodeCore = "rgba(240, 232, 255, 0.7)";
  const pulseColor = "rgba(240, 232, 255, 0.85)";

  // Build pulse paths: center→sat, one at a time, 3.5s apart
  const pulsePaths = satellites.map((s, i) => ({
    from: center,
    to: s,
    delay: i * 3.5,
  }));
  // Add cross-connection pulses after satellite pulses
  const crossPulses = extraEdges.map(([a, b], i) => ({
    from: satellites[a],
    to: satellites[b],
    delay: satellites.length * 3.5 + i * 3.5,
  }));
  const allPulses = [...pulsePaths, ...crossPulses];
  const totalCycle = allPulses.length * 3.5;

  return (
    <svg viewBox="0 0 640 90" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="cortex-glow">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* Connections: center to each satellite */}
      {satellites.map((s, i) => (
        <line key={`r-${i}`} x1={center.cx} y1={center.cy} x2={s.cx} y2={s.cy}
          stroke={lineColor} strokeWidth="1" strokeLinecap="round" />
      ))}
      {/* Cross-connections */}
      {extraEdges.map(([a, b], i) => (
        <line key={`x-${i}`} x1={satellites[a].cx} y1={satellites[a].cy}
          x2={satellites[b].cx} y2={satellites[b].cy}
          stroke={lineColor} strokeWidth="0.8" strokeLinecap="round" />
      ))}

      {/* Inner glow on core */}
      <circle cx={center.cx} cy={center.cy} r="14" fill="rgba(230, 220, 255, 0.06)" filter="url(#cortex-glow)" />

      {/* Core node */}
      <circle cx={center.cx} cy={center.cy} r="7" fill={nodeCore} />

      {/* Satellite nodes */}
      {satellites.map((s, i) => (
        <circle key={`n-${i}`} cx={s.cx} cy={s.cy} r="3.5" fill={nodeBase} />
      ))}

      {/* Signal pulses — one path at a time */}
      {allPulses.map((p, i) => (
        <g key={`p-${i}`}>
          <circle r="2.5" fill={pulseColor}>
            <animate attributeName="cx" values={`${p.from.cx};${p.to.cx}`}
              dur="1.8s" begin={`${p.delay}s`} repeatCount="indefinite"
              calcMode="spline" keySplines="0.4 0 0.2 1"
              restart="always" />
            <animate attributeName="cy" values={`${p.from.cy};${p.to.cy}`}
              dur="1.8s" begin={`${p.delay}s`} repeatCount="indefinite"
              calcMode="spline" keySplines="0.4 0 0.2 1" />
            <animate attributeName="opacity" values="0;0.9;0.9;0"
              keyTimes="0;0.15;0.8;1" dur="1.8s" begin={`${p.delay}s`}
              repeatCount="indefinite" />
          </circle>
          {/* Destination node brightens */}
          <circle cx={p.to.cx} cy={p.to.cy} r={p.to === center ? 7 : 3.5}
            fill={pulseColor} opacity="0">
            <animate attributeName="opacity" values="0;0;0.6;0"
              keyTimes="0;0.7;0.88;1" dur="1.8s" begin={`${p.delay}s`}
              repeatCount="indefinite" />
          </circle>
        </g>
      ))}
    </svg>
  );
};

/* ─── WORKFLOW ORCHESTRATION ─── parallel lanes, left→right routing */
const OrchestrationMesh = () => {
  const lanes = [
    { y: 28, width: 1.2, opacity: 0.3 },
    { y: 48, width: 1, opacity: 0.22 },
    { y: 68, width: 0.8, opacity: 0.18 },
  ];
  const lineColor = "rgba(190, 178, 235, 0.25)";
  const nodeColor = "rgba(200, 190, 240, 0.45)";
  const pulseColor = "rgba(220, 210, 250, 0.75)";

  // Handoff nodes — vertically aligned between lanes
  const handoffs = [
    { x: 200, lanes: [0, 1] },
    { x: 360, lanes: [1, 2] },
    { x: 500, lanes: [0, 1, 2] },
  ];

  return (
    <svg viewBox="0 0 640 90" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
      {/* Horizontal lanes */}
      {lanes.map((l, i) => (
        <line key={`lane-${i}`} x1="60" y1={l.y} x2="600" y2={l.y}
          stroke={lineColor} strokeWidth={l.width} strokeLinecap="round" opacity={l.opacity} />
      ))}

      {/* Vertical handoff connectors */}
      {handoffs.map((h, i) => {
        const minLane = Math.min(...h.lanes);
        const maxLane = Math.max(...h.lanes);
        return (
          <line key={`v-${i}`} x1={h.x} y1={lanes[minLane].y} x2={h.x} y2={lanes[maxLane].y}
            stroke={lineColor} strokeWidth="0.7" opacity="0.15" />
        );
      })}

      {/* Handoff nodes */}
      {handoffs.map((h, hi) =>
        h.lanes.map((li) => (
          <circle key={`hn-${hi}-${li}`} cx={h.x} cy={lanes[li].y} r="3" fill={nodeColor} />
        ))
      )}

      {/* Left→right traveling pulses, staggered per lane */}
      {lanes.map((l, i) => (
        <circle key={`pulse-${i}`} r="2" fill={pulseColor} cy={l.y}>
          <animate attributeName="cx" values="60;600" dur="5s"
            begin={`${i * 1.2}s`} repeatCount="indefinite"
            calcMode="spline" keySplines="0.3 0 0.7 1" />
          <animate attributeName="opacity" values="0;0.7;0.7;0"
            keyTimes="0;0.05;0.9;1" dur="5s"
            begin={`${i * 1.2}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
};

/* ─── SOVEREIGN DATA PLANE ─── minimal, heavy, near-static */
const SovereignMesh = () => {
  const lineColor = "rgba(145, 130, 200, 0.2)";
  const nodeColor = "rgba(165, 150, 215, 0.35)";
  const pulseColor = "rgba(180, 165, 225, 0.5)";

  const nodes = [
    { cx: 230, cy: 48, r: 8 },
    { cx: 400, cy: 48, r: 7 },
    { cx: 520, cy: 48, r: 4.5 },
  ];

  return (
    <svg viewBox="0 0 640 90" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
      {/* Single heavy horizontal spine */}
      <line x1="120" y1="48" x2="580" y2="48"
        stroke={lineColor} strokeWidth="1.5" strokeLinecap="round" />

      {/* Nodes — heavy, static */}
      {nodes.map((n, i) => (
        <circle key={`sn-${i}`} cx={n.cx} cy={n.cy} r={n.r} fill={nodeColor} />
      ))}

      {/* Very slow pulse — 8s travel, long pause before repeat */}
      <circle r="2.5" fill={pulseColor}>
        <animate attributeName="cx" values={`${nodes[0].cx};${nodes[1].cx};${nodes[2].cx}`}
          keyTimes="0;0.6;1" dur="8s" begin="0s" repeatCount="indefinite"
          calcMode="spline" keySplines="0.3 0 0.7 1;0.3 0 0.7 1" />
        <animate attributeName="cy" values="48;48;48" dur="8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.5;0.5;0.5;0"
          keyTimes="0;0.05;0.5;0.9;1" dur="8s" begin="0s" repeatCount="indefinite" />
      </circle>

      {/* Node 2 brightens on arrival */}
      <circle cx={nodes[1].cx} cy={nodes[1].cy} r={nodes[1].r} fill={pulseColor} opacity="0">
        <animate attributeName="opacity" values="0;0;0.3;0"
          keyTimes="0;0.5;0.65;0.8" dur="8s" repeatCount="indefinite" />
      </circle>
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
      <div className="relative h-[120px] md:h-[130px] overflow-hidden">
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
            style={{ color: "rgba(160, 150, 200, 0.55)" }}
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
