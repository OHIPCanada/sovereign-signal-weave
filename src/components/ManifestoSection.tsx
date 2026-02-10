import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface MeshNode {
  id: string;
  cx: number;
  cy: number;
  r: number;
  isCore: boolean;
}

interface MeshEdge {
  from: string;
  to: string;
}

interface MeshConfig {
  nodes: MeshNode[];
  edges: MeshEdge[];
  pulseDelay: number; // seconds between signal propagations
  pulseDuration: number; // seconds for one pulse traverse
}

interface LayerConfig {
  label: string;
  subtitle: string;
  lineColor: string;
  nodeColor: string;
  coreNodeColor: string;
  glowColor: string;
  mesh: MeshConfig;
}

// AI Cortex — denser mesh, 2 core reasoning hubs, faster signal
const cortexMesh: MeshConfig = {
  nodes: [
    { id: "c1", cx: 80, cy: 30, r: 3, isCore: false },
    { id: "c2", cx: 160, cy: 55, r: 3.5, isCore: false },
    { id: "c3", cx: 250, cy: 25, r: 3, isCore: false },
    { id: "c4", cx: 320, cy: 48, r: 7, isCore: true },
    { id: "c5", cx: 400, cy: 22, r: 3, isCore: false },
    { id: "c6", cx: 430, cy: 65, r: 3.5, isCore: false },
    { id: "c7", cx: 510, cy: 42, r: 6, isCore: true },
    { id: "c8", cx: 570, cy: 70, r: 3, isCore: false },
    { id: "c9", cx: 590, cy: 20, r: 2.5, isCore: false },
  ],
  edges: [
    { from: "c1", to: "c2" },
    { from: "c2", to: "c4" },
    { from: "c3", to: "c4" },
    { from: "c4", to: "c5" },
    { from: "c4", to: "c6" },
    { from: "c5", to: "c7" },
    { from: "c6", to: "c7" },
    { from: "c7", to: "c8" },
    { from: "c7", to: "c9" },
    { from: "c1", to: "c3" },
  ],
  pulseDelay: 3,
  pulseDuration: 2.5,
};

// Workflow Orchestration — linear/structured topology, sequential routing
const orchestrationMesh: MeshConfig = {
  nodes: [
    { id: "o1", cx: 90, cy: 45, r: 3, isCore: false },
    { id: "o2", cx: 190, cy: 28, r: 3, isCore: false },
    { id: "o3", cx: 260, cy: 55, r: 5.5, isCore: true },
    { id: "o4", cx: 340, cy: 35, r: 3, isCore: false },
    { id: "o5", cx: 430, cy: 50, r: 5.5, isCore: true },
    { id: "o6", cx: 510, cy: 30, r: 3, isCore: false },
    { id: "o7", cx: 580, cy: 60, r: 3, isCore: false },
  ],
  edges: [
    { from: "o1", to: "o2" },
    { from: "o2", to: "o3" },
    { from: "o3", to: "o4" },
    { from: "o4", to: "o5" },
    { from: "o5", to: "o6" },
    { from: "o5", to: "o7" },
    { from: "o1", to: "o3" },
    { from: "o6", to: "o7" },
  ],
  pulseDelay: 4,
  pulseDuration: 3,
};

// Sovereign Data Plane — minimal, heavy, near-static
const sovereignMesh: MeshConfig = {
  nodes: [
    { id: "s1", cx: 140, cy: 40, r: 4, isCore: false },
    { id: "s2", cx: 280, cy: 50, r: 8, isCore: true },
    { id: "s3", cx: 420, cy: 45, r: 4, isCore: false },
    { id: "s4", cx: 520, cy: 55, r: 7, isCore: true },
    { id: "s5", cx: 350, cy: 25, r: 3, isCore: false },
    { id: "s6", cx: 200, cy: 65, r: 3, isCore: false },
  ],
  edges: [
    { from: "s1", to: "s2" },
    { from: "s2", to: "s3" },
    { from: "s3", to: "s4" },
    { from: "s2", to: "s5" },
    { from: "s1", to: "s6" },
    { from: "s5", to: "s3" },
  ],
  pulseDelay: 5,
  pulseDuration: 4,
};

const layers: LayerConfig[] = [
  {
    label: "AI Cortex",
    subtitle: "Reasoning · Context · Decision Support",
    lineColor: "rgba(210, 200, 245, 0.25)",
    nodeColor: "rgba(210, 200, 245, 0.35)",
    coreNodeColor: "rgba(235, 225, 255, 0.55)",
    glowColor: "rgba(230, 220, 255, 0.12)",
    mesh: cortexMesh,
  },
  {
    label: "Workflow Orchestration",
    subtitle: "Routing · Decisions · Clinical Ops",
    lineColor: "rgba(190, 175, 230, 0.22)",
    nodeColor: "rgba(190, 175, 230, 0.3)",
    coreNodeColor: "rgba(215, 205, 245, 0.5)",
    glowColor: "rgba(200, 185, 235, 0.08)",
    mesh: orchestrationMesh,
  },
  {
    label: "Sovereign Data Plane",
    subtitle: "Storage · Policy · Jurisdictional Control",
    lineColor: "rgba(160, 145, 210, 0.2)",
    nodeColor: "rgba(160, 145, 210, 0.25)",
    coreNodeColor: "rgba(185, 170, 230, 0.45)",
    glowColor: "rgba(160, 145, 210, 0.06)",
    mesh: sovereignMesh,
  },
];

const NeuralMesh = ({ layer, index }: { layer: LayerConfig; index: number }) => {
  const { mesh } = layer;
  const nodeMap = Object.fromEntries(mesh.nodes.map((n) => [n.id, n]));

  // Build pulse paths: each edge becomes a signal route
  const totalCycleDuration = mesh.pulseDelay * mesh.edges.length + mesh.pulseDuration;

  return (
    <svg
      viewBox="0 0 640 90"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <filter id={`inner-glow-${index}`}>
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id={`line-blur-${index}`}>
          <feGaussianBlur stdDeviation="0.5" />
        </filter>
      </defs>

      {/* Background structural grid — very faint */}
      <g opacity="0.03">
        {[0, 30, 60, 90].map((y) => (
          <line key={`hg-${y}`} x1="0" y1={y} x2="640" y2={y} stroke="rgba(200,190,240,1)" strokeWidth="0.5" />
        ))}
        {[0, 80, 160, 240, 320, 400, 480, 560, 640].map((x) => (
          <line key={`vg-${x}`} x1={x} y1="0" x2={x} y2="90" stroke="rgba(200,190,240,1)" strokeWidth="0.5" />
        ))}
      </g>

      {/* Connection lines — 1px, low opacity, intentional paths */}
      {mesh.edges.map((edge, ei) => {
        const from = nodeMap[edge.from];
        const to = nodeMap[edge.to];
        if (!from || !to) return null;

        return (
          <line
            key={`edge-${ei}`}
            x1={from.cx}
            y1={from.cy}
            x2={to.cx}
            y2={to.cy}
            stroke={layer.lineColor}
            strokeWidth="1"
            strokeLinecap="round"
          />
        );
      })}

      {/* Nodes */}
      {mesh.nodes.map((node) => (
        <g key={node.id}>
          {/* Inner glow for core nodes */}
          {node.isCore && (
            <circle
              cx={node.cx}
              cy={node.cy}
              r={node.r + 4}
              fill={layer.glowColor}
              filter={`url(#inner-glow-${index})`}
            />
          )}
          {/* Node circle */}
          <circle
            cx={node.cx}
            cy={node.cy}
            r={node.r}
            fill={node.isCore ? layer.coreNodeColor : layer.nodeColor}
          />
        </g>
      ))}

      {/* Signal propagation — one pulse per edge, staggered */}
      {mesh.edges.map((edge, ei) => {
        const from = nodeMap[edge.from];
        const to = nodeMap[edge.to];
        if (!from || !to) return null;

        const startDelay = ei * mesh.pulseDelay;
        const dur = mesh.pulseDuration;

        return (
          <g key={`pulse-${ei}`}>
            {/* Traveling pulse dot */}
            <circle r="2" fill={layer.coreNodeColor}>
              <animate
                attributeName="cx"
                values={`${from.cx};${to.cx}`}
                dur={`${dur}s`}
                begin={`${startDelay}s`}
                repeatCount="indefinite"
                calcMode="spline"
                keySplines="0.4 0 0.2 1"
              />
              <animate
                attributeName="cy"
                values={`${from.cy};${to.cy}`}
                dur={`${dur}s`}
                begin={`${startDelay}s`}
                repeatCount="indefinite"
                calcMode="spline"
                keySplines="0.4 0 0.2 1"
              />
              <animate
                attributeName="opacity"
                values="0;0.8;0.8;0"
                keyTimes="0;0.1;0.85;1"
                dur={`${dur}s`}
                begin={`${startDelay}s`}
                repeatCount="indefinite"
              />
            </circle>

            {/* Destination node brightens on pulse arrival */}
            <circle
              cx={to.cx}
              cy={to.cy}
              r={nodeMap[to.id]?.r ?? 3}
              fill={layer.coreNodeColor}
              opacity="0"
            >
              <animate
                attributeName="opacity"
                values="0;0;0.7;0"
                keyTimes="0;0.75;0.9;1"
                dur={`${dur}s`}
                begin={`${startDelay}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        );
      })}
    </svg>
  );
};

const LayerPanel = ({ layer, index }: { layer: LayerConfig; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
      className="relative rounded-[18px] overflow-hidden"
      style={{
        background:
          index === 0
            ? "rgba(255, 255, 255, 0.09)"
            : index === 2
            ? "rgba(255, 255, 255, 0.035)"
            : "rgba(255, 255, 255, 0.06)",
        border:
          index === 0
            ? "1px solid rgba(230, 230, 250, 0.24)"
            : index === 2
            ? "1px solid rgba(230, 230, 250, 0.12)"
            : "1px solid rgba(230, 230, 250, 0.18)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        boxShadow:
          index === 0
            ? "0 18px 60px rgba(10, 5, 25, 0.4)"
            : index === 2
            ? "0 18px 60px rgba(10, 5, 25, 0.45)"
            : "0 18px 60px rgba(10, 5, 25, 0.35)",
      }}
    >
      {/* Animated neural mesh */}
      <div className="relative h-[110px] md:h-[120px] overflow-hidden">
        <NeuralMesh layer={layer} index={index} />
      </div>

      {/* Label chip */}
      <div className="relative px-5 pb-4 pt-1 flex items-center justify-between">
        <div>
          <span
            className="text-[13px] md:text-[15px] font-semibold tracking-[0.05em]"
            style={{ color: "rgba(230, 225, 255, 0.92)" }}
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
      {/* Content grid: left text + right stack */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20 items-center">
          {/* Left column — text */}
          <motion.div style={{ opacity: headlineOpacity, y: headlineY }}>
            <p
              className="mono-label mb-5"
              style={{ color: "rgba(160, 150, 200, 0.5)" }}
            >
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
            {/* Power glow behind stack */}
            <div
              className="absolute pointer-events-none"
              style={{
                top: "-10%",
                left: "5%",
                width: "90%",
                height: "120%",
                background:
                  "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(160, 130, 240, 0.12) 0%, transparent 65%)",
              }}
            />

            <div className="relative z-10 space-y-4 md:space-y-5">
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
