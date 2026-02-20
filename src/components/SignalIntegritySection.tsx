import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

    const rails = [0.32, 0.45, 0.58, 0.71];
    const N = 42;

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
      x: -Math.random() * 300,
      y: Math.random(),
      vx: 0.0006 + Math.random() * 0.0005,
      amp: 0.05 + Math.random() * 0.06,
      freq: 0.6 + Math.random(),
      phase: Math.random() * Math.PI * 2,
      verified: false,
      warm: Math.random() < 0.25,
      trail: [],
    }));

    const fieldX0 = 0.40;
    const fieldX1 = 0.68;

    const t0 = performance.now();

    function snapToRail(yNorm: number) {
      return rails.reduce((a, b) =>
        Math.abs(b - yNorm) < Math.abs(a - yNorm) ? b : a
      );
    }

    let raf: number;

    function draw(now: number) {
      const t = (now - t0) / 1000;
      const w = canvas!.width;
      const h = canvas!.height;

      ctx.clearRect(0, 0, w, h);

      // Subtle rails — calm, measured lines
      ctx.strokeStyle = "rgba(30,11,56,0.12)";
      ctx.lineWidth = 1;
      rails.forEach((r) => {
        ctx.beginPath();
        ctx.moveTo(fieldX1 * w, r * h);
        ctx.lineTo(w, r * h);
        ctx.stroke();
      });

      // Intelligence field label
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = "rgba(30,11,56,0.45)";
      ctx.font = `${11 * DPR}px system-ui, -apple-system, Segoe UI, sans-serif`;
      ctx.fillText("INTELLIGENCE FIELD", fieldX0 * w + 10 * DPR, 28 * DPR);
      ctx.globalAlpha = 1;

      // Draw particles
      particles.forEach((p) => {
        p.x += p.vx * w;
        const xn = p.x / w;

        let y = p.y + Math.sin(t * p.freq + p.phase) * p.amp;

        if (xn > fieldX0 && xn < fieldX1) {
          const k = (xn - fieldX0) / (fieldX1 - fieldX0);
          const target = snapToRail(y);
          y = y * (1 - k) + target * k;
          if (k > 0.75) p.verified = true;
        }

        if (xn >= fieldX1) {
          const target = snapToRail(y);
          y = y * 0.2 + target * 0.8;
        }

        y = Math.max(0.06, Math.min(0.94, y));
        const px = p.x;
        const py = y * h;

        p.trail.push({ x: px, y: py, v: p.verified });
        if (p.trail.length > 40) p.trail.shift();

        // Trail — soft, institutional
        ctx.beginPath();
        for (let i = 0; i < p.trail.length; i++) {
          const tr = p.trail[i];
          if (i === 0) ctx.moveTo(tr.x, tr.y);
          else ctx.lineTo(tr.x, tr.y);
        }
        ctx.strokeStyle = p.verified
          ? "rgba(232,150,124,0.15)"
          : "rgba(120,80,220,0.08)";
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Particle dot — warm verified, cool unverified
        const isWarm = p.verified && p.warm && Math.sin(t * 0.9 + p.phase) > 0.6;

        ctx.beginPath();
        ctx.arc(px, py, isWarm ? 5 : 4, 0, Math.PI * 2);
        ctx.fillStyle = isWarm ? "#E8967C" : "#8B6DF6";
        ctx.fill();

        // Respawn
        if (p.x > w + 80) {
          p.x = -Math.random() * 250;
          p.y = Math.random();
          p.verified = false;
          p.trail = [];
        }
      });

      raf = requestAnimationFrame(draw);
    }

    // Entrance animation
    gsap.set(textEl, { opacity: 0, y: 30 });
    gsap.set(canvas, { opacity: 0, y: 20 });

    ScrollTrigger.create({
      trigger: section,
      start: "top 78%",
      once: true,
      onEnter: () => {
        gsap.to(textEl, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" });
        gsap.to(canvas, { opacity: 1, y: 0, duration: 1.0, delay: 0.15, ease: "power3.out" });
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
        gap: "72px",
        alignItems: "center",
        padding: "120px 80px",
        background: `
          radial-gradient(900px 600px at 20% 40%, rgba(120,80,220,0.08), transparent 60%),
          radial-gradient(800px 600px at 78% 60%, rgba(232,150,124,0.08), transparent 60%),
          linear-gradient(180deg, #FAF7FF, #FDF8F4)
        `,
        minHeight: "100vh",
      }}
    >
      {/* Left — Copy */}
      <div ref={textRef}>
        <div
          className="font-mono uppercase"
          style={{
            fontSize: 12,
            letterSpacing: "3px",
            color: "rgba(30,11,56,0.45)",
            marginBottom: 18,
          }}
        >
          [ TRUST AT SYSTEM SCALE ]
        </div>

        <h2
          style={{
            fontSize: "clamp(44px, 4.5vw, 64px)",
            fontWeight: 800,
            lineHeight: 1.02,
            letterSpacing: "-0.02em",
            margin: "0 0 18px 0",
            color: "#1E0B38",
          }}
        >
          Trusted by systems that cannot fail.
        </h2>

        <p
          style={{
            fontSize: 18,
            lineHeight: 1.6,
            color: "rgba(30,11,56,0.65)",
            maxWidth: "480px",
          }}
        >
          Signals enter fragmented. DocG routes, verifies, and records decisions — continuously, across the entire system.
        </p>
      </div>

      {/* Right — Canvas visualization */}
      <div style={{ height: "520px" }}>
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
          }}
        />
      </div>
    </section>
  );
};

export default SignalIntegritySection;
