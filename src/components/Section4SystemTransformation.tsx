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
    const PARTICLES = 110;
    const LOOP_SECONDS = 10.0;
    const SWEEP_WIDTH = 0.22;
    const ALIGN_STRENGTH = 0.75;
    const GRID_SPACING = 28;

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
    }

    const pts: Particle[] = Array.from({ length: PARTICLES }, () => ({
      x: rand(0, 1), y: rand(0, 1),
      vx: rand(-0.02, 0.02), vy: rand(-0.015, 0.015),
      r: rand(1.2, 2.2), phase: rand(0, Math.PI * 2),
    }));

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

    function drawSweep(sweepX: number) {
      const half = (SWEEP_WIDTH * w) * 0.5;
      const grad = ctx!.createRadialGradient(sweepX, h * 0.5, 0, sweepX, h * 0.5, half * 1.8);
      grad.addColorStop(0.0, "rgba(242,193,174,0.12)");
      grad.addColorStop(0.35, "rgba(232,150,124,0.10)");
      grad.addColorStop(1.0, "rgba(212,97,107,0.00)");
      ctx!.fillStyle = grad;
      ctx!.fillRect(0, 0, w, h);

      ctx!.save();
      ctx!.globalAlpha = 0.28;
      ctx!.fillStyle = "rgba(242,193,174,0.35)";
      ctx!.fillRect(sweepX - 1.2 * dpr, 0, 2.4 * dpr, h);
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

      for (const pt of pts) {
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;

        if (pt.x < -0.05) pt.x = 1.05;
        if (pt.x > 1.05) pt.x = -0.05;
        if (pt.y < -0.05) pt.y = 1.05;
        if (pt.y > 1.05) pt.y = -0.05;

        const fx = noise2(pt.x * 2.2 + time * 0.00015, pt.y * 2.0) * 0.003;
        const fy = noise2(pt.y * 2.1, pt.x * 2.0 + time * 0.00012) * 0.003;
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

        const finalPx = pt.x * w;
        const finalPy = pt.y * h;

        ctx!.save();
        if (warmMix > 0.02) {
          ctx!.fillStyle = `rgba(${warmRGB[0]},${warmRGB[1]},${warmRGB[2]},${(0.20 * warmMix).toFixed(3)})`;
          ctx!.beginPath();
          ctx!.arc(finalPx, finalPy, pt.r * 6.5 * dpr, 0, Math.PI * 2);
          ctx!.fill();
        } else {
          ctx!.fillStyle = `rgba(123,97,255,${(0.14 * baseAlpha).toFixed(3)})`;
          ctx!.beginPath();
          ctx!.arc(finalPx, finalPy, pt.r * 6.0 * dpr, 0, Math.PI * 2);
          ctx!.fill();
        }

        const coreA = baseAlpha * (0.65 + 0.6 * influence);
        if (warmMix > 0.02) {
          ctx!.fillStyle = `rgba(${warmRGB[0]},${warmRGB[1]},${warmRGB[2]},${coreA.toFixed(3)})`;
        } else {
          ctx!.fillStyle = `rgba(255,255,255,${coreA.toFixed(3)})`;
        }
        ctx!.beginPath();
        ctx!.arc(finalPx, finalPy, pt.r * dpr * (1.0 + 0.35 * influence), 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();
      }

      drawSweep(sweepX);
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
      className="relative overflow-hidden flex items-center"
      style={{ padding: "clamp(56px, 7vw, 96px) 0", minHeight: "100vh" }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="relative z-10 mx-auto px-6 md:px-12" style={{ width: "min(1200px, 92vw)" }}>
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] items-center" style={{ gap: "clamp(28px, 4vw, 56px)" }}>
          {/* Left content */}
          <div className="flex flex-col gap-5">
            <motion.p
              style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, letterSpacing: "0.28em", textTransform: "uppercase" }}
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
                fontSize: "clamp(44px, 5.4vw, 84px)", lineHeight: 0.95,
                letterSpacing: "-0.02em",
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
                color: "rgba(255,255,255,0.72)", fontSize: 16,
                lineHeight: 1.6, maxWidth: "48ch",
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
              className="flex flex-wrap gap-2.5"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {["Routing", "Orchestration", "Policy Enforcement", "Audit Trails"].map((label) => (
                <span
                  key={label}
                  style={{
                    fontSize: 12, color: "rgba(255,255,255,0.72)",
                    border: "1px solid rgba(255,255,255,0.16)",
                    background: "rgba(255,255,255,0.06)",
                    padding: "8px 12px", borderRadius: 999,
                    backdropFilter: "blur(10px)",
                  }}
                >
                  {label}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right visual – viewport card */}
          <div>
            <motion.div
              ref={wrapRef}
              className="relative overflow-hidden"
              style={{
                borderRadius: 32,
                background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
                border: "1px solid rgba(255,255,255,0.14)",
                overflow: "hidden",
                minHeight: "clamp(320px, 40vw, 460px)",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.05) inset, 0 30px 80px rgba(0,0,0,0.35)",
              }}
            >
              <canvas ref={canvasRef} className="absolute inset-0 z-[2]" style={{ width: "100%", height: "100%", display: "block" }} />

              <div
                className="absolute left-[18px] top-[18px] z-[3] uppercase"
                style={{ color: "rgba(255,255,255,0.60)", fontSize: 12, letterSpacing: "0.22em" }}
              >
                National-scale coordination layer
              </div>
            </motion.div>
          </div>
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
