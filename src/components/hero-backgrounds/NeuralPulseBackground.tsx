import { useCallback, useRef } from "react";
import { useCanvasAnimation, type DrawFn } from "@/hooks/useCanvasAnimation";

/** Neural Pulse — AI Cortex hero: interconnected nodes with pulsing signals */
const NeuralPulseBackground = () => {
  interface Node { x: number; y: number; vx: number; vy: number; layer: number; phase: number; }
  const nodesRef = useRef<Node[]>(
    Array.from({ length: 60 }, () => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0004,
      vy: (Math.random() - 0.5) * 0.0004,
      layer: Math.floor(Math.random() * 3),
      phase: Math.random() * Math.PI * 2,
    }))
  );

  const draw: DrawFn = useCallback((ctx, t, w, h, DPR) => {
    const nodes = nodesRef.current;
    const cGrad = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, h * 0.6);
    cGrad.addColorStop(0, `rgba(123,97,255,${0.12 + Math.sin(t * 0.5) * 0.04})`);
    cGrad.addColorStop(0.5, "rgba(123,97,255,0.03)");
    cGrad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = cGrad;
    ctx.fillRect(0, 0, w, h);

    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > 1) n.vx *= -1;
      if (n.y < 0 || n.y > 1) n.vy *= -1;
      n.x = Math.max(0, Math.min(1, n.x));
      n.y = Math.max(0, Math.min(1, n.y));
    });

    const DIST = 120 * DPR;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = (nodes[i].x - nodes[j].x) * w;
        const dy = (nodes[i].y - nodes[j].y) * h;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < DIST) {
          const alpha = (1 - d / DIST) * 0.25;
          const pulse = Math.sin(t * 2 + nodes[i].phase + nodes[j].phase) * 0.5 + 0.5;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x * w, nodes[i].y * h);
          ctx.lineTo(nodes[j].x * w, nodes[j].y * h);
          ctx.strokeStyle = `rgba(123,97,255,${alpha * (0.5 + pulse * 0.5)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
          if (pulse > 0.8) {
            const px = nodes[i].x * w + (nodes[j].x - nodes[i].x) * w * ((t * 0.3) % 1);
            const py = nodes[i].y * h + (nodes[j].y - nodes[i].y) * h * ((t * 0.3) % 1);
            ctx.beginPath();
            ctx.arc(px, py, Math.max(0.1, 2 * DPR), 0, Math.PI * 2);
            ctx.fillStyle = "rgba(212,97,107,0.6)";
            ctx.fill();
          }
        }
      }
    }

    nodes.forEach(n => {
      const px = n.x * w;
      const py = n.y * h;
      const breathe = Math.sin(t * 1.5 + n.phase) * 0.3 + 0.7;
      const r = Math.max(0.1, (n.layer === 0 ? 2 : n.layer === 1 ? 3 : 4) * DPR);
      ctx.beginPath();
      ctx.arc(px, py, r * 4, 0, Math.PI * 2);
      ctx.fillStyle = n.layer === 2 ? `rgba(212,97,107,${0.08 * breathe})` : `rgba(123,97,255,${0.06 * breathe})`;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fillStyle = n.layer === 2 ? `rgba(212,97,107,${0.7 * breathe})` : `rgba(123,97,255,${0.6 * breathe})`;
      ctx.fill();
    });

    for (let ring = 0; ring < 3; ring++) {
      const ringT = (t * 0.2 + ring * 0.33) % 1;
      const ringR = Math.max(0.1, ringT * Math.min(w, h) * 0.5);
      const ringAlpha = (1 - ringT) * 0.08;
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.5, ringR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(123,97,255,${ringAlpha})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }, []);

  const canvasRef = useCanvasAnimation(draw);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: 0.7 }} />;
};

export default NeuralPulseBackground;
