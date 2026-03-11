import { useEffect, useRef } from "react";

const MobileParticleWave = () => {
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

    const loop = (now: number) => {
      const t = (now - t0) / 1000;
      const w = canvas.width;
      const h = canvas.height;
      if (w === 0 || h === 0) {
        animRef.current = requestAnimationFrame(loop);
        return;
      }

      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      // The terrain sits in the lower 55% of the canvas
      const terrainTop = h * 0.45;

      // --- Terrain: dense dot-matrix field below a soft ridge ---
      // Ridge line function - gentle undulation, not a sharp mountain
      const ridge = (x: number): number => {
        const nx = x / w;
        const base = terrainTop + h * 0.08;
        // gentle central rise
        const bell = Math.exp(-Math.pow((nx - 0.5) * 3.2, 2)) * h * 0.12;
        // subtle undulation
        const wave = Math.sin(nx * 4 + t * 0.12) * h * 0.008
          + Math.sin(nx * 7 + t * 0.08) * h * 0.004;
        return base - bell + wave;
      };

      // Fill below ridge with deep gradient
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= w; x += 2) {
        ctx.lineTo(x, ridge(x));
      }
      ctx.lineTo(w, h);
      ctx.closePath();

      const terrainGrad = ctx.createLinearGradient(0, terrainTop, 0, h);
      terrainGrad.addColorStop(0, "rgba(18, 8, 38, 0.92)");
      terrainGrad.addColorStop(0.5, "rgba(14, 5, 30, 0.95)");
      terrainGrad.addColorStop(1, "rgba(10, 3, 22, 0.9)");
      ctx.fillStyle = terrainGrad;
      ctx.fill();

      // Ridge edge - very subtle glow line
      ctx.beginPath();
      for (let x = 0; x <= w; x += 2) {
        const y = ridge(x);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(120, 80, 200, 0.12)";
      ctx.lineWidth = 1.5 * dpr;
      ctx.stroke();

      // --- Dot-matrix particles on terrain surface ---
      const spacing = 6 * dpr;
      const cols = Math.ceil(w / spacing);
      const rows = Math.ceil((h - terrainTop) / spacing);

      for (let gx = 0; gx < cols; gx++) {
        const px = gx * spacing;
        const ridgeY = ridge(px);

        for (let gy = 0; gy < rows; gy++) {
          const py = terrainTop + gy * spacing;
          if (py < ridgeY) continue; // above terrain

          const depth = (py - ridgeY) / (h - ridgeY);
          const nx = gx / cols;

          // Proximity to ridge = brighter
          const ridgeDist = (py - ridgeY) / (h * 0.3);
          const ridgeFade = Math.max(0, 1 - ridgeDist);

          // Subtle pulse
          const pulse = 0.6 + Math.sin(t * 0.5 + gx * 0.4 + gy * 0.3) * 0.15;
          const alpha = ridgeFade * ridgeFade * 0.18 * pulse;
          if (alpha < 0.01) continue;

          const r = 26 + depth * 10;
          const g = 10 + ridgeFade * 40;
          const b = 50 + ridgeFade * 80;

          const radius = (0.6 + ridgeFade * 0.6) * dpr;
          ctx.beginPath();
          ctx.arc(px, py, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${alpha})`;
          ctx.fill();
        }
      }

      // --- Subtle radial glow at apex ---
      const glowR = w * 0.3;
      const apexY = ridge(cx);
      const glow = ctx.createRadialGradient(cx, apexY, 0, cx, apexY, glowR);
      glow.addColorStop(0, "rgba(100, 60, 200, 0.06)");
      glow.addColorStop(0.5, "rgba(60, 30, 140, 0.03)");
      glow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, apexY - glowR, w, glowR * 2);

      // --- Sparse signal particles drifting upward from ridge ---
      const signals = 18;
      for (let i = 0; i < signals; i++) {
        const seed = i * 97.31;
        const baseX = ((seed * 3.7) % 1) * w;
        const drift = Math.sin(t * 0.3 + i * 1.7) * 15 * dpr;
        const sx = baseX + drift;
        const lifeT = ((t * 0.15 + seed * 0.01) % 1);
        const sy = ridge(baseX) - lifeT * h * 0.15;
        const sa = (1 - lifeT) * 0.15 * (0.5 + Math.sin(t + i) * 0.5);

        if (sa < 0.01) continue;

        ctx.beginPath();
        ctx.arc(sx, sy, 1 * dpr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(140, 100, 255, ${sa})`;
        ctx.fill();
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
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 1 }}
    />
  );
};

export default MobileParticleWave;
