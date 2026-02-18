import { motion, useInView } from "framer-motion";
import { useRef } from "react";

/* ── Single Continuous Transformation Canvas ── */
const TransformationCanvas = () => {
  return (
    <div
      className="relative w-full overflow-hidden rounded-[32px]"
      style={{
        height: 420,
        background: "rgba(255,255,255,0.22)",
        boxShadow: "0 40px 120px rgba(18,10,34,0.10)",
      }}
    >
      {/* Horizontal transformation gradient beam */}
      <motion.div
        className="absolute inset-y-0 pointer-events-none"
        style={{
          width: 260,
          background: "linear-gradient(90deg, transparent, rgba(232,150,124,0.22), rgba(110,43,255,0.12), transparent)",
          filter: "blur(30px)",
        }}
        animate={{ left: ["-260px", "110%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Zone labels */}
      {[
        { label: "FRAGMENTED", left: "10%" },
        { label: "CONVERGENCE", left: "45%" },
        { label: "HARMONIZED", left: "80%" },
      ].map((z) => (
        <div
          key={z.label}
          className="absolute font-mono uppercase pointer-events-none"
          style={{
            left: z.left,
            top: 24,
            transform: "translateX(-50%)",
            fontSize: 10,
            letterSpacing: "0.22em",
            color: "rgba(18,10,34,0.30)",
          }}
        >
          {z.label}
        </div>
      ))}

      {/* Subtle vertical zone dividers */}
      {[33.3, 66.6].map((pct) => (
        <div
          key={pct}
          className="absolute pointer-events-none"
          style={{
            left: `${pct}%`,
            top: 50,
            bottom: 20,
            width: 1,
            background: "linear-gradient(to bottom, transparent, rgba(110,43,255,0.08), transparent)",
          }}
        />
      ))}

      {/* ═══ LEFT ZONE: Fragmented chaos ═══ */}
      {[
        { w: 72, x: 3, y: 22, d: 0, r: -3 },
        { w: 55, x: 18, y: 35, d: 0.3, r: 4 },
        { w: 90, x: 5, y: 48, d: 0.6, r: -2 },
        { w: 42, x: 22, y: 60, d: 0.9, r: 5 },
        { w: 68, x: 8, y: 72, d: 1.2, r: -4 },
        { w: 50, x: 15, y: 84, d: 1.5, r: 2 },
      ].map((p, i) => (
        <motion.div
          key={`frag-${i}`}
          className="absolute rounded-full"
          style={{
            width: p.w,
            height: 12,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: "rgba(18,10,34,0.06)",
            border: "1px solid rgba(18,10,34,0.05)",
            rotate: `${p.r}deg`,
          }}
          animate={{
            x: [0, 6, -4, 3, -2, 0],
            y: [0, -4, 3, -2, 1, 0],
            opacity: [0.6, 0.2, 0.75, 0.15, 0.55, 0.6],
            rotate: [p.r, p.r + 2, p.r - 1.5, p.r + 1, p.r],
          }}
          transition={{
            duration: 2.8 + i * 0.2,
            delay: p.d,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Fragmented disconnected lines */}
      {[
        { x1: 4, y1: 40, x2: 14, y2: 38 },
        { x1: 20, y1: 55, x2: 28, y2: 58 },
        { x1: 6, y1: 68, x2: 16, y2: 65 },
      ].map((l, i) => (
        <motion.div
          key={`fline-${i}`}
          className="absolute"
          style={{
            left: `${l.x1}%`,
            top: `${l.y1}%`,
            width: `${l.x2 - l.x1}%`,
            height: 1,
            background: "rgba(18,10,34,0.08)",
            transformOrigin: "left center",
          }}
          animate={{
            opacity: [0.3, 0.08, 0.25, 0.05, 0.3],
            scaleX: [1, 0.7, 1.1, 0.8, 1],
          }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Noise overlay for left zone */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: 0,
          top: 0,
          width: "33%",
          height: "100%",
          backgroundImage: "radial-gradient(rgba(18,10,34,0.05) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
          opacity: 0.2,
        }}
      />

      {/* Flicker overlay left zone */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ left: 0, top: 0, width: "33%", height: "100%", background: "rgba(18,10,34,0.015)" }}
        animate={{ opacity: [0, 0.05, 0, 0.08, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* ═══ CENTER ZONE: Convergence engine ═══ */}
      {/* Central vortex glow */}
      <motion.div
        className="absolute pointer-events-none rounded-full"
        style={{
          left: "50%",
          top: "50%",
          width: 140,
          height: 140,
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(110,43,255,0.12) 0%, rgba(232,150,124,0.08) 40%, transparent 70%)",
          filter: "blur(20px)",
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* SVG convergence network */}
      <svg
        className="absolute pointer-events-none"
        style={{ left: "28%", top: 0, width: "44%", height: "100%" }}
        viewBox="0 0 400 420"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Spline paths converging to center */}
        {[
          { d: "M 30 80 C 80 90, 140 140, 200 200", color: "110,43,255", w: 2, dur: 2.4 },
          { d: "M 370 60 C 320 100, 260 150, 200 200", color: "191,167,255", w: 2, dur: 2.8 },
          { d: "M 50 340 C 100 300, 150 250, 200 210", color: "232,150,124", w: 1.8, dur: 3.0 },
          { d: "M 360 350 C 310 310, 260 260, 200 210", color: "110,43,255", w: 1.8, dur: 2.6 },
          { d: "M 200 30 C 200 80, 200 140, 200 200", color: "191,167,255", w: 1.5, dur: 3.2 },
          { d: "M 200 390 C 200 340, 200 270, 200 210", color: "232,150,124", w: 1.5, dur: 2.9 },
        ].map((p, i) => (
          <g key={`wire-${i}`}>
            <motion.path
              d={p.d}
              fill="none"
              stroke={`rgba(${p.color},0.18)`}
              strokeWidth={p.w}
              strokeDasharray="5 7"
              animate={{ strokeDashoffset: [0, -120] }}
              transition={{ duration: p.dur, repeat: Infinity, ease: "linear" }}
            />
            {/* Signal particle */}
            <circle r="3.5" fill={`rgba(${p.color},0.85)`}>
              <animateMotion dur={`${p.dur}s`} repeatCount="indefinite" path={p.d} />
            </circle>
          </g>
        ))}

        {/* Central convergence node */}
        <motion.circle
          cx={200}
          cy={205}
          r={8}
          fill="rgba(110,43,255,0.6)"
          animate={{
            r: [8, 12, 8],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle
          cx={200}
          cy={205}
          r={20}
          fill="none"
          stroke="rgba(110,43,255,0.15)"
          strokeWidth={1.5}
          animate={{
            r: [20, 35, 20],
            opacity: [0.3, 0, 0.3],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>

      {/* Satellite nodes in convergence zone */}
      {[
        { x: 35, y: 25, color: "110,43,255", delay: 0 },
        { x: 62, y: 18, color: "191,167,255", delay: 0.5 },
        { x: 37, y: 80, color: "232,150,124", delay: 1.0 },
        { x: 63, y: 82, color: "110,43,255", delay: 1.5 },
        { x: 50, y: 12, color: "191,167,255", delay: 0.8 },
        { x: 50, y: 92, color: "232,150,124", delay: 1.3 },
      ].map((n, i) => (
        <motion.div
          key={`node-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${n.x}%`,
            top: `${n.y}%`,
            width: 8,
            height: 8,
            background: `rgba(${n.color},0.7)`,
            transform: "translate(-50%, -50%)",
          }}
          animate={{
            scale: [1, 1.6, 1],
            boxShadow: [
              `0 0 0 0 rgba(${n.color},0.4)`,
              `0 0 0 16px rgba(${n.color},0)`,
              `0 0 0 0 rgba(${n.color},0.4)`,
            ],
          }}
          transition={{
            duration: 2.2,
            delay: n.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* ═══ RIGHT ZONE: Harmonized resolution ═══ */}
      {/* Clean horizontal flow line */}
      <div
        className="absolute"
        style={{
          left: "70%",
          right: "4%",
          top: "50%",
          height: 2,
          background: "linear-gradient(90deg, rgba(110,43,255,0.06), rgba(232,150,124,0.35), rgba(110,43,255,0.06))",
        }}
      />

      {/* Checkpoints on flow line */}
      {[
        { pos: "74%", delay: 0 },
        { pos: "84%", delay: 1.2 },
        { pos: "94%", delay: 2.4 },
      ].map((cp, i) => (
        <motion.div
          key={`cp-${i}`}
          className="absolute rounded-full"
          style={{
            left: cp.pos,
            top: "50%",
            width: 16,
            height: 16,
            transform: "translate(-50%, -50%)",
            background: "rgba(255,255,255,0.92)",
            border: "2px solid rgba(232,150,124,0.5)",
          }}
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(232,150,124,0)",
              "0 0 0 0 rgba(232,150,124,0)",
              "0 0 0 18px rgba(232,150,124,0.12)",
              "0 0 0 0 rgba(232,150,124,0)",
            ],
            borderColor: [
              "rgba(232,150,124,0.35)",
              "rgba(232,150,124,0.35)",
              "rgba(232,150,124,0.8)",
              "rgba(232,150,124,0.35)",
            ],
          }}
          transition={{
            duration: 4.2,
            delay: cp.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <motion.div
            className="absolute rounded-full"
            style={{ inset: 3, background: "rgba(232,150,124,0.6)" }}
            animate={{
              opacity: [0.2, 0.2, 1, 0.2],
              scale: [0.6, 0.6, 1, 0.6],
            }}
            transition={{
              duration: 4.2,
              delay: cp.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      ))}

      {/* Traveling pulse */}
      <motion.div
        className="absolute rounded-full"
        style={{
          top: "50%",
          width: 8,
          height: 8,
          transform: "translateY(-50%)",
          background: "rgba(232,150,124,0.95)",
        }}
        animate={{
          left: ["70%", "74%", "84%", "94%", "97%", "70%"],
          boxShadow: [
            "0 0 0 0 rgba(232,150,124,0.6)",
            "0 0 0 12px rgba(232,150,124,0)",
            "0 0 0 12px rgba(232,150,124,0)",
            "0 0 0 12px rgba(232,150,124,0)",
            "0 0 0 0 rgba(232,150,124,0.4)",
            "0 0 0 0 rgba(232,150,124,0)",
          ],
        }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Stable aligned bars — resolved state */}
      {[
        { y: 28, w: "18%", l: "74%" },
        { y: 36, w: "14%", l: "78%" },
        { y: 66, w: "16%", l: "75%" },
        { y: 74, w: "20%", l: "73%" },
      ].map((b, i) => (
        <motion.div
          key={`bar-${i}`}
          className="absolute rounded-md"
          style={{
            top: `${b.y}%`,
            left: b.l,
            width: b.w,
            height: 8,
            background: "rgba(110,43,255,0.035)",
            border: "1px solid rgba(110,43,255,0.06)",
          }}
          animate={{ opacity: [0.5, 0.85, 0.5] }}
          transition={{ duration: 4, delay: i * 0.5, repeat: Infinity }}
        />
      ))}

      {/* Calm breathing glow — right zone */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          right: 0,
          top: 0,
          width: "34%",
          height: "100%",
          background: "radial-gradient(ellipse at 80% 50%, rgba(232,150,124,0.06), transparent 70%)",
        }}
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

/* ── Main Section ── */
const InterfaceSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

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

        {/* Single continuous transformation canvas */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.3 }}
        >
          <TransformationCanvas />
        </motion.div>
      </div>
    </section>
  );
};

export default InterfaceSection;
