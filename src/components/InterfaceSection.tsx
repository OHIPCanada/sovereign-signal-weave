import { motion, useInView } from "framer-motion";
import { useRef } from "react";

/* ── Panel 1: Fragmented Signals ── */
const FragmentedPanel = () => (
  <div className="relative w-full h-full overflow-hidden">
    {/* Ghost rows - misaligned */}
    {[78, 148, 228].map((top, i) => (
      <motion.div
        key={top}
        className="absolute"
        style={{
          left: i === 1 ? 20 : 16,
          right: i === 2 ? 20 : 16,
          top,
          height: 1,
          background: "rgba(18,10,34,0.07)",
        }}
        animate={{ opacity: [0.4, 0.15, 0.4], x: [0, i % 2 === 0 ? 2 : -3, 0] }}
        transition={{ duration: 3 + i * 0.7, repeat: Infinity, ease: "easeInOut" }}
      />
    ))}

    {/* Messy jittery pills with flicker */}
    {[
      { w: 92, l: 18, t: 38, delay: 0, rot: -2 },
      { w: 58, l: 180, t: 56, delay: 0.3, rot: 3 },
      { w: 110, l: 120, t: 112, delay: 0.7, rot: -1.5 },
      { w: 78, l: 28, t: 170, delay: 1.0, rot: 2.5 },
      { w: 88, l: 195, t: 198, delay: 1.4, rot: -3 },
      { w: 64, l: 55, t: 252, delay: 1.8, rot: 1 },
      { w: 48, l: 240, t: 140, delay: 2.2, rot: -2.5 },
    ].map((p, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{
          width: p.w,
          height: 16,
          left: p.l,
          top: p.t,
          background: "rgba(18,10,34,0.07)",
          border: "1px solid rgba(18,10,34,0.06)",
          rotate: `${p.rot}deg`,
        }}
        animate={{
          x: [0, 4, -3, 1, 0],
          y: [0, -3, 2, -1, 0],
          opacity: [0.7, 0.35, 0.8, 0.25, 0.7],
          scale: [1, 0.97, 1.02, 0.98, 1],
        }}
        transition={{
          duration: 3.2 + i * 0.3,
          delay: p.delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    ))}

    {/* Noise overlay */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: "radial-gradient(rgba(18,10,34,0.06) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
        opacity: 0.18,
        mixBlendMode: "multiply",
      }}
    />

    {/* Flicker overlay */}
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{ background: "rgba(18,10,34,0.02)" }}
      animate={{ opacity: [0, 0.04, 0, 0.06, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
);

/* ── Panel 2: Intelligence Layer ── */
const IntelligencePanel = () => {
  const nodes = [
    { cx: 48, cy: 100 },
    { cx: 140, cy: 170 },
    { cx: 220, cy: 120 },
    { cx: 290, cy: 200 },
    { cx: 180, cy: 260 },
  ];

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Horizontal scan glow */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          top: 0,
          left: 0,
          width: 180,
          height: "100%",
          background: "linear-gradient(90deg, transparent 0%, rgba(232,150,124,0.28) 40%, rgba(232,150,124,0.40) 50%, rgba(232,150,124,0.28) 60%, transparent 100%)",
          filter: "blur(18px)",
          mixBlendMode: "multiply",
        }}
        animate={{ left: ["-180px", "110%"] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "linear" }}
      />

      {/* SVG spline paths with flowing particles */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 340 320" preserveAspectRatio="xMidYMid meet" style={{ pointerEvents: "none" }}>
        {/* Connection wires */}
        <motion.path
          d="M 48 100 C 90 80, 110 170, 140 170"
          fill="none"
          stroke="rgba(110,43,255,0.28)"
          strokeWidth={2}
          strokeDasharray="4 6"
          animate={{ strokeDashoffset: [0, -120] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.path
          d="M 140 170 C 170 140, 200 130, 220 120"
          fill="none"
          stroke="rgba(191,167,255,0.38)"
          strokeWidth={2}
          strokeDasharray="4 6"
          animate={{ strokeDashoffset: [0, -120] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
        />
        <motion.path
          d="M 220 120 C 250 150, 270 180, 290 200"
          fill="none"
          stroke="rgba(232,150,124,0.32)"
          strokeWidth={2}
          strokeDasharray="4 6"
          animate={{ strokeDashoffset: [0, -120] }}
          transition={{ duration: 2.3, repeat: Infinity, ease: "linear" }}
        />
        <motion.path
          d="M 140 170 C 160 210, 170 240, 180 260"
          fill="none"
          stroke="rgba(110,43,255,0.22)"
          strokeWidth={1.8}
          strokeDasharray="4 6"
          animate={{ strokeDashoffset: [0, -120] }}
          transition={{ duration: 3.0, repeat: Infinity, ease: "linear" }}
        />
        <motion.path
          d="M 290 200 C 260 230, 220 255, 180 260"
          fill="none"
          stroke="rgba(191,167,255,0.30)"
          strokeWidth={1.8}
          strokeDasharray="4 6"
          animate={{ strokeDashoffset: [0, -120] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
        />

        {/* Signal particles traveling along paths */}
        <circle r="3" fill="rgba(110,43,255,0.85)">
          <animateMotion dur="3s" repeatCount="indefinite" path="M 48 100 C 90 80, 110 170, 140 170" />
        </circle>
        <circle r="2.5" fill="rgba(232,150,124,0.9)">
          <animateMotion dur="2.6s" repeatCount="indefinite" path="M 140 170 C 170 140, 200 130, 220 120" />
        </circle>
        <circle r="3" fill="rgba(191,167,255,0.85)">
          <animateMotion dur="3.2s" repeatCount="indefinite" path="M 220 120 C 250 150, 270 180, 290 200" />
        </circle>
        <circle r="2" fill="rgba(110,43,255,0.7)">
          <animateMotion dur="3.5s" repeatCount="indefinite" path="M 290 200 C 260 230, 220 255, 180 260" />
        </circle>
      </svg>

      {/* Pulsing nodes that brighten */}
      {nodes.map((n, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${(n.cx / 340) * 100}%`,
            top: `${(n.cy / 320) * 100}%`,
            width: 10,
            height: 10,
            background: "rgba(110,43,255,0.75)",
            transform: "translate(-50%, -50%)",
          }}
          animate={{
            scale: [1, 1.5, 1],
            boxShadow: [
              "0 0 0 0 rgba(110,43,255,0.4)",
              "0 0 0 18px rgba(110,43,255,0)",
              "0 0 0 0 rgba(110,43,255,0.4)",
            ],
          }}
          transition={{
            duration: 2,
            delay: i * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

/* ── Panel 3: Coordinated Care ── */
const CoordinatedPanel = () => {
  const checkpoints = [
    { pos: "18%", delay: 0 },
    { pos: "48%", delay: 0.4 },
    { pos: "78%", delay: 0.8 },
  ];

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Clean flow line */}
      <div
        className="absolute"
        style={{
          left: 32,
          right: 32,
          top: "50%",
          height: 2,
          background: "linear-gradient(90deg, rgba(110,43,255,0.12), rgba(232,150,124,0.45), rgba(110,43,255,0.12))",
        }}
      />

      {/* Checkpoints with confirmation glow */}
      {checkpoints.map((cp, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: cp.pos,
            top: "50%",
            width: 20,
            height: 20,
            transform: "translate(-50%, -50%)",
            background: "rgba(255,255,255,0.9)",
            border: "2px solid rgba(232,150,124,0.55)",
          }}
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(232,150,124,0.0)",
              "0 0 0 0 rgba(232,150,124,0.0)",
              "0 0 0 20px rgba(232,150,124,0.15)",
              "0 0 0 0 rgba(232,150,124,0.0)",
            ],
          }}
          transition={{
            duration: 4.2,
            delay: i * 1.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Inner confirmation blink */}
          <motion.div
            className="absolute rounded-full"
            style={{
              inset: 4,
              background: "rgba(232,150,124,0.7)",
            }}
            animate={{ opacity: [0.3, 0.9, 0.3], scale: [0.8, 1, 0.8] }}
            transition={{
              duration: 4.2,
              delay: i * 1.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      ))}

      {/* Traveling pulse dot */}
      <motion.div
        className="absolute rounded-full"
        style={{
          top: "50%",
          width: 10,
          height: 10,
          transform: "translateY(-50%)",
          background: "rgba(232,150,124,0.95)",
        }}
        animate={{
          left: ["32px", "18%", "48%", "78%", "calc(100% - 32px)", "32px"],
          boxShadow: [
            "0 0 0 0 rgba(232,150,124,0.5)",
            "0 0 0 14px rgba(232,150,124,0)",
            "0 0 0 14px rgba(232,150,124,0)",
            "0 0 0 14px rgba(232,150,124,0)",
            "0 0 0 0 rgba(232,150,124,0.5)",
            "0 0 0 0 rgba(232,150,124,0)",
          ],
        }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Stable aligned blocks */}
      {[
        { t: "20%", w: "52%", l: "24%" },
        { t: "30%", w: "38%", l: "31%" },
        { t: "68%", w: "48%", l: "26%" },
        { t: "78%", w: "42%", l: "29%" },
      ].map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-lg"
          style={{
            top: b.t,
            left: b.l,
            width: b.w,
            height: 12,
            background: "rgba(110,43,255,0.04)",
            border: "1px solid rgba(110,43,255,0.08)",
          }}
          animate={{ opacity: [0.45, 0.8, 0.45] }}
          transition={{ duration: 3.5, delay: i * 0.4, repeat: Infinity }}
        />
      ))}
    </div>
  );
};

/* ── Main Section ── */
const InterfaceSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  const panels = [
    { label: "FRAGMENTED SIGNALS", content: <FragmentedPanel /> },
    { label: "INTELLIGENCE LAYER", content: <IntelligencePanel /> },
    { label: "COORDINATED CARE", content: <CoordinatedPanel /> },
  ];

  return (
    <section
      ref={ref}
      id="features"
      className="relative overflow-hidden"
      style={{
        padding: "120px 0 130px",
        background: `
          radial-gradient(900px 600px at 18% 18%, rgba(191,167,255,0.55), transparent 65%),
          radial-gradient(900px 600px at 78% 78%, rgba(242,193,174,0.55), transparent 60%),
          linear-gradient(135deg, #F7F3FF, #FFFFFF)
        `,
      }}
    >
      {/* Warm glow overlay */}
      <div
        className="absolute inset-[-2px] pointer-events-none"
        style={{
          background: "radial-gradient(600px 380px at 62% 48%, rgba(232,150,124,0.18), transparent 70%)",
        }}
      />

      <div
        className="relative z-10 mx-auto"
        style={{ width: "min(1180px, calc(100% - 64px))" }}
      >
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span
            className="inline-block mb-4 font-mono uppercase"
            style={{
              fontSize: 12,
              letterSpacing: "0.28em",
              color: "rgba(18,10,34,0.55)",
            }}
          >
            [ APPLIED INTELLIGENCE ]
          </span>
          <h2
            style={{
              fontSize: "clamp(44px, 5vw, 72px)",
              fontWeight: 900,
              lineHeight: 1.03,
              color: "#120A22",
              letterSpacing: "-0.02em",
              margin: "0 0 16px",
            }}
          >
            Where intelligence meets
            <br />
            care delivery.
          </h2>
          <p
            className="mx-auto"
            style={{
              maxWidth: 760,
              fontSize: 18,
              lineHeight: 1.6,
              color: "rgba(18,10,34,0.68)",
              margin: 0,
            }}
          >
            DocG AI integrates directly into clinical operations — without
            replacing systems, without adding friction.
          </p>
        </motion.div>

        {/* Three Floating Glass Surfaces */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {panels.map((panel, i) => (
            <motion.div
              key={panel.label}
              className="rounded-[28px] overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.42)",
                border: "none",
                boxShadow: "0 40px 120px rgba(18,10,34,0.10)",
              }}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.15 }}
            >
              {/* Panel title */}
              <div
                className="font-mono uppercase"
                style={{
                  padding: "18px 22px",
                  fontSize: 12,
                  letterSpacing: "0.22em",
                  color: "rgba(18,10,34,0.45)",
                }}
              >
                {panel.label}
              </div>

              {/* Inner surface — no border */}
              <div
                className="relative mx-4 mb-4 rounded-[20px] overflow-hidden"
                style={{
                  height: 320,
                  background: "rgba(255,255,255,0.28)",
                  border: "none",
                }}
              >
                {panel.content}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InterfaceSection;
