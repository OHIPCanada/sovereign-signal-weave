import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PILLARS = [
  "Jurisdiction Control",
  "Cryptographic Audit Trails",
  "Deployment Flexibility",
];

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
    const coreInner = svg.querySelector("#lg-core-dot") as SVGCircleElement;
    const gridLines = svg.querySelectorAll<SVGLineElement>(".lg-grid");
    const cornerAnchors = svg.querySelectorAll<SVGGElement>(".lg-corner");
    const perimeterFrame = svg.querySelector("#lg-perimeter") as SVGRectElement;
    const sealGlow = svg.querySelector("#lg-seal-glow") as SVGRectElement;
    const crossH = svg.querySelector("#lg-cross-h") as SVGLineElement;
    const crossV = svg.querySelector("#lg-cross-v") as SVGLineElement;
    const lockIcon = svg.querySelector("#lg-lock") as SVGGElement;

    const tl = gsap.timeline({ delay: 0.3 });

    /* ── Stage 1: Core floating unstably ── */
    // Set initial states
    gsap.set(core, { x: 12, y: -8, rotation: 5, transformOrigin: "300px 300px" });
    gsap.set(gridLines, { opacity: 0 });
    gsap.set(cornerAnchors, { opacity: 0, scale: 0 });
    gsap.set(perimeterFrame, { opacity: 0, attr: { "stroke-dashoffset": 1680 } });
    gsap.set(sealGlow, { opacity: 0 });
    gsap.set([crossH, crossV], { opacity: 0 });
    gsap.set(lockIcon, { opacity: 0, scale: 0, transformOrigin: "300px 300px" });

    // Subtle drift for 1.2s
    tl.to(core, { x: -6, y: 5, rotation: -3, duration: 0.6, ease: "sine.inOut" })
      .to(core, { x: 8, y: -4, rotation: 4, duration: 0.6, ease: "sine.inOut" });

    /* ── Stage 2: Grid fades in ── */
    tl.to(gridLines, {
      opacity: 0.12,
      duration: 0.8,
      stagger: { each: 0.03, from: "center" },
      ease: "power2.out",
    }, "-=0.2");

    /* ── Stage 3: Core snaps to center ── */
    tl.to(core, {
      x: 0,
      y: 0,
      rotation: 0,
      duration: 0.5,
      ease: "back.out(2.5)",
    }, "-=0.3");

    // Crosshairs appear
    tl.to([crossH, crossV], {
      opacity: 0.2,
      duration: 0.4,
      ease: "power2.out",
    }, "-=0.2");

    /* ── Stage 4: Corner anchors slide in from edges ── */
    const cornerOffsets = [
      { x: -80, y: -80 },  // top-left
      { x: 80, y: -80 },   // top-right
      { x: 80, y: 80 },    // bottom-right
      { x: -80, y: 80 },   // bottom-left
    ];

    cornerAnchors.forEach((corner, i) => {
      gsap.set(corner, { x: cornerOffsets[i].x, y: cornerOffsets[i].y });
    });

    tl.to(cornerAnchors, {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      duration: 0.6,
      stagger: 0.08,
      ease: "power3.out",
    });

    /* ── Stage 5: Perimeter frame draws ── */
    tl.to(perimeterFrame, {
      opacity: 1,
      attr: { "stroke-dashoffset": 0 },
      duration: 1.2,
      ease: "power2.inOut",
    }, "-=0.3");

    /* ── Stage 6: Lock pulse — seal engaged ── */
    tl.to(sealGlow, {
      opacity: 0.35,
      duration: 0.4,
      ease: "power2.in",
    })
    .to(lockIcon, {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: "back.out(2)",
    }, "-=0.2")
    .to(sealGlow, {
      opacity: 0,
      duration: 1.2,
      ease: "power2.out",
    }, "-=0.1");

    /* ── Idle state: subtle breathing after lock ── */
    tl.call(() => {
      // Subtle grid shimmer
      gridLines.forEach((line, i) => {
        gsap.to(line, {
          opacity: gsap.utils.random(0.06, 0.16),
          duration: gsap.utils.random(3, 5),
          yoyo: true,
          repeat: -1,
          delay: i * 0.15,
          ease: "sine.inOut",
        });
      });

      // Corner anchors gentle pulse
      cornerAnchors.forEach((corner, i) => {
        gsap.to(corner, {
          opacity: gsap.utils.random(0.7, 1),
          duration: gsap.utils.random(2, 3.5),
          yoyo: true,
          repeat: -1,
          delay: i * 0.5,
          ease: "sine.inOut",
        });
      });

      // Perimeter subtle glow pulse
      gsap.to(perimeterFrame, {
        opacity: gsap.utils.random(0.6, 1),
        duration: 3,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });

      // Core gentle breathing
      gsap.to(core, {
        scale: 1.03,
        transformOrigin: "300px 300px",
        duration: 3,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    });

    return () => {
      tl.kill();
      gsap.killTweensOf([core, coreInner, perimeterFrame, sealGlow, lockIcon, crossH, crossV]);
      gridLines.forEach((l) => gsap.killTweensOf(l));
      cornerAnchors.forEach((c) => gsap.killTweensOf(c));
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

  /* Grid lines — tighter, architectural grid */
  const gridLinesData: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 0; i <= 12; i++) {
    const pos = 90 + i * 35;
    gridLinesData.push({ x1: pos, y1: 90, x2: pos, y2: 510 });   // vertical
    gridLinesData.push({ x1: 90, y1: pos, x2: 510, y2: pos });   // horizontal
  }

  /* Corner bracket positions */
  const corners = [
    { x: 120, y: 120 },  // top-left
    { x: 480, y: 120 },  // top-right
    { x: 480, y: 480 },  // bottom-right
    { x: 120, y: 480 },  // bottom-left
  ];

  const cornerBracketSize = 24;

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
              <radialGradient id="lgAmbient" cx="50%" cy="50%" r="55%">
                <stop offset="0%" stopColor="#3D1F7A" stopOpacity={0.6} />
                <stop offset="60%" stopColor="#241034" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#0B0613" stopOpacity={0} />
              </radialGradient>
              <filter id="lgGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="lgSealFilter" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="18" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Ambient glow */}
            <circle cx="300" cy="300" r="220" fill="url(#lgAmbient)" />

            {/* Architectural grid */}
            {gridLinesData.map((l, i) => (
              <line
                key={i}
                className="lg-grid"
                x1={l.x1}
                y1={l.y1}
                x2={l.x2}
                y2={l.y2}
                stroke="rgba(123,77,255,0.12)"
                strokeWidth={0.5}
              />
            ))}

            {/* Crosshair alignment lines */}
            <line
              id="lg-cross-h"
              x1="90"
              y1="300"
              x2="510"
              y2="300"
              stroke="rgba(123,97,255,0.3)"
              strokeWidth={1}
              strokeDasharray="4 8"
            />
            <line
              id="lg-cross-v"
              x1="300"
              y1="90"
              x2="300"
              y2="510"
              stroke="rgba(123,97,255,0.3)"
              strokeWidth={1}
              strokeDasharray="4 8"
            />

            {/* Perimeter frame — square boundary */}
            <rect
              id="lg-perimeter"
              x="120"
              y="120"
              width="360"
              height="360"
              rx="4"
              fill="none"
              stroke="rgba(123,77,255,0.7)"
              strokeWidth={2}
              strokeDasharray="1680"
              strokeDashoffset="1680"
            />

            {/* Seal glow — full perimeter flash */}
            <rect
              id="lg-seal-glow"
              x="110"
              y="110"
              width="380"
              height="380"
              rx="8"
              fill="none"
              stroke="rgba(123,77,255,0.8)"
              strokeWidth={6}
              filter="url(#lgSealFilter)"
            />

            {/* Corner anchor brackets */}
            {corners.map((c, i) => {
              const s = cornerBracketSize;
              // Direction multipliers for each corner
              const dx = i === 0 || i === 3 ? 1 : -1;
              const dy = i === 0 || i === 1 ? 1 : -1;

              return (
                <g key={i} className="lg-corner" style={{ transformOrigin: `${c.x}px ${c.y}px` }}>
                  {/* L-shaped bracket */}
                  <line
                    x1={c.x}
                    y1={c.y}
                    x2={c.x + s * dx}
                    y2={c.y}
                    stroke="rgba(123,77,255,0.9)"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                  />
                  <line
                    x1={c.x}
                    y1={c.y}
                    x2={c.x}
                    y2={c.y + s * dy}
                    stroke="rgba(123,77,255,0.9)"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                  />
                  {/* Corner dot */}
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r={4}
                    fill="#7B4DFF"
                    filter="url(#lgGlow)"
                  />
                </g>
              );
            })}

            {/* Central core block */}
            <g id="lg-core">
              {/* Core square */}
              <rect
                x="255"
                y="255"
                width="90"
                height="90"
                rx="6"
                fill="#7B4DFF"
                opacity={0.85}
                filter="url(#lgGlow)"
              />
              <rect
                x="255"
                y="255"
                width="90"
                height="90"
                rx="6"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth={1}
              />
              {/* Inner detail square */}
              <rect
                x="272"
                y="272"
                width="56"
                height="56"
                rx="4"
                fill="rgba(255,255,255,0.08)"
              />
              {/* Center dot */}
              <circle
                id="lg-core-dot"
                cx="300"
                cy="300"
                r="8"
                fill="rgba(255,255,255,0.6)"
              />
            </g>

            {/* Lock icon — appears after seal */}
            <g id="lg-lock" style={{ transformOrigin: "300px 300px" }}>
              {/* Lock body */}
              <rect
                x="289"
                y="296"
                width="22"
                height="16"
                rx="3"
                fill="none"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth={1.5}
              />
              {/* Lock shackle */}
              <path
                d="M293 296 V290 A7 7 0 0 1 307 290 V296"
                fill="none"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth={1.5}
                strokeLinecap="round"
              />
              {/* Lock keyhole */}
              <circle cx="300" cy="304" r="2" fill="rgba(255,255,255,0.5)" />
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default SovereigntySection;
