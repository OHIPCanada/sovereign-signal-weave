import { useState } from "react";
import { motion } from "framer-motion";

/* ─── DATA ─── */
const inputs = [
  { label: "EMR / Clinical Systems", x: 80, y: 420 },
  { label: "Virtual Care", x: 230, y: 440 },
  { label: "Patient Access", x: 380, y: 430 },
  { label: "Labs & Imaging", x: 520, y: 440 },
  { label: "Scheduling", x: 660, y: 420 },
];

const outputs = [
  { label: "Clinical Ops", x: 100, y: 60 },
  { label: "Care Pathways", x: 260, y: 50 },
  { label: "Automation", x: 420, y: 55 },
  { label: "Audit Trails", x: 560, y: 50 },
  { label: "Policy Enforcement", x: 700, y: 60 },
];

const coreNode = { x: 400, y: 240, label: "AI Cortex", subtitle: "Reasoning • Context • Decision Support" };

/* checkpoint dots along routes */
const checkpoints = [
  { cx: 180, cy: 350 },
  { cx: 350, cy: 330 },
  { cx: 500, cy: 345 },
  { cx: 620, cy: 340 },
  { cx: 200, cy: 140 },
  { cx: 350, cy: 130 },
  { cx: 530, cy: 135 },
  { cx: 660, cy: 145 },
];

/* routes for pulses: each is input→checkpoint→core→checkpoint→output */
const pulseRoutes = [
  { points: "80,420 180,350 400,240 200,140 100,60", dur: "6s", delay: "0s" },
  { points: "380,430 350,330 400,240 350,130 260,50", dur: "7s", delay: "2s" },
  { points: "660,420 620,340 400,240 530,135 560,50", dur: "6.5s", delay: "4s" },
];

/* ─── ARCHITECTURE MAP SVG ─── */
const ArchitectureMap = () => {
  const [hoveredRoute, setHoveredRoute] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  const routeTooltips = [
    "Clinical data flows through AI reasoning for real-time decision support.",
    "Patient access routes through contextual intelligence for care pathway optimization.",
    "Scheduling data enforces sovereign governance and audit compliance automatically.",
  ];

  const lineColor = "rgba(100, 75, 160, 0.35)";
  const lineDim = "rgba(100, 75, 160, 0.18)";
  const coreColor = "rgba(212, 97, 107, 0.9)";
  const textStrong = "rgba(30, 20, 50, 0.92)";
  const textSoft = "rgba(50, 40, 70, 0.62)";

  /* Nodes pulse warmer near coral side (right), cooler near purple side (left) */
  const getNodeColor = (x: number) => {
    const t = Math.min(1, Math.max(0, x / 800));
    const r = Math.round(100 + t * 112);
    const g = Math.round(75 + t * 22);
    const b = Math.round(180 - t * 73);
    return `rgba(${r}, ${g}, ${b}, 0.75)`;
  };

  return (
    <div className="relative w-full aspect-[4/3]">
      <svg
        viewBox="0 0 800 500"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="core-glow">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="node-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Lines: Inputs → Core ── */}
        {inputs.map((inp, i) => (
          <line
            key={`in-${i}`}
            x1={inp.x} y1={inp.y}
            x2={coreNode.x} y2={coreNode.y}
            stroke={lineColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity={hoveredRoute !== null ? 0.12 : 1}
            style={{ transition: "opacity 0.4s" }}
          />
        ))}

        {/* ── Lines: Core → Outputs ── */}
        {outputs.map((out, i) => (
          <line
            key={`out-${i}`}
            x1={coreNode.x} y1={coreNode.y}
            x2={out.x} y2={out.y}
            stroke={lineColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity={hoveredRoute !== null ? 0.12 : 1}
            style={{ transition: "opacity 0.4s" }}
          />
        ))}

        {/* ── Highlighted routes (on hover) ── */}
        {pulseRoutes.map((route, i) => (
          <polyline
            key={`route-${i}`}
            points={route.points}
            fill="none"
            stroke={hoveredRoute === i ? "rgba(200, 180, 255, 0.6)" : "transparent"}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transition: "stroke 0.4s" }}
            onMouseEnter={() => {
              setHoveredRoute(i);
              const pts = route.points.split(" ");
              const mid = pts[2].split(",");
              setTooltip({ text: routeTooltips[i], x: parseFloat(mid[0]), y: parseFloat(mid[1]) - 40 });
            }}
            onMouseLeave={() => { setHoveredRoute(null); setTooltip(null); }}
            className="cursor-pointer"
            pointerEvents="stroke"
          />
        ))}

        {/* ── Checkpoint nodes ── */}
        {checkpoints.map((cp, i) => (
          <circle key={`cp-${i}`} cx={cp.cx} cy={cp.cy} r="4" fill={getNodeColor(cp.cx)}>
            <animate
              attributeName="opacity"
              values="0.6;1;0.6"
              dur="6s"
              begin={`${i * 0.8}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}

        {/* ── Input labels ── */}
        {inputs.map((inp, i) => (
          <g key={`il-${i}`}>
            <circle cx={inp.x} cy={inp.y} r="5" fill={getNodeColor(inp.x)} filter="url(#node-glow)">
              <animate attributeName="opacity" values="0.6;1;0.6" dur="6s" begin={`${i * 1.2}s`} repeatCount="indefinite" />
            </circle>
            <text
              x={inp.x} y={inp.y + 20}
              textAnchor="middle"
              fill={textSoft}
              fontSize="10"
              fontFamily="Inter, sans-serif"
              fontWeight="500"
              letterSpacing="0.04em"
            >
              {inp.label}
            </text>
          </g>
        ))}

        {/* ── Output labels ── */}
        {outputs.map((out, i) => (
          <g key={`ol-${i}`}>
            <circle cx={out.x} cy={out.y} r="5" fill={getNodeColor(out.x)} filter="url(#node-glow)">
              <animate attributeName="opacity" values="0.6;1;0.6" dur="6s" begin={`${i * 1.2 + 0.5}s`} repeatCount="indefinite" />
            </circle>
            <text
              x={out.x} y={out.y - 14}
              textAnchor="middle"
              fill={textSoft}
              fontSize="10"
              fontFamily="Inter, sans-serif"
              fontWeight="500"
              letterSpacing="0.04em"
            >
              {out.label}
            </text>
          </g>
        ))}

        {/* ── Central core node ── */}
        <circle cx={coreNode.x} cy={coreNode.y} r="36" fill={coreColor} filter="url(#core-glow)">
          <animate attributeName="opacity" values="0.85;1;0.85" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx={coreNode.x} cy={coreNode.y} r="22" fill="rgba(255, 200, 180, 0.2)" />
        <text
          x={coreNode.x} y={coreNode.y - 2}
          textAnchor="middle"
          fill={textStrong}
          fontSize="13"
          fontFamily="Inter, sans-serif"
          fontWeight="700"
          letterSpacing="0.02em"
        >
          {coreNode.label}
        </text>
        <text
          x={coreNode.x} y={coreNode.y + 56}
          textAnchor="middle"
          fill={textSoft}
          fontSize="9.5"
          fontFamily="Inter, sans-serif"
          fontWeight="400"
          letterSpacing="0.06em"
        >
          {coreNode.subtitle}
        </text>

        {/* ── Traveling pulses ── */}
        {pulseRoutes.map((route, i) => (
          <circle key={`pulse-${i}`} r="5" fill="rgba(180, 100, 130, 0.85)" filter="url(#node-glow)">
            <animateMotion
              dur={route.dur}
              begin={route.delay}
              repeatCount="indefinite"
              path={`M${route.points.split(" ").map(p => p.replace(",", " ")).join(" L")}`}
              calcMode="spline"
              keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1"
              keyTimes="0;0.33;0.66;1"
            />
            <animate
              attributeName="opacity"
              values="0;0.9;0.9;0"
              keyTimes="0;0.1;0.85;1"
              dur={route.dur}
              begin={route.delay}
              repeatCount="indefinite"
            />
          </circle>
        ))}

        {/* ── Tooltip ── */}
        {tooltip && (
          <g>
            <rect
              x={tooltip.x - 140}
              y={tooltip.y - 14}
              width="280"
              height="28"
              rx="6"
              fill="rgba(42, 26, 62, 0.92)"
              stroke="rgba(80, 60, 120, 0.2)"
              strokeWidth="1"
            />
            <text
              x={tooltip.x}
              y={tooltip.y + 4}
              textAnchor="middle"
              fill="rgba(255,255,255,0.92)"
              fontSize="10"
              fontFamily="Inter, sans-serif"
              fontWeight="400"
            >
              {tooltip.text}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

/* ─── MAIN SECTION ─── */
const PlatformSection = () => {
  return (
    <section
      className="platform-bg relative overflow-hidden"
      id="product"
      style={{ minHeight: "95vh" }}
    >
      <div className="relative z-10 max-w-[1240px] mx-auto px-6 md:px-12 py-28 md:py-36 lg:py-44">
        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-14 lg:gap-20 items-center">
          {/* ── Left: Text ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            className="flex flex-col"
          >
            <p
              style={{
                color: "rgba(80, 60, 120, 0.6)",
                letterSpacing: "0.18em",
                fontSize: "12px",
                fontWeight: 600,
                fontFamily: "Inter, sans-serif",
                textTransform: "uppercase",
                marginBottom: "28px",
              }}
            >
              PLATFORM ARCHITECTURE
            </p>

            <h2
              style={{
                color: "#2A1A3E",
                fontWeight: 800,
                fontSize: "clamp(48px, 5.5vw, 72px)",
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
                marginBottom: "28px",
              }}
            >
              How the system
              <br />
              is built.
            </h2>

            <p
              style={{
                color: "rgba(42, 26, 62, 0.72)",
                fontSize: "18px",
                fontWeight: 400,
                lineHeight: 1.5,
                maxWidth: "520px",
                marginBottom: "40px",
              }}
            >
              DocG AI is a cognitive layer that sits above clinical systems,
              routes decisions through workflow, and enforces sovereign
              governance—without adding friction to care delivery.
            </p>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="self-start px-7 py-3.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, rgba(212, 97, 107, 0.9), rgba(180, 70, 85, 0.85))",
                color: "#FFFAF8",
                border: "1px solid rgba(212, 97, 107, 0.25)",
                boxShadow: "0 8px 32px rgba(212, 97, 107, 0.25)",
              }}
            >
              Explore the Platform
            </motion.button>
          </motion.div>

          {/* ── Right: Architecture Map ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="rounded-[28px] overflow-hidden"
            style={{
              background: "linear-gradient(160deg, rgba(60, 40, 100, 0.08), rgba(60, 40, 100, 0.03))",
              border: "1px solid rgba(80, 60, 120, 0.12)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "0 30px 80px rgba(0,0,0,0.08), inset 0 0 120px rgba(232,150,124,0.04)",
              padding: "24px",
            }}
          >
            <ArchitectureMap />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PlatformSection;
