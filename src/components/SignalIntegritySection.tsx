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

    const c = canvas.getContext("2d")!;
    if (!c) return;

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.width / Math.min(window.devicePixelRatio, 2);
    const H = () => canvas.height / Math.min(window.devicePixelRatio, 2);

    const LINE_COUNT = 5;

    // Color palette per line (violet → coral gradient)
    const lineColors = [
      { r: 123, g: 97, b: 255 },   // electric violet
      { r: 140, g: 80, b: 230 },   // mid violet
      { r: 180, g: 70, b: 180 },   // magenta blend
      { r: 212, g: 97, b: 107 },   // warm coral
      { r: 232, g: 150, b: 124 },  // peach
    ];

    const state = {
      time: 0,
      wobbleAmp: 1.0,
      outOpacity: 0.12,
      scanY: -10,
      scanOpacity: 0,
      warmGlow: 0,
      pulseX: -100,
      pulseOpacity: 0,
      verified: false,
      depth: 0, // 0→1 for 3D reveal
    };

    function draw() {
      const w = W();
      const h = H();
      c.clearRect(0, 0, w, h);

      const cx = w * 0.5;
      const lineSpacing = (h * 0.62) / (LINE_COUNT - 1);
      const yStart = h * 0.19;

      // ═══ DEPTH LAYERS (3D shadow planes) ═══
      // Back shadow layer — subtle depth plane
      const depthOffset = state.depth * 12;
      if (depthOffset > 0.5) {
        c.save();
        c.globalAlpha = 0.06 * state.depth;
        c.translate(depthOffset, depthOffset * 1.5);
        drawWaves(w, h, cx, lineSpacing, yStart, true);
        c.restore();

        // Mid shadow layer
        c.save();
        c.globalAlpha = 0.1 * state.depth;
        c.translate(depthOffset * 0.5, depthOffset * 0.7);
        drawWaves(w, h, cx, lineSpacing, yStart, true);
        c.restore();
      }

      // ═══ WARM GLOW ═══
      if (state.warmGlow > 0.01) {
        const g1 = c.createRadialGradient(cx, h * 0.5, 0, cx, h * 0.5, h * 0.55);
        g1.addColorStop(0, `rgba(212,97,107,${state.warmGlow * 0.4})`);
        g1.addColorStop(0.35, `rgba(180,70,180,${state.warmGlow * 0.2})`);
        g1.addColorStop(0.7, `rgba(123,97,255,${state.warmGlow * 0.1})`);
        g1.addColorStop(1, "transparent");
        c.fillStyle = g1;
        c.fillRect(0, 0, w, h);
      }

      // ═══ CENTER VERIFICATION PLANE ═══
      // Gradient column
      const planeGrad = c.createLinearGradient(cx, h * 0.02, cx, h * 0.98);
      planeGrad.addColorStop(0, `rgba(123,97,255,${0.06 + state.warmGlow * 0.12})`);
      planeGrad.addColorStop(0.5, `rgba(212,97,107,${0.08 + state.warmGlow * 0.15})`);
      planeGrad.addColorStop(1, `rgba(123,97,255,${0.04 + state.warmGlow * 0.08})`);
      c.fillStyle = planeGrad;
      c.fillRect(cx - 1.5, h * 0.03, 3, h * 0.94);

      // Flanking lines with gradient
      [-22, 22].forEach((off) => {
        c.beginPath();
        c.moveTo(cx + off, h * 0.06);
        c.lineTo(cx + off, h * 0.94);
        c.strokeStyle = `rgba(123,97,255,${0.04 + state.warmGlow * 0.04})`;
        c.lineWidth = 0.7;
        c.stroke();
      });

      // ═══ MAIN WAVES ═══
      drawWaves(w, h, cx, lineSpacing, yStart, false);

      // ═══ SCAN BAR ═══
      if (state.scanOpacity > 0.01) {
        // Wide glow
        const sg = c.createLinearGradient(cx - 120, 0, cx + 120, 0);
        sg.addColorStop(0, "transparent");
        sg.addColorStop(0.2, `rgba(123,97,255,${state.scanOpacity * 0.5})`);
        sg.addColorStop(0.5, `rgba(212,97,107,${state.scanOpacity * 0.9})`);
        sg.addColorStop(0.8, `rgba(232,150,124,${state.scanOpacity * 0.5})`);
        sg.addColorStop(1, "transparent");
        c.fillStyle = sg;
        c.fillRect(cx - 120, state.scanY - 3, 240, 6);

        // Trail
        const tg = c.createLinearGradient(0, state.scanY - 60, 0, state.scanY);
        tg.addColorStop(0, "transparent");
        tg.addColorStop(1, `rgba(212,97,107,${state.scanOpacity * 0.08})`);
        c.fillStyle = tg;
        c.fillRect(cx - 80, state.scanY - 60, 160, 60);
      }

      // ═══ PULSE ═══
      if (state.pulseOpacity > 0.01) {
        const py = h * 0.5;
        // Large outer glow
        const pg = c.createRadialGradient(state.pulseX, py, 0, state.pulseX, py, 35);
        pg.addColorStop(0, `rgba(212,97,107,${state.pulseOpacity * 0.7})`);
        pg.addColorStop(0.4, `rgba(180,70,180,${state.pulseOpacity * 0.3})`);
        pg.addColorStop(1, "transparent");
        c.fillStyle = pg;
        c.fillRect(state.pulseX - 35, py - 35, 70, 70);
        // Bright core
        c.beginPath();
        c.arc(state.pulseX, py, 4, 0, Math.PI * 2);
        c.fillStyle = `rgba(255,255,255,${state.pulseOpacity * 0.9})`;
        c.fill();
        c.beginPath();
        c.arc(state.pulseX, py, 6, 0, Math.PI * 2);
        c.fillStyle = `rgba(212,97,107,${state.pulseOpacity * 0.8})`;
        c.fill();
      }

      // ═══ LABELS ═══
      c.font = "11px monospace";
      c.letterSpacing = "3px";
      c.fillStyle = "rgba(123,97,255,0.5)";
      c.textAlign = "left";
      c.fillText("SIGNAL IN", w * 0.04, yStart - 30);

      c.fillStyle = "rgba(212,97,107,0.55)";
      c.textAlign = "right";
      c.fillText("INTEGRITY VERIFIED", w * 0.96, yStart - 30);

      c.fillStyle = `rgba(123,97,255,${state.verified ? 0.4 : 0.0})`;
      c.textAlign = "center";
      c.fillText("VERIFY", cx, h * 0.95);
    }

    function drawWaves(w: number, h: number, cx: number, lineSpacing: number, yStart: number, isShadow: boolean) {
      const leftStart = w * 0.04;
      const leftEnd = cx - 45;
      const rightStart = cx + 45;
      const rightEnd = w * 0.96;

      for (let i = 0; i < LINE_COUNT; i++) {
        const baseY = yStart + i * lineSpacing;
        const col = lineColors[i];
        const depthScale = 1 + (i * 0.08) * state.depth; // lines get slightly thicker with depth

        // ── INPUT wave ──
        c.beginPath();
        for (let x = leftStart; x <= leftEnd; x += 3) {
          const t = state.time + i * 0.8;
          const noise =
            state.wobbleAmp * (
              Math.sin(x * 0.04 + t * 1.8 + i * 1.3) * 17 +
              Math.cos(x * 0.09 + t * 2.2 + i * 0.7) * 10 +
              Math.sin(x * 0.18 + t * 1.1 + i * 2.1) * 5
            );
          const y = baseY + noise;
          if (x === leftStart) c.moveTo(x, y);
          else c.lineTo(x, y);
        }

        if (isShadow) {
          c.strokeStyle = `rgba(${col.r},${col.g},${col.b},0.12)`;
          c.lineWidth = 3.5;
        } else {
          // Gradient-like opacity: brighter near center
          c.strokeStyle = `rgba(${col.r},${col.g},${col.b},${0.55 + i * 0.04})`;
          c.lineWidth = 2.2 * depthScale;
          c.shadowColor = `rgba(${col.r},${col.g},${col.b},0.3)`;
          c.shadowBlur = 6 * state.depth;
        }
        c.lineCap = "round";
        c.lineJoin = "round";
        c.stroke();
        c.shadowBlur = 0;

        // ── OUTPUT line ──
        const microDrift = Math.sin(state.time * 0.3 + i * 1.5) * 1.5;
        c.beginPath();
        c.moveTo(rightStart, baseY + microDrift);
        c.lineTo(rightEnd, baseY + microDrift);

        if (isShadow) {
          c.strokeStyle = `rgba(${col.r},${col.g},${col.b},0.06)`;
          c.lineWidth = 2.5;
        } else {
          c.strokeStyle = `rgba(${col.r},${col.g},${col.b},${state.outOpacity})`;
          c.lineWidth = 1.8 * depthScale;
          c.shadowColor = `rgba(${col.r},${col.g},${col.b},0.2)`;
          c.shadowBlur = 4 * state.depth;
        }
        c.lineCap = "round";
        c.stroke();
        c.shadowBlur = 0;
      }
    }

    // ── Animation loop ──
    let raf: number;
    function tick() {
      state.time += 0.016;
      draw();
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    // ── Entrance ──
    gsap.set(textEl, { opacity: 0, y: 40 });
    gsap.set(canvas, { opacity: 0, y: 50 });

    ScrollTrigger.create({
      trigger: section,
      start: "top 78%",
      once: true,
      onEnter: () => {
        gsap.to(textEl, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" });
        gsap.to(canvas, { opacity: 1, y: 0, duration: 1.1, delay: 0.12, ease: "power3.out" });
        // 3D depth reveal
        gsap.to(state, { depth: 1, duration: 2.0, delay: 0.5, ease: "power2.out" });
      },
    });

    // ── Pulse runner ──
    function runPulse() {
      const w = W();
      gsap.set(state, { pulseX: w * 0.5, pulseOpacity: 0 });
      gsap.to(state, { pulseOpacity: 1, duration: 0.2, ease: "power2.out" });
      gsap.to(state, { pulseX: w * 0.92, duration: 1.6, ease: "power1.inOut" });
      gsap.to(state, { pulseOpacity: 0, duration: 0.4, delay: 1.2, ease: "power2.in" });
    }

    // ── Verification ──
    const verifyTL = gsap.timeline({ paused: true });
    verifyTL
      .to(state, { scanY: 0, scanOpacity: 1, duration: 0.01 }, 0)
      .to(state, { scanY: H(), duration: 1.3, ease: "power2.inOut" }, 0)
      .to(state, { scanOpacity: 0, duration: 0.3 }, 1.0)
      .to(state, { warmGlow: 0.9, duration: 0.5, ease: "power2.out" }, 0.1)
      .to(state, { wobbleAmp: 0.12, duration: 1.2, ease: "power2.out" }, 0.6)
      .to(state, { outOpacity: 0.55, duration: 0.8, ease: "power2.out" }, 0.8)
      .set(state, { verified: true }, 0.9)
      .add(() => runPulse(), 1.1)
      .to(state, { warmGlow: 0.3, duration: 1.0, ease: "sine.out" }, 1.5)
      .to(state, { wobbleAmp: 0.35, duration: 2.0, ease: "sine.inOut" }, 2.0);

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

        {/* Right — Canvas signal verification with 3D depth */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "2.2 / 1",
            perspective: "800px",
          }}
        >
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              transform: "rotateY(-4deg) rotateX(2deg)",
              transformStyle: "preserve-3d",
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default SignalIntegritySection;
