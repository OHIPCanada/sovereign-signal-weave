import React, { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Vec2 = { x: number; y: number };
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Particle = {
  p: Vec2; v: Vec2; grid: Vec2; face: Vec2;
  hue: number; C: number; temp: number;
};

const HeroSection = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const stateRef = useRef({
    entropy: 1, coherence: 0, field: 0, graph: 0, face: 0, os: 0, warmth: 0
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0;
    let particles: Particle[] = [];
    const N = window.innerWidth < 768 ? 2000 : 5000;

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const cx = w / 2, cy = h / 2;
      for (let i = 0; i < N; i++) {
        const cols = 50;
        const gx = (i % cols) * (w / cols);
        const gy = Math.floor(i / cols) * (h / 30);

        const isEye = i < N * 0.4;
        let fx: number, fy: number;
        if (isEye) {
          const side = i % 2 === 0 ? -1 : 1;
          const angle = Math.random() * Math.PI * 2;
          const r = Math.random() * 40;
          fx = cx + (side * 120) + Math.cos(angle) * r;
          fy = cy - 80 + Math.sin(angle) * r;
        } else {
          fx = cx + (Math.random() - 0.5) * 400;
          fy = cy + (Math.random() - 0.5) * 600;
        }

        particles.push({
          p: { x: Math.random() * w, y: Math.random() * h },
          v: { x: 0, y: 0 },
          grid: { x: gx, y: gy },
          face: { x: fx, y: fy },
          hue: Math.random() > 0.5 ? 1 : 0,
          C: 0,
          temp: 1,
        });
      }
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrap,
        start: "top top",
        end: "+=4000",
        scrub: 1,
        pin: true,
      },
    });

    tl.to(stateRef.current, { entropy: 0.1, field: 1, coherence: 0.3, duration: 1 })
      .to(stateRef.current, { graph: 1, warmth: 0.4, duration: 1 })
      .to(stateRef.current, { face: 1, coherence: 0.7, duration: 1 })
      .to(stateRef.current, { os: 1, face: 0, warmth: 0.8, duration: 1 });

    let raf = 0;
    const render = () => {
      const s = stateRef.current;
      ctx.fillStyle = "#070B14";
      ctx.fillRect(0, 0, w, h);

      // Subtle auras
      ctx.save();
      const a1 = ctx.createRadialGradient(w * 0.22, h * 0.58, 1, w * 0.22, h * 0.58, Math.min(w, h) * 0.85);
      a1.addColorStop(0, "rgba(189,166,255,0.11)"); a1.addColorStop(0.65, "rgba(189,166,255,0.03)"); a1.addColorStop(1, "rgba(189,166,255,0)");
      ctx.fillStyle = a1; ctx.fillRect(0, 0, w, h);
      const a2 = ctx.createRadialGradient(w * 0.78, h * 0.52, 1, w * 0.78, h * 0.52, Math.min(w, h) * 0.90);
      a2.addColorStop(0, "rgba(232,150,124,0.09)"); a2.addColorStop(0.65, "rgba(232,150,124,0.025)"); a2.addColorStop(1, "rgba(232,150,124,0)");
      ctx.fillStyle = a2; ctx.fillRect(0, 0, w, h);
      // Vignette
      const vg = ctx.createRadialGradient(w * 0.5, h * 0.55, Math.min(w, h) * 0.12, w * 0.5, h * 0.55, Math.max(w, h) * 0.92);
      vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,0.65)");
      ctx.fillStyle = vg; ctx.fillRect(0, 0, w, h);
      ctx.restore();

      // Grid field (Scene 2)
      if (s.field > 0.01) {
        ctx.save();
        ctx.strokeStyle = `rgba(189,166,255,${0.04 + s.field * 0.08})`;
        ctx.lineWidth = 1;
        const cell = Math.max(34, Math.min(58, Math.floor(Math.min(w, h) / 18)));
        for (let x = 0; x < w; x += cell) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
        for (let y = 0; y < h; y += cell) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
        ctx.restore();
      }

      // Memory core glow (Scene 5)
      if (s.os > 0.01) {
        ctx.save(); ctx.globalCompositeOperation = "lighter";
        const t = performance.now() / 1000;
        const r0 = Math.min(w, h) * 0.06 * (0.9 + 0.08 * Math.sin(t * 1.8));
        const r1 = Math.min(w, h) * 0.18 * (0.95 + 0.1 * Math.sin(t * 0.9));
        const cg = ctx.createRadialGradient(w / 2, h / 2, r0 * 0.25, w / 2, h / 2, r1);
        cg.addColorStop(0, `rgba(243,239,255,${0.1 + s.os * 0.2})`);
        cg.addColorStop(0.35, `rgba(189,166,255,${0.08 + s.os * 0.18})`);
        cg.addColorStop(0.65, `rgba(232,150,124,${0.05 + s.os * 0.12})`);
        cg.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(w / 2, h / 2, r1, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }

      // Particles
      ctx.save(); ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < N; i++) {
        const p = particles[i];

        // Scene 1: Brownian
        p.v.x += (Math.random() - 0.5) * 2 * s.entropy;
        p.v.y += (Math.random() - 0.5) * 2 * s.entropy;

        // Scene 2: Grid pull
        if (s.field > 0) {
          p.v.x += (p.grid.x - p.p.x) * 0.05 * s.field;
          p.v.y += (p.grid.y - p.p.y) * 0.05 * s.field;
        }

        // Scene 3: Spiral / graph
        if (s.graph > 0) {
          const cx = w / 2, cy = h / 2;
          const dx = p.p.x - cx, dy = p.p.y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const nx = dx / dist, ny = dy / dist;
          p.v.x += (-ny * 12 - nx * 5) * s.graph * 0.016;
          p.v.y += (nx * 12 - ny * 5) * s.graph * 0.016;
        }

        // Scene 4: Face morph
        if (s.face > 0) {
          p.v.x += (p.face.x - p.p.x) * 0.1 * s.face;
          p.v.y += (p.face.y - p.p.y) * 0.1 * s.face;
        }

        // Scene 5: Stabilized OS potential well
        if (s.os > 0) {
          const angle = (i / N) * Math.PI * 2 + performance.now() * 0.001;
          const loopIdx = i % 5;
          const rr = 120 + loopIdx * 30;
          const tx = w / 2 + Math.cos(angle * (1 + loopIdx * 0.3)) * rr;
          const ty = h / 2 + Math.sin(angle * (0.7 + loopIdx * 0.2)) * rr * 0.65;
          p.v.x += (tx - p.p.x) * 0.05 * s.os;
          p.v.y += (ty - p.p.y) * 0.05 * s.os;
        }

        // Damping + integrate
        const damp = lerp(0.88, 0.96, 1 - s.coherence);
        p.v.x *= damp; p.v.y *= damp;
        p.p.x += p.v.x; p.p.y += p.v.y;

        // Wrap in entropy phase
        if (s.entropy > 0.5) {
          if (p.p.x < -20) p.p.x = w + 20;
          if (p.p.x > w + 20) p.p.x = -20;
          if (p.p.y < -20) p.p.y = h + 20;
          if (p.p.y > h + 20) p.p.y = -20;
        }

        // Color
        const r = lerp(155, 232, s.warmth);
        const g = lerp(123, 150, s.warmth);
        const b = lerp(255, 124, s.warmth);
        const alpha = 0.15 + s.coherence * 0.55;
        ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${alpha})`;
        ctx.beginPath(); ctx.arc(p.p.x, p.p.y, 1.5 + s.coherence * 1.2, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();

      // Graph lines (Scene 3)
      if (s.graph > 0.05) {
        ctx.save(); ctx.globalCompositeOperation = "lighter";
        ctx.strokeStyle = `rgba(189,166,255,${0.06 * s.graph})`;
        ctx.lineWidth = 1;
        const step = N < 3000 ? 4 : 6;
        const maxD = Math.min(w, h) * 0.08;
        const maxD2 = maxD * maxD;
        for (let i = 0; i < N; i += step) {
          for (let j = i + step; j < Math.min(i + step * 4, N); j += step) {
            const d = (particles[i].p.x - particles[j].p.x) ** 2 + (particles[i].p.y - particles[j].p.y) ** 2;
            if (d < maxD2) {
              ctx.beginPath(); ctx.moveTo(particles[i].p.x, particles[i].p.y);
              ctx.lineTo(particles[j].p.x, particles[j].p.y); ctx.stroke();
            }
          }
        }
        ctx.restore();
      }

      // HUD
      ctx.save();
      ctx.font = "600 11px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace";
      ctx.fillStyle = `rgba(243,239,255,${0.12 + s.coherence * 0.3})`;
      ctx.textAlign = "left"; ctx.textBaseline = "top";
      let label = "FRAGMENTATION / DATA SILOS";
      if (s.field > 0.5 && s.graph < 0.5) label = "FIELD / INFRASTRUCTURE EMERGES";
      else if (s.graph > 0.5 && s.face < 0.5) label = "MEANING / UNIFIED KNOWLEDGE GRAPH";
      else if (s.face > 0.3) label = "PERCEPTION / ACCOUNTABILITY";
      else if (s.os > 0.5) label = "STABILIZED INTELLIGENCE / OPERATING SYSTEM";
      ctx.fillText(label, 24, h - 72);
      const barW = 190, bx = 24, by = h - 52;
      ctx.fillStyle = "rgba(255,255,255,0.06)"; ctx.fillRect(bx, by, barW, 6);
      const gg = ctx.createLinearGradient(bx, 0, bx + barW, 0);
      gg.addColorStop(0, "rgba(189,166,255,0.85)"); gg.addColorStop(0.55, "rgba(232,150,124,0.80)"); gg.addColorStop(1, "rgba(106,255,210,0.78)");
      ctx.fillStyle = gg; ctx.fillRect(bx, by, barW * clamp(s.coherence, 0, 1), 6);
      ctx.fillStyle = `rgba(243,239,255,${0.12 + s.coherence * 0.3})`;
      ctx.fillText(`COHERENCE  ${(clamp(s.coherence, 0, 1) * 100).toFixed(0)}%`, bx + barW + 12, h - 58);
      ctx.restore();

      raf = requestAnimationFrame(render);
    };

    window.addEventListener("resize", resize);
    resize();
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative" style={{ background: "#070B14" }}>
      <canvas ref={canvasRef} className="sticky top-0 w-full h-screen" />
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center" style={{ height: "100vh", position: "sticky", top: 0 }}>
        <div
          style={{
            textAlign: "center",
            lineHeight: 0.9,
            letterSpacing: "-0.02em",
            fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
            fontWeight: 900,
            fontSize: "clamp(64px, 12vw, 260px)",
            background: "linear-gradient(90deg, #BDA6FF 0%, #E8967C 55%, #7B61FF 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            filter: "drop-shadow(0 18px 55px rgba(0,0,0,0.70))",
            opacity: 0.98,
            userSelect: "none",
          }}
        >
          INTELLIGENCE
        </div>
        <p
          style={{
            marginTop: 16,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace",
            fontSize: 12,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(243,239,255,0.62)",
            userSelect: "none",
          }}
        >
          INTELLIGENCE BECOMES INFRASTRUCTURE
        </p>
      </div>
      <div className="h-[400vh]" />
    </div>
  );
};

export default HeroSection;
