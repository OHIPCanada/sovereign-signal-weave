import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";

/* ── Signal pill data ── */
const SIGNALS = [
  { x: 120, y: 120, w: 90, stroke: "rgba(110,59,255,0.18)", fill: "rgba(110,59,255,0.75)" },
  { x: 190, y: 180, w: 120, stroke: "rgba(212,97,107,0.16)", fill: "rgba(212,97,107,0.75)" },
  { x: 150, y: 240, w: 140, stroke: "rgba(110,59,255,0.16)", fill: "rgba(110,59,255,0.72)" },
  { x: 260, y: 290, w: 100, stroke: "rgba(232,150,124,0.18)", fill: "rgba(232,150,124,0.75)" },
  { x: 110, y: 330, w: 130, stroke: "rgba(110,59,255,0.14)", fill: "rgba(110,59,255,0.65)" },
  { x: 220, y: 380, w: 110, stroke: "rgba(212,97,107,0.14)", fill: "rgba(212,97,107,0.7)" },
  { x: 320, y: 130, w: 100, stroke: "rgba(110,59,255,0.14)", fill: "rgba(110,59,255,0.6)" },
  { x: 330, y: 210, w: 140, stroke: "rgba(242,193,174,0.18)", fill: "rgba(242,193,174,0.9)" },
  { x: 300, y: 360, w: 120, stroke: "rgba(110,59,255,0.14)", fill: "rgba(110,59,255,0.62)" },
  { x: 160, y: 90, w: 80, stroke: "rgba(212,97,107,0.16)", fill: "rgba(212,97,107,0.68)" },
  { x: 240, y: 150, w: 95, stroke: "rgba(110,59,255,0.12)", fill: "rgba(110,59,255,0.58)" },
  { x: 100, y: 420, w: 115, stroke: "rgba(232,150,124,0.14)", fill: "rgba(232,150,124,0.65)" },
  { x: 350, y: 310, w: 85, stroke: "rgba(110,59,255,0.16)", fill: "rgba(110,59,255,0.7)" },
  { x: 280, y: 440, w: 105, stroke: "rgba(212,97,107,0.12)", fill: "rgba(212,97,107,0.6)" },
  { x: 180, y: 460, w: 130, stroke: "rgba(110,59,255,0.14)", fill: "rgba(110,59,255,0.55)" },
  { x: 370, y: 400, w: 75, stroke: "rgba(232,150,124,0.16)", fill: "rgba(232,150,124,0.72)" },
  { x: 130, y: 60, w: 100, stroke: "rgba(110,59,255,0.12)", fill: "rgba(110,59,255,0.5)" },
  { x: 310, y: 80, w: 110, stroke: "rgba(212,97,107,0.14)", fill: "rgba(212,97,107,0.62)" },
];

const TRACES = [
  { d: "M180 120 C 340 80, 430 120, 600 260", stroke: "rgba(110,59,255,0.35)" },
  { d: "M220 300 C 360 340, 480 320, 600 260", stroke: "rgba(212,97,107,0.28)" },
  { d: "M260 420 C 420 430, 520 360, 600 260", stroke: "rgba(110,59,255,0.25)" },
  { d: "M360 220 C 460 200, 520 220, 600 260", stroke: "rgba(232,150,124,0.22)" },
  { d: "M140 200 C 300 160, 440 200, 600 260", stroke: "rgba(110,59,255,0.20)" },
  { d: "M300 400 C 440 380, 530 330, 600 260", stroke: "rgba(212,97,107,0.18)" },
];

const CHECKPOINTS = [760, 820, 900, 980, 1060];

const InterfaceSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const hasTriggered = useRef(false);

  const setupAnimations = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const sigs = svg.querySelectorAll<SVGGElement>(".sig");
    const traces = svg.querySelector("#traces") as SVGGElement;
    const tracePaths = svg.querySelectorAll<SVGPathElement>("#traces path");
    const timeline = svg.querySelector("#timeline") as SVGGElement;
    const pulse = svg.querySelector("#pulse") as SVGCircleElement;
    const lens = svg.querySelector("#lens") as SVGGElement;

    // Setup trace dash
    tracePaths.forEach((p) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = `6 10`;
      p.style.strokeDashoffset = `${len}`;
    });

    // 1) Idle drift loop
    const drift = gsap.timeline({ repeat: -1, yoyo: true });
    sigs.forEach((el, i) => {
      drift.to(
        el,
        {
          x: gsap.utils.random(-12, 12),
          y: gsap.utils.random(-10, 10),
          duration: gsap.utils.random(2.8, 4.4),
          ease: "sine.inOut",
        },
        i * 0.06
      );
    });

    // Lens breathing
    gsap.to(lens, {
      scale: 1.04,
      transformOrigin: "600px 260px",
      yoyo: true,
      repeat: -1,
      duration: 2.8,
      ease: "sine.inOut",
    });

    // 2) Transform timeline (triggered on scroll)
    const transformTL = gsap.timeline({ paused: true });
    const lensFlash = svg.querySelector("#lensFlash");

    // Reveal traces
    transformTL.to(traces, { opacity: 1, duration: 0.6, ease: "power2.out" }, 0.0);

    // Draw traces — brighter during convergence
    tracePaths.forEach((p, idx) => {
      transformTL.to(p, {
        strokeDashoffset: 0,
        duration: 0.9 + idx * 0.12,
        ease: "expo.out",
      }, 0.1);
    });
    transformTL.to(tracePaths, {
      attr: { "stroke-width": 3.5 },
      opacity: 1,
      duration: 0.5,
      ease: "power2.in",
    }, 0.6);

    // Move signals toward lens center (600, 260)
    sigs.forEach((el, i) => {
      const targetX = 600 - SIGNALS[i].x + gsap.utils.random(-30, 30);
      const targetY = 260 - SIGNALS[i].y + gsap.utils.random(-20, 20);
      transformTL.to(el, {
        x: targetX,
        y: targetY,
        opacity: 0,
        duration: 1.2,
        ease: "power3.inOut",
      }, 0.2 + i * 0.03);
    });

    // Lens flash — dramatic burst when signals converge
    if (lensFlash) {
      transformTL.to(lensFlash, {
        attr: { r: 120 },
        fill: "rgba(110,59,255,0.45)",
        duration: 0.4,
        ease: "power2.in",
      }, 0.8);
      transformTL.to(lensFlash, {
        attr: { r: 200 },
        fill: "rgba(110,59,255,0.0)",
        duration: 0.7,
        ease: "power2.out",
      }, 1.2);
    }

    // Lens scale pulse on convergence
    if (lens) {
      transformTL.to(lens, {
        scale: 1.15,
        transformOrigin: "600px 260px",
        duration: 0.4,
        ease: "power2.in",
      }, 0.8);
      transformTL.to(lens, {
        scale: 1.0,
        transformOrigin: "600px 260px",
        duration: 0.6,
        ease: "elastic.out(1, 0.5)",
      }, 1.2);
    }

    // Bring in harmonized timeline
    transformTL.to(timeline, { opacity: 1, duration: 0.8, ease: "power2.out" }, 1.4);

    // Soften traces back down
    transformTL.to(traces, { opacity: 0.2, duration: 0.8, ease: "power2.out" }, 1.5);
    transformTL.to(tracePaths, { attr: { "stroke-width": 2 }, duration: 0.6 }, 1.5);

    // 3) Post-transform pulse loop
    const pulseTL = gsap.timeline({ repeat: -1, paused: true });
    pulseTL
      .set(pulse, { attr: { cx: 720, r: 10 }, opacity: 0.9 })
      .to(pulse, { attr: { cx: 1090 }, duration: 2.8, ease: "sine.inOut" })
      .to(pulse, { opacity: 0.0, duration: 0.15 }, ">-0.1")
      .set(pulse, { opacity: 0.9, attr: { cx: 720 } });

    // --- TRIGGER LOGIC: scroll guard + delayed convergence ---
    const stageEl = stageRef.current;
    if (!stageEl || hasTriggered.current) return;

    let started = false;
    let enteredAt = 0;
    const MIN_FRAGMENTED_MS = 3200;
    let userHasScrolled = false;

    const onFirstScroll = () => { userHasScrolled = true; };
    window.addEventListener("scroll", onFirstScroll, { once: true });

    function startConvergence() {
      if (started) return;
      started = true;
      hasTriggered.current = true;

      // Slow drift instead of killing it instantly
      gsap.to(drift, { timeScale: 0.25, duration: 0.8, ease: "sine.out" });

      transformTL.play(0);

      // Pause drift after signals have converged (~2.1s)
      gsap.delayedCall(2.1, () => drift.pause());

      // Start pulse after transform completes
      transformTL.eventCallback("onComplete", () => {
        pulseTL.play(0);
      });
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting || started) return;

          // Don't auto-trigger if page loads at this section
          if (!userHasScrolled) return;

          // Record first visible moment
          if (!enteredAt) enteredAt = Date.now();

          // Ensure fragmented state is visible for MIN_FRAGMENTED_MS
          const elapsed = Date.now() - enteredAt;
          const remaining = Math.max(0, (MIN_FRAGMENTED_MS - elapsed) / 1000);

          gsap.delayedCall(remaining, startConvergence);
        });
      },
      { threshold: 0.65, rootMargin: "0px 0px -10% 0px" }
    );

    io.observe(stageEl);

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onFirstScroll);
      drift.kill();
      transformTL.kill();
      pulseTL.kill();
    };
  }, []);

  useEffect(() => {
    const cleanup = setupAnimations();
    return () => cleanup?.();
  }, [setupAnimations]);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative overflow-hidden"
      style={{
        padding: "clamp(64px, 8vw, 120px) 0",
        background: `
          radial-gradient(1100px 700px at 20% 20%, rgba(110,59,255,0.18), transparent 55%),
          radial-gradient(900px 600px at 80% 70%, rgba(232,150,124,0.20), transparent 60%),
          linear-gradient(180deg, #FBF7FF 0%, #FFF7F1 55%, #FBF7FF 100%)
        `,
        color: "#140A2A",
      }}
    >
      <div
        className="relative z-10 mx-auto"
        style={{ width: "min(1200px, 92vw)" }}
      >
        {/* Header */}
        <div className="mb-7">
          <div
            className="font-mono uppercase"
            style={{
              fontSize: 12,
              letterSpacing: "0.22em",
              opacity: 0.65,
              marginBottom: 14,
            }}
          >
            [ APPLIED INTELLIGENCE ]
          </div>
          <h2
            style={{
              fontSize: "clamp(44px, 5vw, 72px)",
              fontWeight: 900,
              lineHeight: 1.02,
              margin: "0 0 14px 0",
              letterSpacing: "-0.02em",
            }}
          >
            Where intelligence meets care delivery.
          </h2>
          <p
            style={{
              fontSize: 18,
              lineHeight: 1.5,
              opacity: 0.78,
              maxWidth: "58ch",
              margin: 0,
            }}
          >
            DocG AI integrates directly into clinical operations — without
            replacing systems, without adding friction. It turns fragmented
            signals into coordinated action.
          </p>
        </div>

        {/* Transformation Stage */}
        <div
          ref={stageRef}
          className="relative overflow-hidden"
          style={{
            borderRadius: 28,
            background: "rgba(255,255,255,0.30)",
            border: "1px solid rgba(20,10,42,0.10)",
            boxShadow: "0 20px 60px rgba(20,10,42,0.12)",
          }}
        >
          {/* Stage labels */}
          <div
            className="absolute flex justify-between pointer-events-none z-10"
            style={{
              top: 18,
              left: 22,
              right: 22,
              fontSize: 11,
              letterSpacing: "0.28em",
              textTransform: "uppercase" as const,
              opacity: 0.55,
            }}
          >
            <span>FRAGMENTED</span>
            <span>CONVERGENCE</span>
            <span>HARMONIZED</span>
          </div>

          {/* SVG Stage */}
          <svg
            ref={svgRef}
            className="w-full block"
            viewBox="0 0 1200 520"
            fill="none"
            style={{ height: "auto" }}
          >
            <defs>
              {/* Glow filter */}
              <filter id="s7glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feColorMatrix
                  in="blur"
                  type="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.9 0"
                  result="glow"
                />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Intense flash filter */}
              <filter id="s7flash" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="18" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Warm lens gradient */}
              <radialGradient id="lensWarm" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="#F2C1AE" stopOpacity={0.85} />
                <stop offset="45%" stopColor="#E8967C" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#D4616B" stopOpacity={0} />
              </radialGradient>

              {/* Violet stroke gradient */}
              <linearGradient id="violetStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#6E3BFF" stopOpacity={0} />
                <stop offset="35%" stopColor="#6E3BFF" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#6E3BFF" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Background wash */}
            <rect x="24" y="24" width="1152" height="472" rx="28" fill="rgba(255,255,255,0.40)" />
            <rect x="24" y="24" width="1152" height="472" rx="28" fill="none" stroke="rgba(20,10,42,0.10)" />

            {/* Warm glow anchors */}
            <circle cx="230" cy="120" r="180" fill="url(#lensWarm)" opacity={0.35} />
            <circle cx="980" cy="380" r="220" fill="url(#lensWarm)" opacity={0.22} />

            {/* Central cortex lens */}
            <g id="lens" filter="url(#s7glow)">
              <circle cx="600" cy="260" r="54" fill="url(#lensWarm)" opacity={0.9} />
              <circle cx="600" cy="260" r="34" fill="rgba(110,59,255,0.12)" />
              <circle cx="600" cy="260" r="18" fill="rgba(110,59,255,0.55)" />
              <circle cx="600" cy="260" r="72" fill="none" stroke="rgba(110,59,255,0.18)" strokeWidth={2} />
              <circle cx="600" cy="260" r="92" fill="none" stroke="rgba(110,59,255,0.10)" strokeWidth={2} />
            </g>

            {/* Lens flash (animated during convergence) */}
            <circle id="lensFlash" cx="600" cy="260" r="30" fill="rgba(110,59,255,0.0)" filter="url(#s7flash)" />

            {/* Dashed traces (drawn during convergence) */}
            <g id="traces" opacity={0}>
              {TRACES.map((t, i) => (
                <path key={i} d={t.d} stroke={t.stroke} strokeWidth={2} strokeDasharray="6 10" fill="none" />
              ))}
            </g>

            {/* Harmonized timeline */}
            <g id="timeline" opacity={0}>
              <path d="M720 260 H 1090" stroke="url(#violetStroke)" strokeWidth={3} strokeLinecap="round" fill="none" />
              <g filter="url(#s7glow)">
                {CHECKPOINTS.map((cx, i) => (
                  <circle
                    key={i}
                    className="ck"
                    cx={cx}
                    cy={260}
                    r={7}
                    fill={i === CHECKPOINTS.length - 1 ? "rgba(212,97,107,0.85)" : "rgba(110,59,255,0.75)"}
                  />
                ))}
              </g>
              {/* Traveling pulse */}
              <circle id="pulse" cx={720} cy={260} r={10} fill="rgba(242,193,174,0.9)" filter="url(#s7glow)" />
            </g>

            {/* Signal pills (fragmented state) */}
            <g id="signals" filter="url(#s7glow)">
              {SIGNALS.map((s, i) => (
                <g key={i} className="sig" transform={`translate(${s.x} ${s.y})`}>
                  <rect rx={10} width={s.w} height={20} fill="rgba(20,10,42,0.06)" stroke={s.stroke} />
                  <circle cx={14} cy={10} r={5} fill={s.fill} />
                </g>
              ))}
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default InterfaceSection;
