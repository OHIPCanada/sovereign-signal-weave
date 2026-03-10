import { useCallback, useRef } from "react";
import { useCanvasAnimation, type DrawFn } from "@/hooks/useCanvasAnimation";

/** Data Stream Waterfall — EMR Layer hero */
const DataStreamBackground = () => {
  interface Stream { x: number; speed: number; width: number; color: string; offset: number; }
  interface DataPacket { x: number; y: number; speed: number; size: number; color: string; }

  const streams = useRef<Stream[]>(
    Array.from({ length: 24 }, (_, i) => ({
      x: (i / 24) + Math.random() * 0.02,
      speed: 0.3 + Math.random() * 0.5,
      width: 2 + Math.random() * 4,
      color: Math.random() > 0.6 ? "coral" : "purple",
      offset: Math.random() * 1000,
    }))
  ).current;

  const packets = useRef<DataPacket[]>(
    Array.from({ length: 80 }, () => ({
      x: Math.random(), y: Math.random(),
      speed: 0.001 + Math.random() * 0.003,
      size: 2 + Math.random() * 3,
      color: Math.random() > 0.5 ? "rgba(212,97,107,0.7)" : "rgba(123,97,255,0.6)",
    }))
  ).current;

  const draw: DrawFn = useCallback((ctx, t, w, h, DPR) => {
    streams.forEach(s => {
      const sx = s.x * w;
      const segments = 20;
      for (let i = 0; i < segments; i++) {
        const segY = ((i / segments + t * s.speed * 0.1 + s.offset) % 1) * h;
        const segH = h / segments * 0.6;
        const alpha = Math.sin((i / segments) * Math.PI) * 0.15;
        ctx.fillStyle = s.color === "coral"
          ? `rgba(232,150,124,${alpha})`
          : `rgba(123,97,255,${alpha})`;
        ctx.fillRect(sx - s.width / 2, segY, s.width * DPR, segH);
      }
    });

    const bandY = h * 0.45;
    const bandH = h * 0.1;
    const bandGrad = ctx.createLinearGradient(0, bandY, 0, bandY + bandH);
    bandGrad.addColorStop(0, "rgba(123,97,255,0)");
    bandGrad.addColorStop(0.3, `rgba(123,97,255,${0.08 + Math.sin(t) * 0.03})`);
    bandGrad.addColorStop(0.7, `rgba(212,97,107,${0.06 + Math.sin(t * 1.3) * 0.03})`);
    bandGrad.addColorStop(1, "rgba(212,97,107,0)");
    ctx.fillStyle = bandGrad;
    ctx.fillRect(0, bandY, w, bandH);

    const scanX = ((t * 0.15) % 1) * w;
    ctx.fillStyle = "rgba(123,97,255,0.12)";
    ctx.fillRect(scanX - 2, bandY, 4 * DPR, bandH);

    packets.forEach(p => {
      p.y += p.speed;
      if (p.y > 1) { p.y = 0; p.x = Math.random(); }
      const distToCenter = Math.abs(p.y - 0.5);
      if (distToCenter < 0.15) p.x += (0.5 - p.x) * 0.002;
      const px = p.x * w;
      const py = p.y * h;
      ctx.beginPath();
      ctx.arc(px, py, p.size * DPR, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px, py - 8 * DPR);
      ctx.strokeStyle = p.color.replace(/[\d.]+\)$/, "0.2)");
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  }, [streams, packets]);

  const canvasRef = useCanvasAnimation(draw);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: 0.6 }} />;
};

export default DataStreamBackground;
