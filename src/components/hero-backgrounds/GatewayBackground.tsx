import { useCallback, useRef } from "react";
import { useCanvasAnimation, type DrawFn } from "@/hooks/useCanvasAnimation";

/** Radial Gateway — Patient Access hero: orbiting access points converging to center */
const GatewayBackground = () => {
  interface AccessPoint { angle: number; radius: number; speed: number; size: number; color: string; }
  interface Signal { angle: number; dist: number; speed: number; }

  const accessPoints = useRef<AccessPoint[]>([
    { angle: 0, radius: 0.28, speed: 0.15, size: 6, color: "rgba(232,150,124,0.85)" },
    { angle: Math.PI * 0.4, radius: 0.32, speed: 0.12, size: 5, color: "rgba(123,97,255,0.75)" },
    { angle: Math.PI * 0.8, radius: 0.25, speed: 0.18, size: 7, color: "rgba(212,97,107,0.8)" },
    { angle: Math.PI * 1.2, radius: 0.30, speed: 0.14, size: 5, color: "rgba(123,97,255,0.7)" },
    { angle: Math.PI * 1.6, radius: 0.35, speed: 0.11, size: 6, color: "rgba(232,150,124,0.75)" },
  ]).current;

  const signals = useRef<Signal[]>(
    Array.from({ length: 30 }, () => ({
      angle: Math.random() * Math.PI * 2,
      dist: 0.45 + Math.random() * 0.15,
      speed: 0.003 + Math.random() * 0.004,
    }))
  ).current;

  const draw: DrawFn = useCallback((ctx, t, w, h, DPR) => {
    const cx = w * 0.5, cy = h * 0.5;
    const minDim = Math.min(w, h);

    const gateGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, minDim * 0.15);
    gateGrad.addColorStop(0, `rgba(232,150,124,${0.25 + Math.sin(t * 0.8) * 0.08})`);
    gateGrad.addColorStop(0.5, "rgba(212,97,107,0.08)");
    gateGrad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gateGrad;
    ctx.fillRect(0, 0, w, h);

    [0.2, 0.28, 0.35, 0.42].forEach((r, i) => {
      ctx.beginPath();
      ctx.arc(cx, cy, minDim * r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(123,97,255,${0.06 + Math.sin(t * 0.5 + i) * 0.02})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([4 * DPR, 8 * DPR]);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    signals.forEach(s => {
      s.dist -= s.speed;
      if (s.dist < 0.05) {
        s.dist = 0.45 + Math.random() * 0.15;
        s.angle = Math.random() * Math.PI * 2;
      }
      const sx = cx + Math.cos(s.angle) * minDim * s.dist;
      const sy = cy + Math.sin(s.angle) * minDim * s.dist;
      const alpha = s.dist < 0.15 ? s.dist / 0.15 : 1;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      const trailEnd = s.dist + 0.03;
      ctx.lineTo(cx + Math.cos(s.angle) * minDim * trailEnd, cy + Math.sin(s.angle) * minDim * trailEnd);
      ctx.strokeStyle = `rgba(232,150,124,${alpha * 0.15})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(sx, sy, 2 * DPR, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(232,150,124,${alpha * 0.6})`;
      ctx.fill();
    });

    accessPoints.forEach(ap => {
      const a = ap.angle + t * ap.speed;
      const px = cx + Math.cos(a) * minDim * ap.radius;
      const py = cy + Math.sin(a) * minDim * ap.radius;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(px, py);
      ctx.strokeStyle = ap.color.replace(/[\d.]+\)$/, "0.12)");
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(px, py, ap.size * 3 * DPR, 0, Math.PI * 2);
      ctx.fillStyle = ap.color.replace(/[\d.]+\)$/, "0.08)");
      ctx.fill();
      ctx.beginPath();
      ctx.arc(px, py, ap.size * DPR, 0, Math.PI * 2);
      ctx.fillStyle = ap.color;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(px, py, 2 * DPR, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      ctx.fill();
    });

    ctx.beginPath();
    ctx.arc(cx, cy, 12 * DPR, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(232,150,124,0.9)";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, 5 * DPR, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.fill();

    for (let ring = 0; ring < 2; ring++) {
      const ringT = (t * 0.3 + ring * 0.5) % 1;
      const ringR = ringT * minDim * 0.2;
      const ringAlpha = (1 - ringT) * 0.12;
      ctx.beginPath();
      ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(232,150,124,${ringAlpha})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }, [accessPoints, signals]);

  const canvasRef = useCanvasAnimation(draw);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: 0.7 }} />;
};

export default GatewayBackground;
