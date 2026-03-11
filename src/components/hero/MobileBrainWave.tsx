import { motion } from "framer-motion";

const modules = [
  { label: "AI CORTEX", x: 62, y: 28, delay: 2.0 },
  { label: "SOVEREIGN DATA", x: 18, y: 52, delay: 2.6 },
  { label: "AUDIT INTEGRITY", x: 82, y: 48, delay: 3.2 },
  { label: "CLINIC OS", x: 28, y: 76, delay: 3.8 },
  { label: "VIRTUAL CARE", x: 74, y: 74, delay: 4.4 },
];

const MobileBrainWave = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* CSS Animations */}
      <style>{`
        @keyframes waveFlow {
          0% { stroke-dashoffset: 800; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes waveFlowReverse {
          0% { stroke-dashoffset: -800; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes brainPulse {
          0%, 100% { opacity: 0.7; filter: drop-shadow(0 0 8px rgba(0,200,255,0.3)); }
          50% { opacity: 1; filter: drop-shadow(0 0 20px rgba(0,200,255,0.6)); }
        }
        @keyframes brainPulseWarm {
          0%, 100% { opacity: 0.7; filter: drop-shadow(0 0 8px rgba(255,180,80,0.3)); }
          50% { opacity: 1; filter: drop-shadow(0 0 20px rgba(255,180,80,0.6)); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1); }
        }
        @keyframes nodeGlow {
          0%, 100% { r: 2; opacity: 0.4; }
          50% { r: 4; opacity: 1; }
        }
        .wave-line {
          stroke-dasharray: 12 6;
          animation: waveFlow 8s linear infinite;
        }
        .wave-line-reverse {
          stroke-dasharray: 10 8;
          animation: waveFlowReverse 10s linear infinite;
        }
        .brain-left { animation: brainPulse 3.5s ease-in-out infinite; }
        .brain-right { animation: brainPulseWarm 3.5s ease-in-out 0.5s infinite; }
      `}</style>

      <svg
        viewBox="0 0 400 300"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Brain left gradient - cool blue/teal */}
          <radialGradient id="brainLeft" cx="40%" cy="45%" r="50%">
            <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#0088aa" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#004466" stopOpacity="0.4" />
          </radialGradient>
          {/* Brain right gradient - warm orange/gold */}
          <radialGradient id="brainRight" cx="60%" cy="45%" r="50%">
            <stop offset="0%" stopColor="#ffcc44" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#dd8833" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#884400" stopOpacity="0.4" />
          </radialGradient>
          {/* Wave gradient cool */}
          <linearGradient id="waveCool" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00ccff" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#7b61ff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ffaa44" stopOpacity="0.3" />
          </linearGradient>
          {/* Wave gradient warm */}
          <linearGradient id="waveWarm" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7b61ff" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#dd8833" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ffcc66" stopOpacity="0.8" />
          </linearGradient>
          {/* Glow filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glowStrong">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Module capsule gradient */}
          <linearGradient id="capsuleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
          </linearGradient>
        </defs>

        {/* === WAVEFORM LINES === */}
        {/* Primary wave - flows through brain */}
        <path
          d="M -20 150 Q 40 120, 80 145 Q 120 170, 160 140 Q 180 128, 200 135 Q 220 142, 240 130 Q 280 108, 320 145 Q 360 175, 420 140"
          fill="none"
          stroke="url(#waveCool)"
          strokeWidth="1.8"
          className="wave-line"
          filter="url(#glow)"
        />
        {/* Secondary wave offset */}
        <path
          d="M -30 160 Q 50 190, 90 155 Q 130 125, 170 155 Q 200 172, 230 148 Q 260 125, 300 158 Q 340 185, 430 150"
          fill="none"
          stroke="url(#waveWarm)"
          strokeWidth="1.2"
          className="wave-line-reverse"
          filter="url(#glow)"
          opacity="0.6"
        />
        {/* Tertiary subtle wave */}
        <path
          d="M -10 145 Q 60 130, 100 150 Q 140 168, 180 142 Q 220 118, 260 148 Q 300 172, 350 138 Q 390 110, 420 145"
          fill="none"
          stroke="url(#waveCool)"
          strokeWidth="0.8"
          className="wave-line"
          opacity="0.3"
          style={{ animationDuration: "12s" }}
        />

        {/* === BRAIN === */}
        <g transform="translate(200, 140)" filter="url(#glowStrong)">
          {/* Left hemisphere - cool blue/teal */}
          <g className="brain-left">
            <path
              d="M -2 -30 C -8 -38, -28 -40, -32 -28 C -36 -18, -38 -5, -35 8 C -33 18, -28 30, -18 35 C -10 39, -4 36, -2 30 Z"
              fill="url(#brainLeft)"
              stroke="rgba(0,200,255,0.3)"
              strokeWidth="0.5"
            />
            {/* Neural folds */}
            <path d="M -6 -22 Q -18 -18, -26 -10" fill="none" stroke="rgba(0,220,255,0.4)" strokeWidth="0.6" />
            <path d="M -5 -10 Q -20 -5, -30 2" fill="none" stroke="rgba(0,220,255,0.35)" strokeWidth="0.5" />
            <path d="M -4 5 Q -16 10, -28 15" fill="none" stroke="rgba(0,220,255,0.3)" strokeWidth="0.5" />
            <path d="M -5 18 Q -14 22, -20 28" fill="none" stroke="rgba(0,220,255,0.25)" strokeWidth="0.4" />
          </g>
          {/* Right hemisphere - warm orange/gold */}
          <g className="brain-right">
            <path
              d="M 2 -30 C 8 -38, 28 -40, 32 -28 C 36 -18, 38 -5, 35 8 C 33 18, 28 30, 18 35 C 10 39, 4 36, 2 30 Z"
              fill="url(#brainRight)"
              stroke="rgba(255,180,80,0.3)"
              strokeWidth="0.5"
            />
            {/* Neural folds */}
            <path d="M 6 -22 Q 18 -18, 26 -10" fill="none" stroke="rgba(255,200,100,0.4)" strokeWidth="0.6" />
            <path d="M 5 -10 Q 20 -5, 30 2" fill="none" stroke="rgba(255,200,100,0.35)" strokeWidth="0.5" />
            <path d="M 4 5 Q 16 10, 28 15" fill="none" stroke="rgba(255,200,100,0.3)" strokeWidth="0.5" />
            <path d="M 5 18 Q 14 22, 20 28" fill="none" stroke="rgba(255,200,100,0.25)" strokeWidth="0.4" />
          </g>
          {/* Central fissure glow */}
          <line x1="0" y1="-32" x2="0" y2="34" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        </g>

        {/* === WAVE NODES (glowing dots along wave) === */}
        {[
          { cx: 80, cy: 145, delay: 0 },
          { cx: 140, cy: 148, delay: 0.4 },
          { cx: 260, cy: 138, delay: 0.8 },
          { cx: 320, cy: 145, delay: 1.2 },
          { cx: 50, cy: 155, delay: 1.6 },
          { cx: 350, cy: 138, delay: 2.0 },
        ].map((node, i) => (
          <circle
            key={`node-${i}`}
            cx={node.cx}
            cy={node.cy}
            r="2.5"
            fill={node.cx < 200 ? "#00ccff" : "#ffaa44"}
            filter="url(#glow)"
            opacity="0.6"
            style={{
              animation: `nodeGlow 2.5s ease-in-out ${node.delay}s infinite`,
            }}
          />
        ))}

        {/* === SPARKLE PARTICLES === */}
        {[
          { x: 45, y: 125, s: 1.2, d: 0.3 },
          { x: 95, y: 170, s: 0.8, d: 0.9 },
          { x: 150, y: 115, s: 1.0, d: 1.5 },
          { x: 240, y: 110, s: 0.9, d: 2.1 },
          { x: 290, y: 168, s: 1.1, d: 2.7 },
          { x: 340, y: 120, s: 0.7, d: 3.3 },
          { x: 70, y: 180, s: 0.6, d: 1.0 },
          { x: 310, y: 175, s: 0.8, d: 3.8 },
          { x: 180, y: 105, s: 0.5, d: 0.6 },
          { x: 360, y: 155, s: 0.9, d: 4.2 },
        ].map((p, i) => (
          <g
            key={`sparkle-${i}`}
            transform={`translate(${p.x}, ${p.y})`}
            style={{
              animation: `sparkle ${2 + p.s}s ease-in-out ${p.d}s infinite`,
            }}
          >
            {/* 4-point star */}
            <line x1="0" y1={-3 * p.s} x2="0" y2={3 * p.s} stroke="rgba(255,255,255,0.8)" strokeWidth="0.5" />
            <line x1={-3 * p.s} y1="0" x2={3 * p.s} y2="0" stroke="rgba(255,255,255,0.8)" strokeWidth="0.5" />
          </g>
        ))}
      </svg>

      {/* === MODULE POP-UPS (HTML overlay for better text rendering) === */}
      {modules.map((mod, i) => (
        <motion.div
          key={mod.label}
          className="absolute pointer-events-none"
          style={{
            left: `${mod.x}%`,
            top: `${mod.y}%`,
            transform: "translate(-50%, -50%)",
          }}
          initial={{ opacity: 0, scale: 0.5, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            delay: mod.delay,
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {/* Energy line to wave center */}
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              bottom: -12,
              width: 1,
              height: 12,
              background: `linear-gradient(to bottom, ${i < 2 ? "rgba(0,200,255,0.4)" : i < 4 ? "rgba(123,97,255,0.4)" : "rgba(255,170,68,0.4)"}, transparent)`,
            }}
          />
          {/* Capsule */}
          <div
            style={{
              padding: "4px 10px",
              borderRadius: 20,
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.15)",
              boxShadow: `0 0 12px ${i < 2 ? "rgba(0,200,255,0.15)" : i < 4 ? "rgba(123,97,255,0.15)" : "rgba(255,170,68,0.15)"}, inset 0 1px 0 rgba(255,255,255,0.1)`,
              whiteSpace: "nowrap" as const,
            }}
          >
            <span
              style={{
                fontSize: 8,
                fontWeight: 600,
                letterSpacing: "0.12em",
                color: "rgba(255,255,255,0.85)",
                fontFamily: "monospace",
              }}
            >
              {mod.label}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default MobileBrainWave;
