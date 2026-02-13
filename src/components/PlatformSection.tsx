import { motion } from "framer-motion";

/* ─── DATA (15% more spacing) ─── */
const inputNodes = [
  { label: "EMR", x: 80, y: 430 },
  { label: "Virtual Care", x: 210, y: 450 },
  { label: "Patient Access", x: 370, y: 460 },
  { label: "Labs", x: 530, y: 450 },
  { label: "Scheduling", x: 660, y: 430 },
];

const outputNodes = [
  { label: "Clinical Ops", x: 80, y: 65 },
  { label: "Care Pathways", x: 220, y: 50 },
  { label: "Automation", x: 370, y: 42 },
  { label: "Audit", x: 520, y: 50 },
  { label: "Policy", x: 660, y: 65 },
];

const core = { x: 370, y: 248 };

const pulseRoutes = [
  { path: "M80,430 Q200,340 370,248 Q200,150 80,65", dur: "9s", delay: "0s" },
  { path: "M370,460 Q370,360 370,248 Q370,145 370,42", dur: "8s", delay: "2s" },
  { path: "M660,430 Q530,340 370,248 Q530,150 660,65", dur: "9s", delay: "4s" },
  { path: "M210,450 Q280,350 370,248 Q290,150 220,50", dur: "10s", delay: "1s" },
  { path: "M530,450 Q460,350 370,248 Q460,150 520,50", dur: "10s", delay: "3s" },
];

/* Color: coral (left) → violet (right) */
const getInputColor = (x: number) => {
  const t = x / 740;
  return `rgba(${Math.round(212 - t * 50)}, ${Math.round(97 + t * 10)}, ${Math.round(107 + t * 80)}, 0.7)`;
};
const getOutputColor = (x: number) => {
  const t = x / 740;
  return `rgba(${Math.round(160 - t * 37)}, ${Math.round(97)}, ${Math.round(180 + t * 75)}, 0.7)`;
};

/* ─── ARCHITECTURE VISUALIZATION ─── */
const LivingArchitecture = () => (
  <div className="relative w-full aspect-[4/3]">
    <svg viewBox="0 0 740 500" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="core-glow-3">
          <feGaussianBlur stdDeviation="18" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="node-glow-3">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="halo-blur">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <radialGradient id="core-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D4616B" stopOpacity="1" />
          <stop offset="35%" stopColor="#E8967C" stopOpacity="0.85" />
          <stop offset="65%" stopColor="rgba(180, 120, 200, 0.4)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="halo-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(123, 97, 255, 0.12)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        {/* Input line gradient: coral tint */}
        <linearGradient id="input-line-grad" x1="0%" y1="100%" x2="50%" y2="50%">
          <stop offset="0%" stopColor="rgba(212, 97, 107, 0.4)" />
          <stop offset="100%" stopColor="rgba(212, 97, 107, 0.15)" />
        </linearGradient>
        {/* Output line gradient: violet tint */}
        <linearGradient id="output-line-grad" x1="50%" y1="50%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(123, 97, 255, 0.15)" />
          <stop offset="100%" stopColor="rgba(123, 97, 255, 0.4)" />
        </linearGradient>
      </defs>

      {/* ── Input lines (coral tint, 1.5px) ── */}
      {inputNodes.map((inp, i) => (
        <line key={`in-${i}`} x1={inp.x} y1={inp.y} x2={core.x} y2={core.y}
          stroke="rgba(212, 97, 107, 0.3)" strokeWidth="1.5" strokeLinecap="round" />
      ))}

      {/* ── Output lines (violet tint, 1.5px) ── */}
      {outputNodes.map((out, i) => (
        <line key={`out-${i}`} x1={core.x} y1={core.y} x2={out.x} y2={out.y}
          stroke="rgba(123, 97, 255, 0.3)" strokeWidth="1.5" strokeLinecap="round" />
      ))}

      {/* ── Input nodes ── */}
      {inputNodes.map((inp, i) => (
        <g key={`il-${i}`}>
          <circle cx={inp.x} cy={inp.y} r="5.5" fill={getInputColor(inp.x)} filter="url(#node-glow-3)">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="6s" begin={`${i * 1.2}s`} repeatCount="indefinite" />
          </circle>
          <text x={inp.x} y={inp.y + 24} textAnchor="middle" fill="rgba(30,30,50,0.55)" fontSize="11" fontFamily="Inter, sans-serif" fontWeight="500" letterSpacing="0.05em">
            {inp.label}
          </text>
        </g>
      ))}

      {/* ── Output nodes ── */}
      {outputNodes.map((out, i) => (
        <g key={`ol-${i}`}>
          <circle cx={out.x} cy={out.y} r="5.5" fill={getOutputColor(out.x)} filter="url(#node-glow-3)">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="6s" begin={`${i * 1.2 + 0.5}s`} repeatCount="indefinite" />
          </circle>
          <text x={out.x} y={out.y - 18} textAnchor="middle" fill="rgba(30,30,50,0.55)" fontSize="11" fontFamily="Inter, sans-serif" fontWeight="500" letterSpacing="0.05em">
            {out.label}
          </text>
        </g>
      ))}

      {/* ── Layer 3: Slow rotating ring ── */}
      <circle cx={core.x} cy={core.y} r="80" fill="none" stroke="rgba(123, 97, 255, 0.08)" strokeWidth="1" strokeDasharray="8 12">
        <animateTransform attributeName="transform" type="rotate" from={`0 ${core.x} ${core.y}`} to={`360 ${core.x} ${core.y}`} dur="60s" repeatCount="indefinite" />
      </circle>
      <circle cx={core.x} cy={core.y} r="68" fill="none" stroke="rgba(212, 97, 107, 0.06)" strokeWidth="0.8" strokeDasharray="5 10">
        <animateTransform attributeName="transform" type="rotate" from={`360 ${core.x} ${core.y}`} to={`0 ${core.x} ${core.y}`} dur="45s" repeatCount="indefinite" />
      </circle>

      {/* ── Layer 2: Expanding halo pulse ── */}
      <circle cx={core.x} cy={core.y} r="52" fill="none" stroke="rgba(212, 97, 107, 0.15)" strokeWidth="1.5" filter="url(#halo-blur)">
        <animate attributeName="r" values="52;72;52" dur="6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0.15;0.6" dur="6s" repeatCount="indefinite" />
      </circle>

      {/* ── Violet ambient halo ── */}
      <circle cx={core.x} cy={core.y} r="85" fill="url(#halo-grad)" />

      {/* ── Layer 1: Core reactor ── */}
      <circle cx={core.x} cy={core.y} r="52" fill="url(#core-gradient)" filter="url(#core-glow-3)">
        <animate attributeName="r" values="52;58;52" dur="5s" repeatCount="indefinite" />
      </circle>
      <circle cx={core.x} cy={core.y} r="30" fill="rgba(212, 97, 107, 0.2)" />
      <circle cx={core.x} cy={core.y} r="16" fill="rgba(212, 97, 107, 0.35)" />
      <text x={core.x} y={core.y + 5} textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14" fontFamily="Inter, sans-serif" fontWeight="700" letterSpacing="0.03em">
        AI Cortex
      </text>

      {/* ── Traveling white particles (active signals) ── */}
      {pulseRoutes.map((route, i) => (
        <g key={`pulse-${i}`}>
          {/* Glow trail */}
          <circle r="6" fill="rgba(255,255,255,0.3)" filter="url(#node-glow-3)">
            <animateMotion dur={route.dur} begin={route.delay} repeatCount="indefinite" path={route.path} calcMode="linear" />
            <animate attributeName="opacity" values="0;0.5;0.5;0" keyTimes="0;0.1;0.85;1" dur={route.dur} begin={route.delay} repeatCount="indefinite" />
          </circle>
          {/* White core particle */}
          <circle r="3" fill="rgba(255,255,255,0.9)">
            <animateMotion dur={route.dur} begin={route.delay} repeatCount="indefinite" path={route.path} calcMode="linear" />
            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur={route.dur} begin={route.delay} repeatCount="indefinite" />
          </circle>
        </g>
      ))}

      {/* ── Zone labels ── */}
      <text x="370" y="495" textAnchor="middle" fill="rgba(30,30,50,0.3)" fontSize="9" fontFamily="Inter, sans-serif" fontWeight="600" letterSpacing="0.2em">
        INPUTS
      </text>
      <text x="370" y="22" textAnchor="middle" fill="rgba(30,30,50,0.3)" fontSize="9" fontFamily="Inter, sans-serif" fontWeight="600" letterSpacing="0.2em">
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
          radial-gradient(1200px 600px at 20% 50%, rgba(212,97,107,0.25), transparent 60%),
          radial-gradient(1000px 700px at 85% 30%, rgba(123,97,255,0.25), transparent 65%),
          linear-gradient(180deg, #F9F8FC 0%, #F1EEF8 100%)
        `,
      }}
    >
      {/* Top gradient line separator */}
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{
        background: "linear-gradient(90deg, transparent 5%, rgba(123, 97, 255, 0.5) 30%, rgba(0, 255, 255, 0.3) 60%, rgba(212, 97, 107, 0.4) 85%, transparent 95%)",
      }} />
      <div className="absolute top-0 left-0 right-0 h-[40px] pointer-events-none" style={{
        background: "linear-gradient(180deg, rgba(123, 97, 255, 0.08) 0%, transparent 100%)",
      }} />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-12 py-28 md:py-36 lg:py-44 flex items-center min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-16 lg:gap-20 items-center w-full">
          {/* ── Left: Narrative ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-7"
          >
            <span
              style={{
                fontSize: "12px",
                letterSpacing: "0.18em",
                textTransform: "uppercase" as const,
                fontWeight: 500,
                color: "rgba(17, 17, 17, 0.55)",
                fontFamily: "Inter, sans-serif",
              }}
            >
              PLATFORM ARCHITECTURE
            </span>

            <h2 style={{
              color: "#111111",
              fontWeight: 800,
              fontSize: "clamp(48px, 6vw, 80px)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              fontFamily: "Inter, sans-serif",
            }}>
              How intelligence
              <br />moves through
              <br />healthcare.
            </h2>

            <p style={{
              color: "rgba(30, 30, 30, 0.75)",
              fontSize: "18px",
              fontWeight: 400,
              lineHeight: 1.6,
              maxWidth: "520px",
            }}>
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

          {/* ── Right: Glass Architecture Slab ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.8, delay: 0.15 }}
            style={{
              background: "rgba(255, 255, 255, 0.55)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              borderRadius: "36px",
              border: "1px solid rgba(90, 70, 160, 0.15)",
              boxShadow: "0 60px 140px rgba(60, 40, 120, 0.18)",
              padding: "32px",
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
