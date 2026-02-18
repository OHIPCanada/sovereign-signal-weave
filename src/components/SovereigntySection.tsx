import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PILLARS = [
  "Jurisdiction Control",
  "Cryptographic Audit Trails",
  "Deployment Flexibility",
];

/* Particle data — micro particles that hit the perimeter and stop */
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
    const perimeterSegments = svg.querySelectorAll<SVGLineElement>(".lg-peri-seg");
    const sealGlow = svg.querySelector("#lg-seal-glow") as SVGRectElement;
    const lockIcon = svg.querySelector("#lg-lock") as SVGGElement;
    const particles = svg.querySelectorAll<SVGCircleElement>(".lg-particle");
    const ambientGlow = svg.querySelector("#lg-ambient") as SVGCircleElement;

    const tl = gsap.timeline({ delay: 0.2 });

    /* ── Initial state: everything hidden except faint ambient ── */
    gsap.set(core, { opacity: 0, scale: 0.8, transformOrigin: "300px 300px" });
    gsap.set(gridLines, { opacity: 0 });
    gsap.set(innerGridLines, { opacity: 0 });
    gsap.set(cornerAnchors, { opacity: 0 });
    gsap.set(perimeterSegments, { drawSVG: "0%", opacity: 0 });
    gsap.set(sealGlow, { opacity: 0 });
    gsap.set(lockIcon, { opacity: 0, scale: 0, transformOrigin: "300px 300px" });
    gsap.set(particles, { opacity: 0 });
    gsap.set(ambientGlow, { opacity: 0.15 });

    /* ══════════ Stage 1 — Empty space: faint grid + soft glow ══════════ */
    tl.to(ambientGlow, { opacity: 0.3, duration: 1, ease: "power2.out" });
    tl.to(gridLines, {
      opacity: 0.06,
      duration: 1.2,
      stagger: { each: 0.02, from: "center" },
      ease: "power2.out",
    }, "-=0.8");

    /* ══════════ Stage 2 — Core appears: soft fade + pulse ══════════ */
    tl.to(core, {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: "power3.out",
    }, "-=0.3");
    // Single arrival pulse
    tl.to(core, {
      scale: 1.08,
      duration: 0.25,
      ease: "power2.in",
    }).to(core, {
      scale: 1,
      duration: 0.4,
      ease: "power3.out",
    });

    /* ══════════ Stage 3 — Perimeter lines draw in (sequential edges) ══════════ */
    // Top: left to right
    tl.to(perimeterSegments[0], {
      opacity: 1,
      attr: { "stroke-dashoffset": 0 },
      duration: 0.5,
      ease: "power3.out",
    });
    // Right: top to bottom
    tl.to(perimeterSegments[1], {
      opacity: 1,
      attr: { "stroke-dashoffset": 0 },
      duration: 0.5,
      ease: "power3.out",
    }, "-=0.1");
    // Bottom: right to left
    tl.to(perimeterSegments[2], {
      opacity: 1,
      attr: { "stroke-dashoffset": 0 },
      duration: 0.5,
      ease: "power3.out",
    }, "-=0.1");
    // Left: bottom to top — closes the loop
    tl.to(perimeterSegments[3], {
      opacity: 1,
      attr: { "stroke-dashoffset": 0 },
      duration: 0.5,
      ease: "power3.out",
    }, "-=0.1");

    // Inner grid fades in subtly after frame is built
    tl.to(innerGridLines, {
      opacity: 0.035,
      duration: 0.8,
      stagger: 0.015,
      ease: "power2.out",
    }, "-=0.3");

    /* ══════════ Stage 4 — Corner nodes snap in from off-screen ══════════ */
    const cornerOffsets = [
      { x: -60, y: -60 },
      { x: 60, y: -60 },
      { x: 60, y: 60 },
      { x: -60, y: 60 },
    ];
    cornerAnchors.forEach((c, i) => {
      gsap.set(c, { x: cornerOffsets[i].x, y: cornerOffsets[i].y });
    });

    tl.to(cornerAnchors, {
      opacity: 1,
      x: 0,
      y: 0,
      duration: 0.45,
      stagger: 0.06,
      ease: "power3.out",
    });

    /* ══════════ Stage 5 — Lock pulse: center emits glow wave + particles hit border ══════════ */
    tl.to(sealGlow, {
      opacity: 0.5,
      duration: 0.3,
      ease: "power2.in",
    });

    // Particles fly outward and stop at perimeter
    tl.to(particles, {
      opacity: 1,
      duration: 0.1,
    }, "-=0.2");

    particles.forEach((p) => {
      const tx = parseFloat(p.getAttribute("data-tx") || "0");
      const ty = parseFloat(p.getAttribute("data-ty") || "0");
      tl.to(p, {
        attr: { cx: tx, cy: ty },
        duration: 0.4,
        ease: "power3.out",
      }, "<");
    });

    // Particles fade after hitting border
    tl.to(particles, {
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
    }, "+=0.1");

    // Lock icon appears
    tl.to(lockIcon, {
      opacity: 1,
      scale: 1,
      duration: 0.35,
      ease: "back.out(2)",
    }, "-=0.5");

    // Seal glow fades
    tl.to(sealGlow, {
      opacity: 0,
      duration: 1.0,
      ease: "power2.out",
    }, "-=0.3");

    // Grid brightens slightly — system engaged
    tl.to(gridLines, {
      opacity: 0.1,
      duration: 0.6,
      ease: "power2.out",
    }, "-=0.8");

    /* ══════════ Stage 6 — Subtle idle: breathing glow + micro shimmer ══════════ */
    tl.call(() => {
      // Very slow core breathing
      gsap.to(core, {
        scale: 1.02,
        transformOrigin: "300px 300px",
        duration: 4,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });

      // Micro shimmer on border segments
      perimeterSegments.forEach((seg, i) => {
        gsap.to(seg, {
          opacity: gsap.utils.random(0.5, 0.9),
          duration: gsap.utils.random(2.5, 4),
          yoyo: true,
          repeat: -1,
          delay: i * 0.6,
          ease: "sine.inOut",
        });
      });

      // Grid shimmer — barely perceptible
      gridLines.forEach((line, i) => {
        gsap.to(line, {
          opacity: gsap.utils.random(0.04, 0.12),
          duration: gsap.utils.random(3, 6),
          yoyo: true,
          repeat: -1,
          delay: i * 0.1,
          ease: "sine.inOut",
        });
      });

      // Corner anchors subtle pulse
      cornerAnchors.forEach((c, i) => {
        gsap.to(c, {
          opacity: gsap.utils.random(0.7, 1),
          duration: gsap.utils.random(2.5, 4),
          yoyo: true,
          repeat: -1,
          delay: i * 0.4,
          ease: "sine.inOut",
        });
      });
    });

    return () => {
      tl.kill();
      gsap.killTweensOf([core, sealGlow, lockIcon, ambientGlow]);
      gridLines.forEach((l) => gsap.killTweensOf(l));
      innerGridLines.forEach((l) => gsap.killTweensOf(l));
      cornerAnchors.forEach((c) => gsap.killTweensOf(c));
      perimeterSegments.forEach((s) => gsap.killTweensOf(s));
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

  /* Outer architectural grid — subtle structure */
  const gridLinesData: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 0; i <= 10; i++) {
    const pos = 100 + i * 40;
    gridLinesData.push({ x1: pos, y1: 100, x2: pos, y2: 500 });
    gridLinesData.push({ x1: 100, y1: pos, x2: 500, y2: pos });
  }

  /* Inner grid — extremely faint, inside the perimeter */
  const innerGridData: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 0; i <= 8; i++) {
    const pos = 140 + i * 40;
    innerGridData.push({ x1: pos, y1: 130, x2: pos, y2: 470 });
    innerGridData.push({ x1: 130, y1: pos, x2: 470, y2: pos });
  }

  /* Corner bracket positions */
  const corners = [
    { x: 130, y: 130 },
    { x: 470, y: 130 },
    { x: 470, y: 470 },
    { x: 130, y: 470 },
  ];
  const bracketLen = 18;

  /* Perimeter as 4 separate line segments for sequential draw */
  const periSegments = [
    { x1: 130, y1: 130, x2: 470, y2: 130, len: 340 }, // top
    { x1: 470, y1: 130, x2: 470, y2: 470, len: 340 }, // right
    { x1: 470, y1: 470, x2: 130, y2: 470, len: 340 }, // bottom
    { x1: 130, y1: 470, x2: 130, y2: 130, len: 340 }, // left
  ];

  /* Generate particles — start near center, end at perimeter */
  const particleData = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
    const perimDist = 170; // distance to perimeter
    const tx = 300 + Math.cos(angle) * perimDist;
    const ty = 300 + Math.sin(angle) * perimDist;
    // Clamp to square perimeter
    const clampedX = Math.max(130, Math.min(470, tx));
    const clampedY = Math.max(130, Math.min(470, ty));
    return { cx: 300, cy: 300, tx: clampedX, ty: clampedY };
  });

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
      {/* Subtle noise overlay */}
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
            style={{
              fontSize: 12,
              letterSpacing: "0.22em",
              opacity: 0.5,
              marginBottom: 20,
            }}
          >
            [ TRUST & SOVEREIGNTY ]
          </div>

          <h2
            style={{
              fontSize: "clamp(44px, 5.2vw, 84px)",
              fontWeight: 800,
              lineHeight: 0.95,
              margin: "0 0 24px 0",
              letterSpacing: "-0.02em",
            }}
          >
            Sovereign by design.
          </h2>

          <p
            style={{
              fontSize: "clamp(15px, 1.25vw, 18px)",
              lineHeight: 1.65,
              opacity: 0.72,
              maxWidth: "46ch",
              margin: "0 0 40px 0",
            }}
          >
            Every decision, signal, and action remains jurisdictionally anchored.
            Policy enforcement, auditability, and storage governance operate
            natively — not as overlays.
          </p>

          {/* Pillars */}
          <div className="flex flex-wrap gap-3">
            {PILLARS.map((p) => (
              <div
                key={p}
                style={{
                  padding: "10px 20px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 999,
                  fontSize: 13,
                  letterSpacing: "0.04em",
                  opacity: 0.8,
                  backdropFilter: "blur(4px)",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                {p}
              </div>
            ))}
          </div>
        </div>

        {/* Right — Locking Grid Chamber */}
        <div
          ref={vaultRef}
          style={{
            aspectRatio: "1",
            maxWidth: 700,
            width: "100%",
            justifySelf: "end",
          }}
        >
          <svg
            ref={svgRef}
            className="w-full h-full block"
            viewBox="0 0 600 600"
            fill="none"
          >
            <defs>
              <radialGradient id="lgAmbient" cx="50%" cy="50%" r="40%">
                <stop offset="0%" stopColor="#3D1F7A" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#0B0613" stopOpacity={0} />
              </radialGradient>
              {/* Tighter glow filter */}
              <filter id="lgGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="lgSealFilter" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="10" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Ambient glow — controlled */}
            <circle id="lg-ambient" cx="300" cy="300" r="180" fill="url(#lgAmbient)" />

            {/* Outer architectural grid */}
            {gridLinesData.map((l, i) => (
              <line
                key={`g-${i}`}
                className="lg-grid"
                x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
                stroke="rgba(123,77,255,0.08)"
                strokeWidth={0.4}
              />
            ))}

            {/* Inner grid — extremely faint */}
            {innerGridData.map((l, i) => (
              <line
                key={`ig-${i}`}
                className="lg-inner-grid"
                x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
                stroke="rgba(123,77,255,0.05)"
                strokeWidth={0.3}
              />
            ))}

            {/* Perimeter — 4 separate segments for sequential draw */}
            {periSegments.map((seg, i) => (
              <line
                key={`ps-${i}`}
                className="lg-peri-seg"
                x1={seg.x1} y1={seg.y1} x2={seg.x2} y2={seg.y2}
                stroke="rgba(123,77,255,0.6)"
                strokeWidth={1}
                strokeLinecap="square"
                strokeDasharray={seg.len}
                strokeDashoffset={seg.len}
              />
            ))}

            {/* Seal glow — tighter */}
            <rect
              id="lg-seal-glow"
              x="125" y="125"
              width="350" height="350"
              rx="2"
              fill="none"
              stroke="rgba(123,77,255,0.6)"
              strokeWidth={3}
              filter="url(#lgSealFilter)"
            />

            {/* Particles — fly from center to perimeter on lock */}
            {particleData.map((p, i) => (
              <circle
                key={`part-${i}`}
                className="lg-particle"
                cx={p.cx} cy={p.cy}
                r={1.5}
                fill="rgba(123,77,255,0.8)"
                data-tx={p.tx}
                data-ty={p.ty}
              />
            ))}

            {/* Corner anchor brackets — thin, precise */}
            {corners.map((c, i) => {
              const dx = i === 0 || i === 3 ? 1 : -1;
              const dy = i === 0 || i === 1 ? 1 : -1;

              return (
                <g key={`c-${i}`} className="lg-corner" style={{ transformOrigin: `${c.x}px ${c.y}px` }}>
                  <line
                    x1={c.x} y1={c.y}
                    x2={c.x + bracketLen * dx} y2={c.y}
                    stroke="rgba(123,77,255,0.8)"
                    strokeWidth={1.2}
                    strokeLinecap="square"
                  />
                  <line
                    x1={c.x} y1={c.y}
                    x2={c.x} y2={c.y + bracketLen * dy}
                    stroke="rgba(123,77,255,0.8)"
                    strokeWidth={1.2}
                    strokeLinecap="square"
                  />
                  <circle
                    cx={c.x} cy={c.y} r={2.5}
                    fill="#7B4DFF"
                    filter="url(#lgGlow)"
                  />
                </g>
              );
            })}

            {/* Central core block — tighter, engineered */}
            <g id="lg-core">
              <rect
                x="268" y="268"
                width="64" height="64"
                rx="3"
                fill="#7B4DFF"
                opacity={0.8}
                filter="url(#lgGlow)"
              />
              <rect
                x="268" y="268"
                width="64" height="64"
                rx="3"
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth={0.8}
              />
              {/* Inner detail */}
              <rect
                x="280" y="280"
                width="40" height="40"
                rx="2"
                fill="rgba(255,255,255,0.06)"
              />
              <circle
                cx="300" cy="300" r="5"
                fill="rgba(255,255,255,0.5)"
              />
            </g>

            {/* Lock icon — appears after seal */}
            <g id="lg-lock" style={{ transformOrigin: "300px 300px" }}>
              <rect
                x="291" y="298"
                width="18" height="13"
                rx="2"
                fill="none"
                stroke="rgba(255,255,255,0.45)"
                strokeWidth={1}
              />
              <path
                d="M294 298 V293 A6 6 0 0 1 306 293 V298"
                fill="none"
                stroke="rgba(255,255,255,0.45)"
                strokeWidth={1}
                strokeLinecap="round"
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
