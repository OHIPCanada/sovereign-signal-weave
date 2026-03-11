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
      // Ridge sits at ~65% height — prominent terrain
      const terrainTop = h * 0.38;

      // --- Ridge line: tall central peak ---
      const ridge = (x: number): number => {
        const nx = x / w;
        const base = terrainTop + h * 0.05;
        // Strong central mountain peak
        const peak = Math.exp(-Math.pow((nx - 0.5) * 2.8, 2)) * h * 0.2;
        // Secondary shoulders
        const shoulder1 = Math.exp(-Math.pow((nx - 0.25) * 4, 2)) * h * 0.06;
        const shoulder2 = Math.exp(-Math.pow((nx - 0.75) * 4, 2)) * h * 0.06;
        // Animated undulation
        const wave = Math.sin(nx * 5 + t * 0.2) * h * 0.008
          + Math.sin(nx * 9 + t * 0.15) * h * 0.004;
        return base - peak - shoulder1 - shoulder2 + wave;
      };

      // Fill terrain body
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= w; x += 2) {
        ctx.lineTo(x, ridge(x));
      }
      ctx.lineTo(w, h);
      ctx.closePath();

      const gradShift = Math.sin(t * 0.15) * 8;
      const terrainGrad = ctx.createLinearGradient(0, terrainTop - h * 0.15, 0, h);
      terrainGrad.addColorStop(0, `hsla(${272 + gradShift}, 85%, 10%, 0.97)`);
      terrainGrad.addColorStop(0.3, `hsla(${268 + gradShift}, 80%, 7%, 0.98)`);
      terrainGrad.addColorStop(0.7, `hsla(${265 + gradShift}, 75%, 5%, 0.96)`);
      terrainGrad.addColorStop(1, `hsla(${260 + gradShift}, 70%, 4%, 0.93)`);
      ctx.fillStyle = terrainGrad;
      ctx.fill();

      // Coral bloom inside terrain
      const bloomX = w * (0.6 + Math.sin(t * 0.1) * 0.05);
      const bloomY = h * (0.7 + Math.cos(t * 0.08) * 0.03);
      const bloomR = w * 0.4;
      ctx.save();
      ctx.clip(); // clip to terrain shape
      const bloom = ctx.createRadialGradient(bloomX, bloomY, 0, bloomX, bloomY, bloomR);
      bloom.addColorStop(0, `rgba(212, 97, 107, ${0.06 + Math.sin(t * 0.2) * 0.02})`);
      bloom.addColorStop(0.5, `rgba(232, 150, 124, ${0.03 + Math.sin(t * 0.25) * 0.01})`);
      bloom.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = bloom;
      ctx.fillRect(0, 0, w, h);

      // Violet bloom inside terrain
      const v2 = ctx.createRadialGradient(w * 0.3, h * 0.65, 0, w * 0.3, h * 0.65, w * 0.35);
      v2.addColorStop(0, `rgba(91, 31, 166, ${0.07 + Math.sin(t * 0.18) * 0.02})`);
      v2.addColorStop(0.6, "rgba(26, 6, 48, 0.03)");
      v2.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = v2;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      // Ridge glow line — animated purple-coral
      ctx.beginPath();
      for (let x = 0; x <= w; x += 2) {
        const y = ridge(x);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      const glowAlpha = 0.15 + Math.sin(t * 0.4) * 0.05;
      ctx.strokeStyle = `rgba(192, 132, 252, ${glowAlpha})`;
      ctx.lineWidth = 1.8 * dpr;
      ctx.stroke();

      // Second glow line offset
      ctx.beginPath();
      for (let x = 0; x <= w; x += 3) {
        const y = ridge(x) + 2 * dpr;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(212, 97, 107, ${glowAlpha * 0.4})`;
      ctx.lineWidth = 1 * dpr;
      ctx.stroke();

      // --- Dense dot-matrix particles on terrain ---
      const spacing = 5 * dpr;
      const cols = Math.ceil(w / spacing);
      const rows = Math.ceil((h - (terrainTop - h * 0.15)) / spacing);

      for (let gx = 0; gx < cols; gx++) {
        const px = gx * spacing;
        const ridgeY = ridge(px);

        for (let gy = 0; gy < rows; gy++) {
          const py = (terrainTop - h * 0.15) + gy * spacing;
          if (py < ridgeY) continue;

          const depth = (py - ridgeY) / (h - ridgeY);
          const ridgeDist = (py - ridgeY) / (h * 0.25);
          const ridgeFade = Math.max(0, 1 - ridgeDist);

          // Animated pulse
          const pulse = 0.65 + Math.sin(t * 0.6 + gx * 0.35 + gy * 0.25) * 0.2;
          const alpha = ridgeFade * ridgeFade * 0.25 * pulse;
          if (alpha < 0.012) continue;

          // Colors shift from lavender near ridge to deep purple below
          const r = 40 + ridgeFade * 80;
          const g = 15 + ridgeFade * 50;
          const b = 80 + ridgeFade * 120;

          const radius = (0.5 + ridgeFade * 0.9) * dpr;
          ctx.beginPath();
          ctx.arc(px, py, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${alpha})`;
          ctx.fill();
        }
      }

      // --- Apex glow ---
      const glowR = w * 0.35;
      const apexY = ridge(cx);
      const apexGlow = ctx.createRadialGradient(cx, apexY, 0, cx, apexY, glowR);
      apexGlow.addColorStop(0, `rgba(123, 97, 255, ${0.08 + Math.sin(t * 0.3) * 0.03})`);
      apexGlow.addColorStop(0.4, "rgba(91, 31, 166, 0.04)");
      apexGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = apexGlow;
      ctx.fillRect(0, apexY - glowR, w, glowR * 2);

      // --- Rising signal particles ---
      const signals = 24;
      for (let i = 0; i < signals; i++) {
        const seed = i * 97.31;
        const baseX = ((seed * 3.7) % 1) * w;
        const drift = Math.sin(t * 0.35 + i * 1.7) * 12 * dpr;
        const sx = baseX + drift;
        const lifeT = ((t * 0.18 + seed * 0.01) % 1);
        const sy = ridge(baseX) - lifeT * h * 0.2;
        const sa = (1 - lifeT) * 0.2 * (0.5 + Math.sin(t + i) * 0.5);

        if (sa < 0.01) continue;

        ctx.beginPath();
        ctx.arc(sx, sy, 1.2 * dpr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(192, 132, 252, ${sa})`;
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
