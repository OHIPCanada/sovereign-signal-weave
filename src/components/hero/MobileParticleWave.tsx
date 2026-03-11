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

      // --- Ridge line: gentle subtle wave ---
      const ridge = (x: number): number => {
        const nx = x / w;
        const base = terrainTop;
        // Very gentle undulation — no peak
        const wave1 = Math.sin(nx * Math.PI * 2 + t * 0.15) * h * 0.025;
        const wave2 = Math.sin(nx * Math.PI * 3.5 + t * 0.1) * h * 0.015;
        const wave3 = Math.sin(nx * Math.PI * 6 + t * 0.2) * h * 0.006;
        return base + wave1 + wave2 + wave3;
      };

      // Fill terrain body
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= w; x += 2) {
        ctx.lineTo(x, ridge(x));
      }
      ctx.lineTo(w, h);
      ctx.closePath();

      // Base gradient matching Intelligence Layer: linear-gradient(135deg, #1A0630, #3A0B6E, #5B1FA6)
      const gradShift = Math.sin(t * 0.15) * 5;
      const terrainGrad = ctx.createLinearGradient(0, terrainTop - h * 0.1, w, h);
      terrainGrad.addColorStop(0, `hsla(${268 + gradShift}, 78%, 13%, 1)`);   // #1A0630
      terrainGrad.addColorStop(0.48, `hsla(${270 + gradShift}, 82%, 24%, 1)`); // #3A0B6E
      terrainGrad.addColorStop(1, `hsla(${264 + gradShift}, 68%, 38%, 1)`);    // #5B1FA6
      ctx.fillStyle = terrainGrad;
      ctx.fill();

      // Radial blooms inside terrain (matching Intelligence Layer)
      ctx.save();
      ctx.clip();

      // Purple bloom at left (like radial-gradient at 18% 38%)
      const b1X = w * (0.18 + Math.sin(t * 0.08) * 0.03);
      const b1Y = h * (0.5 + Math.cos(t * 0.06) * 0.03);
      const b1 = ctx.createRadialGradient(b1X, b1Y, 0, b1X, b1Y, w * 0.5);
      b1.addColorStop(0, `rgba(143, 83, 255, ${0.4 + Math.sin(t * 0.2) * 0.05})`);
      b1.addColorStop(0.6, "rgba(143, 83, 255, 0)");
      ctx.fillStyle = b1;
      ctx.fillRect(0, 0, w, h);

      // Coral bloom at right-top (like radial-gradient at 78% 22%)
      const b2X = w * (0.78 + Math.sin(t * 0.1) * 0.03);
      const b2Y = h * (0.4 + Math.cos(t * 0.09) * 0.02);
      const b2 = ctx.createRadialGradient(b2X, b2Y, 0, b2X, b2Y, w * 0.4);
      b2.addColorStop(0, `rgba(255, 192, 174, ${0.16 + Math.sin(t * 0.22) * 0.04})`);
      b2.addColorStop(0.6, "rgba(255, 192, 174, 0)");
      ctx.fillStyle = b2;
      ctx.fillRect(0, 0, w, h);

      // Coral-red bloom at bottom-right (like radial-gradient at 70% 75%)
      const b3X = w * (0.7 + Math.cos(t * 0.07) * 0.03);
      const b3Y = h * (0.75 + Math.sin(t * 0.12) * 0.02);
      const b3 = ctx.createRadialGradient(b3X, b3Y, 0, b3X, b3Y, w * 0.45);
      b3.addColorStop(0, `rgba(212, 97, 107, ${0.12 + Math.sin(t * 0.18) * 0.03})`);
      b3.addColorStop(0.65, "rgba(212, 97, 107, 0)");
      ctx.fillStyle = b3;
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
      const spacing = 3.5 * dpr;
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
          const alpha = ridgeFade * ridgeFade * 0.35 * pulse;
          if (alpha < 0.012) continue;

          // Colors shift from lavender near ridge to deep purple below
          const r = 40 + ridgeFade * 80;
          const g = 15 + ridgeFade * 50;
          const b = 80 + ridgeFade * 120;

          const radius = (0.6 + ridgeFade * 1.1) * dpr;
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
