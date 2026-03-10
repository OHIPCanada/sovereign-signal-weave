import { useCallback, useRef } from "react";
import { useCanvasAnimation, type DrawFn } from "@/hooks/useCanvasAnimation";

/** Signal Wave — Virtual Care hero: care nodes connected by sinusoidal waves */
const SignalWaveBackground = () => {
  interface CareNode { x: number; y: number; label: string; pulse: number; }
  const careNodes = useRef<CareNode[]>([
    { x: 0.15, y: 0.3, label: "Patient", pulse: 0 },
    { x: 0.85, y: 0.3, label: "Clinician", pulse: Math.PI },
    { x: 0.5, y: 0.7, label: "AI Cortex", pulse: Math.PI * 0.5 },
    { x: 0.25, y: 0.7, label: "Pharmacy", pulse: Math.PI * 1.5 },
    { x: 0.75, y: 0.7, label: "Lab", pulse: Math.PI * 0.75 },
  ]).current;

  const draw: DrawFn = useCallback((ctx, t, w, h, DPR) => {
    const bg = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, h * 0.7);
    bg.addColorStop(0, "rgba(123,97,255,0.06)");
    bg.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < careNodes.length; i++) {
      for (let j = i + 1; j < careNodes.length; j++) {
        const n1 = careNodes[i], n2 = careNodes[j];
        const x1 = n1.x * w, y1 = n1.y * h;
        const x2 = n2.x * w, y2 = n2.y * h;

        ctx.beginPath();
        const steps = 60;
        for (let s = 0; s <= steps; s++) {
          const p = s / steps;
          const baseX = x1 + (x2 - x1) * p;
          const baseY = y1 + (y2 - y1) * p;
          const perpX = -(y2 - y1), perpY = x2 - x1;
          const len = Math.sqrt(perpX * perpX + perpY * perpY);
          const waveAmp = Math.sin(p * Math.PI) * 15 * DPR;
          const wave = Math.sin(p * 8 + t * 3 + i + j) * waveAmp;
          const px = baseX + (perpX / len) * wave;
          const py = baseY + (perpY / len) * wave;
          if (s === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        const alpha = 0.12 + Math.sin(t * 1.5 + i * 2) * 0.05;
        ctx.strokeStyle = j === 2 ? `rgba(212,97,107,${alpha})` : `rgba(123,97,255,${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        const dotP = ((t * 0.2 + i * 0.3 + j * 0.2) % 1);
        const dotX = x1 + (x2 - x1) * dotP;
        const dotY = y1 + (y2 - y1) * dotP;
        const dotWaveAmp = Math.sin(dotP * Math.PI) * 15 * DPR;
        const dotWave = Math.sin(dotP * 8 + t * 3 + i + j) * dotWaveAmp;
        const perpX2 = -(y2 - y1), perpY2 = x2 - x1;
        const len2 = Math.sqrt(perpX2 * perpX2 + perpY2 * perpY2);
        ctx.beginPath();
        ctx.arc(dotX + (perpX2 / len2) * dotWave, dotY + (perpY2 / len2) * dotWave, 3 * DPR, 0, Math.PI * 2);
        ctx.fillStyle = j === 2 ? "rgba(242,193,174,0.8)" : "rgba(189,166,255,0.8)";
        ctx.fill();
      }
    }

    careNodes.forEach((node, i) => {
      const nx = node.x * w, ny = node.y * h;
      const breathe = Math.sin(t * 1.2 + node.pulse) * 0.3 + 0.7;
      ctx.beginPath();
      ctx.arc(nx, ny, 30 * DPR, 0, Math.PI * 2);
      ctx.fillStyle = i === 2 ? `rgba(212,97,107,${0.08 * breathe})` : `rgba(123,97,255,${0.06 * breathe})`;
      ctx.fill();
      const pulseR = 20 * DPR + ((t * 0.5 + node.pulse) % 1) * 25 * DPR;
      const pulseAlpha = (1 - ((t * 0.5 + node.pulse) % 1)) * 0.15;
      ctx.beginPath();
      ctx.arc(nx, ny, pulseR, 0, Math.PI * 2);
      ctx.strokeStyle = i === 2 ? `rgba(212,97,107,${pulseAlpha})` : `rgba(123,97,255,${pulseAlpha})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(nx, ny, 8 * DPR, 0, Math.PI * 2);
      ctx.fillStyle = i === 2 ? "rgba(212,97,107,0.85)" : "rgba(123,97,255,0.75)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(nx, ny, 3 * DPR, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.fill();
    });
  }, [careNodes]);

  const canvasRef = useCanvasAnimation(draw);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: 0.7 }} />;
};

export default SignalWaveBackground;
