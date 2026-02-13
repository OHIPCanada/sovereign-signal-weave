import { motion } from "framer-motion";

/* ─── DATA ─── */
const inputNodes = [
  { label: "EMR", x: 100, y: 400 },
  { label: "Virtual Care", x: 230, y: 420 },
  { label: "Patient Access", x: 370, y: 430 },
  { label: "Labs", x: 510, y: 420 },
  { label: "Scheduling", x: 640, y: 400 },
];

const outputNodes = [
  { label: "Clinical Ops", x: 100, y: 80 },
  { label: "Care Pathways", x: 240, y: 65 },
  { label: "Automation", x: 380, y: 60 },
  { label: "Audit", x: 510, y: 65 },
  { label: "Policy", x: 640, y: 80 },
];

const core = { x: 370, y: 240 };

const pulseRoutes = [
  { path: "M100,400 Q200,320 370,240 Q240,150 100,80", dur: "9s", delay: "0s" },
  { path: "M370,430 Q370,340 370,240 Q370,150 380,60", dur: "8s", delay: "2s" },
  { path: "M640,400 Q520,320 370,240 Q520,150 640,80", dur: "9s", delay: "4s" },
  { path: "M230,420 Q290,330 370,240 Q300,150 240,65", dur: "10s", delay: "1s" },
  { path: "M510,420 Q450,330 370,240 Q450,150 510,65", dur: "10s", delay: "3s" },
];

/* Color interpolation: coral (left) → violet (right) */
const getNodeColor = (x: number) => {
  const t = x / 740;
  const r = Math.round(212 - t * 89);
  const g = Math.round(97 + t * 0);
  const b = Math.round(107 + t * 148);
  return `rgba(${r}, ${g}, ${b}, 0.7)`;
};

const getPulseColor = (i: number) => {
  const colors = [
    "rgba(212, 97, 107, 0.8)",
    "rgba(180, 97, 140, 0.8)",
    "rgba(123, 97, 255, 0.8)",
    "rgba(200, 97, 120, 0.8)",
    "rgba(150, 97, 200, 0.8)",
  ];
  return colors[i % colors.length];
};

/* ─── ARCHITECTURE VISUALIZATION ─── */
const LivingArchitecture = () => (
  <div className="relative w-full aspect-[4/3]">
    <svg viewBox="0 0 740 500" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="core-glow-3">
          <feGaussianBlur stdDeviation="16" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="node-glow-3">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="core-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D4616B" stopOpacity="1" />
          <stop offset="40%" stopColor="#E8967C" stopOpacity="0.8" />
          <stop offset="70%" stopColor="rgba(123, 97, 255, 0.3)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="halo-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(123, 97, 255, 0.15)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      {/* ── Routes: Input → Core ── */}
      {inputNodes.map((inp, i) => (
        <line
          key={`in-${i}`}
          x1={inp.x} y1={inp.y}
          x2={core.x} y2={core.y}
          stroke={getNodeColor(inp.x)}
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.25"
        />
      ))}

      {/* ── Routes: Core → Output ── */}
      {outputNodes.map((out, i) => (
        <line
          key={`out-${i}`}
          x1={core.x} y1={core.y}
          x2={out.x} y2={out.y}
          stroke={getNodeColor(out.x)}
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.25"
        />
      ))}

      {/* ── Input nodes + labels ── */}
      {inputNodes.map((inp, i) => (
        <g key={`il-${i}`}>
          <circle cx={inp.x} cy={inp.y} r="5" fill={getNodeColor(inp.x)} filter="url(#node-glow-3)">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="6s" begin={`${i * 1.2}s`} repeatCount="indefinite" />
          </circle>
          <text x={inp.x} y={inp.y + 22} textAnchor="middle" fill="rgba(30,30,60,0.6)" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="500" letterSpacing="0.06em">
            {inp.label}
          </text>
        </g>
      ))}

      {/* ── Output nodes + labels ── */}
      {outputNodes.map((out, i) => (
        <g key={`ol-${i}`}>
          <circle cx={out.x} cy={out.y} r="5" fill={getNodeColor(out.x)} filter="url(#node-glow-3)">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="6s" begin={`${i * 1.2 + 0.5}s`} repeatCount="indefinite" />
          </circle>
          <text x={out.x} y={out.y - 16} textAnchor="middle" fill="rgba(30,30,60,0.6)" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="500" letterSpacing="0.06em">
            {out.label}
          </text>
        </g>
      ))}

      {/* ── Violet halo around core ── */}
      <circle cx={core.x} cy={core.y} r="70" fill="url(#halo-gradient)" />

      {/* ── Core: AI Cortex with coral glow ── */}
      <circle cx={core.x} cy={core.y} r="44" fill="url(#core-gradient)" filter="url(#core-glow-3)">
        <animate attributeName="r" values="44;47;44" dur="5s" repeatCount="indefinite" />
      </circle>
      <circle cx={core.x} cy={core.y} r="24" fill="rgba(212, 97, 107, 0.25)" />
      <text x={core.x} y={core.y + 4} textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="13" fontFamily="Inter, sans-serif" fontWeight="700" letterSpacing="0.02em">
        AI Cortex
      </text>

      {/* ── Traveling light packets ── */}
      {pulseRoutes.map((route, i) => (
        <circle key={`pulse-${i}`} r="4" fill={getPulseColor(i)} filter="url(#node-glow-3)">
          <animateMotion
            dur={route.dur}
            begin={route.delay}
            repeatCount="indefinite"
            path={route.path}
            calcMode="linear"
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

      {/* ── Section labels ── */}
      <text x="370" y="480" textAnchor="middle" fill="rgba(30,30,60,0.35)" fontSize="9" fontFamily="Inter, sans-serif" fontWeight="600" letterSpacing="0.2em">
        INPUTS
      </text>
      <text x="370" y="35" textAnchor="middle" fill="rgba(30,30,60,0.35)" fontSize="9" fontFamily="Inter, sans-serif" fontWeight="600" letterSpacing="0.2em">
        OUTPUTS
      </text>
    </svg>
  </div>
);

/* ─── MAIN SECTION ─── */
const PlatformSection = () => {
  return (
    <section
      className="relative overflow-hidden"
      id="product"
      style={{
        minHeight: "100vh",
        background: `
          radial-gradient(circle at 25% 50%, rgba(212,97,107,0.18), transparent 60%),
          radial-gradient(circle at 75% 40%, rgba(123,97,255,0.20), transparent 60%),
          linear-gradient(180deg, #F6F4FA 0%, #EDEAF6 100%)
        `,
      }}
    >
      {/* Top gradient line separator */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background: "linear-gradient(90deg, transparent 5%, rgba(123, 97, 255, 0.5) 30%, rgba(0, 255, 255, 0.3) 60%, rgba(212, 97, 107, 0.4) 85%, transparent 95%)",
        }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-[40px] pointer-events-none"
        style={{
          background: "linear-gradient(180deg, rgba(123, 97, 255, 0.08) 0%, transparent 100%)",
        }}
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-12 py-28 md:py-36 lg:py-44 flex items-center min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-16 lg:gap-20 items-center w-full">
          {/* ── Left: Narrative ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-7"
          >
            <span
              className="text-xs uppercase tracking-[0.18em] font-medium"
              style={{ color: "rgba(29, 29, 31, 0.6)" }}
            >
              PLATFORM ARCHITECTURE
            </span>

            <h2
              style={{
                color: "#1D1D1F",
                fontWeight: 800,
                fontSize: "clamp(48px, 6vw, 80px)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                fontFamily: "Inter, sans-serif",
              }}
            >
              How intelligence
              <br />
              moves through
              <br />
              healthcare.
            </h2>

            <p
              style={{
                color: "rgba(30, 30, 30, 0.75)",
                fontSize: "18px",
                fontWeight: 400,
                lineHeight: 1.65,
                maxWidth: "520px",
              }}
            >
              DocG AI sits above clinical systems, routes signals through
              workflows, and enforces sovereign governance — without adding
              friction to care delivery.
            </p>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="self-start px-8 py-4 rounded-full text-sm font-semibold tracking-wide transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #D4616B, #E8967C)",
                color: "#FFFAF8",
                border: "none",
                boxShadow: "0 8px 32px rgba(212, 97, 107, 0.3)",
              }}
            >
              Explore the Platform
            </motion.button>
          </motion.div>

          {/* ── Right: Glass Architecture Surface ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.8, delay: 0.15 }}
            style={{
              background: "rgba(255, 255, 255, 0.75)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              borderRadius: "32px",
              border: "1px solid rgba(120, 100, 200, 0.15)",
              boxShadow: "0 40px 100px rgba(80, 60, 160, 0.20)",
              padding: "28px",
            }}
          >
            <LivingArchitecture />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PlatformSection;
