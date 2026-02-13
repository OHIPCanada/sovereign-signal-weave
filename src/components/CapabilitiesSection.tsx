import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/* ───── SVG Visuals ───── */

const ParticleRing = () => {
  const dots = Array.from({ length: 100 }, (_, i) => {
    const angle = (i / 100) * Math.PI * 2;
    const r = 90;
    const x = 150 + Math.cos(angle) * r;
    const y = 150 + Math.sin(angle) * r;
    // Create gaps
    const isGap = i % 12 === 0 || i % 17 === 0;
    const isCoral = i === 23 || i === 67;
    return { x, y, isGap, isCoral };
  });

  return (
    <div className="relative w-full flex items-center justify-center" style={{ height: 260 }}>
      {/* Core glow */}
      <div
        className="absolute"
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(123,97,255,.45), rgba(123,97,255,.1) 60%, transparent 80%)",
          animation: "glowPulse 3.5s ease-in-out infinite",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
      {/* Rotating ring */}
      <svg
        width="300"
        height="300"
        viewBox="0 0 300 300"
        style={{ animation: "slowSpin 50s linear infinite" }}
      >
        {dots.map((d, i) =>
          d.isGap ? null : (
            <circle
              key={i}
              cx={d.x}
              cy={d.y}
              r={d.isCoral ? 2.2 : 1.6}
              fill={d.isCoral ? "rgba(212,97,107,.85)" : "rgba(123,97,255,.7)"}
              opacity={0.5 + Math.random() * 0.4}
            />
          )
        )}
      </svg>
    </div>
  );
};

const WorkflowRails = () => {
  const rails = [
    { y: 55, packets: [{ delay: 0, dur: 10 }, { delay: 4, dur: 10 }, { delay: 7.5, dur: 10 }] },
    { y: 100, packets: [{ delay: 1, dur: 12 }, { delay: 6, dur: 12 }] },
    { y: 145, packets: [{ delay: 2, dur: 8 }, { delay: 5, dur: 8 }, { delay: 9, dur: 8 }] },
  ];

  return (
    <div className="relative w-full flex items-center justify-center" style={{ height: 260 }}>
      <svg width="100%" height="200" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet">
        {rails.map((rail, ri) => (
          <g key={ri}>
            {/* Rail line */}
            <line
              x1="20"
              y1={rail.y}
              x2="380"
              y2={rail.y}
              stroke="rgba(255,255,255,.08)"
              strokeWidth="1"
            />
            {/* Packets */}
            {rail.packets.map((pkt, pi) => (
              <circle key={pi} r="4" cy={rail.y} fill="rgba(123,97,255,.65)">
                <animate
                  attributeName="cx"
                  values="20;380"
                  dur={`${pkt.dur}s`}
                  begin={`${pkt.delay}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0;.7;.7;0"
                  dur={`${pkt.dur}s`}
                  begin={`${pkt.delay}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
};

const VaultField = () => (
  <div className="relative w-full flex items-center justify-center" style={{ height: 260 }}>
    {/* Coral accent glow */}
    <div
      className="absolute"
      style={{
        width: 120,
        height: 120,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(212,97,107,.45), rgba(232,150,124,.2), rgba(242,193,174,0))",
        filter: "blur(18px)",
        opacity: 0.5,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    />
    <svg width="280" height="220" viewBox="0 0 280 220">
      {/* Vault rectangle */}
      <rect
        x="30"
        y="20"
        width="220"
        height="180"
        rx="20"
        fill="none"
        stroke="rgba(255,255,255,.08)"
        strokeWidth="1"
      />
      {/* Faint grid inside */}
      {Array.from({ length: 9 }, (_, i) => (
        <line
          key={`v${i}`}
          x1={30 + (i + 1) * 22}
          y1="20"
          x2={30 + (i + 1) * 22}
          y2="200"
          stroke="rgba(255,255,255,.04)"
          strokeWidth="1"
        />
      ))}
      {Array.from({ length: 7 }, (_, i) => (
        <line
          key={`h${i}`}
          x1="30"
          y1={20 + (i + 1) * 22.5}
          x2="250"
          y2={20 + (i + 1) * 22.5}
          stroke="rgba(255,255,255,.04)"
          strokeWidth="1"
        />
      ))}
      {/* Central lock node */}
      <circle cx="140" cy="110" r="8" fill="rgba(212,97,107,.6)">
        <animate
          attributeName="opacity"
          values=".5;.85;.5"
          dur="3.5s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="140" cy="110" r="18" fill="none" stroke="rgba(212,97,107,.2)" strokeWidth="1" />
    </svg>
  </div>
);

/* ───── Card Data ───── */

const cards = [
  {
    title: "AI Cortex",
    line: "Reasoning layer that routes clinical decisions.",
    Visual: ParticleRing,
  },
  {
    title: "Workflow Orchestration",
    line: "Signals that move across pathways, calmly.",
    Visual: WorkflowRails,
  },
  {
    title: "Sovereign Data Plane",
    line: "Policy, storage, jurisdiction — enforced automatically.",
    Visual: VaultField,
  },
];

/* ───── Main Section ───── */

const CapabilitiesSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{
        padding: "clamp(72px, 10vw, 120px) 0",
        background: `
          radial-gradient(1200px 700px at 15% 25%, rgba(123,97,255,.18), transparent 60%),
          radial-gradient(900px 600px at 85% 65%, rgba(212,97,107,.14), transparent 62%),
          radial-gradient(700px 420px at 50% 10%, rgba(255,255,255,.06), transparent 60%),
          linear-gradient(180deg, #07060B 0%, #090716 50%, #07060B 100%)
        `,
      }}
    >
      {/* Star noise */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,.16) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.08,
          filter: "blur(.2px)",
        }}
      />
      {/* Ambient glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: "-30%",
          background: "radial-gradient(circle, rgba(123,97,255,.10), transparent 55%)",
          opacity: 0.35,
          filter: "blur(60px)",
        }}
      />

      <motion.div
        style={{ opacity }}
        className="relative z-10 max-w-7xl mx-auto px-6 md:px-12"
      >
        {/* Header */}
        <div className="mb-16">
          <span
            className="mono-label"
            style={{ color: "rgba(255,255,255,.4)" }}
          >
            [ CAPABILITIES ]
          </span>
          <h2
            className="mt-6"
            style={{
              fontSize: "clamp(32px, 4vw, 52px)",
              fontWeight: 600,
              color: "rgba(255,255,255,.92)",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}
          >
            Built as infrastructure.
          </h2>
          <p
            className="mt-4"
            style={{
              fontSize: "clamp(15px, 1.4vw, 18px)",
              color: "rgba(255,255,255,.55)",
              lineHeight: 1.6,
              maxWidth: 560,
            }}
          >
            Three planes that let healthcare systems reason, route, and govern — quietly.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="flex flex-col"
              style={{
                background: "rgba(12,10,20,.55)",
                border: "1px solid rgba(255,255,255,.08)",
                borderRadius: 28,
                padding: 28,
                minHeight: 420,
                boxShadow:
                  "0 30px 80px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.06)",
                backdropFilter: "blur(14px)",
              }}
            >
              {/* Visual */}
              <card.Visual />

              {/* Text */}
              <div className="mt-auto">
                <h3
                  style={{
                    color: "rgba(255,255,255,.92)",
                    fontWeight: 600,
                    fontSize: 22,
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    color: "rgba(255,255,255,.62)",
                    fontSize: 15,
                    lineHeight: 1.5,
                    marginTop: 8,
                  }}
                >
                  {card.line}
                </p>
              </div>

              {/* CTA */}
              <button
                className="mt-6 self-start transition-colors duration-200"
                style={{
                  display: "inline-flex",
                  padding: "10px 14px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,.12)",
                  color: "rgba(255,255,255,.85)",
                  background: "rgba(255,255,255,.03)",
                  fontSize: 13,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(212,97,107,.4)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(255,255,255,.12)")
                }
              >
                Learn more →
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default CapabilitiesSection;
