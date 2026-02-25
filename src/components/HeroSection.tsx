import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { motion, AnimatePresence } from "framer-motion";

const PARTICLE_COUNT = 1500;
const SCENES = [
  "Administrative Friction",
  "Interoperable Backbone",
  "Data Synthesis",
  "Intelligence",
  "The Clinic OS",
];
const COLORS = {
  bg: "#030712",
  primary: "#7B61FF",
  secondary: "#00d2ff",
  accent: "#e879f9",
  mesh: "rgba(123, 97, 255, 0.15)",
};

function generateHeadMesh(count: number, w: number, h: number) {
  const points = [];
  const cx = w * 0.5;
  const cy = h * 0.55;
  const scale = Math.min(w, h) * 0.35;

  for (let i = 0; i < count; i++) {
    const isBrain = i < count * 0.6;

    if (isBrain) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 0.5;
      const nx = Math.cos(angle) * radius * 1.2;
      const ny = Math.sin(angle) * radius * 0.8 - 0.2;
      points.push({ x: cx + nx * scale, y: cy + ny * scale, type: "brain" });
    } else {
      const t = (i / (count * 0.4)) * Math.PI * 2;
      let nx = Math.cos(t) * 0.7;
      let ny = Math.sin(t) * 0.9;

      if (t > 0 && t < Math.PI * 0.8) {
        nx += Math.sin(t * 3) * 0.08;
      }
      if (t > Math.PI * 0.6 && t < Math.PI * 1.2) {
        nx -= 0.1;
        ny += 0.3;
      }

      points.push({
        x: cx + nx * scale + (Math.random() - 0.5) * 20,
        y: cy + ny * scale + (Math.random() - 0.5) * 20,
        type: "silhouette",
      });
    }
  }
  return points;
}

const HeroSection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [sceneIndex, setSceneIndex] = useState(0);

  const particles = useRef<any[]>([]);
  const state = useRef({
    scene: 0,
    meshOpacity: 0,
    scatterForce: 1,
    attraction: 0.02,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    let headTargets = generateHeadMesh(PARTICLE_COUNT, w, h);

    particles.current = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      baseSize: Math.random() * 1.5 + 0.5,
      target: headTargets[i],
      type: headTargets[i].type,
      color: headTargets[i].type === "brain" ? COLORS.accent : COLORS.secondary,
    }));

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      headTargets = generateHeadMesh(PARTICLE_COUNT, w, h);
      particles.current.forEach((p, i) => (p.target = headTargets[i]));
    };
    window.addEventListener("resize", onResize);

    let raf: number;
    const render = () => {
      ctx.fillStyle = `rgba(3, 7, 18, 0.3)`;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "screen";

      const curScene = state.current.scene;
      const attract = state.current.attraction;
      const meshOp = state.current.meshOpacity;

      particles.current.forEach((p, i) => {
        if (curScene === 0) {
          p.vx += (Math.random() - 0.5) * 0.4;
          p.vy += (Math.random() - 0.5) * 0.4;
        } else if (curScene === 1) {
          const gridX = Math.round(p.target.x / 50) * 50;
          const gridY = Math.round(p.target.y / 50) * 50;
          p.vx += (gridX - p.x) * attract;
          p.vy += (gridY - p.y) * attract;
        } else if (curScene === 2) {
          p.vx += (w / 2 - p.x) * attract * 1.5;
          p.vy += (h / 2 - p.y) * attract * 1.5;
        } else if (curScene >= 3) {
          const pulse = Math.sin(Date.now() * 0.002 + i) * 2;
          const tx = p.target.x + (p.type === "brain" ? pulse : 0);
          const ty = p.target.y + (p.type === "brain" ? pulse : 0);

          p.vx += (tx - p.x) * attract;
          p.vy += (ty - p.y) * attract;

          if (meshOp > 0 && i % 15 === 0) {
            const nextP = particles.current[(i + 15) % PARTICLE_COUNT];
            const dist = Math.sqrt((p.x - nextP.x) ** 2 + (p.y - nextP.y) ** 2);
            if (dist < 60) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(123, 97, 255, ${meshOp * (1 - dist / 60)})`;
              ctx.lineWidth = 0.5;
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(nextP.x, nextP.y);
              ctx.stroke();
            }
          }
        }

        p.vx *= 0.88;
        p.vy *= 0.88;
        p.x += p.vx;
        p.y += p.vy;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(
          p.x,
          p.y,
          p.baseSize * (curScene >= 3 && p.type === "brain" ? 1.5 : 1),
          0,
          Math.PI * 2
        );
        ctx.fill();
      });

      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const advanceSequence = () => {
    const nextScene = Math.min(sceneIndex + 1, 4);

    gsap.to(state.current, {
      scene: nextScene,
      attraction: nextScene >= 3 ? 0.08 : 0.03,
      meshOpacity: nextScene >= 3 ? 1 : 0,
      duration: 2,
      ease: "power3.inOut",
    });

    setSceneIndex(nextScene);
  };

  const ecosystemNodes = [
    { label: "VIRTUAL CARE", top: "25%", left: "50%" },
    { label: "SOVEREIGN DATA", top: "45%", left: "28%" },
    { label: "AUDIT INTEGRITY", top: "55%", left: "70%" },
    { label: "AI CORTEX", top: "75%", left: "30%" },
    { label: "CLINIC OS", top: "80%", left: "68%" },
  ];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden flex flex-col justify-between p-6 sm:p-12 font-sans"
      style={{ backgroundColor: COLORS.bg, color: "#ffffff" }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(circle at center, rgba(79, 70, 229, 0.2) 0%, rgba(3, 7, 18, 0.8) 50%, #030712 100%)"
      }} />

      {/* Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* INTELLIGENCE text */}
      <div className="absolute top-[8%] left-0 w-full flex justify-center z-0 pointer-events-none select-none">
        <h1
          className="text-[12vw] font-black tracking-tighter leading-none"
          style={{
            background: "linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(255,255,255,0))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          INTELLIGENCE
        </h1>
      </div>

      {/* Ecosystem HUD Nodes (Scene 4) */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <AnimatePresence>
          {sceneIndex === 4 &&
            ecosystemNodes.map((node, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.15, type: "spring", stiffness: 100 }}
                className="absolute flex flex-col items-center gap-2"
                style={{ top: node.top, left: node.left, transform: "translate(-50%, -50%)" }}
              >
                <div className="w-8 h-8 flex items-center justify-center border border-indigo-400/40 rounded-lg rotate-45 backdrop-blur-sm"
                  style={{ backgroundColor: "rgba(30, 27, 75, 0.5)", boxShadow: "0 0 20px rgba(123,97,255,0.3)" }}>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#00d2ff", boxShadow: "0 0 10px #00d2ff" }} />
                </div>
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase whitespace-nowrap px-3 py-1 rounded-full border border-white/5"
                  style={{ color: "rgba(207, 250, 254, 0.8)", backgroundColor: "rgba(0,0,0,0.4)" }}>
                  {node.label}
                </span>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>

      {/* Narrative Header */}
      <header className="relative z-30 flex justify-between items-start">
        <div className="max-w-xl">
          <motion.div
            key={sceneIndex}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-3 flex items-center gap-3"
          >
            <div className="h-[1px] w-8" style={{ backgroundColor: "#00d2ff" }} />
            <h2 className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: "#22d3ee" }}>
              Phase 0{sceneIndex + 1}
            </h2>
          </motion.div>
          <motion.h1
            key={`title-${sceneIndex}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-light tracking-tight leading-tight"
          >
            {SCENES[sceneIndex]}
          </motion.h1>
        </div>
      </header>

      {/* Footer & Controls */}
      <footer className="relative z-30 flex justify-between items-end">
        <div className="max-w-md space-y-8">
          <motion.p
            key={`desc-${sceneIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm leading-relaxed font-light"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            {sceneIndex === 0 && "Raw data exists in silos, uncoordinated and creating extreme administrative friction."}
            {sceneIndex === 1 && "Data maps to the interoperable backbone, converting silos into flowing clinical pipelines."}
            {sceneIndex === 2 && "The model aggregates disparate data into a centralized, high-density intelligence core."}
            {sceneIndex === 3 && "The core evolves into a digital persona. Explainable AI becomes a visible, accountable partner."}
            {sceneIndex === 4 && "The final stage: A unified ecosystem where sovereign data and clinical protocols operate as one."}
          </motion.p>

          <button
            onClick={advanceSequence}
            disabled={sceneIndex === 4}
            className="group relative flex items-center gap-4 px-8 py-4 backdrop-blur-md border transition-all duration-300"
            style={{
              borderColor: sceneIndex === 4 ? "rgba(16, 185, 129, 0.3)" : "rgba(255,255,255,0.1)",
              backgroundColor: sceneIndex === 4 ? "rgba(16, 185, 129, 0.05)" : "rgba(255,255,255,0.05)",
              cursor: sceneIndex === 4 ? "default" : "pointer",
            }}
          >
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase transition-colors"
              style={{ color: sceneIndex === 4 ? "rgba(52, 211, 153, 0.8)" : "rgba(255,255,255,0.8)" }}>
              {sceneIndex === 4 ? "Ecosystem Initialized" : "Advance Sequence"}
            </span>
            {sceneIndex !== 4 && (
              <div className="w-8 h-[1px] group-hover:w-16 transition-all duration-500"
                style={{ backgroundColor: "rgba(255,255,255,0.3)" }} />
            )}
          </button>
        </div>

        <div className="hidden sm:block font-mono text-[10px] tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.2)" }}>
          INTELLIGENCE_AS_INFRASTRUCTURE // 2026
        </div>
      </footer>
    </div>
  );
};

export default HeroSection;
