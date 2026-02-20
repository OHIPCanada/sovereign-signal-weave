import React, { useRef } from "react";
import { useInView } from "framer-motion";

/* ── Reveal wrapper ── */
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(8px)",
        transition: `all 0.8s cubic-bezier(.22,.65,.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ── Proof Tiles ── */
const proofTiles = [
  { num: "4.3×", suffix: "faster", label: "Decision latency", desc: "From hours to minutes" },
  { num: "27%", suffix: "more", label: "Coordination rate", desc: "Tasks resolved per pathway" },
  { num: "38%", suffix: "fewer", label: "Workflow leakage", desc: "Dropped handoffs reduced" },
  { num: "100%", suffix: "traceable", label: "Audit readiness", desc: "Continuous system memory" },
];

/* ── Orbit System Field ── */
function SystemField() {
  return (
    <div className="measure-visual" style={{ perspective: "900px", position: "relative" }}>
      {/* Ground shadow */}
      <div style={{
        position: "absolute",
        bottom: "-18%",
        left: "10%",
        width: "80%",
        height: "40%",
        background: "radial-gradient(ellipse at center, rgba(232,150,124,0.15) 0%, rgba(212,97,107,0.08) 35%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(18px)",
        pointerEvents: "none",
      }} />
      {/* Ambient glow */}
      <div className="ambient-breathe" style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: "110%",
        height: "110%",
        transform: "translate(-50%, -50%)",
        background: "radial-gradient(circle, rgba(123,97,255,0.07) 0%, rgba(232,150,124,0.05) 40%, transparent 65%)",
        filter: "blur(30px)",
        pointerEvents: "none",
      }} />
      <div style={{ transform: "rotateX(35deg) rotateZ(-10deg)", transformStyle: "preserve-3d", position: "relative", width: "100%", height: "100%" }}>
      {/* Signal pulse ring */}
      <div className="pulse-ring" />
      <div className="pulse-ring" style={{ animationDelay: "2s" }} />

      {/* Core */}
      <div className="core" />

      {/* Orbit 1 — innermost, warm */}
      <div className="orbit orbit-1">
        <div className="node" style={{ top: 0, left: "50%", transform: "translate(-50%,-50%)", background: "rgba(212,97,107,0.8)" }} />
        <div className="node" style={{ bottom: 0, left: "50%", transform: "translate(-50%,50%)", background: "rgba(232,150,124,0.75)" }} />
        <div className="node" style={{ top: "50%", left: 0, transform: "translate(-50%,-50%)", background: "rgba(212,97,107,0.7)" }} />
      </div>

      {/* Orbit 2 — middle, violet */}
      <div className="orbit orbit-2">
        <div className="node" style={{ top: 0, left: "30%", transform: "translate(-50%,-50%)" }} />
        <div className="node" style={{ top: "25%", right: 0, transform: "translate(50%,-50%)" }} />
        <div className="node" style={{ bottom: "10%", left: "15%", transform: "translate(-50%,50%)" }} />
        <div className="node" style={{ bottom: 0, right: "30%", transform: "translate(50%,50%)" }} />
      </div>

      {/* Orbit 3 — outer, cool purple */}
      <div className="orbit orbit-3">
        <div className="node node-lg" style={{ top: 0, left: "40%", transform: "translate(-50%,-50%)" }} />
        <div className="node" style={{ top: "20%", right: 0, transform: "translate(50%,-50%)" }} />
        <div className="node node-lg" style={{ bottom: 0, left: "60%", transform: "translate(-50%,50%)" }} />
        <div className="node" style={{ top: "70%", left: 0, transform: "translate(-50%,-50%)" }} />
        <div className="node" style={{ top: "50%", right: "5%", transform: "translate(50%,-50%)" }} />
      </div>

      {/* Orbit 4 — outermost, faint */}
      <div className="orbit orbit-4">
        <div className="node node-sm" style={{ top: 0, left: "25%", transform: "translate(-50%,-50%)" }} />
        <div className="node node-sm" style={{ bottom: "15%", right: "10%", transform: "translate(50%,50%)" }} />
        <div className="node node-sm" style={{ top: "40%", left: 0, transform: "translate(-50%,-50%)" }} />
      </div>

      <style>{`
        .measure-visual {
          position: relative;
          width: clamp(340px, 42vw, 480px);
          height: clamp(340px, 42vw, 480px);
          margin: 0 auto;
        }

        .core {
          position: absolute;
          width: 72px;
          height: 72px;
          background: radial-gradient(circle, #E8967C 0%, #D4616B 55%, transparent 70%);
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: corePulse 4s ease-in-out infinite;
          box-shadow: 0 0 40px rgba(212,97,107,0.25), 0 0 80px rgba(232,150,124,0.12);
        }

        @keyframes corePulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.9; }
          50% { transform: translate(-50%, -50%) scale(1.08); opacity: 1; }
        }

        .orbit {
          position: absolute;
          border: 1px solid rgba(123,97,255,0.12);
          border-radius: 50%;
          top: 50%;
          left: 50%;
        }

        .orbit-1 {
          width: 160px;
          height: 160px;
          transform: translate(-50%, -50%);
          animation: orbitRotate 28s linear infinite;
          border-color: rgba(212,97,107,0.2);
        }

        .orbit-2 {
          width: 260px;
          height: 260px;
          transform: translate(-50%, -50%);
          animation: orbitRotate 42s linear infinite reverse;
          border-color: rgba(123,97,255,0.15);
        }

        .orbit-3 {
          width: 360px;
          height: 360px;
          transform: translate(-50%, -50%);
          animation: orbitRotate 58s linear infinite;
          border-color: rgba(123,97,255,0.1);
        }

        .orbit-4 {
          width: 440px;
          height: 440px;
          transform: translate(-50%, -50%);
          animation: orbitRotate 75s linear infinite reverse;
          border-color: rgba(123,97,255,0.06);
        }

        @keyframes orbitRotate {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        .node {
          position: absolute;
          width: 8px;
          height: 8px;
          background: rgba(123,97,255,0.65);
          border-radius: 50%;
          box-shadow: 0 0 6px rgba(123,97,255,0.3);
        }

        .node-lg {
          width: 10px;
          height: 10px;
          background: rgba(123,97,255,0.5);
          box-shadow: 0 0 10px rgba(123,97,255,0.25);
        }

        .node-sm {
          width: 5px;
          height: 5px;
          background: rgba(123,97,255,0.35);
          box-shadow: 0 0 4px rgba(123,97,255,0.15);
        }

        .pulse-ring {
          position: absolute;
          width: 80px;
          height: 80px;
          border: 1px solid rgba(232,150,124,0.4);
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: signalPulse 4.5s ease-out infinite;
        }

        @keyframes signalPulse {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
          100% { transform: translate(-50%, -50%) scale(4.5); opacity: 0; }
        }

        .ambient-breathe {
          animation: ambientBreathe 6s ease-in-out infinite;
        }

        @keyframes ambientBreathe {
          0%, 100% { opacity: 0.7; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.08); }
        }
      `}</style>
      </div>
    </div>
  );
}

/* ── Section 5 ── */
export default function ProofSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        padding: "clamp(64px, 7vw, 110px) 0",
        background: `
          radial-gradient(900px 600px at 85% 85%, rgba(242,193,174,0.35), transparent 60%),
          radial-gradient(800px 500px at 15% 10%, rgba(205,188,232,0.45), transparent 60%),
          linear-gradient(135deg, #F4EFFA 0%, #E9DFF4 50%, #F8F4FB 100%)
        `,
        color: "#1B0F2E",
      }}
    >
      <div className="relative z-10 mx-auto" style={{ width: "min(1400px, 94vw)" }}>
        {/* Top: Left text + Right system field */}
        <div
          className="grid grid-cols-1 lg:grid-cols-[0.45fr_1.55fr] items-center"
          style={{ gap: "clamp(80px, 10vw, 160px)" }}
        >
          {/* Left content */}
          <div className="flex flex-col">
            <Reveal>
              <p
                className="font-mono uppercase mb-5"
                style={{
                  fontSize: 12,
                  letterSpacing: "0.22em",
                  color: "rgba(20, 10, 42, 0.45)",
                }}
              >
                [ SYSTEM PROOF ]
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <h2
                className="mb-5"
                style={{
                  fontSize: "clamp(44px, 5.2vw, 84px)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.02em",
                  fontWeight: 800,
                  color: "#1B0F2E",
                  textShadow: "0 10px 40px rgba(0,0,0,0.08)",
                }}
              >
                Intelligence you can{" "}
                <span
                  style={{
                    background: "linear-gradient(90deg, #D4616B, #E8967C)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  measure.
                </span>
              </h2>
            </Reveal>

            <Reveal delay={0.2}>
              <p
                style={{
                  fontSize: "clamp(15px, 1.25vw, 18px)",
                  lineHeight: 1.55,
                  maxWidth: "46ch",
                  color: "rgba(27, 15, 46, 0.72)",
                }}
              >
                DocG AI turns fragmented clinical signals into coordinated actions—at system scale.
              </p>
            </Reveal>
          </div>

          {/* Right: System Field — no card, floating in space */}
          <Reveal delay={0.25}>
            <SystemField />
          </Reveal>
        </div>

        {/* Instrument-grade metrics */}
        <div
          className="grid grid-cols-2 md:grid-cols-4"
          style={{ gap: "clamp(20px, 3vw, 40px)", marginTop: 72 }}
        >
          {proofTiles.map((tile, i) => (
            <Reveal key={tile.label} delay={0.3 + i * 0.08}>
              <div
                style={{
                  borderTop: "1px solid rgba(27,15,46,0.15)",
                  paddingTop: 20,
                }}
              >
                <p style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em", color: "#1B0F2E" }}>
                  {tile.num}{" "}
                  <span style={{ fontSize: 18, fontWeight: 600, opacity: 0.7 }}>{tile.suffix}</span>
                </p>
                <p style={{ marginTop: 6, fontSize: 14, fontWeight: 600, color: "#1B0F2E" }}>
                  {tile.label}
                </p>
                <p style={{ marginTop: 4, fontSize: 13, opacity: 0.6 }}>
                  {tile.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
