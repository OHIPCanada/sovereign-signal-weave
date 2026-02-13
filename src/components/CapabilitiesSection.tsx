import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/* ───── Band 1: AI Cortex — breathing network mesh ───── */

const CortexVisual = () => (
  <div className="s4-viz-container">
    {/* Core glow orb */}
    <div className="s4-cortex-core" />
    <svg
      className="s4-svg"
      viewBox="0 0 800 280"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <radialGradient id="s4CoreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(139,92,246,0.5)" />
          <stop offset="50%" stopColor="rgba(192,132,252,0.2)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      {/* Core glow circle */}
      <circle cx="400" cy="140" r="55" fill="url(#s4CoreGlow)" className="s4-core-glow" />

      {/* Network mesh edges */}
      <g className="s4-cortex-edges">
        <line x1="120" y1="140" x2="240" y2="80" />
        <line x1="240" y1="80" x2="330" y2="120" />
        <line x1="330" y1="120" x2="400" y2="140" />
        <line x1="400" y1="140" x2="470" y2="110" />
        <line x1="470" y1="110" x2="560" y2="80" />
        <line x1="560" y1="80" x2="680" y2="140" />
        <line x1="400" y1="140" x2="330" y2="200" />
        <line x1="330" y1="200" x2="240" y2="190" />
        <line x1="240" y1="190" x2="120" y2="140" />
        <line x1="400" y1="140" x2="470" y2="200" />
        <line x1="470" y1="200" x2="560" y2="195" />
        <line x1="560" y1="195" x2="680" y2="140" />
        <line x1="240" y1="80" x2="240" y2="190" />
        <line x1="560" y1="80" x2="560" y2="195" />
        <line x1="330" y1="120" x2="330" y2="200" />
        <line x1="470" y1="110" x2="470" y2="200" />
      </g>

      {/* Nodes */}
      <g className="s4-cortex-nodes">
        <circle cx="120" cy="140" r="5" />
        <circle cx="240" cy="80" r="4.5" />
        <circle cx="330" cy="120" r="4" />
        <circle cx="400" cy="140" r="7" className="s4-center-node" />
        <circle cx="470" cy="110" r="4" />
        <circle cx="560" cy="80" r="4.5" />
        <circle cx="680" cy="140" r="5" />
        <circle cx="240" cy="190" r="4" />
        <circle cx="330" cy="200" r="4.5" />
        <circle cx="470" cy="200" r="4.5" />
        <circle cx="560" cy="195" r="4" />
      </g>

      {/* Convergence pulse — travels to center */}
      <circle r="3" fill="rgba(192,132,252,0.9)" className="s4-convergence-1">
        <animateMotion dur="4s" repeatCount="indefinite" path="M120,140 L240,80 L330,120 L400,140" />
        <animate attributeName="opacity" values="0;0.9;0.9;0" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle r="3" fill="rgba(192,132,252,0.9)" className="s4-convergence-2">
        <animateMotion dur="5s" repeatCount="indefinite" path="M680,140 L560,80 L470,110 L400,140" />
        <animate attributeName="opacity" values="0;0.9;0.9;0" dur="5s" repeatCount="indefinite" />
      </circle>
    </svg>
  </div>
);

/* ───── Band 2: Workflow Orchestration — signal rails ───── */

const WorkflowVisual = () => {
  const rails = [
    { y: 70, pulses: [{ delay: 0, dur: 5 }, { delay: 2.5, dur: 5 }] },
    { y: 140, pulses: [{ delay: 0.8, dur: 6.5 }, { delay: 4, dur: 6.5 }] },
    { y: 210, pulses: [{ delay: 1.6, dur: 8 }, { delay: 5, dur: 8 }] },
  ];

  return (
    <div className="s4-viz-container">
      <svg
        className="s4-svg"
        viewBox="0 0 800 280"
        preserveAspectRatio="xMidYMid meet"
      >
        {rails.map((rail, ri) => (
          <g key={ri}>
            {/* Rail line */}
            <line
              x1="0" y1={rail.y} x2="800" y2={rail.y}
              stroke="rgba(167,139,250,0.2)"
              strokeWidth="1"
            />
            {/* Junction nodes */}
            <circle cx="200" cy={rail.y} r="3" fill="rgba(167,139,250,0.4)" />
            <circle cx="400" cy={rail.y} r="3" fill="rgba(167,139,250,0.4)" />
            <circle cx="600" cy={rail.y} r="3" fill="rgba(167,139,250,0.4)" />
            {/* Signal pulses */}
            {rail.pulses.map((p, pi) => (
              <circle key={pi} r="5" cy={rail.y} fill="rgba(196,181,253,0.85)">
                <animate
                  attributeName="cx"
                  values="0;800"
                  dur={`${p.dur}s`}
                  begin={`${p.delay}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0;0.85;0.85;0"
                  dur={`${p.dur}s`}
                  begin={`${p.delay}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </g>
        ))}

        {/* Branch lines (occasional merge/split) */}
        <line x1="250" y1="70" x2="350" y2="140" stroke="rgba(167,139,250,0.1)" strokeWidth="1" />
        <line x1="450" y1="140" x2="550" y2="210" stroke="rgba(167,139,250,0.1)" strokeWidth="1" />
        <line x1="500" y1="70" x2="600" y2="140" stroke="rgba(167,139,250,0.08)" strokeWidth="1" />
      </svg>
    </div>
  );
};

/* ───── Band 3: Sovereign Data Plane — grid + anchor nodes ───── */

const DataPlaneVisual = () => (
  <div className="s4-viz-container">
    <svg
      className="s4-svg"
      viewBox="0 0 800 280"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Faint grid */}
      {Array.from({ length: 20 }, (_, i) => (
        <line
          key={`v${i}`}
          x1={i * 42}
          y1="0"
          x2={i * 42}
          y2="280"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="1"
        />
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <line
          key={`h${i}`}
          x1="0"
          y1={i * 40}
          x2="800"
          y2={i * 40}
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="1"
        />
      ))}

      {/* Anchor nodes with security halos */}
      {[
        { cx: 200, cy: 140, r: 6, delay: 0 },
        { cx: 400, cy: 140, r: 8, delay: 1 },
        { cx: 600, cy: 140, r: 6, delay: 2 },
        { cx: 300, cy: 80, r: 4, delay: 0.5 },
        { cx: 500, cy: 80, r: 4, delay: 1.5 },
        { cx: 300, cy: 200, r: 4, delay: 2.5 },
        { cx: 500, cy: 200, r: 4, delay: 3 },
      ].map((node, i) => (
        <g key={i}>
          {/* Security halo */}
          <circle
            cx={node.cx}
            cy={node.cy}
            r={node.r + 12}
            fill="none"
            stroke="rgba(212,97,107,0.15)"
            strokeWidth="1"
          >
            <animate
              attributeName="r"
              values={`${node.r + 10};${node.r + 16};${node.r + 10}`}
              dur="8s"
              begin={`${node.delay}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.6;1;0.6"
              dur="8s"
              begin={`${node.delay}s`}
              repeatCount="indefinite"
            />
          </circle>
          {/* Anchor node */}
          <circle
            cx={node.cx}
            cy={node.cy}
            r={node.r}
            className="s4-data-node"
          >
            <animate
              attributeName="opacity"
              values="0.7;1;0.7"
              dur="8s"
              begin={`${node.delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        </g>
      ))}

      {/* Connecting spine lines between anchors */}
      <line x1="200" y1="140" x2="400" y2="140" stroke="rgba(232,150,124,0.2)" strokeWidth="1" />
      <line x1="400" y1="140" x2="600" y2="140" stroke="rgba(232,150,124,0.2)" strokeWidth="1" />
      <line x1="300" y1="80" x2="400" y2="140" stroke="rgba(232,150,124,0.12)" strokeWidth="1" />
      <line x1="500" y1="80" x2="400" y2="140" stroke="rgba(232,150,124,0.12)" strokeWidth="1" />
      <line x1="300" y1="200" x2="400" y2="140" stroke="rgba(232,150,124,0.12)" strokeWidth="1" />
      <line x1="500" y1="200" x2="400" y2="140" stroke="rgba(232,150,124,0.12)" strokeWidth="1" />
    </svg>
  </div>
);

/* ───── Band data ───── */

const bands = [
  {
    title: "AI Cortex",
    sub: "Reasoning layer that routes clinical decisions through structured intelligence.",
    Visual: CortexVisual,
  },
  {
    title: "Workflow Orchestration",
    sub: "Signals moving across pathways — steady, branching, merging — at system scale.",
    Visual: WorkflowVisual,
  },
  {
    title: "Sovereign Data Plane",
    sub: "Policy, storage, and jurisdiction — enforced automatically, anchored permanently.",
    Visual: DataPlaneVisual,
  },
];

/* ───── Section ───── */

const CapabilitiesSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={ref}
      className="s4-section relative overflow-hidden"
    >
      {/* Grain noise overlay */}
      <div className="s4-noise" />
      {/* Ambient glow */}
      <div className="s4-ambient" />

      <motion.div style={{ opacity }} className="relative z-10">
        {/* Section header */}
        <div className="s4-header">
          <span className="mono-label" style={{ color: "rgba(255,255,255,0.35)" }}>
            [ CAPABILITIES ]
          </span>
          <h2 className="s4-headline">
            Built as Infrastructure.
          </h2>
          <p className="s4-subtext">
            Three structural planes that power modern healthcare — invisibly, continuously, and at scale.
          </p>
        </div>

        {/* Infrastructure bands */}
        <div className="s4-bands">
          {bands.map((band, i) => (
            <motion.div
              key={band.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              className="s4-band"
            >
              <div className="s4-band-text">
                <h3 className="s4-band-title">{band.title}</h3>
                <p className="s4-band-sub">{band.sub}</p>
              </div>
              <div className="s4-band-visual">
                <band.Visual />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default CapabilitiesSection;
