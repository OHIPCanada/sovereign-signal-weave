import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  type: "human" | "ai";
  phase: number;
  speed: number;
}

const HeroSection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const startTimeRef = useRef<number>(0);
  const isMobile = useIsMobile();
  const [textVisible, setTextVisible] = useState(false);

  const initParticles = useCallback((w: number, h: number) => {
    const particles: Particle[] = [];
    const humanCount = isMobile ? 120 : 280;
    const aiCount = isMobile ? 100 : 240;
    const spread = isMobile ? 100 : 180;

    // Human cluster — left side, organic
    for (let i = 0; i < humanCount; i++) {
      const cx = w * 0.28;
      const cy = h * 0.48;
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * spread;
      const x = cx + Math.cos(angle) * dist;
      const y = cy + Math.sin(angle) * dist;
      particles.push({
        x, y, originX: x, originY: y,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        size: Math.random() * 2.2 + 0.8,
        type: "human",
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.5,
      });
    }

    // AI cluster — right side, geometric
    for (let i = 0; i < aiCount; i++) {
      const cx = w * 0.72;
      const cy = h * 0.48;
      // Grid-like distribution with slight randomness
      const gridSize = Math.ceil(Math.sqrt(aiCount));
      const gx = (i % gridSize) / gridSize - 0.5;
      const gy = Math.floor(i / gridSize) / gridSize - 0.5;
      const x = cx + gx * spread * 2 + (Math.random() - 0.5) * 8;
      const y = cy + gy * spread * 2 + (Math.random() - 0.5) * 8;
      particles.push({
        x, y, originX: x, originY: y,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.08,
        size: Math.random() * 1.8 + 0.6,
        type: "ai",
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.4,
      });
    }

    particlesRef.current = particles;
  }, [isMobile]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles(w, h);
      startTimeRef.current = performance.now();
    };

    resize();
    window.addEventListener("resize", resize);

    // Show text after fusion
    const textTimer = setTimeout(() => setTextVisible(true), 4200);

    const animate = (now: number) => {
      const elapsed = (now - startTimeRef.current) / 1000;
      ctx.clearRect(0, 0, w, h);

      const particles = particlesRef.current;
      const centerX = w / 2;
      const centerY = h * 0.48;

      // Phase progress
      const attractionStart = 2;
      const fusionStart = 4;
      const attractionProgress = Math.max(0, Math.min(1, (elapsed - attractionStart) / 2));
      const fusionProgress = Math.max(0, Math.min(1, (elapsed - fusionStart) / 2.5));
      const entryProgress = Math.min(1, elapsed / 1.8);

      // Update & draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Entry: slide in from sides
        const sideOffset = p.type === "human" ? -200 : 200;
        const entryX = p.originX + sideOffset * (1 - easeOutCubic(entryProgress));
        
        // Organic vs geometric motion
        if (p.type === "human") {
          // Organic noise-like drift
          p.x = entryX + Math.sin(now * 0.001 * p.speed + p.phase) * 3;
          p.y = p.originY + Math.cos(now * 0.0008 * p.speed + p.phase * 1.3) * 3;
        } else {
          // Precise rhythmic oscillation
          p.x = entryX + Math.sin(now * 0.002 * p.speed + p.phase) * 1.5;
          p.y = p.originY + Math.sin(now * 0.0015 * p.speed + p.phase) * 1.5;
        }

        // Attraction phase — drift toward center
        if (attractionProgress > 0) {
          const pullStrength = attractionProgress * 0.35;
          p.x += (centerX - p.x) * pullStrength * 0.02;
          p.y += (centerY - p.y) * pullStrength * 0.02;
          // Update origins so they stay shifted
          p.originX += (centerX - p.originX) * pullStrength * 0.008;
          p.originY += (centerY - p.originY) * pullStrength * 0.008;
        }

        // Fusion — orbit around center
        if (fusionProgress > 0) {
          const dx = p.x - centerX;
          const dy = p.y - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx);
          const orbitSpeed = 0.0003 * p.speed * fusionProgress;
          const newAngle = angle + orbitSpeed * (p.type === "human" ? 1 : -1);
          const targetDist = Math.max(20, dist * (1 - fusionProgress * 0.01));
          p.x = centerX + Math.cos(newAngle) * targetDist;
          p.y = centerY + Math.sin(newAngle) * targetDist;
        }

        // Draw particle
        const alpha = 0.5 + entryProgress * 0.5;
        if (p.type === "human") {
          ctx.fillStyle = `rgba(189, 166, 255, ${alpha})`;
        } else {
          ctx.fillStyle = `rgba(66, 190, 255, ${alpha})`;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Connection lines during attraction + fusion
      if (attractionProgress > 0) {
        const connectionAlpha = Math.min(0.2, attractionProgress * 0.2);
        const threshold = isMobile ? 50 : 70;
        ctx.lineWidth = 0.5;
        for (let i = 0; i < particles.length; i += 3) {
          for (let j = i + 1; j < particles.length; j += 3) {
            // Only connect across types for dramatic effect
            if (particles[i].type === particles[j].type) continue;
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < threshold) {
              const lineAlpha = connectionAlpha * (1 - dist / threshold);
              ctx.strokeStyle = `rgba(200, 190, 255, ${lineAlpha})`;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      }

      // Fusion glow
      if (fusionProgress > 0) {
        const glowRadius = isMobile ? 120 : 220;
        const grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, glowRadius * fusionProgress);
        grad.addColorStop(0, `rgba(232, 150, 124, ${0.45 * fusionProgress})`);
        grad.addColorStop(0.4, `rgba(212, 97, 107, ${0.2 * fusionProgress})`);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      clearTimeout(textTimer);
      window.removeEventListener("resize", resize);
    };
  }, [isMobile, initParticles]);

  return (
    <section className="hero-bg-dark relative overflow-hidden min-h-[60vh] md:min-h-[80vh] lg:min-h-screen">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: "block" }}
      />

      {/* Hero text — fades in after fusion */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] md:min-h-[80vh] lg:min-h-screen px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={textVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl"
        >
          <h1 className="text-[clamp(28px,6vw,72px)] font-black leading-[1.05] tracking-tight text-white mb-4 md:mb-6">
            Intelligence, engineered
            <br />
            <span className="bg-gradient-to-r from-[#BDA6FF] via-[#42BEFF] to-[#E8967C] bg-clip-text text-transparent">
              for healthcare.
            </span>
          </h1>
          <p className="text-[clamp(14px,2vw,20px)] text-white/60 leading-relaxed max-w-xl mx-auto">
            Human cognition × system-scale AI — unified into infrastructure.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export default HeroSection;
