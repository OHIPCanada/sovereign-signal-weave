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

      // Particle terrain - multiple layers for depth
      const layers = [
        { yBase: 0.45, amplitude: 0.08, speed: 0.15, color1: [60, 20, 120], color2: [30, 80, 160], density: 1.2, size: 1.2 },
        { yBase: 0.55, amplitude: 0.10, speed: 0.20, color1: [80, 40, 160], color2: [40, 100, 180], density: 1.0, size: 1.4 },
        { yBase: 0.65, amplitude: 0.12, speed: 0.25, color1: [100, 60, 200], color2: [50, 120, 200], density: 0.8, size: 1.6 },
        { yBase: 0.75, amplitude: 0.06, speed: 0.10, color1: [40, 15, 80], color2: [20, 50, 120], density: 1.4, size: 1.0 },
      ];

      const cols = Math.floor(w / (3 * dpr));
      const rows = Math.floor(h / (3 * dpr));

      for (const layer of layers) {
        for (let gx = 0; gx < cols; gx++) {
          for (let gy = 0; gy < rows; gy++) {
            const nx = gx / cols;
            const ny = gy / rows;
            const px = (gx / cols) * w;
            const py = (gy / rows) * h;

            // Wave terrain height
            const wave1 = Math.sin(nx * 6 + t * layer.speed) * layer.amplitude;
            const wave2 = Math.sin(nx * 10 + t * layer.speed * 1.3 + 1.5) * layer.amplitude * 0.5;
            const wave3 = Math.sin(nx * 3 + t * layer.speed * 0.7 + 3.0) * layer.amplitude * 0.7;
            const terrainY = layer.yBase + wave1 + wave2 + wave3;

            // Only render particles near the terrain surface
            const dist = Math.abs(ny - terrainY);
            if (dist > 0.15) continue;

            const falloff = 1 - dist / 0.15;
            const alpha = falloff * falloff * (0.5 + Math.sin(t * 0.8 + gx * 0.3 + gy * 0.2) * 0.2);

            if (alpha < 0.05) continue;

            // Color interpolation based on position
            const colorMix = nx;
            const r = layer.color1[0] + (layer.color2[0] - layer.color1[0]) * colorMix;
            const g = layer.color1[1] + (layer.color2[1] - layer.color1[1]) * colorMix;
            const b = layer.color1[2] + (layer.color2[2] - layer.color1[2]) * colorMix;

            const radius = layer.size * dpr * falloff;

            ctx.beginPath();
            ctx.arc(px, py, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${alpha})`;
            ctx.fill();
          }
        }
      }

      // Floating ambient particles
      const floaters = 40;
      for (let i = 0; i < floaters; i++) {
        const seed = i * 137.508;
        const fx = ((seed * 7.3 + t * 5 * (0.3 + (i % 4) * 0.15)) % w);
        const fy = ((seed * 3.1 + Math.sin(t * 0.4 + i * 0.7) * 30) % h);
        const fa = 0.12 + Math.sin(t * 1.2 + i * 2) * 0.08;
        const fr = (0.6 + (i % 3) * 0.4) * dpr;
        ctx.beginPath();
        ctx.arc(fx, fy, fr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(123, 97, 255, ${fa})`;
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
      style={{ opacity: 0.9 }}
    />
  );
};

export default MobileParticleWave;
