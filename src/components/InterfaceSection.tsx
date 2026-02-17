import { motion, useInView } from "framer-motion";
import { useRef } from "react";

/* ── tiny UI blocks for panels ── */
const FragmentBlock = ({ x, y, w, h, delay }: { x: number; y: number; w: number; h: number; delay: number }) => (
  <motion.div
    className="absolute rounded-md"
    style={{
      left: `${x}%`,
      top: `${y}%`,
      width: w,
      height: h,
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.06)",
    }}
    animate={{ x: [0, 3, -2, 0], y: [0, -2, 3, 0], opacity: [0.35, 0.5, 0.3, 0.35] }}
    transition={{ duration: 4 + delay, repeat: Infinity, ease: "easeInOut" }}
  />
);

const CoordinatedBlock = ({ x, y, w, h, delay }: { x: number; y: number; w: number; h: number; delay: number }) => (
  <motion.div
    className="absolute rounded-lg"
    style={{
      left: `${x}%`,
      top: `${y}%`,
      width: w,
      height: h,
      background: "rgba(155,123,255,0.06)",
      border: "1px solid rgba(155,123,255,0.12)",
    }}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: [0.6, 0.9, 0.6], scale: [0.98, 1, 0.98] }}
    transition={{ duration: 3, delay, repeat: Infinity, ease: "easeInOut" }}
  />
);

/* ── Panel components ── */
const FragmentedPanel = () => (
  <div className="relative w-full h-full overflow-hidden">
    {/* Scattered dim blocks with jitter */}
    <FragmentBlock x={10} y={8} w={72} h={28} delay={0} />
    <FragmentBlock x={55} y={15} w={56} h={20} delay={0.8} />
    <FragmentBlock x={20} y={35} w={48} h={32} delay={1.2} />
    <FragmentBlock x={60} y={50} w={64} h={24} delay={0.4} />
    <FragmentBlock x={8} y={62} w={40} h={28} delay={1.6} />
    <FragmentBlock x={45} y={75} w={80} h={20} delay={0.6} />
    <FragmentBlock x={15} y={85} w={52} h={16} delay={1} />

    {/* Dim disconnected lines */}
    {[25, 45, 68].map((top) => (
      <div
        key={top}
        className="absolute left-[15%] right-[15%]"
        style={{
          top: `${top}%`,
          height: 1,
          background: "rgba(255,255,255,0.04)",
        }}
      />
    ))}
  </div>
);

const IntelligencePanel = () => (
  <div className="relative w-full h-full overflow-hidden">
    {/* Scan beam */}
    <motion.div
      className="absolute left-0 w-full"
      style={{
        height: 120,
        background: "linear-gradient(to bottom, transparent, rgba(232,150,124,0.25), transparent)",
        pointerEvents: "none",
      }}
      animate={{ top: ["-120px", "100%"] }}
      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
    />

    {/* Elements that glow when scanned */}
    {[
      { x: 12, y: 12, w: 80, h: 32 },
      { x: 30, y: 30, w: 60, h: 24 },
      { x: 8, y: 48, w: 90, h: 28 },
      { x: 25, y: 65, w: 70, h: 20 },
      { x: 15, y: 80, w: 50, h: 24 },
    ].map((b, i) => (
      <motion.div
        key={i}
        className="absolute rounded-md"
        style={{
          left: `${b.x}%`,
          top: `${b.y}%`,
          width: b.w,
          height: b.h,
          background: "rgba(155,123,255,0.04)",
          border: "1px solid rgba(155,123,255,0.08)",
        }}
        animate={{
          borderColor: [
            "rgba(155,123,255,0.08)",
            "rgba(232,150,124,0.35)",
            "rgba(155,123,255,0.08)",
          ],
          boxShadow: [
            "0 0 0 0 rgba(232,150,124,0)",
            "0 0 16px 2px rgba(232,150,124,0.15)",
            "0 0 0 0 rgba(232,150,124,0)",
          ],
        }}
        transition={{
          duration: 5,
          delay: (i * 5) / 5,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    ))}

    {/* Brief connection lines */}
    {[
      { x1: "45%", y1: "28%", x2: "55%", y2: "48%" },
      { x1: "30%", y1: "54%", x2: "60%", y2: "65%" },
    ].map((l, i) => (
      <motion.svg
        key={i}
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: "none" }}
      >
        <motion.line
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke="rgba(232,150,124,0.3)"
          strokeWidth={1}
          animate={{ opacity: [0, 0.6, 0] }}
          transition={{
            duration: 5,
            delay: i * 2 + 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.svg>
    ))}
  </div>
);

const CoordinatedPanel = () => (
  <div className="relative w-full h-full overflow-hidden">
    {/* Aligned, smooth elements */}
    <CoordinatedBlock x={10} y={10} w={100} h={36} delay={0} />
    <CoordinatedBlock x={10} y={28} w={100} h={28} delay={0.3} />
    <CoordinatedBlock x={10} y={48} w={100} h={32} delay={0.6} />
    <CoordinatedBlock x={10} y={66} w={100} h={24} delay={0.9} />
    <CoordinatedBlock x={10} y={80} w={100} h={28} delay={1.2} />

    {/* Soft connecting lines */}
    {[22, 42, 60, 76].map((top, i) => (
      <motion.div
        key={i}
        className="absolute left-[10%] right-[10%]"
        style={{
          top: `${top}%`,
          height: 1,
          background: "rgba(155,123,255,0.12)",
        }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 3, delay: i * 0.4, repeat: Infinity }}
      />
    ))}

    {/* Coral pulse dot */}
    <motion.div
      className="absolute"
      style={{
        left: "50%",
        top: "50%",
        width: 12,
        height: 12,
        marginLeft: -6,
        marginTop: -6,
        background: "#E8967C",
        borderRadius: "50%",
      }}
      animate={{
        boxShadow: [
          "0 0 0 0 rgba(232,150,124,0.6)",
          "0 0 0 16px rgba(232,150,124,0)",
          "0 0 0 0 rgba(232,150,124,0)",
        ],
      }}
      transition={{ duration: 2.5, repeat: Infinity }}
    />

    {/* Outward pulse ring */}
    <motion.div
      className="absolute rounded-full"
      style={{
        left: "50%",
        top: "50%",
        width: 60,
        height: 60,
        marginLeft: -30,
        marginTop: -30,
        border: "1px solid rgba(232,150,124,0.15)",
      }}
      animate={{ scale: [0.5, 1.5], opacity: [0.5, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
    />
  </div>
);

/* ── Main Section ── */
const InterfaceSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  const panels = [
    {
      label: "FRAGMENTED SIGNALS",
      content: <FragmentedPanel />,
      labelColor: "rgba(255,255,255,0.3)",
    },
    {
      label: "INTELLIGENCE LAYER",
      content: <IntelligencePanel />,
      labelColor: "rgba(232,150,124,0.7)",
    },
    {
      label: "COORDINATED CARE",
      content: <CoordinatedPanel />,
      labelColor: "rgba(155,123,255,0.7)",
    },
  ];

  return (
    <section
      ref={ref}
      id="features"
      className="relative overflow-hidden"
      style={{
        padding: "clamp(80px, 9vw, 140px) 0",
        background: "radial-gradient(circle at top left, #1a0833 0%, #090016 100%)",
      }}
    >
      {/* Noise overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span
            className="inline-block mb-5 font-mono text-xs tracking-[0.25em] uppercase"
            style={{ color: "rgba(232,150,124,0.6)" }}
          >
            [ APPLIED INTELLIGENCE ]
          </span>
          <h2
            style={{
              color: "#F3EFFF",
              fontWeight: 800,
              fontSize: "clamp(36px, 4.5vw, 72px)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            Where intelligence meets
            <br />
            care delivery.
          </h2>
          <p
            className="mt-5 mx-auto"
            style={{
              color: "rgba(243,239,255,0.45)",
              fontSize: "clamp(15px, 1.25vw, 18px)",
              lineHeight: 1.65,
              maxWidth: "580px",
            }}
          >
            DocG AI integrates directly into clinical operations — without replacing systems, without adding friction.
          </p>
        </motion.div>

        {/* Three Panels */}
        <div className="flex flex-col lg:flex-row items-stretch justify-center gap-6 lg:gap-10">
          {panels.map((panel, i) => (
            <motion.div
              key={panel.label}
              className="flex-1 max-w-[380px] mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.15 }}
            >
              {/* Panel visual */}
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  height: 420,
                  background: "rgba(255,255,255,0.03)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {panel.content}
              </div>
              {/* Label */}
              <p
                className="mt-4 text-center font-mono text-xs tracking-[0.2em] uppercase"
                style={{ color: panel.labelColor }}
              >
                {panel.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InterfaceSection;
