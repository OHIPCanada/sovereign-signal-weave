import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

// --- Scene Definitions ---
enum SceneState {
  FRAGMENTATION = 0,
  FIELD = 1,
  EMERGENCE = 2,
  PERSONA = 3,
  STABILIZED = 4,
}

// --- Types ---
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

const HeroSection = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scene, setScene] = useState<SceneState>(SceneState.FRAGMENTATION);
  const requestRef = useRef<number>(0);

  const particles = useRef<Particle[]>([]);
  const stateRef = useRef({
    scene: SceneState.FRAGMENTATION,
    waveRadius: 0,
    progress: 0,
    eyePulse: 0,
  });

  const C = {
    void: "#020408",
    cold: "rgba(189, 166, 255, 0.5)",
    warm: "rgba(232, 150, 124, 0.8)",
    healing: "rgba(106, 255, 210, 0.7)",
    gold: "rgba(255, 215, 0, 0.6)",
  };

  const getFaceCoords = (i: number, w: number, h: number) => {
    const cx = w / 2;
    const cy = h / 2.2;
    const r = Math.min(w, h) * 0.25;
    if (i < 800) {
      const angle = (i / 800) * Math.PI * 2;
      const eyeR = r * 0.4 * (i % 2 === 0 ? 1 : 0.8);
      return { x: cx + Math.cos(angle) * eyeR, y: cy + Math.sin(angle) * eyeR * 0.6 };
    } else {
      const angle = ((i - 800) / (PARTICLE_COUNT - 800)) * Math.PI;
      return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r * 1.4 - r * 0.2 };
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
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3,
          homeX: (i % gridSize) * stepX + stepX / 2,
          homeY: Math.floor(i / gridSize) * stepY + stepY / 2,
          faceX: face.x,
          faceY: face.y,
          size: Math.random() * 1.5 + 0.5,
          color: C.cold,
          angle: Math.random() * Math.PI * 2,
        });
      }
      particles.current = pArray;
    };

    setup();
    window.addEventListener("resize", setup);

    const render = () => {
      ctx.fillStyle = C.void;
      ctx.fillRect(0, 0, w, h);

      const { scene: currentScene, waveRadius } = stateRef.current;
      const centerX = w / 2;
      const centerY = h / 2;

      particles.current.forEach((p, i) => {
        if (currentScene === SceneState.FRAGMENTATION) {
          p.vx += (Math.random() - 0.5) * 0.2;
          p.vy += (Math.random() - 0.5) * 0.2;
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
        } else if (currentScene === SceneState.FIELD || currentScene === SceneState.EMERGENCE) {
          const dx = p.x - centerX;
          const dy = p.y - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < waveRadius) {
            p.x += (p.homeX - p.x) * 0.08;
            p.y += (p.homeY - p.y) * 0.08;
            p.color = i % 3 === 0 ? C.healing : C.cold;
          } else {
            p.x += p.vx;
            p.y += p.vy;
          }
        } else if (currentScene === SceneState.PERSONA) {
          p.x += (p.faceX - p.x) * 0.05;
          p.y += (p.faceY - p.y) * 0.05;
          p.color = i < 800 ? C.warm : C.cold;
        } else if (currentScene === SceneState.STABILIZED) {
          p.angle += 0.01;
          const spiralR = 100 * Math.sin(p.angle * 0.3);
          const tx = p.homeX + Math.cos(p.angle) * spiralR;
          const ty = p.homeY + Math.sin(p.angle) * spiralR;
          p.x += (tx - p.x) * 0.05;
          p.y += (ty - p.y) * 0.05;
          p.color = C.healing;
        }

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (currentScene >= SceneState.EMERGENCE && i % 40 === 0) {
          const nextP = particles.current[(i + 40) % PARTICLE_COUNT];
          const d = Math.sqrt((p.x - nextP.x) ** 2 + (p.y - nextP.y) ** 2);
          if (d < 100) {
            ctx.strokeStyle = currentScene === SceneState.PERSONA ? C.warm : C.gold;
            ctx.globalAlpha = 0.2;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(nextP.x, nextP.y);
            ctx.stroke();
            ctx.globalAlpha = 1.0;
          }
        }
      });

      requestRef.current = requestAnimationFrame(render);
    };

    requestRef.current = requestAnimationFrame(render);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      window.removeEventListener("resize", setup);
    };
  }, []);

  const nextScene = () => {
    const next = ((scene + 1) % 5) as SceneState;
    setScene(next);
    stateRef.current.scene = next;

    if (next === SceneState.FIELD) {
      gsap.to(stateRef.current, {
        waveRadius: window.innerWidth * 1.2,
        duration: 2.5,
        ease: "power2.inOut",
      });
    }
    if (next === SceneState.PERSONA) {
      gsap.to(stateRef.current, {
        progress: 1,
        duration: 2,
        ease: "expo.inOut",
      });
    }
  };

  const sceneLabels: Record<SceneState, string> = {
    [SceneState.FRAGMENTATION]: "CHAOS",
    [SceneState.FIELD]: "GRID",
    [SceneState.EMERGENCE]: "GRAPH",
    [SceneState.PERSONA]: "HUMAN",
    [SceneState.STABILIZED]: "OS",
  };

  const sceneDescriptions: Record<SceneState, string> = {
    [SceneState.FRAGMENTATION]: "Raw data exists in silos, uncoordinated and decaying into noise.",
    [SceneState.FIELD]: "The Field appears. AI infrastructure creates a unified backbone.",
    [SceneState.EMERGENCE]: "Meaning emerges. Data fragments cluster into a knowledge graph.",
    [SceneState.PERSONA]: "The Hybrid Face looks back. Intelligence becomes accountable.",
    [SceneState.STABILIZED]: "The Operating System for Institutional Intelligence is active.",
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ height: "100vh", background: "#020408" }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-12 pointer-events-none z-10">
        <header className="flex justify-between items-start">
          <div className="space-y-1">
            <h2
              style={{
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                fontSize: 10,
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: "rgba(243,239,255,0.35)",
              }}
            >
              Status: {scene === SceneState.STABILIZED ? "Stabilized" : "Processing"}
            </h2>
            <h1
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: 24,
                fontWeight: 300,
                letterSpacing: "-0.02em",
                color: "rgba(243,239,255,0.85)",
              }}
            >
              Institutional Intelligence
            </h1>
          </div>
          <div
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: 10,
              color: "rgba(243,239,255,0.25)",
              textAlign: "right",
            }}
          >
            <p>LATENCY: 12ms</p>
            <p style={{ marginTop: 4 }}>COHERENCE: 0.68</p>
          </div>
        </header>

        <div className="flex flex-col items-center">
          <h1
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontWeight: 900,
              fontSize: "clamp(64px, 12vw, 240px)",
              letterSpacing: "-0.04em",
              color: "rgba(243,239,255,0.08)",
              userSelect: "none",
              lineHeight: 1,
            }}
          >
            {sceneLabels[scene]}
          </h1>
        </div>

        <footer className="flex justify-between items-end">
          <div className="max-w-xs space-y-4 pointer-events-auto">
            <p
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: 12,
                lineHeight: 1.6,
                fontWeight: 300,
                color: "rgba(243,239,255,0.5)",
              }}
            >
              {sceneDescriptions[scene]}
            </p>
            <button
              onClick={nextScene}
              style={{
                padding: "8px 24px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(243,239,255,0.7)",
                fontFamily: "ui-monospace, monospace",
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
            >
              Advance Sequence →
            </button>
          </div>
          <div
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: 10,
              color: "rgba(243,239,255,0.15)",
            }}
          >
            © 2026 CONVERGENCE_MODEL_V4
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HeroSection;
