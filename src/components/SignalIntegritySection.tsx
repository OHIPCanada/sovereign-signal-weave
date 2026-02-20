import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CHIPS = ["Integrity", "Traceability", "Jurisdiction"];

const SignalIntegritySection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

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

    const rails = [0.28, 0.42, 0.56, 0.70];

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

    const fieldX0 = 0.38;
    const fieldX1 = 0.70;

    const t0 = performance.now();

    // Mouse tracking (for particles + 3D tilt)
    const mouse = { x: -9999, y: -9999, active: false };
    const cardMouse = { nx: 0, ny: 0 }; // normalized -1 to 1
    const smoothCard = { rx: 0, ry: 0 };
    const MOUSE_RADIUS = 120;
    const MOUSE_FORCE = 0.06;

    const cardEl = cardRef.current;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas!.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) * DPR;
      mouse.y = (e.clientY - rect.top) * DPR;
      mouse.active = true;

      // 3D tilt calc based on card bounds
      if (cardEl) {
        const cr = cardEl.getBoundingClientRect();
        cardMouse.nx = ((e.clientX - cr.left) / cr.width - 0.5) * 2;
        cardMouse.ny = ((e.clientY - cr.top) / cr.height - 0.5) * 2;
      }
    };
    const onMouseLeave = () => {
      mouse.active = false;
      cardMouse.nx = 0;
      cardMouse.ny = 0;
    };

    if (cardEl) {
      cardEl.addEventListener("mousemove", onMouseMove);
      cardEl.addEventListener("mouseleave", onMouseLeave);
    }

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

      // Subtle grid lines
      ctx.globalAlpha = 0.06;
      ctx.strokeStyle = "#BFA7FF";
      ctx.lineWidth = 1;
      for (let i = 0; i < 12; i++) {
        const y = (i / 11) * h;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Mouse cursor glow
      if (mouse.active) {
      const mg = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, MOUSE_RADIUS * DPR);
        mg.addColorStop(0, "rgba(100,180,255,0.16)");
        mg.addColorStop(0.5, "rgba(120,170,255,0.06)");
        mg.addColorStop(1, "rgba(100,180,255,0)");
        ctx.fillStyle = mg;
        ctx.fillRect(0, 0, w, h);
      }

      // Field glow
      const gx = ((fieldX0 + fieldX1) / 2) * w;
      const grad = ctx.createRadialGradient(gx, h * 0.5, h * 0.05, gx, h * 0.5, h * 0.65);
      grad.addColorStop(0, "rgba(100,180,255,0.22)");
      grad.addColorStop(0.35, "rgba(120,160,255,0.10)");
      grad.addColorStop(0.65, "rgba(130,200,255,0.04)");
      grad.addColorStop(1, "rgba(100,180,255,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Rails on right
      ctx.strokeStyle = "rgba(191,167,255,0.18)";
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

        if (xn > fieldX0 && xn < fieldX1) {
          const k = (xn - fieldX0) / (fieldX1 - fieldX0);
          const target = snapToRail(y);
          y = y * (1 - k) + target * k;
          if (k > 0.7) p.verified = true;
        }

        if (xn >= fieldX1) {
          const target = snapToRail(y);
          y = y * 0.15 + target * 0.85;
        }

        y = Math.max(0.06, Math.min(0.94, y));
        let px = p.x;
        let py = y * h;

        // Mouse repulsion
        if (mouse.active) {
          const dx = px - mouse.x;
          const dy = py - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const radius = MOUSE_RADIUS * DPR;
          if (dist < radius && dist > 0) {
            const force = (1 - dist / radius) * MOUSE_FORCE * radius;
            px += (dx / dist) * force;
            py += (dy / dist) * force;
          }
        }

        p.trail.push({ x: px, y: py, v: p.verified });
        if (p.trail.length > 46) p.trail.shift();

        // Trail
        ctx.beginPath();
        for (let i = 0; i < p.trail.length; i++) {
          const tr = p.trail[i];
          if (i === 0) ctx.moveTo(tr.x, tr.y);
          else ctx.lineTo(tr.x, tr.y);
        }
        ctx.strokeStyle = p.verified
          ? "rgba(212,97,107,0.22)"
          : "rgba(191,167,255,0.18)";
        ctx.lineWidth = p.verified ? 1.6 : 1.2;
        ctx.stroke();

        // Particle dot
        const isWarmPulse = p.verified && p.warm && Math.sin(t * 0.9 + p.phase) > 0.6;
        const r = isWarmPulse ? 6 : 4;

        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = isWarmPulse
          ? "rgba(212,97,107,0.9)"
          : "rgba(191,167,255,0.85)";
        ctx.fill();

        // Halo
        ctx.beginPath();
        ctx.arc(px, py, r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = isWarmPulse
          ? "rgba(212,97,107,0.12)"
          : "rgba(191,167,255,0.12)";
        ctx.fill();

        // Respawn
        if (p.x > w + 80) {
          p.x = -Math.random() * 300;
          p.y = Math.random();
          p.verified = false;
          p.trail.length = 0;
        }
      });

      // Label
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = "rgba(90,32,184,0.5)";
      ctx.font = `${12 * DPR}px system-ui, -apple-system, Segoe UI, Inter`;
      ctx.fillText("INTELLIGENCE FIELD", fieldX0 * w + 12 * DPR, 34 * DPR);
      ctx.globalAlpha = 1;

      // 3D tilt — smooth lerp
      smoothCard.rx += (cardMouse.ny * -18 - smoothCard.rx) * 0.06;
      smoothCard.ry += (cardMouse.nx * 26 - smoothCard.ry) * 0.06;
      if (cardEl) {
        cardEl.style.transform = `rotateX(${smoothCard.rx}deg) rotateY(${smoothCard.ry}deg) scale3d(1.02,1.02,1)`;
      }

      raf = requestAnimationFrame(draw);
    }

    // Entrance
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
      if (cardEl) {
        cardEl.removeEventListener("mousemove", onMouseMove);
        cardEl.removeEventListener("mouseleave", onMouseLeave);
      }
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "clamp(64px, 7vw, 110px) clamp(24px, 5vw, 80px) clamp(48px, 5vw, 80px)",
        background: `
          radial-gradient(1100px 700px at 20% 20%, rgba(110,59,255,0.10), transparent 55%),
          radial-gradient(900px 600px at 80% 70%, rgba(232,150,124,0.12), transparent 60%),
          linear-gradient(180deg, #F7F3FF 0%, #FFFFFF 50%, #FFF7F2 100%)
        `,
        color: "#140A2A",
        minHeight: "100vh",
      }}
    >
      {/* Top — Copy (centered) */}
      <div ref={textRef} style={{ maxWidth: "min(720px, 90vw)", textAlign: "center", marginBottom: "clamp(40px, 5vw, 64px)" }}>
        <div
          className="font-mono uppercase"
          style={{ fontSize: 12, letterSpacing: "3px", color: "rgba(90,32,184,0.55)", marginBottom: 18 }}
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
            color: "#1A1A2E",
          }}
        >
          Trusted by systems that cannot fail.
        </h2>

        <p
          style={{
            fontSize: 18,
            lineHeight: 1.6,
            color: "rgba(26,26,46,0.65)",
            maxWidth: "520px",
            margin: "0 auto 22px",
          }}
        >
          Signals enter fragmented. DocG routes, verifies, and records decisions — continuously.
        </p>

        <div className="flex flex-wrap gap-2.5 justify-center">
          {CHIPS.map((chip) => (
            <span
              key={chip}
              style={{
                fontSize: 13,
                color: "rgba(26,26,46,0.7)",
                border: "1px solid rgba(90,32,184,0.15)",
                background: "rgba(123,97,255,0.05)",
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

      {/* Bottom — 3D perspective wrapper */}
      <div style={{ perspective: "900px", width: "100%", maxWidth: "min(1280px, 94vw)", position: "relative" }}>
        {/* Glass card with 3D tilt */}
        <div
          ref={cardRef}
          style={{
            position: "relative",
            width: "100%",
            height: "520px",
        background: "linear-gradient(135deg, rgba(180,220,255,0.14) 0%, rgba(140,200,255,0.08) 30%, rgba(200,230,255,0.06) 60%, rgba(160,210,255,0.10) 100%)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            border: "1px solid rgba(130,190,255,0.18)",
            borderRadius: 24,
            boxShadow: "0 4px 30px rgba(100,170,255,0.10), 0 0 60px rgba(130,200,255,0.06)",
            overflow: "hidden",
            padding: 2,
            transformStyle: "preserve-3d",
            transition: "none",
            willChange: "transform",
          }}
        >
          {/* Top highlight — glass edge catch */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "5%",
              right: "15%",
              height: "40%",
              background: "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 50%)",
              borderRadius: "24px 24px 0 0",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />
          {/* Diagonal specular streak */}
          <div
            style={{
              position: "absolute",
              top: "5%",
              left: "-10%",
              width: "55%",
              height: "120%",
              background: "linear-gradient(125deg, transparent 35%, rgba(255,255,255,0.06) 48%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.06) 52%, transparent 65%)",
              transform: "rotate(-15deg)",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />
          {/* Bottom edge shadow — glass thickness */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "18%",
              background: "linear-gradient(0deg, rgba(90,32,184,0.05) 0%, transparent 100%)",
              borderRadius: "0 0 24px 24px",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />
          {/* Subtle inset border for glass edge */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 24,
              border: "1px solid rgba(160,210,255,0.20)",
              boxShadow: "inset 0 1px 0 rgba(180,220,255,0.25), inset 0 -1px 0 rgba(100,170,255,0.06)",
              pointerEvents: "none",
              zIndex: 3,
            }}
          />
          <canvas
            ref={canvasRef}
            style={{ width: "100%", height: "100%", display: "block", borderRadius: 22, position: "relative", zIndex: 1 }}
          />
        </div>
        {/* Ground shadow for 3D floating effect */}
        <div
          style={{
            position: "absolute",
            bottom: "-16px",
            left: "10%",
            right: "10%",
            height: "32px",
            background: "radial-gradient(ellipse at center, rgba(100,170,255,0.18) 0%, rgba(130,200,255,0.06) 50%, transparent 70%)",
            filter: "blur(10px)",
            pointerEvents: "none",
          }}
        />
      </div>
    </section>
  );
};

export default SignalIntegritySection;
