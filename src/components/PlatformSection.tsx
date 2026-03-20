import { motion } from "framer-motion";
import { Link } from "react-router-dom";

/* ─── DATA (pulled inward for engineered spacing) ─── */
const inputNodes = [
  { label: "EMR", x: 65, y: 420 },
  { label: "Virtual Care", x: 185, y: 445 },
  { label: "Patient Access", x: 330, y: 455 },
  { label: "Labs", x: 480, y: 445 },
  { label: "Scheduling", x: 650, y: 420 },
];

const outputNodes = [
  { label: "Clinical Ops", x: 65, y: 75 },
  { label: "Care Pathways", x: 185, y: 55 },
  { label: "Automation", x: 410, y: 48 },
  { label: "Audit", x: 550, y: 55 },
  { label: "Policy", x: 670, y: 75 },
];

const core = { x: 370, y: 248 };

/* Signal routes: input→cortex (half path) for staggered firing */
const signalPaths = [
  { from: 0, path: `M65,420 Q190,340 370,248`, dur: "1.8s", delay: "0s" },
  { from: 1, path: `M185,445 Q275,350 370,248`, dur: "1.6s", delay: "5s" },
  { from: 2, path: `M330,455 Q350,355 370,248`, dur: "1.4s", delay: "2.5s" },
  { from: 3, path: `M480,445 Q430,350 370,248`, dur: "1.6s", delay: "8s" },
  { from: 4, path: `M650,420 Q520,340 370,248`, dur: "1.8s", delay: "4s" },
];

/* Outgoing routes: cortex→output */
const outgoingPaths = [
  { path: `M370,248 Q195,165 65,75`, dur: "1.8s", delay: "2s" },
  { path: `M370,248 Q275,155 185,55`, dur: "1.6s", delay: "7s" },
  { path: `M370,248 Q390,150 410,48`, dur: "1.4s", delay: "4.5s" },
  { path: `M370,248 Q465,155 550,55`, dur: "1.6s", delay: "10s" },
  { path: `M370,248 Q530,165 670,75`, dur: "1.8s", delay: "6s" },
];

/* ─── ARCHITECTURE VISUALIZATION ─── */
const LivingArchitecture = () => (
  <div className="relative w-full aspect-[4/3]">
    <svg viewBox="0 0 740 520" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="core-glow">
          <feGaussianBlur stdDeviation="16" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="node-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="halo-blur">
          <feGaussianBlur stdDeviation="10" />
        </filter>
        <filter id="signal-glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>

        {/* Line gradient: coral → violet */}
        <linearGradient id="line-grad-in" x1="0%" y1="100%" x2="50%" y2="50%">
          <stop offset="0%" stopColor="rgba(212, 97, 107, 0.5)" />
          <stop offset="100%" stopColor="rgba(160, 97, 200, 0.3)" />
        </linearGradient>
        <linearGradient id="line-grad-out" x1="50%" y1="50%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(160, 97, 200, 0.3)" />
          <stop offset="100%" stopColor="rgba(123, 97, 255, 0.5)" />
        </linearGradient>

        {/* Core layers */}
        <radialGradient id="core-white" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="core-coral" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D4616B" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#E8967C" stopOpacity="0.4" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="core-violet-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(123, 97, 255, 0.2)" />
          <stop offset="60%" stopColor="rgba(123, 97, 255, 0.06)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>

        {/* AI CORTEX text gradient */}
        <linearGradient id="cortex-text-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3C2A8E" />
          <stop offset="50%" stopColor="#6B5090" />
          <stop offset="100%" stopColor="#C07A7E" />
        </linearGradient>
      </defs>

      {/* ── Connection lines with gradient (0.4 base opacity) ── */}
      {inputNodes.map((inp, i) => (
        <line key={`il-${i}`} x1={inp.x} y1={inp.y} x2={core.x} y2={core.y}
          stroke="url(#line-grad-in)" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      ))}
      {outputNodes.map((out, i) => (
        <line key={`ol-${i}`} x1={core.x} y1={core.y} x2={out.x} y2={out.y}
          stroke="url(#line-grad-out)" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      ))}

      {/* ── Input nodes (ambient breathing) ── */}
      {inputNodes.map((inp, i) => {
        const t = inp.x / 740;
        const r = Math.round(212 - t * 50);
        const b = Math.round(107 + t * 80);
        const col = `rgba(${r}, 97, ${b}, 0.8)`;
        return (
          <g key={`in-${i}`}>
            {/* Breathing ring */}
            <circle cx={inp.x} cy={inp.y} r="10" fill="none" stroke={col} strokeWidth="1" opacity="0.3">
              <animate attributeName="r" values="10;15;10" dur={`${6 + i * 0.8}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;0.08;0.3" dur={`${6 + i * 0.8}s`} repeatCount="indefinite" />
            </circle>
            <circle cx={inp.x} cy={inp.y} r="6" fill={col} filter="url(#node-glow)">
              <animate attributeName="opacity" values="0.7;0.9;0.7" dur={`${5 + i * 0.7}s`} repeatCount="indefinite" />
            </circle>
            <text x={inp.x} y={inp.y + 26} textAnchor="middle" fill="rgba(20,20,40,0.75)" fontSize="12" fontFamily="Inter, sans-serif" fontWeight="600" letterSpacing="0.05em">
              {inp.label}
            </text>
          </g>
        );
      })}

      {/* ── Output nodes (ambient breathing) ── */}
      {outputNodes.map((out, i) => {
        const t = out.x / 740;
        const r = Math.round(160 - t * 37);
        const b = Math.round(180 + t * 75);
        const col = `rgba(${r}, 97, ${b}, 0.8)`;
        return (
          <g key={`out-${i}`}>
            <circle cx={out.x} cy={out.y} r="10" fill="none" stroke={col} strokeWidth="1" opacity="0.3">
              <animate attributeName="r" values="10;15;10" dur={`${6.5 + i * 0.6}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;0.08;0.3" dur={`${6.5 + i * 0.6}s`} repeatCount="indefinite" />
            </circle>
            <circle cx={out.x} cy={out.y} r="6" fill={col} filter="url(#node-glow)">
              <animate attributeName="opacity" values="0.7;0.9;0.7" dur={`${5.5 + i * 0.5}s`} repeatCount="indefinite" />
            </circle>
            <text x={out.x} y={out.y - 20} textAnchor="middle" fill="rgba(20,20,40,0.75)" fontSize="12" fontFamily="Inter, sans-serif" fontWeight="600" letterSpacing="0.05em">
              {out.label}
            </text>
          </g>
        );
      })}

      {/* ── Layer 4: Rotating dashed ring (very faint) ── */}
      <circle cx={core.x} cy={core.y} r="100" fill="none" stroke="rgba(123, 97, 255, 0.08)" strokeWidth="0.8" strokeDasharray="4 16">
        <animateTransform attributeName="transform" type="rotate" from={`0 ${core.x} ${core.y}`} to={`360 ${core.x} ${core.y}`} dur="60s" repeatCount="indefinite" />
      </circle>
      <circle cx={core.x} cy={core.y} r="88" fill="none" stroke="rgba(212, 97, 107, 0.06)" strokeWidth="0.6" strokeDasharray="3 12">
        <animateTransform attributeName="transform" type="rotate" from={`360 ${core.x} ${core.y}`} to={`0 ${core.x} ${core.y}`} dur="45s" repeatCount="indefinite" />
      </circle>

      {/* ── Layer 3: Violet outer halo ── */}
      <circle cx={core.x} cy={core.y} r="90" fill="url(#core-violet-halo)" />

      {/* ── Layer 2: Coral inner ring (pulse 6-8s) ── */}
      <circle cx={core.x} cy={core.y} r="52" fill="url(#core-coral)" filter="url(#core-glow)">
        <animate attributeName="r" values="52;56;52" dur="7s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0.4;0.7" dur="7s" repeatCount="indefinite" />
      </circle>
      {/* Halo pulse ring */}
      <circle cx={core.x} cy={core.y} r="48" fill="none" stroke="rgba(212, 97, 107, 0.2)" strokeWidth="1.5" filter="url(#halo-blur)">
        <animate attributeName="r" values="48;75;48" dur="7s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0.05;0.5" dur="7s" repeatCount="indefinite" />
      </circle>

      {/* ── Layer 1: Core white dot ── */}
      <circle cx={core.x} cy={core.y} r="28" fill="url(#core-coral)" opacity="0.6" />
      <circle cx={core.x} cy={core.y} r="14" fill="url(#core-white)" opacity="0.9">
        <animate attributeName="r" values="14;16;14" dur="6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;0.95;0.8" dur="6s" repeatCount="indefinite" />
      </circle>

      {/* ── AI CORTEX label — pushed further left, clear of glow ── */}
      <text x={core.x - 90} y={core.y + 7} textAnchor="end" fontSize="22" fontFamily="Inter, sans-serif" fontWeight="900" letterSpacing="-0.02em" fill="url(#cortex-text-grad)">
        AI CORTEX
      </text>

      {/* ── Signal transmissions: input → cortex (staggered, every 5-8s) ── */}
      {signalPaths.map((sig, i) => (
        <g key={`sig-in-${i}`}>
          {/* Glow halo */}
          <circle r="8" fill="rgba(212, 97, 107, 0.3)" filter="url(#signal-glow)">
            <animateMotion dur={sig.dur} begin={sig.delay} repeatCount="indefinite" path={sig.path} calcMode="spline" keySplines="0.4 0 0.2 1" keyTimes="0;1" />
            <animate attributeName="opacity" values="0;0.6;0.6;0" keyTimes="0;0.1;0.8;1" dur={sig.dur} begin={sig.delay} repeatCount="indefinite" />
          </circle>
          {/* Bright signal dot */}
          <circle r="3.5" fill="#fff" opacity="0.95">
            <animateMotion dur={sig.dur} begin={sig.delay} repeatCount="indefinite" path={sig.path} calcMode="spline" keySplines="0.4 0 0.2 1" keyTimes="0;1" />
            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.8;1" dur={sig.dur} begin={sig.delay} repeatCount="indefinite" />
          </circle>
        </g>
      ))}

      {/* ── Signal transmissions: cortex → output (staggered) ── */}
      {outgoingPaths.map((sig, i) => (
        <g key={`sig-out-${i}`}>
          <circle r="8" fill="rgba(123, 97, 255, 0.3)" filter="url(#signal-glow)">
            <animateMotion dur={sig.dur} begin={sig.delay} repeatCount="indefinite" path={sig.path} calcMode="spline" keySplines="0.4 0 0.2 1" keyTimes="0;1" />
            <animate attributeName="opacity" values="0;0.5;0.5;0" keyTimes="0;0.1;0.8;1" dur={sig.dur} begin={sig.delay} repeatCount="indefinite" />
          </circle>
          <circle r="3.5" fill="#fff" opacity="0.95">
            <animateMotion dur={sig.dur} begin={sig.delay} repeatCount="indefinite" path={sig.path} calcMode="spline" keySplines="0.4 0 0.2 1" keyTimes="0;1" />
            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.8;1" dur={sig.dur} begin={sig.delay} repeatCount="indefinite" />
          </circle>
        </g>
      ))}

      {/* ── Zone labels ── */}
      <text x="330" y="400" textAnchor="middle" fill="rgba(20,20,40,0.3)" fontSize="8" fontFamily="Inter, sans-serif" fontWeight="700" letterSpacing="0.22em">
        INPUTS
      </text>
      <text x="410" y="100" textAnchor="middle" fill="rgba(20,20,40,0.3)" fontSize="8" fontFamily="Inter, sans-serif" fontWeight="700" letterSpacing="0.22em">
        OUTPUTS
      </text>
    </svg>
  </div>
);

/* ─── MAIN SECTION ─── */
const PlatformSection = () => {
  return (
    <section
      className="relative overflow-hidden flex items-center md:min-h-[70vh] lg:min-h-screen"
      id="platform"
      style={{
        padding: "clamp(64px, 7vw, 110px) 0",
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

      <div className="relative z-10 mx-auto px-6 md:px-12" style={{ width: "min(1400px, 94vw)" }}>
        <div className="grid grid-cols-1 md:grid-cols-[0.45fr_1.55fr] lg:grid-cols-[0.55fr_1.45fr] items-center w-full split-layout-gap">
          {/* ── Left: Narrative ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-5"
          >
            <p className="font-mono uppercase" style={{ color: "rgba(17, 17, 17, 0.45)", fontSize: 12, letterSpacing: "0.22em" }}>
              [ PLATFORM ARCHITECTURE ]
            </p>

            <h2 style={{
              color: "#111111",
              fontWeight: 800,
              fontSize: "clamp(44px, 5.2vw, 84px)",
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
              textShadow: "0 10px 40px rgba(0,0,0,0.10)",
            }}>
              How clinical data
              <br />actually moves.
            </h2>

            <p style={{
              color: "rgba(30, 30, 30, 0.72)",
              fontSize: "clamp(15px, 1.25vw, 18px)",
              fontWeight: 400,
              lineHeight: 1.55,
              maxWidth: "46ch",
            }}>
              DocG AI connects your existing clinical systems. It routes data
              through your workflows and handles security and rules
              automatically. It works in the background so it doesn't slow
              down patient care.
            </p>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/platform/ai-cortex"
                className="inline-block self-start px-8 py-4 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 no-underline"
                style={{
                  background: "linear-gradient(135deg, #D4616B, #E8967C)",
                  color: "#FFFAF8",
                  boxShadow: "0 8px 32px rgba(212, 97, 107, 0.3)",
                }}
              >
                Explore the Platform
              </Link>
            </motion.div>
          </motion.div>

          {/* ── Right: Glass Architecture Slab ── */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.45) 100%)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              borderRadius: "40px",
              border: "1px solid rgba(90, 70, 160, 0.12)",
              boxShadow: `
                0 80px 160px rgba(60, 40, 120, 0.15),
                0 30px 80px rgba(60, 40, 120, 0.08),
                inset 0 1px 0 rgba(255, 255, 255, 0.7)
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
