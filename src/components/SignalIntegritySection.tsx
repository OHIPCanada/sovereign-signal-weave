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

    // Verification flash effects
    interface Flash {
      x: number;
      y: number;
      birth: number;
      duration: number;
      color: string;
    }
    const flashes: Flash[] = [];

    // Mouse tracking (for particles + 3D tilt)
    const mouse = { x: -9999, y: -9999, active: false };
    const cardMouse = { nx: 0, ny: 0 };
    const smoothCard = { rx: 0, ry: 0 };
    const MOUSE_RADIUS = 120;
    const MOUSE_FORCE = 0.06;

    const cardEl = cardRef.current;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas!.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) * DPR;
      mouse.y = (e.clientY - rect.top) * DPR;
      mouse.active = true;

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

    // Animated grid dots
    interface GridDot {
      x: number;
      y: number;
      baseAlpha: number;
      phaseOffset: number;
    }
    const gridDots: GridDot[] = [];
    const GRID_COLS = 32;
    const GRID_ROWS = 16;
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        gridDots.push({
          x: (c + 0.5) / GRID_COLS,
          y: (r + 0.5) / GRID_ROWS,
          baseAlpha: 0.04 + Math.random() * 0.04,
          phaseOffset: Math.random() * Math.PI * 2,
        });
      }
    }

    let raf: number;

    function draw(now: number) {
      const t = (now - t0) / 1000;
      const w = canvas!.width;
      const h = canvas!.height;

      ctx.clearRect(0, 0, w, h);

      // === RICHER BACKGROUND DEPTH ===

      // Animated grid dots with breathing effect
      gridDots.forEach((dot) => {
        const breathe = Math.sin(t * 0.5 + dot.phaseOffset) * 0.5 + 0.5;
        const alpha = dot.baseAlpha * (0.6 + breathe * 0.4);
        // Dots near field zone glow brighter
        const inField = dot.x > fieldX0 - 0.05 && dot.x < fieldX1 + 0.05;
        const fieldBoost = inField ? 1.8 : 1;
        const radius = inField ? 1.8 * DPR : 1.2 * DPR;

        ctx.beginPath();
        ctx.arc(dot.x * w, dot.y * h, radius, 0, Math.PI * 2);
        ctx.fillStyle = inField
          ? `rgba(123,97,255,${alpha * fieldBoost})`
          : `rgba(90,32,184,${alpha * fieldBoost})`;
        ctx.fill();
      });

      // Subtle horizontal scan lines
      ctx.globalAlpha = 0.03;
      ctx.strokeStyle = "#5A20B8";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < 20; i++) {
        const y = (i / 19) * h;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Gradient mesh overlay — warm bottom-right, cool top-left
      const meshGrad = ctx.createRadialGradient(w * 0.15, h * 0.2, 0, w * 0.15, h * 0.2, h * 0.8);
      meshGrad.addColorStop(0, "rgba(123,97,255,0.06)");
      meshGrad.addColorStop(1, "rgba(123,97,255,0)");
      ctx.fillStyle = meshGrad;
      ctx.fillRect(0, 0, w, h);

      const meshGrad2 = ctx.createRadialGradient(w * 0.85, h * 0.8, 0, w * 0.85, h * 0.8, h * 0.7);
      meshGrad2.addColorStop(0, "rgba(212,97,107,0.05)");
      meshGrad2.addColorStop(1, "rgba(212,97,107,0)");
      ctx.fillStyle = meshGrad2;
      ctx.fillRect(0, 0, w, h);

      // === DRAMATIC FIELD ZONE ===

      // Vertical boundary lines (pulsing)
      const boundaryPulse = Math.sin(t * 1.5) * 0.3 + 0.7;
      ctx.strokeStyle = `rgba(123,97,255,${0.2 * boundaryPulse})`;
      ctx.lineWidth = 1.5 * DPR;
      ctx.setLineDash([8 * DPR, 6 * DPR]);
      // Left boundary
      ctx.beginPath();
      ctx.moveTo(fieldX0 * w, 0);
      ctx.lineTo(fieldX0 * w, h);
      ctx.stroke();
      // Right boundary
      ctx.beginPath();
      ctx.moveTo(fieldX1 * w, 0);
      ctx.lineTo(fieldX1 * w, h);
      ctx.stroke();
      ctx.setLineDash([]);

      // Strong field glow — radial center
      const fieldCX = ((fieldX0 + fieldX1) / 2) * w;
      const fieldGlow = ctx.createRadialGradient(fieldCX, h * 0.5, 0, fieldCX, h * 0.5, h * 0.7);
      fieldGlow.addColorStop(0, `rgba(123,97,255,${0.16 + Math.sin(t * 0.8) * 0.06})`);
      fieldGlow.addColorStop(0.3, "rgba(123,97,255,0.08)");
      fieldGlow.addColorStop(0.6, "rgba(123,97,255,0.02)");
      fieldGlow.addColorStop(1, "rgba(123,97,255,0)");
      ctx.fillStyle = fieldGlow;
      ctx.fillRect(0, 0, w, h);

      // Horizontal scanline sweeping through the field
      const scanY = ((t * 0.15) % 1) * h;
      const scanGrad = ctx.createLinearGradient(fieldX0 * w, 0, fieldX1 * w, 0);
      scanGrad.addColorStop(0, "rgba(123,97,255,0)");
      scanGrad.addColorStop(0.2, "rgba(123,97,255,0.12)");
      scanGrad.addColorStop(0.5, "rgba(123,97,255,0.18)");
      scanGrad.addColorStop(0.8, "rgba(123,97,255,0.12)");
      scanGrad.addColorStop(1, "rgba(123,97,255,0)");
      ctx.fillStyle = scanGrad;
      ctx.globalAlpha = 0.5;
      ctx.fillRect(fieldX0 * w, scanY - 2 * DPR, (fieldX1 - fieldX0) * w, 4 * DPR);
      ctx.globalAlpha = 1;

      // Field zone label with glow
      ctx.save();
      ctx.globalAlpha = 0.55;
      ctx.fillStyle = "rgba(123,97,255,0.7)";
      ctx.font = `bold ${11 * DPR}px system-ui, -apple-system, Segoe UI, Inter`;
      ctx.letterSpacing = `${2 * DPR}px`;
      ctx.fillText("INTELLIGENCE FIELD", fieldX0 * w + 14 * DPR, 28 * DPR);
      ctx.restore();

      // Mouse cursor glow
      if (mouse.active) {
        const mg = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, MOUSE_RADIUS * DPR);
        mg.addColorStop(0, "rgba(123,97,255,0.15)");
        mg.addColorStop(0.5, "rgba(123,97,255,0.05)");
        mg.addColorStop(1, "rgba(123,97,255,0)");
        ctx.fillStyle = mg;
        ctx.fillRect(0, 0, w, h);
      }

      // Rails on right — slightly stronger
      ctx.strokeStyle = "rgba(90,32,184,0.16)";
      ctx.lineWidth = 1;
      rails.forEach((r) => {
        const y = r * h;
        ctx.beginPath();
        ctx.moveTo(fieldX1 * w, y);
        ctx.lineTo(w, y);
        ctx.stroke();
        // Rail label dots
        ctx.beginPath();
        ctx.arc(fieldX1 * w + 6 * DPR, y, 2 * DPR, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(90,32,184,0.25)";
        ctx.fill();
      });

      // Draw particles + trails
      particles.forEach((p) => {
        p.x += p.vx * w;
        const xn = p.x / w;

        let y = p.y + Math.sin(t * p.freq + p.phase) * p.amp;

        const wasVerified = p.verified;

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

        // === VERIFICATION FLASH ===
        if (p.verified && !wasVerified) {
          flashes.push({
            x: p.x,
            y: y * h,
            birth: t,
            duration: 0.8,
            color: p.warm ? "rgba(212,97,107," : "rgba(123,97,255,",
          });
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

        // Trail — thicker and more visible
        ctx.beginPath();
        for (let i = 0; i < p.trail.length; i++) {
          const tr = p.trail[i];
          if (i === 0) ctx.moveTo(tr.x, tr.y);
          else ctx.lineTo(tr.x, tr.y);
        }
        ctx.strokeStyle = p.verified
          ? "rgba(212,97,107,0.25)"
          : "rgba(123,97,255,0.15)";
        ctx.lineWidth = p.verified ? 2 : 1.5;
        ctx.stroke();

        // Particle dot — bigger
        const isWarmPulse = p.verified && p.warm && Math.sin(t * 0.9 + p.phase) > 0.6;
        const r = isWarmPulse ? 7 : 5;

        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = isWarmPulse
          ? "rgba(212,97,107,0.95)"
          : p.verified
            ? "rgba(212,97,107,0.8)"
            : "rgba(123,97,255,0.8)";
        ctx.fill();

        // Outer halo
        ctx.beginPath();
        ctx.arc(px, py, r * 3, 0, Math.PI * 2);
        ctx.fillStyle = isWarmPulse
          ? "rgba(212,97,107,0.12)"
          : p.verified
            ? "rgba(212,97,107,0.06)"
            : "rgba(123,97,255,0.08)";
        ctx.fill();

        // Respawn
        if (p.x > w + 80) {
          p.x = -Math.random() * 300;
          p.y = Math.random();
          p.verified = false;
          p.trail.length = 0;
        }
      });

      // === DRAW VERIFICATION FLASHES ===
      for (let i = flashes.length - 1; i >= 0; i--) {
        const f = flashes[i];
        const age = t - f.birth;
        if (age > f.duration) {
          flashes.splice(i, 1);
          continue;
        }
        const progress = age / f.duration;
        const radius = 20 * DPR + progress * 60 * DPR;
        const alpha = (1 - progress) * 0.35;

        // Ripple rings
        for (let ring = 0; ring < 3; ring++) {
          const ringProgress = Math.min(1, progress + ring * 0.15);
          const ringRadius = 10 * DPR + ringProgress * 50 * DPR;
          const ringAlpha = (1 - ringProgress) * 0.2;
          if (ringAlpha <= 0) continue;

          ctx.beginPath();
          ctx.arc(f.x, f.y, ringRadius, 0, Math.PI * 2);
          ctx.strokeStyle = f.color + ringAlpha + ")";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Central flash
        const flashGrad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, radius);
        flashGrad.addColorStop(0, f.color + (alpha * 0.8) + ")");
        flashGrad.addColorStop(0.4, f.color + (alpha * 0.3) + ")");
        flashGrad.addColorStop(1, f.color + "0)");
        ctx.fillStyle = flashGrad;
        ctx.fillRect(f.x - radius, f.y - radius, radius * 2, radius * 2);
      }

      // Noise texture overlay (very subtle)
      ctx.globalAlpha = 0.015;
      for (let i = 0; i < 300; i++) {
        const nx = Math.random() * w;
        const ny = Math.random() * h;
        ctx.fillStyle = Math.random() > 0.5 ? "#fff" : "#000";
        ctx.fillRect(nx, ny, 1.5, 1.5);
      }
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
        padding: "clamp(64px, 8vw, 120px) 0",
        background: `
          radial-gradient(1100px 700px at 20% 20%, rgba(110,59,255,0.10), transparent 55%),
          radial-gradient(900px 600px at 80% 70%, rgba(232,150,124,0.12), transparent 60%),
          linear-gradient(180deg, #F7F3FF 0%, #FFFFFF 50%, #FFF7F2 100%)
        `,
        color: "#140A2A",
      }}
    >
      <div
        className="relative z-10 mx-auto flex flex-col items-center"
        style={{
          width: "min(1200px, 92vw)",
          gap: "clamp(48px, 6vw, 80px)",
        }}
      >
        {/* Top — Copy (centered) */}
        <div ref={textRef} className="text-center">
          <div
            className="font-mono uppercase mb-5"
            style={{ fontSize: 12, letterSpacing: "0.22em", color: "rgba(20, 10, 42, 0.45)" }}
          >
            [ TRUST AT SYSTEM SCALE ]
          </div>

          <h2
            className="mb-5"
            style={{
              fontSize: "clamp(44px, 5.2vw, 84px)",
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
              textShadow: "0 10px 40px rgba(0,0,0,0.08)",
            }}
          >
            Trusted by systems that cannot fail.
          </h2>

          <p
            style={{
              fontSize: "clamp(15px, 1.25vw, 18px)",
              lineHeight: 1.55,
              color: "rgba(20, 10, 42, 0.72)",
              maxWidth: "46ch",
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
                  color: "rgba(20, 10, 42, 0.7)",
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
        <div style={{ perspective: "900px", width: "100%", position: "relative" }}>
        {/* Glass card with 3D tilt */}
        <div
          ref={cardRef}
          style={{
            position: "relative",
            width: "100%",
            height: "clamp(300px, 60vw, 520px)",
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(3px)",
            WebkitBackdropFilter: "blur(3px)",
            border: "1px solid rgba(123,97,255,0.12)",
            borderRadius: 24,
            boxShadow: "0 4px 20px rgba(123,97,255,0.04)",
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
              border: "1px solid rgba(255,255,255,0.15)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(90,32,184,0.04)",
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
              background: "radial-gradient(ellipse at center, rgba(123,97,255,0.15) 0%, transparent 70%)",
              filter: "blur(10px)",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default SignalIntegritySection;
