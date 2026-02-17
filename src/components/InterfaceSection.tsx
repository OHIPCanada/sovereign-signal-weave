import { motion, useInView } from "framer-motion";
import { useRef } from "react";

/* ── Panel 1: Fragmented Signals ── */
const FragmentedPanel = () => (
  <div className="relative w-full h-full overflow-hidden">
    {/* Ghost rows */}
    {[80, 150, 225].map((top) => (
      <div
        key={top}
        className="absolute left-4 right-4"
        style={{ top, height: 1, background: "rgba(18,10,34,0.10)" }}
      />
    ))}

    {/* Jittery pills */}
    {[
      { w: 92, l: 18, t: 40, delay: 0 },
      { w: 68, l: 190, t: 62, delay: 0.4 },
      { w: 110, l: 140, t: 116, delay: 0.8 },
      { w: 78, l: 32, t: 176, delay: 1.2 },
      { w: 98, l: 210, t: 206, delay: 1.6 },
      { w: 72, l: 60, t: 258, delay: 2.0 },
    ].map((p, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{
          width: p.w,
          height: 18,
          left: p.l,
          top: p.t,
          background: "rgba(18,10,34,0.08)",
          border: "1px solid rgba(18,10,34,0.08)",
        }}
        animate={{
          x: [0, 3, -2, 0],
          y: [0, -2, 2, 0],
          opacity: [0.85, 0.65, 0.78, 0.85],
        }}
        transition={{
          duration: 4,
          delay: p.delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    ))}

    {/* Noise dots */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: "radial-gradient(rgba(18,10,34,0.08) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
        opacity: 0.22,
        mixBlendMode: "multiply",
      }}
    />
  </div>
);

/* ── Panel 2: Intelligence Layer ── */
const IntelligencePanel = () => (
  <div className="relative w-full h-full overflow-hidden">
    {/* Strong scan beam */}
    <motion.div
      className="absolute left-0 w-full pointer-events-none"
      style={{
        height: 140,
        background:
          "linear-gradient(to bottom, transparent 0%, rgba(232,150,124,0.0) 30%, rgba(232,150,124,0.35) 50%, rgba(232,150,124,0.0) 70%, transparent 100%)",
        filter: "blur(12px)",
        mixBlendMode: "multiply",
      }}
      animate={{ top: ["-140px", "115%"] }}
      transition={{ duration: 3.8, repeat: Infinity, ease: "linear" }}
    />

    {/* SVG wires with animated dash */}
    <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
      <motion.path
        d="M 30 110 C 80 90, 130 150, 200 130"
        fill="none"
        stroke="rgba(110,43,255,0.34)"
        strokeWidth={2.2}
        strokeDasharray="6 8"
        animate={{ strokeDashoffset: [0, -120] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
        style={{ opacity: 0.75 }}
      />
      <motion.path
        d="M 50 180 C 120 160, 160 220, 260 190"
        fill="none"
        stroke="rgba(191,167,255,0.45)"
        strokeWidth={2.2}
        strokeDasharray="6 8"
        animate={{ strokeDashoffset: [0, -120] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "linear" }}
        style={{ opacity: 0.75 }}
      />
      <motion.path
        d="M 80 240 C 140 220, 200 270, 280 250"
        fill="none"
        stroke="rgba(232,150,124,0.35)"
        strokeWidth={2.2}
        strokeDasharray="6 8"
        animate={{ strokeDashoffset: [0, -120] }}
        transition={{ duration: 3.0, repeat: Infinity, ease: "linear" }}
        style={{ opacity: 0.75 }}
      />
    </svg>

    {/* Pulsing nodes */}
    {[
      { l: "18%", t: "34%" },
      { l: "46%", t: "58%" },
      { l: "68%", t: "42%" },
      { l: "82%", t: "64%" },
    ].map((n, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{
          left: n.l,
          top: n.t,
          width: 10,
          height: 10,
          background: "rgba(110,43,255,0.75)",
          boxShadow: "0 0 0 10px rgba(110,43,255,0.12)",
        }}
        animate={{
          scale: [1, 1.35, 1],
          opacity: [0.85, 1, 0.85],
        }}
        transition={{
          duration: 2.6,
          delay: i * 0.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

/* ── Panel 3: Coordinated Care ── */
const CoordinatedPanel = () => (
  <div className="relative w-full h-full overflow-hidden">
    {/* Flow line */}
    <div
      className="absolute"
      style={{
        left: 40,
        right: 40,
        top: "50%",
        height: 2,
        background:
          "linear-gradient(90deg, rgba(110,43,255,0.20), rgba(232,150,124,0.55), rgba(110,43,255,0.20))",
        opacity: 0.95,
      }}
    />

    {/* Checkpoints */}
    {[90, "calc(50% - 9px)", undefined].map((left, i) => (
      <div
        key={i}
        className="absolute rounded-full"
        style={{
          top: "calc(50% - 9px)",
          width: 18,
          height: 18,
          background: "rgba(255,255,255,0.85)",
          border: "2px solid rgba(232,150,124,0.65)",
          boxShadow: "0 0 0 14px rgba(232,150,124,0.14)",
          ...(i === 0
            ? { left: 90 }
            : i === 1
            ? { left: "50%", transform: "translateX(-50%)" }
            : { right: 90 }),
        }}
      />
    ))}

    {/* Traveling pulse dot */}
    <motion.div
      className="absolute rounded-full"
      style={{
        top: "calc(50% - 6px)",
        width: 12,
        height: 12,
        background: "rgba(232,150,124,0.95)",
      }}
      animate={{
        left: ["60px", "calc(50% - 6px)", "calc(100% - 72px)", "60px"],
        boxShadow: [
          "0 0 0 0 rgba(232,150,124,0.45)",
          "0 0 0 16px rgba(232,150,124,0)",
          "0 0 0 0 rgba(232,150,124,0.40)",
          "0 0 0 0 rgba(232,150,124,0)",
        ],
      }}
      transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
    />

    {/* Aligned stable blocks above/below */}
    {[
      { t: "18%", w: "55%" },
      { t: "28%", w: "40%" },
      { t: "70%", w: "50%" },
      { t: "80%", w: "45%" },
    ].map((b, i) => (
      <motion.div
        key={i}
        className="absolute left-[22%] rounded-lg"
        style={{
          top: b.t,
          width: b.w,
          height: 14,
          background: "rgba(110,43,255,0.06)",
          border: "1px solid rgba(110,43,255,0.10)",
        }}
        animate={{ opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 3, delay: i * 0.3, repeat: Infinity }}
      />
    ))}
  </div>
);

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

        {/* Three Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[22px] items-stretch">
          {panels.map((panel, i) => (
            <motion.div
              key={panel.label}
              className="rounded-[26px] overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.62)",
                border: "1px solid rgba(110,43,255,0.16)",
                boxShadow: "0 30px 80px rgba(18,10,34,0.14)",
              }}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.15 }}
            >
              {/* Panel title */}
              <div
                className="font-mono uppercase"
                style={{
                  padding: "18px 20px",
                  fontSize: 12,
                  letterSpacing: "0.22em",
                  color: "rgba(18,10,34,0.55)",
                }}
              >
                {panel.label}
              </div>

              {/* Panel surface */}
              <div
                className="relative mx-4 mb-4 rounded-[20px] overflow-hidden"
                style={{
                  height: 320,
                  background: "rgba(255,255,255,0.42)",
                  border: "1px solid rgba(110,43,255,0.10)",
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
