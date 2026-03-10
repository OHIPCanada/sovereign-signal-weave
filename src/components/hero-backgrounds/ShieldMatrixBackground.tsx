import { useCallback, useRef } from "react";
import { useCanvasAnimation, type DrawFn } from "@/hooks/useCanvasAnimation";

/** Shield Matrix — Governance hero: concentric rings with orbiting nodes */
const ShieldMatrixBackground = () => {
  interface OrbitNode { ring: number; angle: number; speed: number; size: number; }
  const orbitNodes = useRef<OrbitNode[]>(
    Array.from({ length: 24 }, (_, i) => ({
      ring: Math.floor(i / 6),
      angle: (i % 6) * (Math.PI * 2 / 6) + Math.random() * 0.5,
      speed: 0.08 + Math.random() * 0.12,
      size: 2.5 + Math.random() * 2,
    }))
  ).current;

  const ringRadii = [0.12, 0.22, 0.33, 0.44];

  const draw: DrawFn = useCallback((ctx, t, w, h, DPR) => {
    const cx = w * 0.55, cy = h * 0.5;
    const minDim = Math.min(w, h);

    // Central pulse
    const pulseSize = 0.08 + Math.sin(t * 0.6) * 0.03;
    const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, minDim * pulseSize);
    coreGrad.addColorStop(0, `rgba(232,150,124,${0.3 + Math.sin(t * 0.8) * 0.1})`);
    coreGrad.addColorStop(1, "rgba(232,150,124,0)");
    ctx.fillStyle = coreGrad;
    ctx.fillRect(0, 0, w, h);

    // Concentric rings
    ringRadii.forEach((r, ri) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * (ri % 2 === 0 ? 0.1 : -0.08) * (1 + ri * 0.3));
      ctx.beginPath();
      ctx.arc(0, 0, minDim * r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(123,97,255,${0.08 + Math.sin(t * 0.4 + ri) * 0.04})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([8 * DPR, 16 * DPR]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    });

    // Orbit nodes
    orbitNodes.forEach(node => {
      const r = ringRadii[node.ring] * minDim;
      const a = node.angle + t * node.speed * (node.ring % 2 === 0 ? 1 : -1);
      const nx = cx + Math.cos(a) * r;
      const ny = cy + Math.sin(a) * r;

      const glow = ctx.createRadialGradient(nx, ny, 0, nx, ny, node.size * 4 * DPR);
      glow.addColorStop(0, node.ring < 2 ? "rgba(123,97,255,0.4)" : "rgba(232,150,124,0.4)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(nx - node.size * 4 * DPR, ny - node.size * 4 * DPR, node.size * 8 * DPR, node.size * 8 * DPR);

      ctx.beginPath();
      ctx.arc(nx, ny, node.size * DPR, 0, Math.PI * 2);
      ctx.fillStyle = node.ring < 2 ? "rgba(123,97,255,0.7)" : "rgba(232,150,124,0.7)";
      ctx.fill();
    });

    // Ripple pulses
    for (let i = 0; i < 3; i++) {
      const rippleT = ((t * 0.3 + i * 0.33) % 1);
      const rippleR = rippleT * minDim * 0.5;
      const rippleAlpha = (1 - rippleT) * 0.15;
      ctx.beginPath();
      ctx.arc(cx, cy, rippleR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(232,150,124,${rippleAlpha})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }, [orbitNodes]);

  const canvasRef = useCanvasAnimation(draw);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: 0.7 }} />
    </div>
  );
};

export default ShieldMatrixBackground;
