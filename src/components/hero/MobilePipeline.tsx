import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface CubeModule {
  label: string;
  icon: (ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, t: number) => void;
  color: string;
  glowColor: string;
}

const modules: CubeModule[] = [
  {
    label: "AI CORTEX",
    color: "rgba(123, 97, 255, 0.6)",
    glowColor: "rgba(123, 97, 255, 0.4)",
    icon: (ctx, cx, cy, size, t) => {
      // Neural network sphere - particles orbiting
      const count = 12;
      const r = size * 0.32;
      ctx.strokeStyle = "rgba(180, 160, 255, 0.3)";
      ctx.lineWidth = 0.5;
      const pts: [number, number][] = [];
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2 + t * 0.5;
        const a2 = (i / count) * Math.PI * 3 + t * 0.3;
        const px = cx + Math.cos(a) * r * Math.cos(a2 * 0.5);
        const py = cy + Math.sin(a) * r * 0.9 + Math.sin(a2) * r * 0.3;
        pts.push([px, py]);
      }
      // connections
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i][0] - pts[j][0];
          const dy = pts[i][1] - pts[j][1];
          if (Math.sqrt(dx * dx + dy * dy) < r * 1.2) {
            ctx.beginPath();
            ctx.moveTo(pts[i][0], pts[i][1]);
            ctx.lineTo(pts[j][0], pts[j][1]);
            ctx.stroke();
          }
        }
      }
      // nodes
      pts.forEach(([px, py]) => {
        ctx.beginPath();
        ctx.arc(px, py, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(200, 180, 255, 0.9)";
        ctx.fill();
      });
    },
  },
  {
    label: "SOVEREIGN DATA",
    color: "rgba(0, 200, 255, 0.5)",
    glowColor: "rgba(0, 200, 255, 0.35)",
    icon: (ctx, cx, cy, size, t) => {
      // Encrypted data nodes - floating lock-like geometry
      const s = size * 0.25;
      ctx.strokeStyle = "rgba(0, 220, 255, 0.6)";
      ctx.lineWidth = 1;
      // hexagonal shield
      for (let ring = 0; ring < 2; ring++) {
        const r = s * (0.6 + ring * 0.4);
        const rot = t * 0.3 * (ring % 2 === 0 ? 1 : -1);
        ctx.beginPath();
        for (let i = 0; i <= 6; i++) {
          const a = (i / 6) * Math.PI * 2 + rot;
          const method = i === 0 ? "moveTo" : "lineTo";
          ctx[method](cx + Math.cos(a) * r, cy + Math.sin(a) * r);
        }
        ctx.closePath();
        ctx.stroke();
      }
      // center dot
      ctx.beginPath();
      ctx.arc(cx, cy, 2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 255, 255, 0.8)";
      ctx.fill();
    },
  },
  {
    label: "AUDIT INTEGRITY",
    color: "rgba(212, 97, 107, 0.5)",
    glowColor: "rgba(212, 97, 107, 0.35)",
    icon: (ctx, cx, cy, size, t) => {
      // Shield with checkmark
      const s = size * 0.3;
      ctx.strokeStyle = "rgba(232, 150, 124, 0.7)";
      ctx.lineWidth = 1;
      // shield shape
      ctx.beginPath();
      ctx.moveTo(cx, cy - s);
      ctx.quadraticCurveTo(cx + s, cy - s * 0.7, cx + s * 0.8, cy + s * 0.1);
      ctx.quadraticCurveTo(cx + s * 0.4, cy + s * 0.8, cx, cy + s);
      ctx.quadraticCurveTo(cx - s * 0.4, cy + s * 0.8, cx - s * 0.8, cy + s * 0.1);
      ctx.quadraticCurveTo(cx - s, cy - s * 0.7, cx, cy - s);
      ctx.closePath();
      ctx.stroke();
      // checkmark
      const pulse = 0.7 + Math.sin(t * 2) * 0.3;
      ctx.strokeStyle = `rgba(232, 150, 124, ${pulse})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx - s * 0.3, cy);
      ctx.lineTo(cx - s * 0.05, cy + s * 0.25);
      ctx.lineTo(cx + s * 0.3, cy - s * 0.2);
      ctx.stroke();
    },
  },
  {
    label: "CLINIC OS",
    color: "rgba(100, 220, 180, 0.5)",
    glowColor: "rgba(100, 220, 180, 0.35)",
    icon: (ctx, cx, cy, size, t) => {
      // Dashboard grid
      const s = size * 0.26;
      ctx.strokeStyle = "rgba(100, 240, 200, 0.5)";
      ctx.lineWidth = 0.8;
      // grid lines
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(cx - s, cy + i * s * 0.6);
        ctx.lineTo(cx + s, cy + i * s * 0.6);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx + i * s * 0.6, cy - s);
        ctx.lineTo(cx + i * s * 0.6, cy + s);
        ctx.stroke();
      }
      // pulse bar
      const barW = s * 0.4;
      const barH = s * (0.3 + Math.sin(t * 1.5) * 0.2);
      ctx.fillStyle = "rgba(100, 240, 200, 0.4)";
      ctx.fillRect(cx - barW / 2, cy + s * 0.3 - barH, barW, barH);
    },
  },
  {
    label: "VIRTUAL CARE",
    color: "rgba(160, 120, 255, 0.5)",
    glowColor: "rgba(160, 120, 255, 0.35)",
    icon: (ctx, cx, cy, size, t) => {
      // Telehealth - two connected circles with signal arcs
      const s = size * 0.2;
      ctx.strokeStyle = "rgba(180, 160, 255, 0.6)";
      ctx.lineWidth = 1;
      // two figures
      [-1, 1].forEach((dir) => {
        const fx = cx + dir * s * 0.7;
        ctx.beginPath();
        ctx.arc(fx, cy - s * 0.15, s * 0.2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(fx, cy + s * 0.05);
        ctx.lineTo(fx, cy + s * 0.5);
        ctx.stroke();
      });
      // signal arcs
      const arcCount = 3;
      for (let i = 0; i < arcCount; i++) {
        const r = s * (0.3 + i * 0.25);
        const alpha = 0.2 + Math.sin(t * 2 + i) * 0.2;
        ctx.strokeStyle = `rgba(180, 160, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(cx, cy - s * 0.3, r, -Math.PI * 0.6, -Math.PI * 0.4);
        ctx.stroke();
      }
    },
  },
];

const MobilePipeline = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    const t0 = performance.now();

    const drawCube = (
      ctx: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      size: number,
      color: string,
      glowColor: string,
      activation: number,
      t: number
    ) => {
      if (activation <= 0) return;
      const s = size * 0.5;
      const d = s * 0.35; // isometric depth

      // Glow
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, s * 1.5);
      grd.addColorStop(0, glowColor.replace(/[\d.]+\)$/, `${0.25 * activation})`));
      grd.addColorStop(1, "transparent");
      ctx.fillStyle = grd;
      ctx.fillRect(cx - s * 1.5, cy - s * 1.5, s * 3, s * 3);

      // Front face
      ctx.beginPath();
      ctx.moveTo(cx - s, cy - s + d);
      ctx.lineTo(cx + s, cy - s + d);
      ctx.lineTo(cx + s, cy + s + d);
      ctx.lineTo(cx - s, cy + s + d);
      ctx.closePath();
      ctx.fillStyle = color.replace(/[\d.]+\)$/, `${0.12 * activation})`);
      ctx.fill();
      ctx.strokeStyle = color.replace(/[\d.]+\)$/, `${0.5 * activation})`);
      ctx.lineWidth = 1;
      ctx.stroke();

      // Top face
      ctx.beginPath();
      ctx.moveTo(cx - s, cy - s + d);
      ctx.lineTo(cx - s + d, cy - s);
      ctx.lineTo(cx + s + d, cy - s);
      ctx.lineTo(cx + s, cy - s + d);
      ctx.closePath();
      ctx.fillStyle = color.replace(/[\d.]+\)$/, `${0.18 * activation})`);
      ctx.fill();
      ctx.stroke();

      // Right face
      ctx.beginPath();
      ctx.moveTo(cx + s, cy - s + d);
      ctx.lineTo(cx + s + d, cy - s);
      ctx.lineTo(cx + s + d, cy + s);
      ctx.lineTo(cx + s, cy + s + d);
      ctx.closePath();
      ctx.fillStyle = color.replace(/[\d.]+\)$/, `${0.08 * activation})`);
      ctx.fill();
      ctx.stroke();

      // Edge highlights
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 * activation})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(cx - s, cy - s + d);
      ctx.lineTo(cx + s, cy - s + d);
      ctx.lineTo(cx + s + d, cy - s);
      ctx.stroke();
    };

    const drawEnergyStream = (
      ctx: CanvasRenderingContext2D,
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      activation: number,
      t: number,
      idx: number
    ) => {
      if (activation <= 0) return;
      const particles = 6;
      for (let i = 0; i < particles; i++) {
        const prog = ((t * 0.4 + i / particles + idx * 0.1) % 1);
        const px = x1 + (x2 - x1) * prog;
        const py = y1 + (y2 - y1) * prog + Math.sin(prog * Math.PI * 3 + t * 2) * 4;
        const alpha = Math.sin(prog * Math.PI) * 0.7 * activation;
        const r = 1 + Math.sin(prog * Math.PI) * 1;
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 160, 255, ${alpha})`;
        ctx.fill();
      }
      // faint line
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = `rgba(123, 97, 255, ${0.08 * activation})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    const loop = (now: number) => {
      const t = (now - t0) / 1000;
      const w = canvas.width;
      const h = canvas.height;
      if (w === 0 || h === 0) {
        animRef.current = requestAnimationFrame(loop);
        return;
      }
      const dpr = w / (canvas.getBoundingClientRect().width || 1);

      ctx.clearRect(0, 0, w, h);

      // Background particles
      const bgParticles = 30;
      for (let i = 0; i < bgParticles; i++) {
        const seed = i * 137.5;
        const px = ((seed * 7.3 + t * 8 * (0.5 + (i % 3) * 0.3)) % w);
        const py = ((seed * 3.7 + Math.sin(t * 0.5 + i) * 20) % h);
        const alpha = 0.15 + Math.sin(t + i) * 0.1;
        const r = (0.5 + (i % 3) * 0.3) * dpr;
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(123, 97, 255, ${alpha})`;
        ctx.fill();
      }

      // Pipeline layout - vertical stack
      const cubeSize = 36 * dpr;
      const gapY = h / (modules.length + 1);
      const centerX = w * 0.5;

      const positions: [number, number][] = [];

      modules.forEach((mod, i) => {
        const cy = gapY * (i + 1);
        // slight horizontal stagger for perspective feel
        const cx = centerX + (i - 2) * 6 * dpr;
        positions.push([cx, cy]);

        // Sequential activation: each cube activates 0.6s after previous
        const activationStart = 1.0 + i * 0.6;
        const activation = Math.min(1, Math.max(0, (t - activationStart) / 0.8));

        // Floating bob
        const bob = Math.sin(t * 1.2 + i * 0.8) * 3 * dpr;

        drawCube(ctx, cx, cy + bob, cubeSize, mod.color, mod.glowColor, activation, t);

        // Internal icon
        if (activation > 0.3) {
          ctx.save();
          ctx.globalAlpha = Math.min(1, (activation - 0.3) / 0.5);
          mod.icon(ctx, cx, cy + bob, cubeSize, t);
          ctx.restore();
        }
      });

      // Energy streams between cubes
      for (let i = 0; i < positions.length - 1; i++) {
        const activationStart = 1.0 + (i + 1) * 0.6;
        const streamActivation = Math.min(1, Math.max(0, (t - activationStart) / 0.6));
        drawEnergyStream(
          ctx,
          positions[i][0], positions[i][1] + cubeSize * 0.6,
          positions[i + 1][0], positions[i + 1][1] - cubeSize * 0.6,
          streamActivation,
          t,
          i
        );
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.95 }}
      />
      {/* Labels overlay */}
      <div className="absolute inset-0 flex flex-col justify-around py-4 pointer-events-none">
        {modules.map((mod, i) => (
          <motion.div
            key={mod.label}
            className="flex items-center justify-center"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.6 + i * 0.6 }}
          >
            <span className="text-[9px] font-bold tracking-[0.18em] uppercase text-foreground/80 bg-background/10 backdrop-blur-sm px-2 py-0.5 rounded-sm">
              {mod.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MobilePipeline;
