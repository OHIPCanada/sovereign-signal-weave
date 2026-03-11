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

    // Sparkle particles
    const sparkles: { x: number; y: number; phase: number; speed: number; size: number }[] = [];
    for (let i = 0; i < 35; i++) {
      sparkles.push({
        x: Math.random(),
        y: 0.3 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 1.5,
        size: 1 + Math.random() * 2,
      });
    }

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
      const peakY = h * 0.52; // mountain peak position

      // --- Mountain / Peak shape (dark filled) ---
      const mountainGrad = ctx.createLinearGradient(0, peakY - h * 0.15, 0, h);
      mountainGrad.addColorStop(0, "rgba(30, 10, 60, 0.95)");
      mountainGrad.addColorStop(0.3, "rgba(20, 5, 45, 0.9)");
      mountainGrad.addColorStop(0.7, "rgba(12, 3, 30, 0.85)");
      mountainGrad.addColorStop(1, "rgba(8, 2, 20, 0.7)");

      ctx.beginPath();
      ctx.moveTo(0, h);
      // Left slope
      ctx.quadraticCurveTo(cx * 0.3, h * 0.75, cx * 0.5, peakY + h * 0.08);
      ctx.quadraticCurveTo(cx * 0.75, peakY - h * 0.02, cx, peakY);
      // Right slope
      ctx.quadraticCurveTo(cx * 1.25, peakY - h * 0.02, cx * 1.5, peakY + h * 0.08);
      ctx.quadraticCurveTo(cx * 1.7, h * 0.75, w, h);
      ctx.closePath();
      ctx.fillStyle = mountainGrad;
      ctx.fill();

      // --- Glow at peak ---
      const glowRad = w * 0.25;
      const peakGlow = ctx.createRadialGradient(cx, peakY, 0, cx, peakY, glowRad);
      peakGlow.addColorStop(0, "rgba(0, 200, 220, 0.15)");
      peakGlow.addColorStop(0.4, "rgba(100, 60, 180, 0.08)");
      peakGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = peakGlow;
      ctx.fillRect(cx - glowRad, peakY - glowRad, glowRad * 2, glowRad * 2);

      // --- Wave lines emanating from peak ---
      const waveColors = [
        { r: 0, g: 180, b: 220, a: 0.5 },   // cyan
        { r: 120, g: 80, b: 220, a: 0.35 },  // purple
        { r: 200, g: 160, b: 60, a: 0.3 },   // gold
        { r: 0, g: 140, b: 200, a: 0.25 },   // blue
        { r: 160, g: 100, b: 240, a: 0.2 },  // lavender
      ];

      for (let wi = 0; wi < waveColors.length; wi++) {
        const wc = waveColors[wi];
        const freq = 3 + wi * 1.5;
        const amp = (12 + wi * 6) * dpr;
        const speed = 0.6 + wi * 0.15;
        const yOff = (wi - 2) * 8 * dpr;

        ctx.beginPath();
        ctx.strokeStyle = `rgba(${wc.r}, ${wc.g}, ${wc.b}, ${wc.a})`;
        ctx.lineWidth = (1.2 + wi * 0.3) * dpr;

        // Left wave (from peak going left)
        for (let x = cx; x >= 0; x -= 2) {
          const dist = (cx - x) / cx;
          const envelope = Math.pow(dist, 0.5) * (1 - dist * 0.3);
          const wave = Math.sin(dist * freq * Math.PI + t * speed) * amp * envelope;
          const y = peakY + yOff + wave;
          if (x === cx) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Right wave (from peak going right)
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${wc.r}, ${wc.g}, ${wc.b}, ${wc.a})`;
        for (let x = cx; x <= w; x += 2) {
          const dist = (x - cx) / cx;
          const envelope = Math.pow(dist, 0.5) * (1 - dist * 0.3);
          const wave = Math.sin(dist * freq * Math.PI + t * speed) * amp * envelope;
          const y = peakY + yOff + wave;
          if (x === cx) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // --- Mountain edge glow line ---
      ctx.beginPath();
      ctx.moveTo(0, h);
      ctx.quadraticCurveTo(cx * 0.3, h * 0.75, cx * 0.5, peakY + h * 0.08);
      ctx.quadraticCurveTo(cx * 0.75, peakY - h * 0.02, cx, peakY);
      ctx.quadraticCurveTo(cx * 1.25, peakY - h * 0.02, cx * 1.5, peakY + h * 0.08);
      ctx.quadraticCurveTo(cx * 1.7, h * 0.75, w, h);
      ctx.strokeStyle = "rgba(100, 60, 200, 0.3)";
      ctx.lineWidth = 1.5 * dpr;
      ctx.stroke();

      // --- Sparkle stars ---
      for (const s of sparkles) {
        const alpha = 0.3 + Math.sin(t * s.speed + s.phase) * 0.3;
        if (alpha < 0.08) continue;
        const sx = s.x * w;
        const sy = s.y * h;
        const sr = s.size * dpr;

        // 4-point star
        ctx.save();
        ctx.translate(sx, sy);
        ctx.fillStyle = `rgba(255, 240, 180, ${alpha})`;
        ctx.beginPath();
        for (let p = 0; p < 4; p++) {
          const angle = (p / 4) * Math.PI * 2 - Math.PI / 2;
          const outerR = sr * 1.5;
          const innerR = sr * 0.3;
          ctx.lineTo(Math.cos(angle) * outerR, Math.sin(angle) * outerR);
          const midAngle = angle + Math.PI / 4;
          ctx.lineTo(Math.cos(midAngle) * innerR, Math.sin(midAngle) * innerR);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
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
      style={{ opacity: 0.95 }}
    />
  );
};

export default MobileParticleWave;
