import { useCallback, useRef } from "react";
import { useCanvasAnimation, type DrawFn } from "@/hooks/useCanvasAnimation";

/** Blockchain Cascade — Audit Trails hero: falling blocks + matrix hex chars */
const BlockchainCascadeBackground = () => {
  interface Block { x: number; y: number; speed: number; w: number; h: number; col: number; }
  interface MatrixDrop { x: number; y: number; speed: number; char: string; }

  const chars = "0123456789abcdef";

  const blocks = useRef<Block[]>(
    Array.from({ length: 40 }, (_, i) => ({
      x: Math.random(), y: Math.random() * -1,
      speed: 0.15 + Math.random() * 0.25,
      w: 30 + Math.random() * 50, h: 14 + Math.random() * 10,
      col: i % 3,
    }))
  ).current;

  const drops = useRef<MatrixDrop[]>(
    Array.from({ length: 60 }, () => ({
      x: Math.random(), y: Math.random(),
      speed: 0.002 + Math.random() * 0.004,
      char: chars[Math.floor(Math.random() * chars.length)],
    }))
  ).current;

  const draw: DrawFn = useCallback((ctx, t, w, h, DPR) => {
    // Matrix-style falling hex characters
    ctx.font = `${10 * DPR}px monospace`;
    drops.forEach(d => {
      d.y += d.speed;
      if (d.y > 1) {
        d.y = -0.02; d.x = Math.random();
        d.char = chars[Math.floor(Math.random() * chars.length)];
      }
      const alpha = 0.08 + Math.sin(t * 2 + d.x * 10) * 0.04;
      ctx.fillStyle = `rgba(212,97,107,${alpha})`;
      ctx.fillText(d.char, d.x * w, d.y * h);
    });

    // Falling blockchain blocks
    const colors = ["rgba(212,97,107,", "rgba(123,97,255,", "rgba(232,150,124,"];
    blocks.forEach(b => {
      b.y += b.speed * 0.002;
      if (b.y > 1.1) { b.y = -0.1; b.x = Math.random(); }

      const bx = b.x * w, by = b.y * h;
      const alpha = Math.min(1, Math.sin(b.y * Math.PI)) * 0.2;

      ctx.strokeStyle = `${colors[b.col]}${alpha})`;
      ctx.lineWidth = 1;
      ctx.strokeRect(bx, by, b.w * DPR, b.h * DPR);

      ctx.fillStyle = `${colors[b.col]}${alpha * 0.6})`;
      ctx.font = `${7 * DPR}px monospace`;
      ctx.fillText("0x" + Math.floor(b.x * 0xffff).toString(16), bx + 3 * DPR, by + b.h * DPR * 0.7);

      ctx.beginPath();
      ctx.moveTo(bx + b.w * DPR * 0.5, by + b.h * DPR);
      ctx.lineTo(bx + b.w * DPR * 0.5, by + b.h * DPR + 20 * DPR);
      ctx.strokeStyle = `${colors[b.col]}${alpha * 0.4})`;
      ctx.setLineDash([3 * DPR, 3 * DPR]);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Horizontal verification scan
    const scanY = ((t * 0.08) % 1) * h;
    const scanGrad = ctx.createLinearGradient(0, scanY - 10 * DPR, 0, scanY + 10 * DPR);
    scanGrad.addColorStop(0, "rgba(212,97,107,0)");
    scanGrad.addColorStop(0.5, "rgba(212,97,107,0.12)");
    scanGrad.addColorStop(1, "rgba(212,97,107,0)");
    ctx.fillStyle = scanGrad;
    ctx.fillRect(0, scanY - 10 * DPR, w, 20 * DPR);
  }, [blocks, drops]);

  const canvasRef = useCanvasAnimation(draw);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: 0.8 }} />
    </div>
  );
};

export default BlockchainCascadeBackground;
