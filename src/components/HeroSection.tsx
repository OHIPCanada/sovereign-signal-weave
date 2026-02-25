import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

enum SceneState {
  SILOS = 0,
  BLUEPRINT = 1,
  SYNTHESIS = 2,
  WITNESS = 3,
  INSTITUTION = 4,
}

type Particle = {
  x: number; y: number;
  vx: number; vy: number;
  homeX: number; homeY: number;
  faceX: number; faceY: number;
  siloX: number; siloY: number;
  size: number;
  color: string;
};

const PARTICLE_COUNT = 2000;

const HeroSection = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scene, setScene] = useState<SceneState>(SceneState.SILOS);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: 0, y: 0 });
  const requestRef = useRef<number>(0);
  const stateRef = useRef({
    scene: SceneState.SILOS,
    progress: 0,
    blueprintAlpha: 0,
  });

  const COLORS = {
    void: "#020408",
    data: "rgba(189, 166, 255, 0.4)",
    system: "rgba(106, 255, 210, 0.6)",
    human: "rgba(232, 150, 124, 0.9)",
    link: "rgba(255, 215, 0, 0.3)",
  };

  const getFaceCoords = (i: number, w: number, h: number) => {
    const cx = w / 2;
    const cy = h / 2.2;
    const r = Math.min(w, h) * 0.25;
    if (i < 600) {
      const a = (i / 600) * Math.PI * 2;
      return { x: cx + Math.cos(a) * (r * 0.4), y: cy + Math.sin(a) * (r * 0.25) };
    }
    const a = ((i - 600) / (PARTICLE_COUNT - 600)) * Math.PI;
    return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * (r * 1.3) - r * 0.1 };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let w: number, h: number;

    const setup = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      const pArray: Particle[] = [];

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const face = getFaceCoords(i, w, h);
        const siloId = i % 3;
        const siloX = [w * 0.25, w * 0.5, w * 0.75][siloId];
        const siloY = [h * 0.4, h * 0.6, h * 0.4][siloId];
        pArray.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2,
          homeX: (i % 40) * (w / 40), homeY: Math.floor(i / 40) * (h / 50),
          faceX: face.x, faceY: face.y,
          siloX: siloX + (Math.random() - 0.5) * 150,
          siloY: siloY + (Math.random() - 0.5) * 150,
          size: Math.random() * 1.5 + 0.5,
          color: COLORS.data,
        });
      }
      particles.current = pArray;
    };

    setup();
    window.addEventListener("resize", setup);
    const handleMouse = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouse);

    const render = () => {
      ctx.fillStyle = COLORS.void;
      ctx.fillRect(0, 0, w, h);
      const cur = stateRef.current.scene;

      // Draw Blueprint grid
      if (stateRef.current.blueprintAlpha > 0) {
        ctx.strokeStyle = `rgba(106, 255, 210, ${stateRef.current.blueprintAlpha * 0.1})`;
        ctx.lineWidth = 0.5;
        for (let x = 0; x < w; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
        for (let y = 0; y < h; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
      }

      particles.current.forEach((p, i) => {
        if (cur === SceneState.SILOS) {
          p.vx += (p.siloX - p.x) * 0.005;
          p.vy += (p.siloY - p.y) * 0.005;
          p.vx *= 0.98; p.vy *= 0.98;
          p.x += p.vx * 0.5; p.y += p.vy * 0.5;
          p.color = COLORS.data;
        } else if (cur === SceneState.BLUEPRINT) {
          p.x += (p.homeX - p.x) * 0.05;
          p.y += (p.homeY - p.y) * 0.05;
          p.color = COLORS.system;
        } else if (cur === SceneState.SYNTHESIS || cur === SceneState.WITNESS) {
          const targetX = cur === SceneState.WITNESS ? p.faceX : p.homeX;
          const targetY = cur === SceneState.WITNESS ? p.faceY : p.homeY;
          const gazeX = i < 600 ? (mouse.current.x - w / 2) * 0.05 : 0;
          const gazeY = i < 600 ? (mouse.current.y - h / 2) * 0.05 : 0;
          p.x += (targetX + gazeX - p.x) * 0.07;
          p.y += (targetY + gazeY - p.y) * 0.07;
          p.color = i < 600 ? COLORS.human : COLORS.data;

          if (i % 50 === 0) {
            const next = particles.current[(i + 50) % PARTICLE_COUNT];
            const d = Math.sqrt((p.x - next.x) ** 2 + (p.y - next.y) ** 2);
            if (d < 150) {
              ctx.strokeStyle = COLORS.link;
              ctx.globalAlpha = 1 - (d / 150);
              ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(next.x, next.y); ctx.stroke();
              ctx.globalAlpha = 1;
            }
          }
        }

        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
      });

      requestRef.current = requestAnimationFrame(render);
    };

    requestRef.current = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener("resize", setup);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  const next = () => {
    const nextScene = (stateRef.current.scene + 1) % 5;
    stateRef.current.scene = nextScene;
    setScene(nextScene);
    if (nextScene === SceneState.BLUEPRINT) {
      gsap.to(stateRef.current, { blueprintAlpha: 1, duration: 2 });
    } else {
      gsap.to(stateRef.current, { blueprintAlpha: 0, duration: 1 });
    }
  };

  const labels = ["Silos", "Infrastructure", "Knowledge Graph", "Personification", "Ecosystem"];
  const storyLine = [
    "Fragmented data trapped in disconnected institutional silos.",
    "Revealing the hardware layer: snapped into a unified backbone.",
    "Intelligence emerges as semantic connections bridge the gaps.",
    "A partnership is born. The AI becomes a visible, accountable witness.",
    "The Institutional OS: A stabilized, breathing intelligence ecosystem.",
  ];

  return (
    <div className="relative w-full h-screen bg-[#020408] font-sans text-white overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0" />

      <div className="relative z-10 flex flex-col justify-between h-full p-12 pointer-events-none">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h2 className="text-[10px] tracking-[0.4em] opacity-40 font-mono uppercase">Phase {scene + 1}</h2>
            <h1 className="text-2xl font-light tracking-tight">{labels[scene]}</h1>
          </div>
          <div className="text-right font-mono text-[9px] opacity-20">CONVERGENCE_ENGINE_v5.0</div>
        </div>

        <div className="flex flex-col items-center">
          <h1 className="text-[12vw] font-black opacity-[0.03] select-none leading-none uppercase">{labels[scene]}</h1>
        </div>

        <div className="flex justify-between items-end">
          <div className="max-w-sm space-y-6 pointer-events-auto">
            <p className="text-xs font-light leading-relaxed text-white/50 italic">{storyLine[scene]}</p>
            <button onClick={next} className="px-6 py-3 bg-white/5 border border-white/10 text-[10px] tracking-widest hover:bg-white/10 transition-all uppercase cursor-pointer">
              Evolution Sequence →
            </button>
          </div>
          <div className="font-mono text-[9px] opacity-10">© 2026 // HARMONIZING_DATA_STRUCTURES</div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
