import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function Section4SystemTransformation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const DPR_LIMIT = 2;
    const TOTAL_PARTICLES = 110;
    const LOOP_SECONDS = 10.0;
    const SWEEP_WIDTH = 0.24;
    const ALIGN_STRENGTH = 0.78;
    const GRID_SPACING = 28;
    const THREAD_DIST = 55; // max px distance for connecting threads

    const WARM1 = [0xD4, 0x61, 0x6B];
    const WARM2 = [0xE8, 0x96, 0x7C];
    const WARM3 = [0xF2, 0xC1, 0xAE];

    let w = 0, h = 0, dpr = 1;
    let t0 = performance.now();

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    interface Particle {
      x: number; y: number;
      vx: number; vy: number;
      r: number; phase: number;
      layer: number; // 0=back, 1=mid, 2=front
      speedMul: number;
      blurAmount: number;
    }

    // Distribute across 3 depth layers
    const pts: Particle[] = Array.from({ length: TOTAL_PARTICLES }, (_, i) => {
      const layer = i < 30 ? 0 : i < 75 ? 1 : 2;
      const speedMul = layer === 0 ? 0.5 : layer === 1 ? 0.8 : 1.0;
      const blurAmount = layer === 0 ? 1.5 : layer === 1 ? 0 : 0;
      const rBase = layer === 0 ? rand(0.8, 1.4) : layer === 1 ? rand(1.2, 2.0) : rand(1.6, 2.4);
      return {
        x: rand(0, 1), y: rand(0, 1),
        vx: rand(-0.02, 0.02) * speedMul,
        vy: rand(-0.015, 0.015) * speedMul,
        r: rBase, phase: rand(0, Math.PI * 2),
        layer, speedMul, blurAmount,
      };
    });

    // Sort by layer so back draws first
    pts.sort((a, b) => a.layer - b.layer);

    function noise2(x: number, y: number) {
      return Math.sin(x * 1.3 + y * 0.9) * 0.55 + Math.cos(x * 0.7 - y * 1.1) * 0.45;
    }

    function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
    function clamp(x: number, a: number, b: number) { return Math.max(a, Math.min(b, x)); }

    function mixRGB(a: number[], b: number[], t: number) {
      return [
        Math.round(lerp(a[0], b[0], t)),
        Math.round(lerp(a[1], b[1], t)),
        Math.round(lerp(a[2], b[2], t)),
      ];
    }

    function warmAt(u: number) {
      if (u < 0.5) return mixRGB(WARM1, WARM2, u / 0.5);
      return mixRGB(WARM2, WARM3, (u - 0.5) / 0.5);
    }

    function resize() {
      const rect = wrap!.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, DPR_LIMIT);
      w = Math.floor(rect.width * dpr);
      h = Math.floor(rect.height * dpr);
      canvas!.width = w;
      canvas!.height = h;
      canvas!.style.width = `${rect.width}px`;
      canvas!.style.height = `${rect.height}px`;
    }

    function drawGrid(time: number) {
      const spacing = GRID_SPACING * dpr;
      ctx!.save();
      const warp = 6 * dpr;
      for (let x = 0; x <= w; x += spacing) {
        const n = noise2(x * 0.003, time * 0.00025) * warp;
        ctx!.strokeStyle = "rgba(255,255,255,0.07)";
        ctx!.lineWidth = 1;
        ctx!.beginPath();
        ctx!.moveTo(x + n, 0);
        ctx!.lineTo(x - n, h);
        ctx!.stroke();
      }
      for (let y = 0; y <= h; y += spacing) {
        const n = noise2(time * 0.00025, y * 0.003) * warp;
        ctx!.strokeStyle = "rgba(255,255,255,0.06)";
        ctx!.lineWidth = 1;
        ctx!.beginPath();
        ctx!.moveTo(0, y + n);
        ctx!.lineTo(w, y - n);
        ctx!.stroke();
      }
      ctx!.restore();
    }

    function drawSweep(sweepX: number, time: number) {
      const half = (SWEEP_WIDTH * w) * 0.5;

      // 1) Radial bloom at sweep center
      const bloom = ctx!.createRadialGradient(sweepX, h * 0.5, 0, sweepX, h * 0.5, half * 2.2);
      bloom.addColorStop(0.0, "rgba(242,193,174,0.18)");
      bloom.addColorStop(0.25, "rgba(232,150,124,0.12)");
      bloom.addColorStop(0.6, "rgba(212,97,107,0.04)");
      bloom.addColorStop(1.0, "rgba(212,97,107,0.00)");
      ctx!.fillStyle = bloom;
      ctx!.fillRect(0, 0, w, h);

      // 2) Trailing gradient fade (left side of sweep = wake)
      const trailW = half * 3;
      const trailGrad = ctx!.createLinearGradient(sweepX - trailW, 0, sweepX, 0);
      trailGrad.addColorStop(0.0, "rgba(212,97,107,0.00)");
      trailGrad.addColorStop(0.5, "rgba(232,150,124,0.04)");
      trailGrad.addColorStop(1.0, "rgba(242,193,174,0.08)");
      ctx!.fillStyle = trailGrad;
      ctx!.fillRect(sweepX - trailW, 0, trailW, h);

      // 3) Noise distortion ripple lines behind sweep
      ctx!.save();
      ctx!.globalAlpha = 0.12;
      const rippleCount = 5;
      for (let i = 0; i < rippleCount; i++) {
        const rx = sweepX - half * 0.5 - i * 8 * dpr;
        const rippleNoise = noise2(time * 0.002 + i * 3, i * 7) * 12 * dpr;
        ctx!.strokeStyle = "rgba(242,193,174,0.25)";
        ctx!.lineWidth = (1.2 - i * 0.15) * dpr;
        ctx!.beginPath();
        for (let y = 0; y < h; y += 6) {
          const nx = rx + noise2(y * 0.01 + time * 0.0003, i) * rippleNoise;
          if (y === 0) ctx!.moveTo(nx, y);
          else ctx!.lineTo(nx, y);
        }
        ctx!.stroke();
      }
      ctx!.restore();

      // 4) Bright sweep leading edge
      ctx!.save();
      const edgeGrad = ctx!.createLinearGradient(sweepX - 3 * dpr, 0, sweepX + 3 * dpr, 0);
      edgeGrad.addColorStop(0, "rgba(242,193,174,0.00)");
      edgeGrad.addColorStop(0.4, "rgba(242,193,174,0.30)");
      edgeGrad.addColorStop(0.6, "rgba(255,220,210,0.35)");
      edgeGrad.addColorStop(1, "rgba(242,193,174,0.00)");
      ctx!.fillStyle = edgeGrad;
      ctx!.fillRect(sweepX - 3 * dpr, 0, 6 * dpr, h);
      ctx!.restore();
    }

    // Draw connecting threads between nearby particles in the sweep zone
    function drawThreads(sweepX: number) {
      const half = (SWEEP_WIDTH * w) * 0.5;
      const threadDist = THREAD_DIST * dpr;

      // Only consider mid+front layer particles for threads
      const candidates = pts.filter(p => p.layer >= 1).map(p => ({
        px: p.x * w, py: p.y * h,
        influence: clamp(1 - Math.abs(p.x * w - sweepX) / half, 0, 1),
      })).filter(c => c.influence > 0.15);

      ctx!.save();
      for (let i = 0; i < candidates.length; i++) {
        for (let j = i + 1; j < candidates.length; j++) {
          const dx = candidates[i].px - candidates[j].px;
          const dy = candidates[i].py - candidates[j].py;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < threadDist) {
            const minInf = Math.min(candidates[i].influence, candidates[j].influence);
            const alpha = (1 - dist / threadDist) * minInf * 0.35;
            const warmU = Math.min(candidates[i].influence, candidates[j].influence);
            const warmRGB = warmAt(warmU);
            ctx!.strokeStyle = `rgba(${warmRGB[0]},${warmRGB[1]},${warmRGB[2]},${alpha.toFixed(3)})`;
            ctx!.lineWidth = 0.8 * dpr;
            ctx!.beginPath();
            ctx!.moveTo(candidates[i].px, candidates[i].py);
            ctx!.lineTo(candidates[j].px, candidates[j].py);
            ctx!.stroke();
          }
        }
      }
      ctx!.restore();
    }

    function draw(time: number) {
      const dt = (time - t0) / 1000;
      t0 = time;

      const loopT = (time / 1000) % LOOP_SECONDS;
      const p = loopT / LOOP_SECONDS;
      const sweepX = p * w;

      ctx!.clearRect(0, 0, w, h);

      // Background vignette
      const bg = ctx!.createRadialGradient(w * 0.55, h * 0.45, 0, w * 0.55, h * 0.45, Math.max(w, h) * 0.75);
      bg.addColorStop(0.0, "rgba(123,97,255,0.18)");
      bg.addColorStop(0.6, "rgba(123,97,255,0.05)");
      bg.addColorStop(1.0, "rgba(0,0,0,0.35)");
      ctx!.fillStyle = bg;
      ctx!.fillRect(0, 0, w, h);

      drawGrid(time);

      const half = (SWEEP_WIDTH * w) * 0.5;

      // Update & draw particles by layer (back first)
      for (const pt of pts) {
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;

        if (pt.x < -0.05) pt.x = 1.05;
        if (pt.x > 1.05) pt.x = -0.05;
        if (pt.y < -0.05) pt.y = 1.05;
        if (pt.y > 1.05) pt.y = -0.05;

        const fx = noise2(pt.x * 2.2 + time * 0.00015, pt.y * 2.0) * 0.003 * pt.speedMul;
        const fy = noise2(pt.y * 2.1, pt.x * 2.0 + time * 0.00012) * 0.003 * pt.speedMul;
        pt.x += fx * dt;
        pt.y += fy * dt;

        const px = pt.x * w;
        const py = pt.y * h;

        const d = Math.abs(px - sweepX);
        const influence = clamp(1 - (d / half), 0, 1);

        if (influence > 0) {
          const gx = Math.round(px / (GRID_SPACING * dpr)) * (GRID_SPACING * dpr);
          const gy = Math.round(py / (GRID_SPACING * dpr)) * (GRID_SPACING * dpr);
          pt.x = lerp(px, gx, influence * ALIGN_STRENGTH) / w;
          pt.y = lerp(py, gy, influence * ALIGN_STRENGTH) / h;
        }

        const warmMix = Math.pow(influence, 1.6);
        const warmRGB = warmAt(clamp((px - (sweepX - half)) / (half * 2), 0, 1));
        const baseAlpha = 0.55 + 0.35 * (0.5 + 0.5 * Math.sin(time * 0.001 + pt.phase));

        // Layer-based opacity reduction for back layer
        const layerAlpha = pt.layer === 0 ? 0.45 : pt.layer === 1 ? 0.75 : 1.0;

        const finalPx = pt.x * w;
        const finalPy = pt.y * h;

        ctx!.save();

        // Simulate blur for back layer via larger, more transparent glow
        const glowMultiplier = pt.layer === 0 ? 9.0 : pt.layer === 1 ? 6.5 : 5.5;
        const coreScale = pt.layer === 0 ? 1.3 : 1.0;

        if (warmMix > 0.02) {
          ctx!.fillStyle = `rgba(${warmRGB[0]},${warmRGB[1]},${warmRGB[2]},${(0.18 * warmMix * layerAlpha).toFixed(3)})`;
          ctx!.beginPath();
          ctx!.arc(finalPx, finalPy, pt.r * glowMultiplier * dpr, 0, Math.PI * 2);
          ctx!.fill();
        } else {
          ctx!.fillStyle = `rgba(123,97,255,${(0.12 * baseAlpha * layerAlpha).toFixed(3)})`;
          ctx!.beginPath();
          ctx!.arc(finalPx, finalPy, pt.r * (glowMultiplier - 0.5) * dpr, 0, Math.PI * 2);
          ctx!.fill();
        }

        const coreA = baseAlpha * (0.65 + 0.6 * influence) * layerAlpha;
        if (warmMix > 0.02) {
          ctx!.fillStyle = `rgba(${warmRGB[0]},${warmRGB[1]},${warmRGB[2]},${coreA.toFixed(3)})`;
        } else {
          ctx!.fillStyle = `rgba(255,255,255,${coreA.toFixed(3)})`;
        }
        ctx!.beginPath();
        ctx!.arc(finalPx, finalPy, pt.r * dpr * coreScale * (1.0 + 0.35 * influence), 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();
      }

      // Draw connecting threads in sweep zone
      drawThreads(sweepX);

      // Draw sweep overlay last
      drawSweep(sweepX, time);

      raf = requestAnimationFrame(draw);
    }

    let raf: number;
    resize();
    raf = requestAnimationFrame(draw);

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <motion.section
      className="relative overflow-hidden flex items-center lg:min-h-screen"
      style={{ padding: "clamp(56px, 7vw, 96px) 0" }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="relative z-10 mx-auto px-6 md:px-12" style={{ width: "min(1400px, 94vw)" }}>
        <div className="grid grid-cols-1 lg:grid-cols-[0.28fr_1.72fr] items-center split-layout-gap">
          {/* Left content */}
          <div className="flex flex-col gap-5">
            <motion.p
              style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase" }}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              [ SYSTEM TRANSFORMATION ]
            </motion.p>

            <motion.h2
              style={{
                color: "rgba(255,255,255,0.95)", fontWeight: 800,
                fontSize: "clamp(44px, 5.2vw, 84px)", lineHeight: 0.95,
                letterSpacing: "-0.02em",
                textShadow: "0 10px 40px rgba(0,0,0,0.22)",
              }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              When intelligence becomes infrastructure.
            </motion.h2>

            <motion.p
              style={{
                color: "rgba(255,255,255,0.72)", fontSize: "clamp(15px, 1.25vw, 18px)",
                lineHeight: 1.55, maxWidth: "46ch",
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Signals stop fragmenting. Workflows coordinate. Governance becomes automatic.
              Care becomes continuous — across the entire system.
            </motion.p>

            <motion.div
              className="flex flex-col gap-1.5"
              style={{ marginTop: 4 }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {["National routing fabric", "Unified policy enforcement", "Continuous audit visibility"].map((label) => (
                <span
                  key={label}
                  style={{
                    fontSize: 13, color: "rgba(255,255,255,0.50)",
                    letterSpacing: "0.04em",
                  }}
                >
                  • {label}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right visual – no card, floating field */}
          <div className="relative" style={{ perspective: "1000px" }}>
            {/* Ambient glow */}
            <div
              className="absolute inset-0 -z-[1]"
              style={{
                background: "radial-gradient(ellipse 120% 100% at 50% 50%, rgba(123,97,255,0.22), rgba(212,97,107,0.08) 50%, transparent 75%)",
                filter: "blur(50px)",
                transform: "scale(1.3)",
                animation: "s4Breathe 7s ease-in-out infinite",
              }}
            />
            {/* Ground shadow for depth */}
            <div style={{
              position: "absolute",
              bottom: "-12%",
              left: "15%",
              width: "70%",
              height: "30%",
              background: "radial-gradient(ellipse at center, rgba(123,97,255,0.15) 0%, rgba(212,97,107,0.06) 40%, transparent 70%)",
              borderRadius: "50%",
              filter: "blur(24px)",
              pointerEvents: "none",
            }} />
            <div
              ref={wrapRef}
              className="relative"
              style={{
                transform: "rotateX(28deg) rotateZ(-8deg)",
                transformStyle: "preserve-3d",
                minHeight: "clamp(320px, 40vw, 460px)",
              }}
            >
              <canvas ref={canvasRef} className="absolute inset-0 z-[2]" style={{ width: "100%", height: "100%", display: "block" }} />

              <div
                className="absolute left-[18px] top-[18px] z-[3] uppercase"
                style={{ color: "rgba(255,255,255,0.55)", fontSize: 11, letterSpacing: "0.22em" }}
              >
                National-scale coordination layer
              </div>
            </div>
          </div>

          <style>{`
            @keyframes s4Breathe {
              0%, 100% { opacity: 0.7; transform: scale(1.3); }
              50% { opacity: 1; transform: scale(1.38); }
            }
          `}</style>
        </div>
      </div>

      {/* Section background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(1200px 700px at 20% 20%, rgba(123,97,255,0.22), transparent 55%),
            radial-gradient(900px 600px at 80% 30%, rgba(214,97,107,0.10), transparent 60%),
            linear-gradient(135deg, #14002a, #2a0b52)
          `,
        }}
      />
    </motion.section>
  );
}
