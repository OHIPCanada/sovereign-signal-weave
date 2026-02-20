import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CHIPS = ["Integrity", "Traceability", "Jurisdiction"];

const SignalIntegritySection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const textEl = textRef.current;
    const canvas = canvasRef.current;
    if (!section || !textEl || !canvas) return;

    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    const DPR = Math.min(2, window.devicePixelRatio || 1);

    function resize() {
      const r = canvas!.getBoundingClientRect();
      canvas!.width = Math.floor(r.width * DPR);
      canvas!.height = Math.floor(r.height * DPR);
    }
    resize();
    window.addEventListener("resize", resize);

    // Rails (coordinated care lanes)
    const rails = [0.28, 0.42, 0.56, 0.70];

    // Particles
    const N = 46;
    interface Particle {
      x: number;
      y: number;
      vx: number;
      amp: number;
      freq: number;
      phase: number;
      verified: boolean;
      warm: boolean;
      trail: { x: number; y: number; v: boolean }[];
    }

    const particles: Particle[] = Array.from({ length: N }, () => ({
      x: -Math.random() * 400,
      y: Math.random(),
      vx: 0.0007 + Math.random() * 0.0006,
      amp: 0.08 + Math.random() * 0.09,
      freq: 0.6 + Math.random() * 1.2,
      phase: Math.random() * Math.PI * 2,
      verified: false,
      warm: Math.random() < 0.25,
      trail: [],
    }));

    // Intelligence field bounds
    const fieldX0 = 0.38;
    const fieldX1 = 0.70;

    const t0 = performance.now();

    function snapToRail(yNorm: number) {
      let bestR = rails[0];
      let bestD = 999;
      for (const r of rails) {
        const d = Math.abs(r - yNorm);
        if (d < bestD) { bestR = r; bestD = d; }
      }
      return bestR;
    }

    let raf: number;

    function draw(now: number) {
      const t = (now - t0) / 1000;
      const w = canvas!.width;
      const h = canvas!.height;

      ctx.clearRect(0, 0, w, h);

      // Subtle grid fog
      ctx.globalAlpha = 0.08;
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1;
      for (let i = 0; i < 12; i++) {
        const y = (i / 11) * h;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Field glow (center intelligence layer)
      const gx = ((fieldX0 + fieldX1) / 2) * w;
      const grad = ctx.createRadialGradient(gx, h * 0.5, h * 0.05, gx, h * 0.5, h * 0.65);
      grad.addColorStop(0, "rgba(152,80,255,0.25)");
      grad.addColorStop(0.45, "rgba(152,80,255,0.08)");
      grad.addColorStop(1, "rgba(152,80,255,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Rails on right
      ctx.strokeStyle = "rgba(255,255,255,0.18)";
      ctx.lineWidth = 1;
      rails.forEach((r) => {
        const y = r * h;
        ctx.beginPath();
        ctx.moveTo(fieldX1 * w, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      });

      // Draw particles + trails
      particles.forEach((p) => {
        p.x += p.vx * w;
        const xn = p.x / w;

        let y = p.y + Math.sin(t * p.freq + p.phase) * p.amp;

        // Inside field: converge to lane
        if (xn > fieldX0 && xn < fieldX1) {
          const k = (xn - fieldX0) / (fieldX1 - fieldX0);
          const target = snapToRail(y);
          y = y * (1 - k) + target * k;
          if (k > 0.7) p.verified = true;
        }

        // After field: stick to rail
        if (xn >= fieldX1) {
          const target = snapToRail(y);
          y = y * 0.15 + target * 0.85;
        }

        y = Math.max(0.06, Math.min(0.94, y));
        const px = p.x;
        const py = y * h;

        // Trail (audit ghost)
        p.trail.push({ x: px, y: py, v: p.verified });
        if (p.trail.length > 46) p.trail.shift();

        ctx.beginPath();
        for (let i = 0; i < p.trail.length; i++) {
          const tr = p.trail[i];
          if (i === 0) ctx.moveTo(tr.x, tr.y);
          else ctx.lineTo(tr.x, tr.y);
        }
        ctx.strokeStyle = p.verified
          ? "rgba(242,193,174,0.14)"
          : "rgba(255,255,255,0.07)";
        ctx.lineWidth = p.verified ? 1.6 : 1.2;
        ctx.stroke();

        // Particle glow
        const isWarmPulse = p.verified && p.warm && Math.sin(t * 0.9 + p.phase) > 0.6;
        const r = isWarmPulse ? 6 : 4;

        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = isWarmPulse
          ? "rgba(242,193,174,0.95)"
          : "rgba(180,140,255,0.88)";
        ctx.fill();

        // Halo
        ctx.beginPath();
        ctx.arc(px, py, r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = isWarmPulse
          ? "rgba(232,150,124,0.12)"
          : "rgba(152,80,255,0.10)";
        ctx.fill();

        // Respawn
        if (p.x > w + 80) {
          p.x = -Math.random() * 300;
          p.y = Math.random();
          p.verified = false;
          p.trail.length = 0;
        }
      });

      // Label the intelligence field
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.font = `${12 * DPR}px system-ui, -apple-system, Segoe UI, Inter`;
      ctx.fillText("INTELLIGENCE FIELD", fieldX0 * w + 12 * DPR, 34 * DPR);
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(draw);
    }

    // Entrance animation
    gsap.set(textEl, { opacity: 0, y: 40 });
    gsap.set(canvas, { opacity: 0, y: 50 });

    ScrollTrigger.create({
      trigger: section,
      start: "top 78%",
      once: true,
      onEnter: () => {
        gsap.to(textEl, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" });
        gsap.to(canvas, { opacity: 1, y: 0, duration: 1.1, delay: 0.12, ease: "power3.out" });
      },
    });

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1.4fr",
        gap: "64px",
        alignItems: "center",
        padding: "clamp(64px, 7vw, 120px) clamp(24px, 5vw, 80px)",
        background: `
          radial-gradient(900px 600px at 20% 30%, rgba(90,32,184,0.35), transparent 60%),
          radial-gradient(900px 700px at 80% 70%, rgba(232,150,124,0.18), transparent 65%),
          linear-gradient(180deg, #16002A, #2B0060)
        `,
        color: "#fff",
        minHeight: "100vh",
      }}
    >
      {/* Left — Copy */}
      <div ref={textRef}>
        <div
          className="font-mono uppercase"
          style={{ fontSize: 12, letterSpacing: "3px", opacity: 0.6, marginBottom: 18 }}
        >
          [ TRUST AT SYSTEM SCALE ]
        </div>

        <h2
          style={{
            fontSize: "clamp(44px, 5vw, 64px)",
            fontWeight: 800,
            lineHeight: 1.0,
            letterSpacing: "-0.02em",
            margin: "0 0 18px 0",
          }}
        >
          Trusted by systems that cannot fail.
        </h2>

        <p
          style={{
            fontSize: 18,
            lineHeight: 1.6,
            opacity: 0.78,
            maxWidth: "460px",
            margin: "0 0 18px 0",
          }}
        >
          Signals enter fragmented. DocG routes, verifies, and records decisions — continuously.
        </p>

        <div className="flex flex-wrap gap-2.5">
          {CHIPS.map((chip) => (
            <span
              key={chip}
              style={{
                fontSize: 13,
                opacity: 0.8,
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(255,255,255,0.05)",
                padding: "10px 14px",
                borderRadius: 999,
                backdropFilter: "blur(10px)",
              }}
            >
              {chip}
            </span>
          ))}
        </div>
      </div>

      {/* Right — Full-bleed canvas animation (no card/frame) */}
      <div style={{ position: "relative", height: "520px" }}>
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "100%", display: "block" }}
        />
      </div>
    </section>
  );
};

export default SignalIntegritySection;
