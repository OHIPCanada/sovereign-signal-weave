import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

const modules = [
  { label: "AI CORTEX", angle: -90, radius: 0.42, delay: 2.0, color: "0,200,255" },
  { label: "SOVEREIGN DATA", angle: -162, radius: 0.44, delay: 2.6, color: "123,97,255" },
  { label: "AUDIT INTEGRITY", angle: -18, radius: 0.44, delay: 3.2, color: "255,170,68" },
  { label: "CLINIC OS", angle: 210, radius: 0.40, delay: 3.8, color: "123,97,255" },
  { label: "VIRTUAL CARE", angle: 330, radius: 0.40, delay: 4.4, color: "255,170,68" },
];

// Neural network nodes forming a brain silhouette shape
// Organized as left (cool) and right (warm) clusters
const leftNodes: [number, number][] = [
  // Frontal
  [-12, -52], [-22, -48], [-30, -40], [-18, -38],
  [-36, -30], [-26, -28], [-14, -26], [-42, -18],
  [-32, -14], [-20, -10], [-8, -16],
  // Temporal
  [-48, -6], [-44, 6], [-38, 16], [-28, 4],
  [-16, 2], [-6, -4],
  // Parietal
  [-34, 26], [-22, 20], [-10, 14],
  [-26, 36], [-14, 32], [-6, 24],
  // Occipital
  [-18, 44], [-8, 40], [-24, 50],
];

const rightNodes: [number, number][] = [
  // Frontal
  [12, -52], [22, -48], [30, -40], [18, -38],
  [36, -30], [26, -28], [14, -26], [42, -18],
  [32, -14], [20, -10], [8, -16],
  // Temporal
  [48, -6], [44, 6], [38, 16], [28, 4],
  [16, 2], [6, -4],
  // Parietal
  [34, 26], [22, 20], [10, 14],
  [26, 36], [14, 32], [6, 24],
  // Occipital
  [18, 44], [8, 40], [24, 50],
];

// Generate connections between nearby nodes
function generateConnections(nodes: [number, number][], maxDist = 22): [number, number][] {
  const conns: [number, number][] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i][0] - nodes[j][0];
      const dy = nodes[i][1] - nodes[j][1];
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDist) conns.push([i, j]);
    }
  }
  return conns;
}

// Cross-hemisphere connections (bridge)
const bridgeConnections: [number, number, number, number][] = [
  [-6, -4, 6, -4],
  [-8, -16, 8, -16],
  [-6, 24, 6, 24],
  [-8, 40, 8, 40],
  [-10, 14, 10, 14],
];

const leftConns = generateConnections(leftNodes);
const rightConns = generateConnections(rightNodes);

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

      {/* Neural Network Brain + Waveform — centered */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ top: "8%" }}>
        <style>{`
          @keyframes waveFlow {
            0% { stroke-dashoffset: 800; }
            100% { stroke-dashoffset: 0; }
          }
          @keyframes waveFlowReverse {
            0% { stroke-dashoffset: -800; }
            100% { stroke-dashoffset: 0; }
          }
          @keyframes nodePulse {
            0%, 100% { opacity: 0.25; }
            50% { opacity: 0.85; }
          }
          @keyframes connPulse {
            0%, 100% { stroke-opacity: 0.08; }
            50% { stroke-opacity: 0.35; }
          }
          @keyframes travelPulse {
            0% { stroke-dashoffset: 40; opacity: 0; }
            20% { opacity: 0.7; }
            80% { opacity: 0.7; }
            100% { stroke-dashoffset: 0; opacity: 0; }
          }
          @keyframes sparkle {
            0%, 100% { opacity: 0; transform: scale(0.3); }
            50% { opacity: 0.8; transform: scale(1); }
          }
          .wave-line { stroke-dasharray: 12 6; animation: waveFlow 8s linear infinite; }
          .wave-line-r { stroke-dasharray: 10 8; animation: waveFlowReverse 10s linear infinite; }
        `}</style>

        <svg
          viewBox="-120 -80 240 160"
          className="w-[92vw] max-w-[400px] h-auto"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="glowLeft" cx="30%" cy="40%" r="70%">
              <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="glowRight" cx="70%" cy="40%" r="70%">
              <stop offset="0%" stopColor="#ffaa44" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#ffaa44" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="waveCool" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00ccff" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#7b61ff" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ffaa44" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="waveWarm" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7b61ff" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#dd8833" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ffcc66" stopOpacity="0.6" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="softGlow">
              <feGaussianBlur stdDeviation="6" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Ambient glow behind brain */}
          <ellipse cx="-25" cy="0" rx="55" ry="60" fill="url(#glowLeft)" />
          <ellipse cx="25" cy="0" rx="55" ry="60" fill="url(#glowRight)" />

          {/* === WAVEFORM LINES through brain === */}
          <path
            d="M -120 0 Q -80 -20, -50 -5 Q -20 10, 0 -2 Q 20 -14, 50 2 Q 80 18, 120 -5"
            fill="none" stroke="url(#waveCool)" strokeWidth="1"
            className="wave-line" filter="url(#glow)"
          />
          <path
            d="M -120 8 Q -70 25, -40 5 Q -10 -12, 20 8 Q 50 25, 80 5 Q 100 -8, 120 10"
            fill="none" stroke="url(#waveWarm)" strokeWidth="0.7"
            className="wave-line-r" filter="url(#glow)" opacity="0.4"
          />

          {/* === LEFT HEMISPHERE — Neural Network (cool cyan/teal) === */}
          <g>
            {/* Connections */}
            {leftConns.map(([i, j], idx) => (
              <line
                key={`lc-${idx}`}
                x1={leftNodes[i][0]} y1={leftNodes[i][1]}
                x2={leftNodes[j][0]} y2={leftNodes[j][1]}
                stroke="#00ccff" strokeWidth="0.4"
                style={{
                  animation: `connPulse ${2.5 + (idx % 4) * 0.7}s ease-in-out ${idx * 0.15}s infinite`,
                }}
              />
            ))}
            {/* Traveling pulse on select connections */}
            {leftConns.filter((_, i) => i % 3 === 0).map(([i, j], idx) => {
              const x1 = leftNodes[i][0], y1 = leftNodes[i][1];
              const x2 = leftNodes[j][0], y2 = leftNodes[j][1];
              return (
                <line
                  key={`lt-${idx}`}
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="#00ffff" strokeWidth="0.8"
                  strokeDasharray="4 36"
                  style={{
                    animation: `travelPulse ${3 + idx * 0.5}s ease-in-out ${idx * 0.8}s infinite`,
                  }}
                />
              );
            })}
            {/* Nodes */}
            {leftNodes.map(([nx, ny], i) => (
              <circle
                key={`ln-${i}`} cx={nx} cy={ny}
                r={i % 5 === 0 ? 2.2 : 1.5}
                fill="#00ddff"
                filter={i % 5 === 0 ? "url(#glow)" : undefined}
                style={{
                  animation: `nodePulse ${2 + (i % 5) * 0.4}s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </g>

          {/* === RIGHT HEMISPHERE — Neural Network (warm orange/gold) === */}
          <g>
            {rightConns.map(([i, j], idx) => (
              <line
                key={`rc-${idx}`}
                x1={rightNodes[i][0]} y1={rightNodes[i][1]}
                x2={rightNodes[j][0]} y2={rightNodes[j][1]}
                stroke="#ffaa44" strokeWidth="0.4"
                style={{
                  animation: `connPulse ${2.5 + (idx % 4) * 0.7}s ease-in-out ${idx * 0.15 + 0.3}s infinite`,
                }}
              />
            ))}
            {rightConns.filter((_, i) => i % 3 === 0).map(([i, j], idx) => {
              const x1 = rightNodes[i][0], y1 = rightNodes[i][1];
              const x2 = rightNodes[j][0], y2 = rightNodes[j][1];
              return (
                <line
                  key={`rt-${idx}`}
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="#ffcc66" strokeWidth="0.8"
                  strokeDasharray="4 36"
                  style={{
                    animation: `travelPulse ${3 + idx * 0.5}s ease-in-out ${idx * 0.8 + 0.5}s infinite`,
                  }}
                />
              );
            })}
            {rightNodes.map(([nx, ny], i) => (
              <circle
                key={`rn-${i}`} cx={nx} cy={ny}
                r={i % 5 === 0 ? 2.2 : 1.5}
                fill="#ffcc44"
                filter={i % 5 === 0 ? "url(#glow)" : undefined}
                style={{
                  animation: `nodePulse ${2 + (i % 5) * 0.4}s ease-in-out ${i * 0.2 + 0.4}s infinite`,
                }}
              />
            ))}
          </g>

          {/* === BRIDGE CONNECTIONS (cross-hemisphere) === */}
          {bridgeConnections.map(([x1, y1, x2, y2], i) => (
            <line
              key={`br-${i}`}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#c084fc" strokeWidth="0.5" opacity="0.3"
              style={{
                animation: `connPulse ${3}s ease-in-out ${i * 0.6}s infinite`,
              }}
            />
          ))}

          {/* Central axis */}
          <line x1="0" y1="-56" x2="0" y2="54" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />

          {/* Sparkles */}
          {[
            [-60, -30, 0.8, 0.3], [-80, 10, 0.6, 1.2], [60, -25, 0.7, 0.8],
            [75, 15, 0.9, 1.8], [-45, 40, 0.5, 2.3], [50, 38, 0.6, 2.8],
            [-95, -10, 0.4, 1.5], [90, -5, 0.5, 3.2],
          ].map(([x, y, s, d], i) => (
            <g key={`sp-${i}`} transform={`translate(${x}, ${y})`}
              style={{ animation: `sparkle ${2.5 + s}s ease-in-out ${d}s infinite` }}
            >
              <line x1="0" y1={-2 * s} x2="0" y2={2 * s} stroke="rgba(255,255,255,0.6)" strokeWidth="0.3" />
              <line x1={-2 * s} y1="0" x2={2 * s} y2="0" stroke="rgba(255,255,255,0.6)" strokeWidth="0.3" />
            </g>
          ))}
        </svg>

        {/* === MODULE CAPSULES — positioned around the brain === */}
        {modules.map((mod) => {
          const rad = (mod.angle * Math.PI) / 180;
          const px = 50 + Math.cos(rad) * mod.radius * 100;
          const py = 50 + Math.sin(rad) * mod.radius * 100;
          return (
            <motion.div
              key={mod.label}
              className="absolute pointer-events-none flex flex-col items-center"
              style={{ left: `${px}%`, top: `${py}%`, transform: "translate(-50%, -50%)" }}
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: mod.delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Energy line to center */}
              <div
                className="absolute"
                style={{
                  left: "50%",
                  top: "100%",
                  width: 1,
                  height: 12,
                  marginLeft: -0.5,
                  background: `linear-gradient(to bottom, rgba(${mod.color},0.4), transparent)`,
                }}
              />
              <div style={{
                padding: "3px 8px",
                borderRadius: 14,
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: `0 0 8px rgba(${mod.color},0.1), inset 0 1px 0 rgba(255,255,255,0.06)`,
              }}>
                <span style={{
                  fontSize: 7,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  color: "rgba(255,255,255,0.8)",
                  fontFamily: "monospace",
                  whiteSpace: "nowrap",
                }}>
                  {mod.label}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBrainWave;
