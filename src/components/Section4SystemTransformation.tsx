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

    let w = 0, h = 0;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const N = 54;
    const LINK_DIST = 200;
    const drift = 0.18;
    const nodes: { x: number; y: number; vx: number; vy: number; r: number; phase: number }[] = [];
    let t = 0;

    let pulseT = 0;
    const pulseEvery = 260;
    const pulseSpeed = 2.4;
    const pulseMax = 900;
    let pulseMode = 0;

    function resize() {
      const rect = wrap!.getBoundingClientRect();
      w = Math.floor(rect.width);
      h = Math.floor(rect.height);
      canvas!.width = Math.floor(w * dpr);
      canvas!.height = Math.floor(h * dpr);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function rand(min: number, max: number) {
      return min + Math.random() * (max - min);
    }

    function initNodes() {
      nodes.length = 0;
      for (let i = 0; i < N; i++) {
        nodes.push({
          x: rand(0.12 * w, 0.88 * w),
          y: rand(0.12 * h, 0.88 * h),
          vx: rand(-drift, drift),
          vy: rand(-drift, drift),
          r: rand(2.5, 5),
          phase: rand(0, Math.PI * 2),
        });
      }
    }

    function drawBackground() {
      const g = ctx!.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#140022");
      g.addColorStop(0.55, "#2A0B4E");
      g.addColorStop(1, "#140022");
      ctx!.fillStyle = g;
      ctx!.fillRect(0, 0, w, h);

      const cx = w * 0.52, cy = h * 0.50;
      const rg = ctx!.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.55);
      rg.addColorStop(0, "rgba(123,97,255,0.22)");
      rg.addColorStop(0.55, "rgba(123,97,255,0.06)");
      rg.addColorStop(1, "rgba(0,0,0,0)");
      ctx!.fillStyle = rg;
      ctx!.fillRect(0, 0, w, h);
    }

    function drawLinks(pulseRadius: number) {
      const cx = w * 0.52, cy = h * 0.50;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist > LINK_DIST) continue;

          let alpha = (1 - dist / LINK_DIST) * 0.45;
          const da = Math.hypot(a.x - cx, a.y - cy);
          const db = Math.hypot(b.x - cx, b.y - cy);
          const inPulse = Math.abs(da - pulseRadius) < 28 || Math.abs(db - pulseRadius) < 28;
          if (inPulse) alpha += 0.35;

          ctx!.strokeStyle = `rgba(170,160,210,${alpha})`;
          ctx!.lineWidth = 1;
          ctx!.beginPath();
          ctx!.moveTo(a.x, a.y);
          ctx!.lineTo(b.x, b.y);
          ctx!.stroke();
        }
      }
    }

    function drawNodes(pulseRadius: number) {
      const cx = w * 0.52, cy = h * 0.50;
      for (const n of nodes) {
        const d = Math.hypot(n.x - cx, n.y - cy);
        const hit = Math.abs(d - pulseRadius) < 22;
        const pulseBoost = hit ? 0.6 : 0.0;
        const base = 0.65 + 0.2 * Math.sin(t * 0.02 + n.phase);
        const a = Math.min(1, base + pulseBoost);

        ctx!.beginPath();
        ctx!.fillStyle = `rgba(220,210,255,${a})`;
        ctx!.arc(n.x, n.y, n.r + (hit ? 2.5 : 0), 0, Math.PI * 2);
        ctx!.fill();

        ctx!.beginPath();
        ctx!.fillStyle = `rgba(123,97,255,${hit ? 0.30 : 0.12})`;
        ctx!.arc(n.x, n.y, n.r + 10, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function drawPulse(pulseRadius: number) {
      if (pulseRadius < 20) return; // skip when too small
      const cx = w * 0.52, cy = h * 0.50;
      const inner = Math.max(0, pulseRadius - 18);
      const ring = ctx!.createRadialGradient(cx, cy, inner, cx, cy, pulseRadius + 18);

      if (pulseMode === 0) {
        ring.addColorStop(0, "rgba(123,97,255,0)");
        ring.addColorStop(0.5, "rgba(123,97,255,0.30)");
        ring.addColorStop(1, "rgba(123,97,255,0)");
      } else {
        ring.addColorStop(0, "rgba(212,97,107,0)");
        ring.addColorStop(0.35, "rgba(212,97,107,0.22)");
        ring.addColorStop(0.6, "rgba(232,150,124,0.20)");
        ring.addColorStop(0.8, "rgba(242,193,174,0.15)");
        ring.addColorStop(1, "rgba(242,193,174,0)");
      }

      ctx!.fillStyle = ring;
      ctx!.beginPath();
      ctx!.arc(cx, cy, pulseRadius + 22, 0, Math.PI * 2);
      ctx!.fill();
    }

    function step() {
      t++;
      pulseT++;
      let pulseRadius = pulseT * pulseSpeed;
      if (pulseT > pulseEvery || pulseRadius > pulseMax) {
        pulseT = 0;
        pulseMode = (pulseMode + 1) % 2;
        pulseRadius = 0;
      }

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0.08 * w || n.x > 0.92 * w) n.vx *= -1;
        if (n.y < 0.08 * h || n.y > 0.92 * h) n.vy *= -1;
      }

      ctx!.clearRect(0, 0, w, h);
      drawBackground();
      drawPulse(pulseRadius);
      drawLinks(pulseRadius);
      drawNodes(pulseRadius);

      raf = requestAnimationFrame(step);
    }

    let raf: number;
    resize();
    initNodes();
    raf = requestAnimationFrame(step);

    const onResize = () => { resize(); initNodes(); };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <motion.section
      className="relative overflow-hidden py-20"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
       <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-16 lg:gap-20 items-center w-full">
        {/* Left content */}
        <div className="flex flex-col gap-7">
          <motion.p
            className="mono-label"
            style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, letterSpacing: "0.22em" }}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            [ SYSTEM TRANSFORMATION ]
          </motion.p>

          <motion.h2
            style={{
              color: "rgba(255,255,255,0.95)",
              fontWeight: 800,
              fontSize: "clamp(44px, 5.2vw, 84px)",
              lineHeight: 0.95,
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
              color: "rgba(255,255,255,0.72)",
              fontWeight: 400,
              fontSize: "clamp(15px, 1.25vw, 18px)",
              lineHeight: 1.55,
              maxWidth: "46ch",
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
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {["Routing", "Orchestration", "Policy Enforcement", "Audit Trails"].map((label) => (
              <span
                key={label}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-white/80 text-[12px]"
              >
                {label}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Right visual */}
        <div>
           <div
            ref={wrapRef}
            className="relative aspect-[4/3] rounded-[40px] overflow-hidden border border-white/10 bg-white/[0.03]"
            style={{
              boxShadow: "0 40px 120px rgba(0,0,0,0.35)",
            }}
          >
            <canvas ref={canvasRef} className="absolute inset-0 z-[2]" />

            <div className="absolute left-6 top-6 z-[3] text-white/70 text-[12px] tracking-[0.18em] uppercase">
              National-scale coordination layer
            </div>

            <div className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none">
              <div className="text-white/5 font-black tracking-tight text-[88px]">
                DOCG AI
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Section background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: "linear-gradient(135deg, #140022 0%, #2A0B4E 55%, #140022 100%)",
        }}
      />
    </motion.section>
  );
}
