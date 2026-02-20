import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PILLS = ["Integrity", "Traceability", "Jurisdiction"];

const SignalIntegritySection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const textEl = textRef.current;
    const canvas = canvasRef.current;
    if (!section || !textEl || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    /* ── Sizing ── */
    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    /* ── State ── */
    const W = () => canvas.width / Math.min(window.devicePixelRatio, 2);
    const H = () => canvas.height / Math.min(window.devicePixelRatio, 2);

    const LINE_COUNT = 5;
    const state = {
      time: 0,
      wobbleAmp: 1.0,       // 1 = full noise, 0 = dampened
      outOpacity: 0.15,     // output line opacity
      scanY: -10,           // scan bar Y position (-10 = hidden)
      scanOpacity: 0,
      warmGlow: 0,          // warm plane glow intensity
      pulseX: -100,         // pulse dot X
      pulseOpacity: 0,
      verified: false,
    };

    /* ── Draw frame ── */
    function draw() {
      const w = W();
      const h = H();
      ctx!.clearRect(0, 0, w, h);

      const centerX = w * 0.5;
      const planeX = centerX;

      // ── Warm glow behind center ──
      if (state.warmGlow > 0.01) {
        const grad = ctx!.createRadialGradient(planeX, h * 0.5, 0, planeX, h * 0.5, h * 0.45);
        grad.addColorStop(0, `rgba(212,97,107,${state.warmGlow * 0.35})`);
        grad.addColorStop(0.5, `rgba(232,150,124,${state.warmGlow * 0.2})`);
        grad.addColorStop(1, "transparent");
        ctx!.fillStyle = grad;
        ctx!.fillRect(0, 0, w, h);
      }

      // ── Center structural line ──
      ctx!.beginPath();
      ctx!.moveTo(planeX, h * 0.05);
      ctx!.lineTo(planeX, h * 0.95);
      ctx!.strokeStyle = `rgba(90,32,184,${0.12 + state.warmGlow * 0.15})`;
      ctx!.lineWidth = 1.5;
      ctx!.stroke();

      // ── Flanking lines ──
      [planeX - 20, planeX + 20].forEach((x) => {
        ctx!.beginPath();
        ctx!.moveTo(x, h * 0.08);
        ctx!.lineTo(x, h * 0.92);
        ctx!.strokeStyle = "rgba(90,32,184,0.06)";
        ctx!.lineWidth = 0.8;
        ctx!.stroke();
      });

      // ── INPUT waves (left) ──
      const lineSpacing = (h * 0.7) / (LINE_COUNT - 1);
      const yStart = h * 0.15;
      const leftEnd = planeX - 40;
      const leftStart = w * 0.04;

      for (let i = 0; i < LINE_COUNT; i++) {
        const baseY = yStart + i * lineSpacing;
        ctx!.beginPath();
        for (let x = leftStart; x <= leftEnd; x += 3) {
          const t = state.time + i * 0.8;
          const noise =
            state.wobbleAmp * (
              Math.sin(x * 0.04 + t * 1.8 + i * 1.3) * 16 +
              Math.cos(x * 0.09 + t * 2.2 + i * 0.7) * 9 +
              Math.sin(x * 0.15 + t * 1.1 + i * 2.1) * 5
            );
          const y = baseY + noise;
          if (x === leftStart) ctx!.moveTo(x, y);
          else ctx!.lineTo(x, y);
        }
        ctx!.strokeStyle = `rgba(90,32,184,${0.45 + i * 0.04})`;
        ctx!.lineWidth = 2;
        ctx!.lineCap = "round";
        ctx!.lineJoin = "round";
        ctx!.stroke();
      }

      // ── OUTPUT lines (right) ──
      const rightStart = planeX + 40;
      const rightEnd = w * 0.96;

      for (let i = 0; i < LINE_COUNT; i++) {
        const baseY = yStart + i * lineSpacing;
        const microDrift = Math.sin(state.time * 0.3 + i * 1.5) * 1.5;
        ctx!.beginPath();
        ctx!.moveTo(rightStart, baseY + microDrift);
        ctx!.lineTo(rightEnd, baseY + microDrift);
        ctx!.strokeStyle = `rgba(90,32,184,${state.outOpacity})`;
        ctx!.lineWidth = 1.8;
        ctx!.lineCap = "round";
        ctx!.stroke();
      }

      // ── Scan bar ──
      if (state.scanOpacity > 0.01) {
        const barGrad = ctx!.createLinearGradient(planeX - 80, 0, planeX + 80, 0);
        barGrad.addColorStop(0, "transparent");
        barGrad.addColorStop(0.3, `rgba(212,97,107,${state.scanOpacity * 0.9})`);
        barGrad.addColorStop(0.7, `rgba(232,150,124,${state.scanOpacity * 0.9})`);
        barGrad.addColorStop(1, "transparent");
        ctx!.fillStyle = barGrad;
        ctx!.fillRect(planeX - 80, state.scanY - 2, 160, 4);

        // Scan glow trail
        const trailGrad = ctx!.createLinearGradient(0, state.scanY - 40, 0, state.scanY);
        trailGrad.addColorStop(0, "transparent");
        trailGrad.addColorStop(1, `rgba(212,97,107,${state.scanOpacity * 0.12})`);
        ctx!.fillStyle = trailGrad;
        ctx!.fillRect(planeX - 60, state.scanY - 40, 120, 40);
      }

      // ── Pulse dot ──
      if (state.pulseOpacity > 0.01) {
        const midY = h * 0.5;
        // Outer glow
        const pg = ctx!.createRadialGradient(state.pulseX, midY, 0, state.pulseX, midY, 24);
        pg.addColorStop(0, `rgba(212,97,107,${state.pulseOpacity * 0.6})`);
        pg.addColorStop(1, "transparent");
        ctx!.fillStyle = pg;
        ctx!.fillRect(state.pulseX - 24, midY - 24, 48, 48);
        // Core
        ctx!.beginPath();
        ctx!.arc(state.pulseX, midY, 5, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(212,97,107,${state.pulseOpacity})`;
        ctx!.fill();
      }

      // ── Labels ──
      ctx!.font = "11px monospace";
      ctx!.letterSpacing = "3px";
      ctx!.fillStyle = "rgba(90,32,184,0.45)";
      ctx!.textAlign = "left";
      ctx!.fillText("SIGNAL IN", leftStart, yStart - 28);

      ctx!.fillStyle = "rgba(212,97,107,0.5)";
      ctx!.textAlign = "right";
      ctx!.fillText("INTEGRITY VERIFIED", rightEnd, yStart - 28);

      ctx!.fillStyle = `rgba(90,32,184,${state.verified ? 0.35 : 0.0})`;
      ctx!.textAlign = "center";
      ctx!.fillText("VERIFY", planeX, h * 0.94);
    }

    /* ── Animation loop ── */
    let raf: number;
    function tick() {
      state.time += 0.016;
      draw();
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    /* ── Entrance ── */
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

    /* ── Pulse runner ── */
    function runPulse() {
      const w = W();
      const centerX = w * 0.5;
      gsap.set(state, { pulseX: centerX, pulseOpacity: 0 });
      gsap.to(state, { pulseOpacity: 1, duration: 0.2, ease: "power2.out" });
      gsap.to(state, { pulseX: w * 0.92, duration: 1.6, ease: "power1.inOut" });
      gsap.to(state, { pulseOpacity: 0, duration: 0.4, delay: 1.2, ease: "power2.in" });
    }

    /* ── Verification sequence ── */
    const verifyTL = gsap.timeline({ paused: true });
    verifyTL
      .to(state, { scanY: 0, scanOpacity: 1, duration: 0.01 }, 0)
      .to(state, { scanY: H(), duration: 1.3, ease: "power2.inOut" }, 0)
      .to(state, { scanOpacity: 0, duration: 0.3 }, 1.0)
      .to(state, { warmGlow: 0.8, duration: 0.5, ease: "power2.out" }, 0.1)
      .to(state, { wobbleAmp: 0.15, duration: 1.2, ease: "power2.out" }, 0.6)
      .to(state, { outOpacity: 0.55, duration: 0.8, ease: "power2.out" }, 0.8)
      .set(state, { verified: true }, 0.9)
      .add(() => runPulse(), 1.1)
      .to(state, { warmGlow: 0.35, duration: 1.0, ease: "sine.out" }, 1.5)
      // Restore wobble slightly for organic feel
      .to(state, { wobbleAmp: 0.4, duration: 2.0, ease: "sine.inOut" }, 2.0);

    ScrollTrigger.create({
      trigger: canvas,
      start: "top 68%",
      once: true,
      onEnter: () => {
        verifyTL.play();
        gsap.delayedCall(4, () => {
          runPulse();
          gsap.delayedCall(8, function loop() {
            runPulse();
            gsap.delayedCall(8, loop);
          });
        });
      },
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      gsap.killTweensOf(state);
      verifyTL.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        padding: "110px 0",
        background: `
          radial-gradient(900px 600px at 20% 40%, rgba(90,32,184,0.18), transparent 60%),
          radial-gradient(800px 600px at 78% 55%, rgba(232,150,124,0.14), transparent 60%),
          linear-gradient(180deg, #FBF7FF, #FFF7F2)
        `,
        color: "#140A2A",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        className="relative z-10 mx-auto w-full grid items-center"
        style={{
          maxWidth: "min(1180px, 92vw)",
          gridTemplateColumns: "1fr 1.35fr",
          gap: "54px",
        }}
      >
        {/* Left — Copy */}
        <div ref={textRef}>
          <div
            className="font-mono uppercase"
            style={{ fontSize: 12, letterSpacing: "0.28em", color: "rgba(90,32,184,0.55)", marginBottom: 16 }}
          >
            [ TRUST AT SYSTEM SCALE ]
          </div>

          <h2
            style={{
              fontSize: "clamp(44px, 5vw, 72px)",
              fontWeight: 800,
              lineHeight: 0.98,
              letterSpacing: "-0.02em",
              margin: "0 0 18px 0",
              color: "#1A1A2E",
            }}
          >
            Trusted by systems that cannot fail.
          </h2>

          <p
            style={{
              fontSize: 16,
              lineHeight: 1.65,
              color: "rgba(26,26,46,0.65)",
              maxWidth: "44ch",
              margin: "0 0 22px 0",
            }}
          >
            Signals stabilize. Workflows converge. Governance verifies itself —
            continuously, across the entire system.
          </p>

          <div className="flex flex-wrap gap-2.5">
            {PILLS.map((p) => (
              <div
                key={p}
                style={{
                  border: "1px solid rgba(90,32,184,0.15)",
                  color: "rgba(26,26,46,0.7)",
                  padding: "8px 12px",
                  borderRadius: 999,
                  fontSize: 12,
                  letterSpacing: "0.08em",
                  backdropFilter: "blur(8px)",
                }}
              >
                {p}
              </div>
            ))}
          </div>
        </div>

        {/* Right — Canvas-driven signal verification */}
        <div style={{ position: "relative", width: "100%", aspectRatio: "2.2 / 1" }}>
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default SignalIntegritySection;
