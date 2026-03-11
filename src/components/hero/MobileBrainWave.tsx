import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

const modules = [
  { label: "AI CORTEX", x: 50, y: 8, delay: 2.0, color: "0,200,255" },
  { label: "SOVEREIGN DATA", x: 8, y: 38, delay: 2.6, color: "0,200,255" },
  { label: "AUDIT INTEGRITY", x: 92, y: 38, delay: 3.2, color: "255,170,68" },
  { label: "CLINIC OS", x: 12, y: 68, delay: 3.8, color: "123,97,255" },
  { label: "VIRTUAL CARE", x: 88, y: 68, delay: 4.4, color: "255,170,68" },
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

      // Blooms
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
      const b3X = w * (0.4 + Math.cos(t * 0.07) * 0.03);
      const b3Y = h * (0.8 + Math.sin(t * 0.12) * 0.02);
      const b3 = ctx.createRadialGradient(b3X, b3Y, 0, b3X, b3Y, w * 0.4);
      b3.addColorStop(0, `rgba(91, 31, 166, ${0.15 + Math.sin(t * 0.18) * 0.04})`);
      b3.addColorStop(0.6, "rgba(58, 11, 110, 0.06)");
      b3.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = b3;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      // Ridge glow
      ctx.beginPath();
      for (let x = 0; x <= w; x += 2) {
        const y = ridge(x);
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      const glowAlpha = 0.15 + Math.sin(t * 0.4) * 0.05;
      ctx.strokeStyle = `rgba(192, 132, 252, ${glowAlpha})`;
      ctx.lineWidth = 1.8 * dpr;
      ctx.stroke();

      // Dot-matrix
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
          const rv = 40 + ridgeFade * 80;
          const gv = 15 + ridgeFade * 50;
          const bv = 80 + ridgeFade * 120;
          const radius = (0.6 + ridgeFade * 1.1) * dpr;
          ctx.beginPath();
          ctx.arc(px, py, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${Math.round(rv)}, ${Math.round(gv)}, ${Math.round(bv)}, ${alpha})`;
          ctx.fill();
        }
      }

      // Rising signals
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
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* SVG Brain + Waveform — centered in terrain */}
      <div className="absolute left-0 right-0" style={{ top: "28%", height: "65%" }}>
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
            0%, 100% { opacity: 0.8; filter: drop-shadow(0 0 8px rgba(0,200,255,0.3)); }
            50% { opacity: 1; filter: drop-shadow(0 0 24px rgba(0,200,255,0.6)); }
          }
          @keyframes brainPulseWarm {
            0%, 100% { opacity: 0.8; filter: drop-shadow(0 0 8px rgba(255,180,80,0.3)); }
            50% { opacity: 1; filter: drop-shadow(0 0 24px rgba(255,180,80,0.6)); }
          }
          @keyframes sparkle {
            0%, 100% { opacity: 0; transform: scale(0.3); }
            50% { opacity: 1; transform: scale(1.1); }
          }
          @keyframes nodeGlow {
            0%, 100% { r: 1.5; opacity: 0.3; }
            50% { r: 3.5; opacity: 1; }
          }
          @keyframes neuralPulse {
            0%, 100% { stroke-opacity: 0.1; }
            50% { stroke-opacity: 0.5; }
          }
          @keyframes neuralNodePulse {
            0%, 100% { opacity: 0.3; r: 1.2; }
            50% { opacity: 0.9; r: 2; }
          }
          .wave-line { stroke-dasharray: 12 6; animation: waveFlow 8s linear infinite; }
          .wave-line-reverse { stroke-dasharray: 10 8; animation: waveFlowReverse 10s linear infinite; }
          .brain-left { animation: brainPulse 3.5s ease-in-out infinite; }
          .brain-right { animation: brainPulseWarm 3.5s ease-in-out 0.5s infinite; }
        `}</style>

        <svg
          viewBox="0 0 400 280"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="brainLeftGrad" cx="35%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#00aacc" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#006688" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#003344" stopOpacity="0.2" />
            </radialGradient>
            <radialGradient id="brainRightGrad" cx="65%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#ffdd55" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#ee9922" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#aa6611" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#553300" stopOpacity="0.2" />
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
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="brainGlow">
              <feGaussianBlur stdDeviation="10" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* === WAVEFORM LINES === */}
          <path
            d="M -20 120 Q 40 90, 80 115 Q 120 138, 155 108 Q 175 95, 200 105 Q 225 115, 245 100 Q 280 78, 320 115 Q 360 140, 420 108"
            fill="none" stroke="url(#waveCool)" strokeWidth="1.6"
            className="wave-line" filter="url(#svgGlow)"
          />
          <path
            d="M -30 132 Q 50 158, 90 125 Q 130 95, 170 125 Q 200 142, 230 118 Q 260 95, 300 128 Q 340 155, 430 120"
            fill="none" stroke="url(#waveWarm)" strokeWidth="1.1"
            className="wave-line-reverse" filter="url(#svgGlow)" opacity="0.5"
          />
          <path
            d="M -10 115 Q 60 100, 100 118 Q 140 135, 180 110 Q 220 88, 260 118 Q 300 140, 350 105 Q 390 80, 420 115"
            fill="none" stroke="url(#waveCool)" strokeWidth="0.7"
            className="wave-line" opacity="0.2" style={{ animationDuration: "12s" }}
          />

          {/* === LARGE BRAIN — centered, detailed with neural network === */}
          <g transform="translate(200, 115)" filter="url(#brainGlow)">
            {/* LEFT HEMISPHERE — cool teal/cyan, detailed brain shape */}
            <g className="brain-left">
              {/* Main shape — realistic brain contour */}
              <path
                d="M -3 -55 C -10 -62, -22 -68, -38 -65 C -52 -62, -62 -52, -66 -38 C -70 -24, -72 -8, -70 8 C -68 22, -64 36, -56 46 C -48 55, -36 62, -24 64 C -14 66, -6 60, -3 52 Z"
                fill="url(#brainLeftGrad)" stroke="rgba(0,220,255,0.25)" strokeWidth="0.6"
              />
              {/* Gyri/sulci folds — dense neural pattern */}
              <path d="M -8 -48 Q -22 -50, -38 -45 Q -50 -40, -56 -30" fill="none" stroke="rgba(0,230,255,0.35)" strokeWidth="0.7" />
              <path d="M -6 -38 Q -20 -36, -42 -28 Q -55 -22, -62 -12" fill="none" stroke="rgba(0,220,255,0.3)" strokeWidth="0.6" />
              <path d="M -5 -26 Q -18 -22, -35 -14 Q -52 -6, -66 0" fill="none" stroke="rgba(0,210,255,0.28)" strokeWidth="0.6" />
              <path d="M -5 -14 Q -22 -8, -40 0 Q -56 8, -68 14" fill="none" stroke="rgba(0,200,255,0.25)" strokeWidth="0.5" />
              <path d="M -4 0 Q -18 6, -36 14 Q -50 22, -62 28" fill="none" stroke="rgba(0,200,255,0.22)" strokeWidth="0.5" />
              <path d="M -4 14 Q -16 20, -32 28 Q -44 36, -54 42" fill="none" stroke="rgba(0,190,255,0.2)" strokeWidth="0.5" />
              <path d="M -5 28 Q -14 34, -26 42 Q -36 48, -44 52" fill="none" stroke="rgba(0,180,255,0.18)" strokeWidth="0.4" />
              <path d="M -6 42 Q -12 48, -20 54" fill="none" stroke="rgba(0,170,255,0.15)" strokeWidth="0.4" />
              {/* Temporal lobe bump */}
              <path d="M -58 -10 Q -66 -2, -70 8 Q -68 18, -64 28" fill="none" stroke="rgba(0,220,255,0.2)" strokeWidth="0.5" />
              {/* Frontal lobe detail */}
              <path d="M -15 -58 Q -30 -60, -45 -55 Q -55 -48, -60 -38" fill="none" stroke="rgba(0,240,255,0.2)" strokeWidth="0.4" />
              
              {/* Neural network nodes — left */}
              {[
                [-20, -45], [-40, -35], [-55, -18], [-48, 5], [-35, 22],
                [-22, 38], [-42, -50], [-60, -5], [-50, 30], [-30, 50],
                [-15, -30], [-32, -8], [-45, 15], [-25, 52], [-12, 10],
                [-55, -35], [-38, 42], [-18, -15], [-50, -25], [-28, -42],
              ].map(([nx, ny], i) => (
                <circle key={`ln-${i}`} cx={nx} cy={ny} r="1.3"
                  fill="#00ddff" opacity="0.5"
                  style={{ animation: `neuralNodePulse ${2 + (i % 4) * 0.5}s ease-in-out ${i * 0.3}s infinite` }}
                />
              ))}
              {/* Neural connections — left */}
              {[
                "M -20 -45 L -40 -35", "M -40 -35 L -55 -18", "M -55 -18 L -48 5",
                "M -48 5 L -35 22", "M -35 22 L -22 38", "M -20 -45 L -15 -30",
                "M -15 -30 L -32 -8", "M -32 -8 L -45 15", "M -42 -50 L -40 -35",
                "M -60 -5 L -55 -18", "M -50 30 L -35 22", "M -30 50 L -22 38",
                "M -12 10 L -32 -8", "M -55 -35 L -40 -35", "M -38 42 L -35 22",
                "M -18 -15 L -32 -8", "M -50 -25 L -55 -18", "M -28 -42 L -20 -45",
                "M -48 5 L -12 10", "M -25 52 L -30 50",
              ].map((d, i) => (
                <path key={`lc-${i}`} d={d} fill="none" stroke="rgba(0,220,255,0.2)"
                  strokeWidth="0.4"
                  style={{ animation: `neuralPulse ${3 + (i % 3)}s ease-in-out ${i * 0.2}s infinite` }}
                />
              ))}
            </g>

            {/* RIGHT HEMISPHERE — warm orange/gold */}
            <g className="brain-right">
              <path
                d="M 3 -55 C 10 -62, 22 -68, 38 -65 C 52 -62, 62 -52, 66 -38 C 70 -24, 72 -8, 70 8 C 68 22, 64 36, 56 46 C 48 55, 36 62, 24 64 C 14 66, 6 60, 3 52 Z"
                fill="url(#brainRightGrad)" stroke="rgba(255,200,80,0.25)" strokeWidth="0.6"
              />
              {/* Gyri/sulci folds */}
              <path d="M 8 -48 Q 22 -50, 38 -45 Q 50 -40, 56 -30" fill="none" stroke="rgba(255,220,100,0.35)" strokeWidth="0.7" />
              <path d="M 6 -38 Q 20 -36, 42 -28 Q 55 -22, 62 -12" fill="none" stroke="rgba(255,210,90,0.3)" strokeWidth="0.6" />
              <path d="M 5 -26 Q 18 -22, 35 -14 Q 52 -6, 66 0" fill="none" stroke="rgba(255,200,80,0.28)" strokeWidth="0.6" />
              <path d="M 5 -14 Q 22 -8, 40 0 Q 56 8, 68 14" fill="none" stroke="rgba(255,190,70,0.25)" strokeWidth="0.5" />
              <path d="M 4 0 Q 18 6, 36 14 Q 50 22, 62 28" fill="none" stroke="rgba(255,180,60,0.22)" strokeWidth="0.5" />
              <path d="M 4 14 Q 16 20, 32 28 Q 44 36, 54 42" fill="none" stroke="rgba(255,170,50,0.2)" strokeWidth="0.5" />
              <path d="M 5 28 Q 14 34, 26 42 Q 36 48, 44 52" fill="none" stroke="rgba(255,160,40,0.18)" strokeWidth="0.4" />
              <path d="M 6 42 Q 12 48, 20 54" fill="none" stroke="rgba(255,150,30,0.15)" strokeWidth="0.4" />
              <path d="M 58 -10 Q 66 -2, 70 8 Q 68 18, 64 28" fill="none" stroke="rgba(255,200,80,0.2)" strokeWidth="0.5" />
              <path d="M 15 -58 Q 30 -60, 45 -55 Q 55 -48, 60 -38" fill="none" stroke="rgba(255,230,120,0.2)" strokeWidth="0.4" />

              {/* Neural network nodes — right */}
              {[
                [20, -45], [40, -35], [55, -18], [48, 5], [35, 22],
                [22, 38], [42, -50], [60, -5], [50, 30], [30, 50],
                [15, -30], [32, -8], [45, 15], [25, 52], [12, 10],
                [55, -35], [38, 42], [18, -15], [50, -25], [28, -42],
              ].map(([nx, ny], i) => (
                <circle key={`rn-${i}`} cx={nx} cy={ny} r="1.3"
                  fill="#ffcc44" opacity="0.5"
                  style={{ animation: `neuralNodePulse ${2 + (i % 4) * 0.5}s ease-in-out ${i * 0.25 + 0.5}s infinite` }}
                />
              ))}
              {/* Neural connections — right */}
              {[
                "M 20 -45 L 40 -35", "M 40 -35 L 55 -18", "M 55 -18 L 48 5",
                "M 48 5 L 35 22", "M 35 22 L 22 38", "M 20 -45 L 15 -30",
                "M 15 -30 L 32 -8", "M 32 -8 L 45 15", "M 42 -50 L 40 -35",
                "M 60 -5 L 55 -18", "M 50 30 L 35 22", "M 30 50 L 22 38",
                "M 12 10 L 32 -8", "M 55 -35 L 40 -35", "M 38 42 L 35 22",
                "M 18 -15 L 32 -8", "M 50 -25 L 55 -18", "M 28 -42 L 20 -45",
                "M 48 5 L 12 10", "M 25 52 L 30 50",
              ].map((d, i) => (
                <path key={`rc-${i}`} d={d} fill="none" stroke="rgba(255,200,80,0.2)"
                  strokeWidth="0.4"
                  style={{ animation: `neuralPulse ${3 + (i % 3)}s ease-in-out ${i * 0.2 + 0.3}s infinite` }}
                />
              ))}
            </g>

            {/* Central fissure */}
            <line x1="0" y1="-58" x2="0" y2="60" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            {/* Brain stem hint */}
            <path d="M -6 58 Q 0 72, 6 58" fill="none" stroke="rgba(180,160,220,0.2)" strokeWidth="0.8" />
          </g>

          {/* === WAVE NODES === */}
          {[
            { cx: 60, cy: 118, d: 0 }, { cx: 120, cy: 115, d: 0.4 },
            { cx: 280, cy: 108, d: 0.8 }, { cx: 340, cy: 118, d: 1.2 },
            { cx: 40, cy: 128, d: 1.6 }, { cx: 360, cy: 108, d: 2.0 },
          ].map((n, i) => (
            <circle key={`n-${i}`} cx={n.cx} cy={n.cy} r="2"
              fill={n.cx < 200 ? "#00ccff" : "#ffaa44"} filter="url(#svgGlow)" opacity="0.5"
              style={{ animation: `nodeGlow 2.5s ease-in-out ${n.d}s infinite` }}
            />
          ))}

          {/* === SPARKLES === */}
          {[
            { x: 35, y: 95, s: 1.0, d: 0.3 }, { x: 85, y: 145, s: 0.7, d: 0.9 },
            { x: 140, y: 78, s: 0.9, d: 1.5 }, { x: 255, y: 75, s: 0.8, d: 2.1 },
            { x: 310, y: 140, s: 1.0, d: 2.7 }, { x: 360, y: 88, s: 0.7, d: 3.3 },
            { x: 55, y: 155, s: 0.5, d: 1.0 }, { x: 330, y: 150, s: 0.7, d: 3.8 },
            { x: 175, y: 68, s: 0.4, d: 0.6 }, { x: 370, y: 125, s: 0.8, d: 4.2 },
            { x: 100, y: 65, s: 0.6, d: 1.8 }, { x: 290, y: 62, s: 0.5, d: 2.4 },
          ].map((p, i) => (
            <g key={`s-${i}`} transform={`translate(${p.x}, ${p.y})`}
              style={{ animation: `sparkle ${2 + p.s}s ease-in-out ${p.d}s infinite` }}
            >
              <line x1="0" y1={-2.5 * p.s} x2="0" y2={2.5 * p.s} stroke="rgba(255,255,255,0.7)" strokeWidth="0.4" />
              <line x1={-2.5 * p.s} y1="0" x2={2.5 * p.s} y2="0" stroke="rgba(255,255,255,0.7)" strokeWidth="0.4" />
            </g>
          ))}
        </svg>

        {/* === MODULE POP-UPS === */}
        {modules.map((mod) => (
          <motion.div
            key={mod.label}
            className="absolute pointer-events-none"
            style={{ left: `${mod.x}%`, top: `${mod.y}%`, transform: "translate(-50%, -50%)" }}
            initial={{ opacity: 0, scale: 0.4, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: mod.delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="absolute left-1/2 -translate-x-1/2"
              style={{
                bottom: -14, width: 1, height: 14,
                background: `linear-gradient(to bottom, rgba(${mod.color},0.5), transparent)`,
              }}
            />
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
