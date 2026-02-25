import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

enum SceneState {
  FRAGMENTATION = 0,
  FIELD = 1,
  EMERGENCE = 2,
  PERSONA = 3,
  STABILIZED = 4,
}

type Particle = {
  x: number; y: number;
  vx: number; vy: number;
  homeX: number; homeY: number;
  faceX: number; faceY: number;
  size: number;
  color: string;
  angle: number;
};

const PARTICLE_COUNT = 2400;
const R_RATIO = 0.34;

const HeroSection = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scene, setScene] = useState<SceneState>(SceneState.FRAGMENTATION);

  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: 0, y: 0 });
  const requestRef = useRef<number>(0);
  const sceneRef = useRef<SceneState>(SceneState.FRAGMENTATION);
  const isTransitioning = useRef(false);
  const stateRef = useRef({
    scene: SceneState.FRAGMENTATION,
    waveRadius: 0,
    transitionAlpha: 0,
    lookProgress: 0,
  });

  const C = {
    void: "#020408",
    cold: "rgba(189, 166, 255, 0.45)",
    warm: "rgba(232, 150, 124, 0.85)",
    healing: "rgba(106, 255, 210, 0.7)",
    gold: "rgba(255, 215, 0, 0.5)",
  };

  const getFaceCoords = (i: number, w: number, h: number) => {
    const cx = w / 2;
    const cy = h / 2.2;
    const r = Math.min(w, h) * 0.22;
    if (i < 800) {
      const angle = (i / 800) * Math.PI * 2;
      const eyeR = r * 0.45 * (i % 2 === 0 ? 1 : 0.85);
      return { x: cx + Math.cos(angle) * eyeR, y: cy + Math.sin(angle) * eyeR * 0.6 };
    } else {
      const angle = ((i - 800) / (PARTICLE_COUNT - 800)) * Math.PI;
      return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r * 1.5 - r * 0.2 };
    }
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
      const gridSize = Math.sqrt(PARTICLE_COUNT);
      const stepX = w / gridSize;
      const stepY = h / gridSize;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const face = getFaceCoords(i, w, h);
        pArray.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4,
          homeX: (i % gridSize) * stepX + stepX / 2,
          homeY: Math.floor(i / gridSize) * stepY + stepY / 2,
          faceX: face.x, faceY: face.y,
          size: Math.random() * 1.2 + 0.6,
          color: C.cold,
          angle: Math.random() * Math.PI * 2,
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
      const alpha = stateRef.current.transitionAlpha;
      ctx.globalAlpha = 1;
      ctx.fillStyle = C.void;
      ctx.fillRect(0, 0, w, h);

      const { scene: cur, waveRadius, lookProgress } = stateRef.current;
      const centerX = w / 2;
      const centerY = h / 2;

      particles.current.forEach((p, i) => {
        if (cur === SceneState.FRAGMENTATION) {
          p.vx += (Math.random() - 0.5) * 0.25;
          p.vy += (Math.random() - 0.5) * 0.25;
          p.vx *= 0.98; p.vy *= 0.98;
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
        } else if (cur === SceneState.FIELD || cur === SceneState.EMERGENCE) {
          const dist = Math.sqrt((p.x - centerX) ** 2 + (p.y - centerY) ** 2);
          if (dist < waveRadius) {
            p.x += (p.homeX - p.x) * 0.09;
            p.y += (p.homeY - p.y) * 0.09;
            p.color = i % 6 === 0 ? C.healing : C.cold;
          } else {
            p.x += p.vx; p.y += p.vy;
          }
        } else if (cur === SceneState.PERSONA) {
          const gazeX = (mouse.current.x - w / 2) * 0.1 * lookProgress;
          const gazeY = (mouse.current.y - h / 2) * 0.1 * lookProgress;
          const tx = i < 800 ? p.faceX + gazeX : p.faceX;
          const ty = i < 800 ? p.faceY + gazeY : p.faceY;
          p.x += (tx - p.x) * 0.06;
          p.y += (ty - p.y) * 0.06;
          p.color = i < 800 ? C.warm : C.cold;
        } else if (cur === SceneState.STABILIZED) {
          p.angle += 0.015;
          const spiralR = 50 * Math.sin(p.angle * R_RATIO);
          const tx = p.homeX + Math.cos(p.angle) * spiralR;
          const ty = p.homeY + Math.sin(p.angle) * spiralR;
          p.x += (tx - p.x) * 0.08;
          p.y += (ty - p.y) * 0.08;
          p.color = C.healing;
        }

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (cur >= SceneState.EMERGENCE && i % 45 === 0) {
          const nextP = particles.current[(i + 45) % PARTICLE_COUNT];
          const d = Math.sqrt((p.x - nextP.x) ** 2 + (p.y - nextP.y) ** 2);
          if (d < 110) {
            ctx.strokeStyle = cur === SceneState.PERSONA ? C.warm : C.gold;
            ctx.globalAlpha = 0.15;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(nextP.x, nextP.y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      });

      // Transition overlay flash
      if (alpha > 0.01) {
        ctx.globalAlpha = alpha;
        ctx.fillStyle = C.void;
        ctx.fillRect(0, 0, w, h);
        ctx.globalAlpha = 1;
      }

      requestRef.current = requestAnimationFrame(render);
    };

    requestRef.current = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener("resize", setup);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  const advance = () => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;

    const next = ((sceneRef.current + 1) % 5) as SceneState;

    gsap.to(stateRef.current, {
      transitionAlpha: 0.8, duration: 0.4, yoyo: true, repeat: 1, ease: "power2.inOut"
    });

    if (next === SceneState.FIELD) {
      stateRef.current.waveRadius = 0;
      gsap.to(stateRef.current, { waveRadius: window.innerWidth * 1.5, duration: 3, ease: "power3.inOut" });
    }

    if (next === SceneState.PERSONA) {
      stateRef.current.lookProgress = 0;
      gsap.to(stateRef.current, { lookProgress: 1, duration: 2.5, ease: "power2.out" });
    }

    sceneRef.current = next;
    stateRef.current.scene = next;
    setScene(next);

    setTimeout(() => { isTransitioning.current = false; }, 1000);
  };


  const labels = ["FRAGMENTATION", "FIELD", "EMERGENCE", "PERSONA", "STABILIZED"];
  const subtext = [
    "Data decaying into uncoordinated clinical noise.",
    "Euclidean waves reveal the foundational AI backbone.",
    "Semantic synthesis: EHRS, genomic patterns, and logic arcs.",
    "Operational awareness: The Vigilant Eye senses the whole.",
    "Optimal Coherence (C≈0.70): The Institutional OS."
  ];

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-[#020408] overflow-hidden flex flex-col font-sans text-white uppercase tracking-wider">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-80" />

      <div className="relative z-10 flex flex-col justify-between h-full p-8 sm:p-16 pointer-events-none">
        <header className="flex justify-between items-start">
          <div className="space-y-2">
            <h2 className="font-mono text-[10px] text-white/40 tracking-[0.5em]">Convergence_v4.2026</h2>
            <h1 className="text-2xl font-light tracking-tighter">Institutional_Intelligence</h1>
          </div>
          <div className="font-mono text-[9px] text-white/20 text-right leading-relaxed">
            <p>ORDER_PARAMETER: {scene === 4 ? "0.70" : "0.12"}</p>
            <p>CHIRAL_SCALE: 0.34</p>
          </div>
        </header>

        <div className="flex flex-col items-center">
          <h1 className="font-black text-[14vw] text-white/[0.03] leading-none select-none">
            {labels[scene]}
          </h1>
        </div>

        <footer className="flex justify-between items-end">
          <div className="max-w-xs space-y-6 pointer-events-auto">
            <div className="space-y-3">
              <div className="h-[1px] w-8 bg-white/30" />
              <p className="text-[11px] font-light normal-case italic text-white/50 leading-relaxed">
                {subtext[scene]}
              </p>
            </div>
            <button
              onClick={advance}
              className="group flex items-center gap-6 px-6 py-3 bg-white/[0.02] border border-white/10 hover:border-white/40 transition-all cursor-pointer"
            >
              <span className="font-mono text-[9px] text-white/70">NEXT_PHASE</span>
              <div className="w-4 h-[1px] bg-white/40 group-hover:w-12 transition-all" />
            </button>
          </div>
          <div className="hidden sm:block font-mono text-[9px] text-white/10 italic">
            // SUBSTRATE_COUPLING_ACTIVE
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HeroSection;
