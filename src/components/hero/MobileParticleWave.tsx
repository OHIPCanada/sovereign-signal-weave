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

      // Wave crest sits at 65% of canvas height — safely below INTELLIGENCE text
      const waveBase = h * 0.65;

      // Gentle wave line function
      const waveLine = (x: number, offset: number, amp: number, freq: number, spd: number): number => {
        const nx = x / w;
        return waveBase + offset
          + Math.sin(nx * freq + t * spd) * amp
          + Math.sin(nx * freq * 1.6 + t * spd * 0.7 + 2) * amp * 0.4;
      };

      // --- Fill below wave with hero-matching gradient (#16002A → #0B0613) ---
      // Draw 3 layered waves for depth
      const waveLayers = [
        { offset: -8 * dpr, amp: 10 * dpr, freq: 3.5, spd: 0.18, alpha: 0.3, color: "40, 20, 80" },
        { offset: 0, amp: 14 * dpr, freq: 4, spd: 0.22, alpha: 1, color: "main" },
        { offset: 6 * dpr, amp: 8 * dpr, freq: 5, spd: 0.15, alpha: 0.2, color: "60, 30, 100" },
      ];

      // Background subtle waves (behind main)
      for (const layer of waveLayers) {
        if (layer.color === "main") continue;
        ctx.beginPath();
        ctx.moveTo(0, h);
        for (let x = 0; x <= w; x += 2) {
          ctx.lineTo(x, waveLine(x, layer.offset, layer.amp, layer.freq, layer.spd));
        }
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fillStyle = `rgba(${layer.color}, ${layer.alpha})`;
        ctx.fill();
      }

      // Main wave fill — gradient matching hero-bg
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= w; x += 2) {
        ctx.lineTo(x, waveLine(x, 0, 14 * dpr, 4, 0.22));
      }
      ctx.lineTo(w, h);
      ctx.closePath();

      const fillGrad = ctx.createLinearGradient(0, waveBase - 20 * dpr, 0, h);
      // Match hero-bg: #16002A → #0B0613
      fillGrad.addColorStop(0, "rgba(22, 0, 42, 0.95)");
      fillGrad.addColorStop(0.4, "rgba(16, 4, 34, 0.97)");
      fillGrad.addColorStop(1, "rgba(11, 6, 19, 0.98)");
      ctx.fillStyle = fillGrad;
      ctx.fill();

      // Soft edge glow on wave crest
      ctx.beginPath();
      for (let x = 0; x <= w; x += 2) {
        const y = waveLine(x, 0, 14 * dpr, 4, 0.22);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(100, 60, 200, 0.08)";
      ctx.lineWidth = 2 * dpr;
      ctx.stroke();

      // --- Sparse signal particles rising from crest ---
      const signals = 14;
      for (let i = 0; i < signals; i++) {
        const seed = i * 97.31;
        const baseX = ((seed * 3.7) % 1) * w;
        const drift = Math.sin(t * 0.25 + i * 1.7) * 10 * dpr;
        const sx = baseX + drift;
        const lifeT = ((t * 0.12 + seed * 0.01) % 1);
        const baseY = waveLine(baseX, 0, 14 * dpr, 4, 0.22);
        const sy = baseY - lifeT * h * 0.1;
        const sa = (1 - lifeT) * 0.12 * (0.5 + Math.sin(t + i) * 0.5);

        if (sa < 0.01) continue;
        ctx.beginPath();
        ctx.arc(sx, sy, 0.8 * dpr, 0, Math.PI * 2);
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
    />
  );
};

export default MobileParticleWave;
