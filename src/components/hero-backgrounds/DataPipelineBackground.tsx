import { useCallback, useRef } from "react";
import { useCanvasAnimation, type DrawFn } from "@/hooks/useCanvasAnimation";

/** Data Pipeline Network — Interoperability hero: hub-to-hub packet routing */
const DataPipelineBackground = () => {
  interface Hub { x: number; y: number; label: string; type: "source" | "core" | "target"; }
  interface Packet { fromIdx: number; toIdx: number; progress: number; speed: number; color: string; }

  const hubs: Hub[] = [
    { x: 0.08, y: 0.25, label: "HL7", type: "source" },
    { x: 0.08, y: 0.50, label: "FHIR", type: "source" },
    { x: 0.08, y: 0.75, label: "CDA", type: "source" },
    { x: 0.50, y: 0.50, label: "CORE", type: "core" },
    { x: 0.92, y: 0.25, label: "EMR", type: "target" },
    { x: 0.92, y: 0.50, label: "LAB", type: "target" },
    { x: 0.92, y: 0.75, label: "PHR", type: "target" },
  ];

  const packetsRef = useRef<Packet[]>([]);
  const lastSpawnRef = useRef(0);

  const spawnPacket = () => {
    const sources = [0, 1, 2];
    const targets = [4, 5, 6];
    const from = sources[Math.floor(Math.random() * 3)];
    const to = targets[Math.floor(Math.random() * 3)];
    packetsRef.current.push({
      fromIdx: from, toIdx: to, progress: 0,
      speed: 0.003 + Math.random() * 0.004,
      color: from === 0 ? "rgba(123,97,255,0.8)" : from === 1 ? "rgba(212,97,107,0.8)" : "rgba(232,150,124,0.8)",
    });
  };

  const draw: DrawFn = useCallback((ctx, t, w, h, DPR) => {
    const packets = packetsRef.current;
    if (t - lastSpawnRef.current > 0.4) { spawnPacket(); lastSpawnRef.current = t; }

    // Route lines
    [0, 1, 2].forEach(si => {
      const s = hubs[si], core = hubs[3];
      ctx.beginPath();
      ctx.moveTo(s.x * w, s.y * h);
      ctx.quadraticCurveTo(0.3 * w, (s.y * 0.5 + core.y * 0.5) * h, core.x * w, core.y * h);
      ctx.strokeStyle = `rgba(123,97,255,${0.06 + Math.sin(t + si) * 0.02})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      [4, 5, 6].forEach(ti => {
        const target = hubs[ti];
        ctx.beginPath();
        ctx.moveTo(core.x * w, core.y * h);
        ctx.quadraticCurveTo(0.7 * w, (core.y * 0.5 + target.y * 0.5) * h, target.x * w, target.y * h);
        ctx.strokeStyle = `rgba(212,97,107,${0.05 + Math.sin(t + ti) * 0.02})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    });

    // Hub nodes
    hubs.forEach((hub, i) => {
      const hx = hub.x * w, hy = hub.y * h;
      const r = hub.type === "core" ? 14 * DPR : 8 * DPR;
      const pulseR = r + Math.sin(t * 2 + i) * 3 * DPR;
      const baseColor = hub.type === "source" ? "123,97,255" : hub.type === "core" ? "232,150,124" : "212,97,107";
      const glow = ctx.createRadialGradient(hx, hy, 0, hx, hy, pulseR * 3);
      glow.addColorStop(0, `rgba(${baseColor},0.2)`);
      glow.addColorStop(1, `rgba(${baseColor},0)`);
      ctx.fillStyle = glow;
      ctx.fillRect(hx - pulseR * 3, hy - pulseR * 3, pulseR * 6, pulseR * 6);
      ctx.beginPath();
      ctx.arc(hx, hy, pulseR, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${baseColor},0.15)`;
      ctx.fill();
      ctx.strokeStyle = `rgba(${baseColor},0.4)`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // Animate packets
    for (let i = packets.length - 1; i >= 0; i--) {
      const p = packets[i];
      p.progress += p.speed;
      const from = hubs[p.fromIdx], core = hubs[3], to = hubs[p.toIdx];
      let px: number, py: number;
      if (p.progress < 0.5) {
        const t2 = p.progress * 2;
        const mx = 0.3, my = (from.y * 0.5 + core.y * 0.5);
        px = ((1 - t2) * (1 - t2) * from.x + 2 * (1 - t2) * t2 * mx + t2 * t2 * core.x) * w;
        py = ((1 - t2) * (1 - t2) * from.y + 2 * (1 - t2) * t2 * my + t2 * t2 * core.y) * h;
      } else {
        const t2 = (p.progress - 0.5) * 2;
        const mx = 0.7, my = (core.y * 0.5 + to.y * 0.5);
        px = ((1 - t2) * (1 - t2) * core.x + 2 * (1 - t2) * t2 * mx + t2 * t2 * to.x) * w;
        py = ((1 - t2) * (1 - t2) * core.y + 2 * (1 - t2) * t2 * my + t2 * t2 * to.y) * h;
      }
      ctx.beginPath();
      ctx.arc(px, py, 3 * DPR, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      const trail = ctx.createRadialGradient(px, py, 0, px, py, 10 * DPR);
      trail.addColorStop(0, p.color.replace("0.8", "0.3"));
      trail.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = trail;
      ctx.fillRect(px - 10 * DPR, py - 10 * DPR, 20 * DPR, 20 * DPR);
      if (p.progress > 1) packets.splice(i, 1);
    }
  }, []);

  const canvasRef = useCanvasAnimation(draw);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: 0.7 }} />
    </div>
  );
};

export default DataPipelineBackground;
