import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

const modules = [
  { label: "AI CORTEX", x: 50, y: 22, delay: 2.0, color: "0,200,255" },
  { label: "SOVEREIGN DATA", x: 15, y: 42, delay: 2.6, color: "0,200,255" },
  { label: "AUDIT INTEGRITY", x: 85, y: 42, delay: 3.2, color: "255,170,68" },
  { label: "CLINIC OS", x: 22, y: 65, delay: 3.8, color: "123,97,255" },
  { label: "VIRTUAL CARE", x: 78, y: 65, delay: 4.4, color: "255,170,68" },
];

const MobileBrainWave = () => {
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

      // --- Terrain ridge ---
      const terrainTop = h * 0.38;
      const ridge = (x: number): number => {
        const nx = x / w;
        return terrainTop
          + Math.sin(nx * Math.PI * 2 + t * 0.15) * h * 0.025
          + Math.sin(nx * Math.PI * 3.5 + t * 0.1) * h * 0.015
          + Math.sin(nx * Math.PI * 6 + t * 0.2) * h * 0.006;
      };

      // Fill terrain
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= w; x += 2) ctx.lineTo(x, ridge(x));
      ctx.lineTo(w, h);
      ctx.closePath();

      const gradShift = Math.sin(t * 0.15) * 3;
      const terrainGrad = ctx.createLinearGradient(0, terrainTop - h * 0.1, w, h);
      terrainGrad.addColorStop(0, `hsla(${268 + gradShift}, 78%, 11%, 1)`);
      terrainGrad.addColorStop(0.35, `hsla(${268 + gradShift}, 78%, 13%, 1)`);
      terrainGrad.addColorStop(0.6, `hsla(${270 + gradShift}, 82%, 24%, 1)`);
      terrainGrad.addColorStop(1, `hsla(${264 + gradShift}, 68%, 38%, 1)`);
      ctx.fillStyle = terrainGrad;
      ctx.fill();

      // Peach & violet blooms
      ctx.save();
      ctx.clip();

      const b1X = w * (0.55 + Math.sin(t * 0.08) * 0.04);
      const b1Y = h * (0.55 + Math.cos(t * 0.06) * 0.03);
      const b1 = ctx.createRadialGradient(b1X, b1Y, 0, b1X, b1Y, w * 0.55);
      b1.addColorStop(0, `rgba(255, 200, 170, ${0.22 + Math.sin(t * 0.2) * 0.05})`);
      b1.addColorStop(0.35, `rgba(242, 193, 174, ${0.12 + Math.sin(t * 0.18) * 0.03})`);
      b1.addColorStop(0.7, "rgba(232, 150, 124, 0.04)");
      b1.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = b1;
      ctx.fillRect(0, 0, w, h);

      const b2X = w * (0.2 + Math.cos(t * 0.1) * 0.03);
      const b2Y = h * (0.65 + Math.sin(t * 0.09) * 0.02);
      const b2 = ctx.createRadialGradient(b2X, b2Y, 0, b2X, b2Y, w * 0.35);
      b2.addColorStop(0, `rgba(255, 220, 200, ${0.14 + Math.sin(t * 0.22) * 0.03})`);
      b2.addColorStop(0.5, "rgba(242, 193, 174, 0.06)");
      b2.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = b2;
      ctx.fillRect(0, 0, w, h);

      const b3X = w * (0.4 + Math.cos(t * 0.07) * 0.03);
      const b3Y = h * (0.8 + Math.sin(t * 0.12) * 0.02);
      const b3 = ctx.createRadialGradient(b3X, b3Y, 0, b3X, b3Y, w * 0.4);
      b3.addColorStop(0, `rgba(91, 31, 166, ${0.15 + Math.sin(t * 0.18) * 0.04})`);
      b3.addColorStop(0.6, "rgba(58, 11, 110, 0.06)");
      b3.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = b3;
      ctx.fillRect(0, 0, w, h);

      ctx.restore();

      // Ridge glow line
      ctx.beginPath();
      for (let x = 0; x <= w; x += 2) {
        const y = ridge(x);
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      const glowAlpha = 0.15 + Math.sin(t * 0.4) * 0.05;
      ctx.strokeStyle = `rgba(192, 132, 252, ${glowAlpha})`;
      ctx.lineWidth = 1.8 * dpr;
      ctx.stroke();

      // Dot-matrix particles
      const spacing = 3.5 * dpr;
      const cols = Math.ceil(w / spacing);
      const rows = Math.ceil((h - (terrainTop - h * 0.15)) / spacing);
      for (let gx = 0; gx < cols; gx++) {
        const px = gx * spacing;
        const ridgeY = ridge(px);
        for (let gy = 0; gy < rows; gy++) {
          const py = (terrainTop - h * 0.15) + gy * spacing;
          if (py < ridgeY) continue;
          const ridgeDist = (py - ridgeY) / (h * 0.25);
          const ridgeFade = Math.max(0, 1 - ridgeDist);
          const pulse = 0.65 + Math.sin(t * 0.6 + gx * 0.35 + gy * 0.25) * 0.2;
          const alpha = ridgeFade * ridgeFade * 0.35 * pulse;
          if (alpha < 0.012) continue;
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

      // Rising signal particles
      for (let i = 0; i < 24; i++) {
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
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Canvas terrain background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* SVG Brain + Waveform overlay — positioned inside terrain area */}
      <div className="absolute left-0 right-0" style={{ top: "32%", height: "55%" }}>
        <style>{`
          @keyframes waveFlow {
            0% { stroke-dashoffset: 800; }
            100% { stroke-dashoffset: 0; }
          }
          @keyframes waveFlowReverse {
            0% { stroke-dashoffset: -800; }
            100% { stroke-dashoffset: 0; }
          }
          @keyframes brainPulse {
            0%, 100% { opacity: 0.75; filter: drop-shadow(0 0 6px rgba(0,200,255,0.25)); }
            50% { opacity: 1; filter: drop-shadow(0 0 18px rgba(0,200,255,0.55)); }
          }
          @keyframes brainPulseWarm {
            0%, 100% { opacity: 0.75; filter: drop-shadow(0 0 6px rgba(255,180,80,0.25)); }
            50% { opacity: 1; filter: drop-shadow(0 0 18px rgba(255,180,80,0.55)); }
          }
          @keyframes sparkle {
            0%, 100% { opacity: 0; transform: scale(0.4); }
            50% { opacity: 1; transform: scale(1.1); }
          }
          @keyframes nodeGlow {
            0%, 100% { r: 1.5; opacity: 0.3; }
            50% { r: 3.5; opacity: 1; }
          }
          .wave-line { stroke-dasharray: 12 6; animation: waveFlow 8s linear infinite; }
          .wave-line-reverse { stroke-dasharray: 10 8; animation: waveFlowReverse 10s linear infinite; }
          .brain-left { animation: brainPulse 3.5s ease-in-out infinite; }
          .brain-right { animation: brainPulseWarm 3.5s ease-in-out 0.5s infinite; }
        `}</style>

        <svg
          viewBox="0 0 400 240"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="brainLeft" cx="40%" cy="45%" r="50%">
              <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#0088aa" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#004466" stopOpacity="0.3" />
            </radialGradient>
            <radialGradient id="brainRight" cx="60%" cy="45%" r="50%">
              <stop offset="0%" stopColor="#ffcc44" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#dd8833" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#884400" stopOpacity="0.3" />
            </radialGradient>
            <linearGradient id="waveCool" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00ccff" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#7b61ff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ffaa44" stopOpacity="0.25" />
            </linearGradient>
            <linearGradient id="waveWarm" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7b61ff" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#dd8833" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ffcc66" stopOpacity="0.7" />
            </linearGradient>
            <filter id="svgGlow">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="svgGlowStrong">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* === WAVEFORM LINES === */}
          <path
            d="M -20 110 Q 40 85, 80 105 Q 120 125, 160 100 Q 180 90, 200 97 Q 220 104, 240 92 Q 280 72, 320 105 Q 360 130, 420 100"
            fill="none" stroke="url(#waveCool)" strokeWidth="1.6"
            className="wave-line" filter="url(#svgGlow)"
          />
          <path
            d="M -30 120 Q 50 148, 90 115 Q 130 88, 170 115 Q 200 130, 230 108 Q 260 88, 300 118 Q 340 142, 430 110"
            fill="none" stroke="url(#waveWarm)" strokeWidth="1.1"
            className="wave-line-reverse" filter="url(#svgGlow)" opacity="0.55"
          />
          <path
            d="M -10 105 Q 60 92, 100 110 Q 140 126, 180 102 Q 220 80, 260 108 Q 300 130, 350 98 Q 390 72, 420 105"
            fill="none" stroke="url(#waveCool)" strokeWidth="0.7"
            className="wave-line" opacity="0.25" style={{ animationDuration: "12s" }}
          />

          {/* === BRAIN === */}
          <g transform="translate(200, 100)" filter="url(#svgGlowStrong)">
            {/* Left hemisphere */}
            <g className="brain-left">
              <path
                d="M -2 -28 C -8 -36, -26 -38, -30 -26 C -34 -16, -36 -4, -33 8 C -31 17, -26 28, -17 33 C -10 37, -4 34, -2 28 Z"
                fill="url(#brainLeft)" stroke="rgba(0,200,255,0.3)" strokeWidth="0.5"
              />
              <path d="M -5 -20 Q -17 -16, -24 -8" fill="none" stroke="rgba(0,220,255,0.4)" strokeWidth="0.6" />
              <path d="M -4 -8 Q -18 -3, -28 3" fill="none" stroke="rgba(0,220,255,0.35)" strokeWidth="0.5" />
              <path d="M -3 5 Q -15 10, -26 14" fill="none" stroke="rgba(0,220,255,0.3)" strokeWidth="0.5" />
              <path d="M -4 16 Q -13 20, -18 26" fill="none" stroke="rgba(0,220,255,0.25)" strokeWidth="0.4" />
            </g>
            {/* Right hemisphere */}
            <g className="brain-right">
              <path
                d="M 2 -28 C 8 -36, 26 -38, 30 -26 C 34 -16, 36 -4, 33 8 C 31 17, 26 28, 17 33 C 10 37, 4 34, 2 28 Z"
                fill="url(#brainRight)" stroke="rgba(255,180,80,0.3)" strokeWidth="0.5"
              />
              <path d="M 5 -20 Q 17 -16, 24 -8" fill="none" stroke="rgba(255,200,100,0.4)" strokeWidth="0.6" />
              <path d="M 4 -8 Q 18 -3, 28 3" fill="none" stroke="rgba(255,200,100,0.35)" strokeWidth="0.5" />
              <path d="M 3 5 Q 15 10, 26 14" fill="none" stroke="rgba(255,200,100,0.3)" strokeWidth="0.5" />
              <path d="M 4 16 Q 13 20, 18 26" fill="none" stroke="rgba(255,200,100,0.25)" strokeWidth="0.4" />
            </g>
            {/* Central fissure */}
            <line x1="0" y1="-30" x2="0" y2="32" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
          </g>

          {/* === WAVE NODES === */}
          {[
            { cx: 70, cy: 108, d: 0 }, { cx: 130, cy: 108, d: 0.4 },
            { cx: 270, cy: 98, d: 0.8 }, { cx: 330, cy: 108, d: 1.2 },
            { cx: 45, cy: 115, d: 1.6 }, { cx: 355, cy: 98, d: 2.0 },
          ].map((n, i) => (
            <circle key={`n-${i}`} cx={n.cx} cy={n.cy} r="2"
              fill={n.cx < 200 ? "#00ccff" : "#ffaa44"} filter="url(#svgGlow)" opacity="0.5"
              style={{ animation: `nodeGlow 2.5s ease-in-out ${n.d}s infinite` }}
            />
          ))}

          {/* === SPARKLES === */}
          {[
            { x: 40, y: 90, s: 1.1, d: 0.3 }, { x: 90, y: 130, s: 0.7, d: 0.9 },
            { x: 145, y: 80, s: 0.9, d: 1.5 }, { x: 245, y: 78, s: 0.8, d: 2.1 },
            { x: 300, y: 128, s: 1.0, d: 2.7 }, { x: 350, y: 85, s: 0.7, d: 3.3 },
            { x: 65, y: 140, s: 0.5, d: 1.0 }, { x: 320, y: 135, s: 0.7, d: 3.8 },
            { x: 175, y: 75, s: 0.4, d: 0.6 }, { x: 365, y: 115, s: 0.8, d: 4.2 },
            { x: 110, y: 70, s: 0.6, d: 1.8 }, { x: 280, y: 70, s: 0.5, d: 2.4 },
          ].map((p, i) => (
            <g key={`s-${i}`} transform={`translate(${p.x}, ${p.y})`}
              style={{ animation: `sparkle ${2 + p.s}s ease-in-out ${p.d}s infinite` }}
            >
              <line x1="0" y1={-2.5 * p.s} x2="0" y2={2.5 * p.s} stroke="rgba(255,255,255,0.75)" strokeWidth="0.4" />
              <line x1={-2.5 * p.s} y1="0" x2={2.5 * p.s} y2="0" stroke="rgba(255,255,255,0.75)" strokeWidth="0.4" />
            </g>
          ))}
        </svg>

        {/* === MODULE POP-UPS === */}
        {modules.map((mod, i) => (
          <motion.div
            key={mod.label}
            className="absolute pointer-events-none"
            style={{ left: `${mod.x}%`, top: `${mod.y}%`, transform: "translate(-50%, -50%)" }}
            initial={{ opacity: 0, scale: 0.4, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: mod.delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Energy line */}
            <div className="absolute left-1/2 -translate-x-1/2"
              style={{
                bottom: -14, width: 1, height: 14,
                background: `linear-gradient(to bottom, rgba(${mod.color},0.5), transparent)`,
              }}
            />
            {/* Capsule */}
            <div style={{
              padding: "3px 9px", borderRadius: 18,
              background: "rgba(255,255,255,0.07)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.14)",
              boxShadow: `0 0 10px rgba(${mod.color},0.12), inset 0 1px 0 rgba(255,255,255,0.08)`,
              whiteSpace: "nowrap" as const,
            }}>
              <span style={{
                fontSize: 7.5, fontWeight: 600, letterSpacing: "0.12em",
                color: "rgba(255,255,255,0.85)", fontFamily: "monospace",
              }}>
                {mod.label}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MobileBrainWave;
