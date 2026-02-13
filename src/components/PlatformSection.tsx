import { motion } from "framer-motion";

/* ─── DATA (expanded spacing for scale presence) ─── */
const inputNodes = [
  { label: "EMR", x: 60, y: 440 },
  { label: "Virtual Care", x: 195, y: 460 },
  { label: "Patient Access", x: 370, y: 472 },
  { label: "Labs", x: 545, y: 460 },
  { label: "Scheduling", x: 680, y: 440 },
];

const outputNodes = [
  { label: "Clinical Ops", x: 60, y: 55 },
  { label: "Care Pathways", x: 195, y: 38 },
  { label: "Automation", x: 370, y: 28 },
  { label: "Audit", x: 545, y: 38 },
  { label: "Policy", x: 680, y: 55 },
];

const core = { x: 370, y: 248 };

const pulseRoutes = [
  { path: "M60,440 Q190,350 370,248 Q190,150 60,55", dur: "8s", delay: "0s" },
  { path: "M370,472 Q370,365 370,248 Q370,140 370,28", dur: "7s", delay: "1.5s" },
  { path: "M680,440 Q540,350 370,248 Q540,150 680,55", dur: "8s", delay: "3s" },
  { path: "M195,460 Q275,360 370,248 Q275,145 195,38", dur: "9s", delay: "0.8s" },
  { path: "M545,460 Q465,360 370,248 Q465,145 545,38", dur: "9s", delay: "2.2s" },
];

/* Color: coral (left) → violet (right) */
const getInputColor = (x: number) => {
  const t = x / 740;
  return `rgba(${Math.round(212 - t * 50)}, ${Math.round(97 + t * 10)}, ${Math.round(107 + t * 80)}, 0.85)`;
};
const getOutputColor = (x: number) => {
  const t = x / 740;
  return `rgba(${Math.round(160 - t * 37)}, ${Math.round(97)}, ${Math.round(180 + t * 75)}, 0.85)`;
};

/* ─── ARCHITECTURE VISUALIZATION ─── */
const LivingArchitecture = () => (
  <div className="relative w-full aspect-[4/3]">
    <svg viewBox="0 0 740 500" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="core-glow-3">
          <feGaussianBlur stdDeviation="22" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="node-glow-3">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="halo-blur">
          <feGaussianBlur stdDeviation="12" />
        </filter>
        <filter id="line-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="particle-glow">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <radialGradient id="core-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="15%" stopColor="#D4616B" stopOpacity="1" />
          <stop offset="40%" stopColor="#E8967C" stopOpacity="0.85" />
          <stop offset="65%" stopColor="rgba(180, 120, 200, 0.45)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="halo-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(123, 97, 255, 0.18)" />
          <stop offset="60%" stopColor="rgba(123, 97, 255, 0.06)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="ambient-field" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(212, 97, 107, 0.08)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      {/* ── Ambient field behind everything ── */}
      <circle cx={core.x} cy={core.y} r="220" fill="url(#ambient-field)" />

      {/* ── Input lines (coral, glowing) ── */}
      {inputNodes.map((inp, i) => (
        <g key={`in-${i}`}>
          <line x1={inp.x} y1={inp.y} x2={core.x} y2={core.y}
            stroke="rgba(212, 97, 107, 0.15)" strokeWidth="2" strokeLinecap="round" />
          <line x1={inp.x} y1={inp.y} x2={core.x} y2={core.y}
            stroke="rgba(212, 97, 107, 0.5)" strokeWidth="2" strokeLinecap="round" filter="url(#line-glow)">
            <animate attributeName="opacity" values="0.2;0.6;0.2" dur="4s" begin={`${i * 0.8}s`} repeatCount="indefinite" />
          </line>
        </g>
      ))}

      {/* ── Output lines (violet, glowing) ── */}
      {outputNodes.map((out, i) => (
        <g key={`out-${i}`}>
          <line x1={core.x} y1={core.y} x2={out.x} y2={out.y}
            stroke="rgba(123, 97, 255, 0.15)" strokeWidth="2" strokeLinecap="round" />
          <line x1={core.x} y1={core.y} x2={out.x} y2={out.y}
            stroke="rgba(123, 97, 255, 0.5)" strokeWidth="2" strokeLinecap="round" filter="url(#line-glow)">
            <animate attributeName="opacity" values="0.2;0.6;0.2" dur="4s" begin={`${i * 0.8 + 2}s`} repeatCount="indefinite" />
          </line>
        </g>
      ))}

      {/* ── Input nodes ── */}
      {inputNodes.map((inp, i) => (
        <g key={`il-${i}`}>
          {/* Outer ring */}
          <circle cx={inp.x} cy={inp.y} r="10" fill="none" stroke={getInputColor(inp.x)} strokeWidth="1" opacity="0.4">
            <animate attributeName="r" values="10;14;10" dur="5s" begin={`${i * 0.6}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0.1;0.4" dur="5s" begin={`${i * 0.6}s`} repeatCount="indefinite" />
          </circle>
          {/* Core dot */}
          <circle cx={inp.x} cy={inp.y} r="6" fill={getInputColor(inp.x)} filter="url(#node-glow-3)">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="4s" begin={`${i * 1.2}s`} repeatCount="indefinite" />
          </circle>
          <text x={inp.x} y={inp.y + 26} textAnchor="middle" fill="rgba(20,20,40,0.8)" fontSize="12.5" fontFamily="Inter, sans-serif" fontWeight="600" letterSpacing="0.04em">
            {inp.label}
          </text>
        </g>
      ))}

      {/* ── Output nodes ── */}
      {outputNodes.map((out, i) => (
        <g key={`ol-${i}`}>
          <circle cx={out.x} cy={out.y} r="10" fill="none" stroke={getOutputColor(out.x)} strokeWidth="1" opacity="0.4">
            <animate attributeName="r" values="10;14;10" dur="5s" begin={`${i * 0.6 + 0.3}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0.1;0.4" dur="5s" begin={`${i * 0.6 + 0.3}s`} repeatCount="indefinite" />
          </circle>
          <circle cx={out.x} cy={out.y} r="6" fill={getOutputColor(out.x)} filter="url(#node-glow-3)">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="4s" begin={`${i * 1.2 + 0.5}s`} repeatCount="indefinite" />
          </circle>
          <text x={out.x} y={out.y - 20} textAnchor="middle" fill="rgba(20,20,40,0.8)" fontSize="12.5" fontFamily="Inter, sans-serif" fontWeight="600" letterSpacing="0.04em">
            {out.label}
          </text>
        </g>
      ))}

      {/* ── Layer 3: Rotating rings ── */}
      <circle cx={core.x} cy={core.y} r="95" fill="none" stroke="rgba(123, 97, 255, 0.12)" strokeWidth="1.2" strokeDasharray="6 14">
        <animateTransform attributeName="transform" type="rotate" from={`0 ${core.x} ${core.y}`} to={`360 ${core.x} ${core.y}`} dur="50s" repeatCount="indefinite" />
      </circle>
      <circle cx={core.x} cy={core.y} r="82" fill="none" stroke="rgba(212, 97, 107, 0.1)" strokeWidth="1" strokeDasharray="4 10">
        <animateTransform attributeName="transform" type="rotate" from={`360 ${core.x} ${core.y}`} to={`0 ${core.x} ${core.y}`} dur="38s" repeatCount="indefinite" />
      </circle>
      <circle cx={core.x} cy={core.y} r="108" fill="none" stroke="rgba(123, 97, 255, 0.06)" strokeWidth="0.8" strokeDasharray="3 18">
        <animateTransform attributeName="transform" type="rotate" from={`0 ${core.x} ${core.y}`} to={`360 ${core.x} ${core.y}`} dur="70s" repeatCount="indefinite" />
      </circle>

      {/* ── Layer 2: Expanding halo pulses ── */}
      <circle cx={core.x} cy={core.y} r="55" fill="none" stroke="rgba(212, 97, 107, 0.25)" strokeWidth="2" filter="url(#halo-blur)">
        <animate attributeName="r" values="55;85;55" dur="6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0.08;0.7" dur="6s" repeatCount="indefinite" />
      </circle>
      <circle cx={core.x} cy={core.y} r="60" fill="none" stroke="rgba(123, 97, 255, 0.15)" strokeWidth="1.5" filter="url(#halo-blur)">
        <animate attributeName="r" values="60;95;60" dur="8s" begin="1s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0.05;0.5" dur="8s" begin="1s" repeatCount="indefinite" />
      </circle>

      {/* ── Violet ambient halo ── */}
      <circle cx={core.x} cy={core.y} r="100" fill="url(#halo-grad)" />

      {/* ── Layer 1: Core reactor ── */}
      <circle cx={core.x} cy={core.y} r="60" fill="url(#core-gradient)" filter="url(#core-glow-3)">
        <animate attributeName="r" values="60;67;60" dur="5s" repeatCount="indefinite" />
      </circle>
      <circle cx={core.x} cy={core.y} r="35" fill="rgba(212, 97, 107, 0.25)" />
      <circle cx={core.x} cy={core.y} r="20" fill="rgba(212, 97, 107, 0.4)">
        <animate attributeName="r" values="20;23;20" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx={core.x} cy={core.y} r="8" fill="rgba(255, 255, 255, 0.6)">
        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <text x={core.x} y={core.y + 6} textAnchor="middle" fill="rgba(255,255,255,0.97)" fontSize="16" fontFamily="Inter, sans-serif" fontWeight="700" letterSpacing="0.05em">
        AI Cortex
      </text>

      {/* ── Traveling particles (white with colored trail) ── */}
      {pulseRoutes.map((route, i) => (
        <g key={`pulse-${i}`}>
          {/* Outer glow trail */}
          <circle r="10" fill="rgba(255,255,255,0.15)" filter="url(#particle-glow)">
            <animateMotion dur={route.dur} begin={route.delay} repeatCount="indefinite" path={route.path} calcMode="linear" />
            <animate attributeName="opacity" values="0;0.4;0.4;0" keyTimes="0;0.08;0.88;1" dur={route.dur} begin={route.delay} repeatCount="indefinite" />
          </circle>
          {/* Mid glow */}
          <circle r="5" fill="rgba(255,255,255,0.5)" filter="url(#node-glow-3)">
            <animateMotion dur={route.dur} begin={route.delay} repeatCount="indefinite" path={route.path} calcMode="linear" />
            <animate attributeName="opacity" values="0;0.7;0.7;0" keyTimes="0;0.08;0.88;1" dur={route.dur} begin={route.delay} repeatCount="indefinite" />
          </circle>
          {/* Bright core particle */}
          <circle r="3" fill="rgba(255,255,255,0.95)">
            <animateMotion dur={route.dur} begin={route.delay} repeatCount="indefinite" path={route.path} calcMode="linear" />
            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.88;1" dur={route.dur} begin={route.delay} repeatCount="indefinite" />
          </circle>
        </g>
      ))}

      {/* ── Zone labels ── */}
      <text x="370" y="498" textAnchor="middle" fill="rgba(20,20,40,0.4)" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="700" letterSpacing="0.22em">
        INPUTS
      </text>
      <text x="370" y="16" textAnchor="middle" fill="rgba(20,20,40,0.4)" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="700" letterSpacing="0.22em">
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
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-16 lg:gap-20 items-center w-full">
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
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: "rgba(255, 255, 255, 0.65)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              borderRadius: "36px",
              border: "1px solid rgba(90, 70, 160, 0.18)",
              boxShadow: `
                0 60px 140px rgba(60, 40, 120, 0.2),
                0 20px 60px rgba(60, 40, 120, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.8)
              `,
              padding: "36px",
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
