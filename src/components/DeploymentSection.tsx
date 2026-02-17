import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

/* ─── REASONING PULSE (Left) ─── */
const ReasoningAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = 300, H = 300;
    canvas.width = W; canvas.height = H;
    const cx = W / 2, cy = H / 2;

    const satellites = Array.from({ length: 6 }, (_, i) => ({
      angle: (Math.PI * 2 * i) / 6,
      dist: 80 + Math.random() * 30,
      size: 3 + Math.random() * 2,
      speed: 0.15 + Math.random() * 0.1,
    }));

    let t = 0;
    let raf: number;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      t += 0.012;

      // Expanding rings
      for (let r = 0; r < 3; r++) {
        const radius = ((t * 40 + r * 40) % 120);
        const alpha = Math.max(0, 1 - radius / 120) * 0.25;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(232,150,124,${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Core glow
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 24);
      grad.addColorStop(0, "rgba(232,150,124,0.9)");
      grad.addColorStop(0.5, "rgba(212,97,107,0.6)");
      grad.addColorStop(1, "rgba(212,97,107,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, 24, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Core center
      const coreSize = 10 + Math.sin(t * 2) * 2;
      ctx.beginPath();
      ctx.arc(cx, cy, coreSize, 0, Math.PI * 2);
      ctx.fillStyle = "#E8967C";
      ctx.fill();

      // Satellite nodes
      satellites.forEach((s) => {
        const a = s.angle + t * s.speed;
        const sx = cx + Math.cos(a) * s.dist;
        const sy = cy + Math.sin(a) * s.dist;

        // Connection line
        const pulsePhase = (Math.sin(t * 3 + s.angle) + 1) / 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(sx, sy);
        ctx.strokeStyle = `rgba(110,43,255,${0.08 + pulsePhase * 0.15})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Pulse traveling along line
        const px = cx + (sx - cx) * pulsePhase;
        const py = cy + (sy - cy) * pulsePhase;
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232,150,124,${0.4 + pulsePhase * 0.5})`;
        ctx.fill();

        // Node
        const nodeAlpha = 0.3 + pulsePhase * 0.7;
        ctx.beginPath();
        ctx.arc(sx, sy, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(110,43,255,${nodeAlpha})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(sx, sy, s.size + 4, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(110,43,255,${nodeAlpha * 0.3})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas ref={canvasRef} className="w-[240px] h-[240px] md:w-[280px] md:h-[280px]" style={{ imageRendering: "auto" }} />
      <span className="text-[11px] font-mono tracking-[0.18em] uppercase" style={{ color: "rgba(243,239,255,0.4)" }}>
        Reasoning
      </span>
    </div>
  );
};

/* ─── WORKFLOW ROUTING (Center) ─── */
const WorkflowAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = 300, H = 300;
    canvas.width = W; canvas.height = H;

    const lines = [
      { y: 60, branches: [{ at: 0.4, to: 120, mergeAt: 0.75 }] },
      { y: 120, branches: [] },
      { y: 150, branches: [{ at: 0.55, to: 200, mergeAt: 0.85 }] },
      { y: 200, branches: [] },
      { y: 240, branches: [{ at: 0.3, to: 200, mergeAt: 0.6 }] },
    ];

    const dots = lines.flatMap((line, li) => 
      Array.from({ length: 2 + Math.floor(Math.random() * 2) }, (_, di) => ({
        lineIdx: li,
        offset: (di * 0.4 + Math.random() * 0.3) % 1,
        speed: 0.002 + Math.random() * 0.0015,
        size: 3 + Math.random() * 2,
        branching: false,
        branchProgress: 0,
      }))
    );

    let raf: number;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Draw lines
      lines.forEach((line) => {
        ctx.beginPath();
        ctx.moveTo(0, line.y);
        ctx.lineTo(W, line.y);
        ctx.strokeStyle = "rgba(122,92,255,0.12)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Branch paths
        line.branches.forEach((b) => {
          ctx.beginPath();
          ctx.moveTo(W * b.at, line.y);
          ctx.quadraticCurveTo(W * ((b.at + b.mergeAt) / 2), b.to, W * b.mergeAt, line.y);
          ctx.strokeStyle = "rgba(122,92,255,0.08)";
          ctx.lineWidth = 1;
          ctx.stroke();
        });
      });

      // Animate dots
      dots.forEach((dot) => {
        dot.offset = (dot.offset + dot.speed) % 1;
        const line = lines[dot.lineIdx];
        let x = dot.offset * W;
        let y = line.y;

        // Check if dot is on a branch
        line.branches.forEach((b) => {
          if (dot.offset > b.at && dot.offset < b.mergeAt) {
            const branchT = (dot.offset - b.at) / (b.mergeAt - b.at);
            const t = branchT;
            // Quadratic bezier
            y = (1 - t) * (1 - t) * line.y + 2 * (1 - t) * t * b.to + t * t * line.y;
            x = (1 - t) * (1 - t) * (W * b.at) + 2 * (1 - t) * t * (W * ((b.at + b.mergeAt) / 2)) + t * t * (W * b.mergeAt);
          }
        });

        // Dot glow
        const grad = ctx.createRadialGradient(x, y, 0, x, y, 8);
        grad.addColorStop(0, "rgba(255,255,255,0.8)");
        grad.addColorStop(1, "rgba(122,92,255,0)");
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Dot core
        ctx.beginPath();
        ctx.arc(x, y, dot.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(122,92,255,0.7)";
        ctx.fill();

        // Trail
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - 15, y);
        ctx.strokeStyle = "rgba(122,92,255,0.15)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas ref={canvasRef} className="w-[240px] h-[240px] md:w-[280px] md:h-[280px]" style={{ imageRendering: "auto" }} />
      <span className="text-[11px] font-mono tracking-[0.18em] uppercase" style={{ color: "rgba(243,239,255,0.4)" }}>
        Workflow
      </span>
    </div>
  );
};

/* ─── GOVERNANCE LOGGING (Right) ─── */
const GovernanceAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = 300, H = 300;
    canvas.width = W; canvas.height = H;

    // Grid nodes
    const gridSize = 5;
    const spacing = 44;
    const offsetX = (W - (gridSize - 1) * spacing) / 2;
    const offsetY = 30;
    const nodes = Array.from({ length: gridSize * gridSize }, (_, i) => ({
      x: offsetX + (i % gridSize) * spacing,
      y: offsetY + Math.floor(i / gridSize) * spacing,
      active: false,
      activatedAt: 0,
    }));

    // Connections
    const connections: [number, number][] = [];
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const idx = i * gridSize + j;
        if (j < gridSize - 1) connections.push([idx, idx + 1]);
        if (i < gridSize - 1) connections.push([idx, idx + gridSize]);
      }
    }

    const logDots: { x: number; y: number; alpha: number; createdAt: number }[] = [];
    let t = 0;
    let lastActivation = 0;
    let raf: number;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      t += 0.016;

      // Grid lines
      connections.forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo(nodes[a].x, nodes[a].y);
        ctx.lineTo(nodes[b].x, nodes[b].y);
        ctx.strokeStyle = "rgba(110,43,255,0.06)";
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Activate random node every ~1.5s
      if (t - lastActivation > 1.5) {
        const idx = Math.floor(Math.random() * nodes.length);
        nodes[idx].active = true;
        nodes[idx].activatedAt = t;
        // Add log dot
        logDots.push({
          x: 30 + logDots.length * 12,
          y: H - 25,
          alpha: 1,
          createdAt: t,
        });
        if (logDots.length > 18) logDots.shift();
        lastActivation = t;
      }

      // Draw nodes
      nodes.forEach((node) => {
        const timeSinceActive = t - node.activatedAt;
        const isGlowing = node.active && timeSinceActive < 3;

        if (isGlowing) {
          // Activation ring
          const ringSize = Math.min(timeSinceActive * 8, 16);
          const ringAlpha = Math.max(0, 1 - timeSinceActive / 3) * 0.4;
          ctx.beginPath();
          ctx.arc(node.x, node.y, ringSize, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(232,150,124,${ringAlpha})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, isGlowing ? 5 : 3, 0, Math.PI * 2);
        ctx.fillStyle = isGlowing
          ? `rgba(232,150,124,${0.5 + Math.max(0, 1 - timeSinceActive / 2) * 0.5})`
          : "rgba(110,43,255,0.15)";
        ctx.fill();

        if (node.active && timeSinceActive > 4) {
          node.active = false;
        }
      });

      // Audit trail label
      ctx.fillStyle = "rgba(243,239,255,0.15)";
      ctx.font = "9px monospace";
      ctx.fillText("AUDIT LOG", 10, H - 40);

      // Log line
      ctx.beginPath();
      ctx.moveTo(10, H - 35);
      ctx.lineTo(W - 10, H - 35);
      ctx.strokeStyle = "rgba(110,43,255,0.08)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Log dots
      logDots.forEach((dot, i) => {
        const age = t - dot.createdAt;
        const x = 20 + i * 14;
        ctx.beginPath();
        ctx.arc(x, H - 20, 3, 0, Math.PI * 2);
        ctx.fillStyle = age < 1
          ? `rgba(232,150,124,${0.9})`
          : `rgba(242,193,174,${Math.max(0.2, 0.7 - age * 0.05)})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas ref={canvasRef} className="w-[240px] h-[240px] md:w-[280px] md:h-[280px]" style={{ imageRendering: "auto" }} />
      <span className="text-[11px] font-mono tracking-[0.18em] uppercase" style={{ color: "rgba(243,239,255,0.4)" }}>
        Governance
      </span>
    </div>
  );
};

/* ─── MAIN SECTION ─── */
const DeploymentSection = () => {
  return (
    <section
      className="relative overflow-hidden"
      id="deployment"
      style={{
        padding: "clamp(80px, 9vw, 140px) 0",
        background: `radial-gradient(circle at 50% 40%, #1a0833 0%, #120622 40%, #0b0417 100%)`,
      }}
    >
      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />

      {/* Top edge line */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{
        background: "linear-gradient(90deg, transparent 10%, rgba(110,43,255,0.2) 50%, transparent 90%)",
      }} />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-12 w-full">
        {/* Header */}
        <motion.div
          className="text-center mb-16 md:mb-24"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
        >
          <span
            className="inline-block mb-5 text-[11px] font-mono tracking-[0.22em] uppercase"
            style={{ color: "rgba(243,239,255,0.35)" }}
          >
            [ LIVE SYSTEM STATE ]
          </span>

          <h2
            style={{
              color: "#F3EFFF",
              fontWeight: 700,
              fontSize: "clamp(40px, 5vw, 64px)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Intelligence operating in real time.
          </h2>

          <p
            className="mx-auto mt-5"
            style={{
              color: "rgba(243,239,255,0.5)",
              fontSize: "18px",
              lineHeight: 1.6,
              maxWidth: "540px",
            }}
          >
            Clinical signals flow, branch, resolve, and log — continuously.
          </p>
        </motion.div>

        {/* 3-column animation grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
          {/* Reasoning */}
          <motion.div
            className="flex justify-center relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0 }}
          >
            {/* Faint circular glow behind */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(212,97,107,0.08) 0%, transparent 70%)" }}
            />
            <ReasoningAnimation />
          </motion.div>

          {/* Workflow */}
          <motion.div
            className="flex justify-center relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(110,43,255,0.08) 0%, transparent 70%)" }}
            />
            <WorkflowAnimation />
          </motion.div>

          {/* Governance */}
          <motion.div
            className="flex justify-center relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(232,150,124,0.08) 0%, transparent 70%)" }}
            />
            <GovernanceAnimation />
          </motion.div>
        </div>

        {/* System status bar */}
        <motion.div
          className="flex items-center justify-center gap-3 mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#E8967C" }} />
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase" style={{ color: "rgba(243,239,255,0.25)" }}>
            ALL SUBSYSTEMS NOMINAL
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default DeploymentSection;
