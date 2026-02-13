import { useRef, useCallback, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ─── AI CORTEX ─── Orbital particle ring with glowing core */
const CortexViz = () => {
  const rings = [
    { r: 62, count: 60, speed: 50 },
    { r: 44, count: 36, speed: 38 },
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Central core glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 48, height: 48, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,.35), rgba(180,150,255,.3) 50%, transparent 80%)",
          boxShadow: "0 0 40px 12px rgba(160,130,255,.25), 0 0 80px 20px rgba(123,97,255,.12)",
          animation: "glowPulse 3.5s ease-in-out infinite",
        }}
      />
      {/* Inner white dot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,.9)" }}
      />
      {/* Rings */}
      {rings.map((ring, ri) => (
        <svg key={ri} className="absolute top-1/2 left-1/2"
          width={ring.r * 2 + 20} height={ring.r * 2 + 20}
          viewBox={`0 0 ${ring.r * 2 + 20} ${ring.r * 2 + 20}`}
          style={{
            transform: `translate(-50%, -50%) ${ri === 1 ? "rotate(30deg)" : ""}`,
            animation: `slowSpin ${ring.speed}s linear infinite ${ri === 1 ? "reverse" : ""}`,
          }}
        >
          {/* Orbit path */}
          <circle cx={ring.r + 10} cy={ring.r + 10} r={ring.r}
            fill="none" stroke="rgba(180,160,255,.12)" strokeWidth="1"
            strokeDasharray="4 6"
          />
          {/* Dots */}
          {Array.from({ length: ring.count }, (_, i) => {
            const angle = (i / ring.count) * Math.PI * 2;
            const x = (ring.r + 10) + Math.cos(angle) * ring.r;
            const y = (ring.r + 10) + Math.sin(angle) * ring.r;
            const isGap = i % 8 === 0;
            const isAccent = i === 5 || i === 23 || i === 41;
            if (isGap) return null;
            return (
              <circle key={i} cx={x} cy={y}
                r={isAccent ? 2.8 : 1.8}
                fill={isAccent ? "rgba(232,150,124,1)" : "rgba(200,180,255,.85)"}
              />
            );
          })}
        </svg>
      ))}
    </div>
  );
};

/* ─── WORKFLOW ORCHESTRATION ─── Signal rails with traveling pulses */
const WorkflowViz = () => {
  const rails = [
    { y: "28%", packets: [{ delay: 0, dur: 8 }, { delay: 3, dur: 9 }, { delay: 6.5, dur: 8 }], opacity: 1 },
    { y: "50%", packets: [{ delay: 1.2, dur: 11 }, { delay: 5.5, dur: 10 }], opacity: 0.8 },
    { y: "72%", packets: [{ delay: 0.5, dur: 7 }, { delay: 4, dur: 9 }, { delay: 8, dur: 7 }], opacity: 0.6 },
  ];

  return (
    <div className="relative w-full h-full">
      {rails.map((rail, ri) => (
        <div key={ri} className="absolute left-0 right-0" style={{ top: rail.y, transform: "translateY(-50%)" }}>
          {/* Rail line */}
          <div className="absolute inset-x-4 h-px" style={{
            background: `linear-gradient(90deg, transparent, rgba(180,160,255,${0.25 * rail.opacity}), rgba(180,160,255,${0.2 * rail.opacity}), transparent)`,
          }} />
          {/* Static checkpoint nodes */}
          {[25, 50, 75].map((pos, ni) => (
            <div key={ni} className="absolute top-1/2 -translate-y-1/2" style={{
              left: `${pos}%`, width: 6, height: 6, borderRadius: "50%",
              background: "rgba(200,185,255,.45)",
              boxShadow: "0 0 8px 2px rgba(160,130,255,.15)",
            }} />
          ))}
          {/* Traveling pulses */}
          {rail.packets.map((pkt, pi) => (
            <div key={pi} className="absolute top-1/2" style={{
              width: 10, height: 10, borderRadius: "50%", marginTop: -5,
              background: "rgba(220,210,255,.95)",
              boxShadow: "0 0 12px 4px rgba(180,150,255,.4), 0 0 24px 8px rgba(123,97,255,.15)",
              animation: `s2Flow ${pkt.dur}s linear ${pkt.delay}s infinite`,
            }} />
          ))}
        </div>
      ))}
    </div>
  );
};

/* ─── SOVEREIGN DATA PLANE ─── Vault grid with breathing lock node */
const DataPlaneViz = () => (
  <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
    {/* Coral ambient glow */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{
        width: 140, height: 140, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(232,150,124,.35), rgba(212,97,107,.15) 50%, transparent 75%)",
        filter: "blur(20px)",
      }}
    />
    {/* Grid */}
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
      {/* Vertical lines */}
      {Array.from({ length: 12 }, (_, i) => {
        const x = ((i + 1) / 13) * 100;
        return <line key={`v${i}`} x1={`${x}%`} y1="10%" x2={`${x}%`} y2="90%" stroke="rgba(200,180,255,.07)" strokeWidth="1" />;
      })}
      {/* Horizontal lines */}
      {Array.from({ length: 6 }, (_, i) => {
        const y = 15 + (i * 14);
        return <line key={`h${i}`} x1="8%" y1={`${y}%`} x2="92%" y2={`${y}%`} stroke="rgba(200,180,255,.07)" strokeWidth="1" />;
      })}
    </svg>
    {/* Vault boundary */}
    <div className="absolute" style={{
      width: "70%", height: "75%", borderRadius: 16,
      border: "1px solid rgba(200,180,255,.1)",
      boxShadow: "inset 0 0 30px rgba(123,97,255,.04)",
    }} />
    {/* Central lock node */}
    <div className="relative">
      <div style={{
        width: 16, height: 16, borderRadius: "50%",
        background: "rgba(232,150,124,.85)",
        boxShadow: "0 0 16px 6px rgba(232,150,124,.3), 0 0 40px 12px rgba(212,97,107,.12)",
        animation: "glowPulse 3.5s ease-in-out infinite",
      }} />
      {/* Orbit rings around node */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 42, height: 42, borderRadius: "50%",
          border: "1px solid rgba(232,150,124,.25)",
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 68, height: 68, borderRadius: "50%",
          border: "1px solid rgba(232,150,124,.1)",
        }}
      />
    </div>
  </div>
);

/* ─── Card data ─── */
const layers = [
  { label: "AI Cortex", subtitle: "Reasoning · Context · Decision Support", Viz: CortexViz },
  { label: "Workflow Orchestration", subtitle: "Routing · Decisions · Clinical Ops", Viz: WorkflowViz },
  { label: "Sovereign Data Plane", subtitle: "Storage · Policy · Jurisdictional Control", Viz: DataPlaneViz },
];

const ManifestoSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardTransforms, setCardTransforms] = useState<string[]>(["", "", ""]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const headlineOpacity = useTransform(scrollYProgress, [0.06, 0.22], [0, 1]);
  const headlineY = useTransform(scrollYProgress, [0.06, 0.22], [36, 0]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    setCardTransforms(
      [0, 1, 2].map((i) => {
        const depth = (i + 1) * 0.5;
        return `perspective(1200px) rotateY(${x * 2 * depth}deg) rotateX(${-y * 1.5 * depth}deg)`;
      })
    );
  }, []);

  const handleMouseLeave = useCallback(() => {
    setCardTransforms(["", "", ""]);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return (
    <section
      ref={containerRef}
      id="intelligence-layer"
      className="relative overflow-hidden"
      style={{ padding: "clamp(64px, 7vw, 110px) 0" }}
    >
      {/* Background */}
      <div className="absolute inset-0" style={{
        background: `
          radial-gradient(900px 600px at 18% 38%, rgba(143,83,255,0.45), transparent 60%),
          radial-gradient(700px 520px at 78% 22%, rgba(255,192,174,0.18), transparent 62%),
          radial-gradient(900px 700px at 70% 75%, rgba(212,97,107,0.14), transparent 66%),
          linear-gradient(135deg, #1A0630 0%, #3A0B6E 48%, #5B1FA6 120%)
        `,
        filter: "saturate(1.08)",
      }} />

      <div className="relative z-10" style={{ width: "min(1180px, calc(100% - 48px))", margin: "0 auto" }}>
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] items-start" style={{ gap: "clamp(24px, 4vw, 64px)" }}>
          {/* Left — Copy */}
          <motion.div style={{ opacity: headlineOpacity, y: headlineY }}>
            <p className="mb-5 mono-label" style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, letterSpacing: "0.22em" }}>
              [ THE INTELLIGENCE LAYER ]
            </p>
            <h2 className="mb-5" style={{
              color: "rgba(255,255,255,0.95)",
              fontWeight: 800,
              lineHeight: 0.95,
              fontSize: "clamp(44px, 5.2vw, 84px)",
              textShadow: "0 10px 40px rgba(0,0,0,0.22)",
            }}>
              Healthcare<br />runs on<br />intelligence<br />now.
            </h2>
            <p style={{ color: "rgba(255,255,255,0.72)", fontWeight: 400, fontSize: "clamp(15px, 1.25vw, 18px)", lineHeight: 1.55, maxWidth: "46ch" }}>
              Three system planes running beneath every clinical workflow — reasoning, orchestration, and sovereign data governance — engineered as infrastructure, not features.
            </p>
          </motion.div>

          {/* Right — Cards */}
          <div className="relative">
            <div className="absolute pointer-events-none" style={{
              top: "-10%", left: "5%", width: "90%", height: "120%",
              background: "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(160,130,240,0.12) 0%, transparent 65%)",
            }} />
            <div className="relative z-10 flex flex-col gap-4">
              {layers.map((layer, i) => (
                <motion.article
                  key={layer.label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
                  whileHover={{ y: -4 }}
                  className="relative rounded-[20px] overflow-hidden"
                  style={{
                    background: "linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.025))",
                    border: "1px solid rgba(255,255,255,0.12)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
                    padding: "20px",
                    transform: cardTransforms[i] || "none",
                    transition: "transform 0.15s ease-out",
                  }}
                >
                  {/* Subtle inner highlight */}
                  <div className="absolute inset-0 pointer-events-none rounded-[20px]"
                    style={{ background: "radial-gradient(600px 250px at 15% 20%, rgba(255,255,255,0.06), transparent 50%)" }}
                  />

                  {/* Header */}
                  <div className="relative mb-3">
                    <div style={{ fontWeight: 600, fontSize: 17, color: "rgba(255,255,255,0.95)", letterSpacing: "-0.01em" }}>
                      {layer.label}
                    </div>
                    <div style={{ fontWeight: 400, fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 3 }}>
                      {layer.subtitle}
                    </div>
                  </div>

                  {/* Visualization — FIXED equal height */}
                  <div className="relative rounded-xl overflow-hidden" style={{
                    height: 150,
                    background: "rgba(0,0,0,0.2)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}>
                    <layer.Viz />
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManifestoSection;
