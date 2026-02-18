import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PILLARS = [
  "Jurisdiction Control",
  "Cryptographic Audit Trails",
  "Deployment Flexibility",
];

const PARTICLE_COUNT = 16;

const SovereigntySection = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const vaultRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  const setupAnimations = useCallback(() => {
    const svg = svgRef.current;
    if (!svg || hasAnimated.current) return;
    hasAnimated.current = true;

    const core = svg.querySelector("#lg-core") as SVGGElement;
    const gridLines = svg.querySelectorAll<SVGLineElement>(".lg-grid");
    const innerGridLines = svg.querySelectorAll<SVGLineElement>(".lg-inner-grid");
    const cornerAnchors = svg.querySelectorAll<SVGGElement>(".lg-corner");
    const orbitDots = svg.querySelectorAll<SVGCircleElement>(".lg-orbit-dot");
    const sealGlow = svg.querySelector("#lg-seal-glow") as SVGRectElement;
    const lockIcon = svg.querySelector("#lg-lock") as SVGGElement;
    const particles = svg.querySelectorAll<SVGCircleElement>(".lg-particle");
    const ambientGlow = svg.querySelector("#lg-ambient") as SVGCircleElement;

    /* ── Initial state ── */
    gsap.set(core, { opacity: 0, scale: 0.8, transformOrigin: "300px 300px" });
    gsap.set(gridLines, { opacity: 0 });
    gsap.set(innerGridLines, { opacity: 0 });
    gsap.set(cornerAnchors, { opacity: 0 });
    gsap.set(orbitDots, { opacity: 0 });
    gsap.set(sealGlow, { opacity: 0 });
    gsap.set(lockIcon, { opacity: 0, scale: 0, transformOrigin: "300px 300px" });
    gsap.set(particles, { opacity: 0 });
    gsap.set(ambientGlow, { opacity: 0.15 });

    /* ══════════ INTRO (plays once) — grid + core fade in ══════════ */
    const intro = gsap.timeline({ delay: 0.2 });

    intro.to(ambientGlow, { opacity: 0.35, duration: 1, ease: "power2.out" });
    intro.to(gridLines, {
      opacity: 0.07,
      duration: 1.2,
      stagger: { each: 0.02, from: "center" },
      ease: "power2.out",
    }, "-=0.8");

    intro.to(core, {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: "power3.out",
    }, "-=0.3");
    intro.to(core, { scale: 1.08, duration: 0.25, ease: "power2.in" })
      .to(core, { scale: 1, duration: 0.4, ease: "power3.out" });

    intro.to(innerGridLines, {
      opacity: 0.035,
      duration: 0.8,
      stagger: 0.015,
      ease: "power2.out",
    }, "-=0.4");

    /* ══════════ ORBIT DOTS — continuous loop along perimeter ══════════ */
    // Each dot travels around the rectangle path: top→right→bottom→left
    // Perimeter path waypoints (clockwise from top-left)
    const pathPoints = [
      { x: 130, y: 130 }, { x: 470, y: 130 }, // top edge
      { x: 470, y: 470 }, // right edge
      { x: 130, y: 470 }, // bottom edge
      { x: 130, y: 130 }, // left edge (back to start)
    ];

    // Total perimeter = 4 * 340 = 1360
    const edgeLengths = [340, 340, 340, 340];
    const totalPerimeter = 1360;

    orbitDots.forEach((dot, i) => {
      const offset = (i / orbitDots.length) * totalPerimeter;
      const duration = 8; // seconds for full loop

      // Create a repeating tween using motionPath-like manual approach
      const tl = gsap.timeline({ repeat: -1, delay: 0.5 });

      // We'll use an object to track progress around the perimeter
      const proxy = { progress: 0 };
      tl.to(proxy, {
        progress: 1,
        duration: duration,
        ease: "none",
        onUpdate: () => {
          // Calculate position along perimeter
          let dist = ((proxy.progress * totalPerimeter) + offset) % totalPerimeter;
          let accumulated = 0;
          for (let edge = 0; edge < 4; edge++) {
            if (dist <= accumulated + edgeLengths[edge]) {
              const t = (dist - accumulated) / edgeLengths[edge];
              const x1 = pathPoints[edge].x;
              const y1 = pathPoints[edge].y;
              const x2 = pathPoints[edge + 1].x;
              const y2 = pathPoints[edge + 1].y;
              gsap.set(dot, { attr: { cx: x1 + (x2 - x1) * t, cy: y1 + (y2 - y1) * t } });
              break;
            }
            accumulated += edgeLengths[edge];
          }
        },
      });
    });

    // Fade dots in after intro
    gsap.to(orbitDots, { opacity: 1, duration: 1, delay: 0.3 });

    /* ══════════ LOOP — corners, particles, lock cycle ══════════ */
    const loop = gsap.timeline({ repeat: -1, repeatDelay: 1.5, delay: 0 });

    // Reset state at start of each cycle
    loop.set(cornerAnchors, { opacity: 0 });
    loop.set(lockIcon, { opacity: 0, scale: 0 });
    loop.set(sealGlow, { opacity: 0 });
    loop.set(particles, { opacity: 0, attr: { cx: 300, cy: 300 } });

    // Corner anchors snap in
    const cornerOffsets = [
      { x: -50, y: -50 }, { x: 50, y: -50 },
      { x: 50, y: 50 }, { x: -50, y: 50 },
    ];
    loop.set(cornerAnchors, { x: (i: number) => cornerOffsets[i].x, y: (i: number) => cornerOffsets[i].y });
    loop.to(cornerAnchors, {
      opacity: 1, x: 0, y: 0,
      duration: 0.45, stagger: 0.06, ease: "power3.out",
    }, "+=0.5");

    // Lock pulse — particles fly out
    loop.to(sealGlow, { opacity: 0.45, duration: 0.3, ease: "power2.in" });
    loop.to(particles, { opacity: 1, duration: 0.1 }, "-=0.2");

    particles.forEach((p) => {
      const tx = parseFloat(p.getAttribute("data-tx") || "0");
      const ty = parseFloat(p.getAttribute("data-ty") || "0");
      loop.to(p, { attr: { cx: tx, cy: ty }, duration: 0.4, ease: "power3.out" }, "<");
    });

    loop.to(particles, { opacity: 0, duration: 0.6, ease: "power2.out" }, "+=0.1");

    // Lock icon
    loop.to(lockIcon, {
      opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2)",
    }, "-=0.5");

    loop.to(sealGlow, { opacity: 0, duration: 1.0, ease: "power2.out" }, "-=0.3");

    // Grid brightens slightly when locked
    loop.to(gridLines, { opacity: 0.12, duration: 0.6, ease: "power2.out" }, "-=0.8");

    // Hold the locked state
    loop.to({}, { duration: 2.5 });

    // Fade out only lock icon & corners
    loop.to(lockIcon, { opacity: 0, duration: 0.6, ease: "power2.inOut" });
    loop.to(cornerAnchors, { opacity: 0, duration: 0.6, ease: "power2.inOut" }, "-=0.4");
    loop.to(particles, { opacity: 0, duration: 0.3 }, "-=0.6");
    loop.to(gridLines, { opacity: 0.07, duration: 0.6, ease: "power2.inOut" }, "-=0.3");

    // Start loop after intro finishes
    intro.call(() => loop.play(), [], "+=0.2");

    // Core stays static — no breathing/movement

    // Grid shimmer
    gridLines.forEach((line, i) => {
      gsap.to(line, {
        opacity: gsap.utils.random(0.04, 0.1),
        duration: gsap.utils.random(3, 5),
        yoyo: true, repeat: -1, delay: i * 0.08, ease: "sine.inOut",
      });
    });

    return () => {
      intro.kill();
      loop.kill();
      gsap.killTweensOf([core, sealGlow, lockIcon, ambientGlow]);
      gridLines.forEach((l) => gsap.killTweensOf(l));
      innerGridLines.forEach((l) => gsap.killTweensOf(l));
      cornerAnchors.forEach((c) => gsap.killTweensOf(c));
      orbitDots.forEach((d) => gsap.killTweensOf(d));
      particles.forEach((p) => gsap.killTweensOf(p));
    };
  }, []);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const textEl = textRef.current;
    const vaultEl = vaultRef.current;
    const section = sectionRef.current;

    if (textEl && vaultEl && section) {
      gsap.set(textEl, { opacity: 0, y: 40 });
      gsap.set(vaultEl, { opacity: 0, y: 60, scale: 0.95 });

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top 75%",
        once: true,
        onEnter: () => {
          gsap.to(textEl, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" });
          gsap.to(vaultEl, {
            opacity: 1, y: 0, scale: 1, duration: 1.1, delay: 0.2, ease: "power3.out",
            onComplete: () => {
              cleanup = setupAnimations();
            },
          });
        },
      });

      return () => {
        cleanup?.();
        st.kill();
      };
    }

    return () => cleanup?.();
  }, [setupAnimations]);

  /* Grid data */
  const gridLinesData: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 0; i <= 10; i++) {
    const pos = 100 + i * 40;
    gridLinesData.push({ x1: pos, y1: 100, x2: pos, y2: 500 });
    gridLinesData.push({ x1: 100, y1: pos, x2: 500, y2: pos });
  }

  const innerGridData: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 0; i <= 8; i++) {
    const pos = 140 + i * 40;
    innerGridData.push({ x1: pos, y1: 130, x2: pos, y2: 470 });
    innerGridData.push({ x1: 130, y1: pos, x2: 470, y2: pos });
  }

  const corners = [
    { x: 130, y: 130 }, { x: 470, y: 130 },
    { x: 470, y: 470 }, { x: 130, y: 470 },
  ];
  const bracketLen = 18;

  const ORBIT_DOT_COUNT = 8;
  const orbitDotColors = [
    "#C084FC", "#D4616B", "#7B61FF", "#E8937C",
    "#C084FC", "#D4616B", "#7B61FF", "#F2C1AE",
  ];

  const particleData = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
    const perimDist = 170;
    const tx = 300 + Math.cos(angle) * perimDist;
    const ty = 300 + Math.sin(angle) * perimDist;
    const clampedX = Math.max(130, Math.min(470, tx));
    const clampedY = Math.max(130, Math.min(470, ty));
    return { cx: 300, cy: 300, tx: clampedX, ty: clampedY };
  });

  /* Color palette for particles — warm coral, cyan, gold, soft violet */
  const particleColors = [
    "#D4616B", "#C084FC", "#7B61FF", "#E8937C",
    "#C084FC", "#D4616B", "#7B61FF", "#F2C1AE",
    "#D4616B", "#C084FC", "#E8937C", "#7B61FF",
    "#C084FC", "#D4616B", "#F2C1AE", "#7B61FF",
  ];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        padding: "clamp(64px, 7vw, 110px) 0",
        background: "radial-gradient(circle at 50% 40%, #241034 0%, #0B0613 70%)",
        color: "#EDE7F6",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Noise overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />

      <div
        className="relative z-10 mx-auto w-full grid items-center"
        style={{
          maxWidth: "min(1280px, 94vw)",
          gridTemplateColumns: "0.45fr 1fr",
          gap: "clamp(24px, 4vw, 80px)",
        }}
      >
        {/* Left — Text */}
        <div ref={textRef}>
          <div
            className="font-mono uppercase"
            style={{ fontSize: 12, letterSpacing: "0.22em", opacity: 0.5, marginBottom: 20 }}
          >
            [ TRUST & SOVEREIGNTY ]
          </div>

          <h2
            style={{
              fontSize: "clamp(44px, 5.2vw, 84px)",
              fontWeight: 800, lineHeight: 0.95,
              margin: "0 0 24px 0", letterSpacing: "-0.02em",
            }}
          >
            Sovereign by design.
          </h2>

          <p
            style={{
              fontSize: "clamp(15px, 1.25vw, 18px)",
              lineHeight: 1.65, opacity: 0.72,
              maxWidth: "46ch", margin: "0 0 40px 0",
            }}
          >
            Every decision, signal, and action remains jurisdictionally anchored.
            Policy enforcement, auditability, and storage governance operate
            natively — not as overlays.
          </p>

          <div className="flex flex-wrap gap-3">
            {PILLARS.map((p) => (
              <div
                key={p}
                style={{
                  padding: "10px 20px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 999, fontSize: 13,
                  letterSpacing: "0.04em", opacity: 0.8,
                  backdropFilter: "blur(4px)",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                {p}
              </div>
            ))}
          </div>
        </div>

        {/* Right — Locking Grid */}
        <div
          ref={vaultRef}
          style={{ aspectRatio: "1", maxWidth: 700, width: "100%", justifySelf: "end" }}
        >
          <svg
            ref={svgRef}
            className="w-full h-full block"
            viewBox="0 0 600 600"
            fill="none"
          >
            <defs>
              <radialGradient id="lgAmbient" cx="50%" cy="50%" r="40%">
                <stop offset="0%" stopColor="#7B61FF" stopOpacity={0.2} />
                <stop offset="50%" stopColor="#1A0A3E" stopOpacity={0.12} />
                <stop offset="100%" stopColor="#0B0613" stopOpacity={0} />
              </radialGradient>
              <radialGradient id="lgCoreGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.12)" stopOpacity={1} />
                <stop offset="40%" stopColor="#7B61FF" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#1A0630" stopOpacity={0.85} />
              </radialGradient>
              <filter id="lgGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="lgSealFilter" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="lgPeriGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C084FC" stopOpacity={0.7} />
                <stop offset="50%" stopColor="#7B61FF" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#D4616B" stopOpacity={0.7} />
              </linearGradient>
            </defs>

            {/* Ambient glow */}
            <circle id="lg-ambient" cx="300" cy="300" r="180" fill="url(#lgAmbient)" />

            {/* Outer grid — subtle warm-cool mix */}
            {gridLinesData.map((l, i) => (
              <line
                key={`g-${i}`}
                className="lg-grid"
                x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
                stroke={i % 3 === 0 ? "rgba(123,97,255,0.06)" : i % 3 === 1 ? "rgba(192,132,252,0.06)" : "rgba(212,97,107,0.05)"}
                strokeWidth={0.4}
              />
            ))}

            {/* Inner grid */}
            {innerGridData.map((l, i) => (
              <line
                key={`ig-${i}`}
                className="lg-inner-grid"
                x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
                stroke={i % 2 === 0 ? "rgba(123,97,255,0.04)" : "rgba(192,132,252,0.04)"}
                strokeWidth={0.3}
              />
            ))}

            {/* Orbit dots — circles traveling along perimeter */}
            {Array.from({ length: ORBIT_DOT_COUNT }, (_, i) => (
              <circle
                key={`od-${i}`}
                className="lg-orbit-dot"
                cx={130}
                cy={130}
                r={3}
                fill={orbitDotColors[i]}
                filter="url(#lgGlow)"
              />
            ))}

            {/* Seal glow — warm coral */}
            <rect
              id="lg-seal-glow"
              x="125" y="125"
              width="350" height="350"
              rx="2"
              fill="none"
              stroke="#D4616B"
              strokeWidth={2.5}
              opacity={0.5}
              filter="url(#lgSealFilter)"
            />

            {/* Particles — multi-colored */}
            {particleData.map((p, i) => (
              <circle
                key={`part-${i}`}
                className="lg-particle"
                cx={p.cx} cy={p.cy}
                r={1.5}
                fill={particleColors[i]}
                data-tx={p.tx}
                data-ty={p.ty}
              />
            ))}

            {/* Corner brackets — alternating cyan and coral */}
            {corners.map((c, i) => {
              const dx = i === 0 || i === 3 ? 1 : -1;
              const dy = i === 0 || i === 1 ? 1 : -1;
              const color = i % 2 === 0 ? "#C084FC" : "#D4616B";

              return (
                <g key={`c-${i}`} className="lg-corner" style={{ transformOrigin: `${c.x}px ${c.y}px` }}>
                  <line
                    x1={c.x} y1={c.y}
                    x2={c.x + bracketLen * dx} y2={c.y}
                    stroke={color} strokeWidth={1.2} strokeLinecap="square" opacity={0.85}
                  />
                  <line
                    x1={c.x} y1={c.y}
                    x2={c.x} y2={c.y + bracketLen * dy}
                    stroke={color} strokeWidth={1.2} strokeLinecap="square" opacity={0.85}
                  />
                  <circle
                    cx={c.x} cy={c.y} r={2.5}
                    fill={color} filter="url(#lgGlow)"
                  />
                </g>
              );
            })}

            {/* Core block — coral-to-violet gradient */}
            <g id="lg-core">
              <rect
                x="268" y="268" width="64" height="64" rx="3"
                fill="url(#lgCoreGrad)"
                opacity={0.85}
                filter="url(#lgGlow)"
              />
              <rect
                x="268" y="268" width="64" height="64" rx="3"
                fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={0.8}
              />
              <rect
                x="280" y="280" width="40" height="40" rx="2"
                fill="rgba(255,255,255,0.06)"
              />
              <circle cx="300" cy="300" r="5" fill="rgba(255,255,255,0.45)" />
            </g>

            {/* Lock icon */}
            <g id="lg-lock" style={{ transformOrigin: "300px 300px" }}>
              <rect
                x="291" y="298" width="18" height="13" rx="2"
                fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth={1}
              />
              <path
                d="M294 298 V293 A6 6 0 0 1 306 293 V298"
                fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth={1} strokeLinecap="round"
              />
              <circle cx="300" cy="304" r="1.5" fill="rgba(255,255,255,0.45)" />
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default SovereigntySection;
