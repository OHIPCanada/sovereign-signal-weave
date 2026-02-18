import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PILLARS = [
  "Jurisdiction Control",
  "Cryptographic Audit Trails",
  "Deployment Flexibility",
];

/* Four perimeter anchor positions (top, right, bottom, left) */
const ANCHORS = [
  { cx: 300, cy: 100 },
  { cx: 500, cy: 300 },
  { cx: 300, cy: 500 },
  { cx: 100, cy: 300 },
];

const SovereigntySection = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const vaultRef = useRef<HTMLDivElement>(null);

  const setupAnimations = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const core = svg.querySelector("#sov-core") as SVGRectElement;
    const pulse1 = svg.querySelector("#sov-pulse-1") as SVGCircleElement;
    const pulse2 = svg.querySelector("#sov-pulse-2") as SVGCircleElement;
    const gridLines = svg.querySelectorAll<SVGLineElement>(".sov-grid");
    const anchorDots = svg.querySelectorAll<SVGCircleElement>(".sov-anchor");
    const rays = svg.querySelectorAll<SVGLineElement>(".sov-ray");
    const outerRing = svg.querySelector("#sov-outer") as SVGCircleElement;

    // Core breathing
    gsap.to(core, {
      scale: 1.06,
      transformOrigin: "300px 300px",
      duration: 2.5,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    // Pulse 1 — expanding ring
    gsap.fromTo(
      pulse1,
      { attr: { r: 60 }, opacity: 0.5 },
      {
        attr: { r: 200 },
        opacity: 0,
        duration: 3.5,
        repeat: -1,
        ease: "power2.out",
      }
    );

    // Pulse 2 — staggered second ring
    gsap.fromTo(
      pulse2,
      { attr: { r: 60 }, opacity: 0.35 },
      {
        attr: { r: 220 },
        opacity: 0,
        duration: 4,
        repeat: -1,
        delay: 1.5,
        ease: "power2.out",
      }
    );

    // Outer ring slow rotation
    gsap.to(outerRing, {
      rotation: 360,
      transformOrigin: "300px 300px",
      duration: 60,
      repeat: -1,
      ease: "none",
    });

    // Grid shimmer — very subtle opacity wave
    gridLines.forEach((line, i) => {
      gsap.to(line, {
        opacity: gsap.utils.random(0.04, 0.12),
        duration: gsap.utils.random(3, 5),
        yoyo: true,
        repeat: -1,
        delay: i * 0.3,
        ease: "sine.inOut",
      });
    });

    // Anchor dots pulse
    anchorDots.forEach((dot, i) => {
      gsap.to(dot, {
        opacity: gsap.utils.random(0.4, 0.8),
        scale: 1.3,
        transformOrigin: "center",
        duration: gsap.utils.random(2, 3.5),
        yoyo: true,
        repeat: -1,
        delay: i * 0.8,
        ease: "sine.inOut",
      });
    });

    // Light rays gentle pulse
    rays.forEach((ray, i) => {
      gsap.to(ray, {
        opacity: gsap.utils.random(0.06, 0.18),
        duration: gsap.utils.random(2.5, 4),
        yoyo: true,
        repeat: -1,
        delay: i * 0.6,
        ease: "sine.inOut",
      });
    });

    return () => {
      gsap.killTweensOf([core, pulse1, pulse2, outerRing]);
      gridLines.forEach((l) => gsap.killTweensOf(l));
      anchorDots.forEach((d) => gsap.killTweensOf(d));
      rays.forEach((r) => gsap.killTweensOf(r));
    };
  }, []);

  useEffect(() => {
    const cleanup = setupAnimations();

    // Scroll-triggered entrance
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
          gsap.to(vaultEl, { opacity: 1, y: 0, scale: 1, duration: 1.1, delay: 0.2, ease: "power3.out" });
        },
      });

      return () => {
        cleanup?.();
        st.kill();
      };
    }

    return () => cleanup?.();
  }, [setupAnimations]);

  /* Generate subtle grid lines */
  const gridLinesData: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 1; i < 10; i++) {
    const pos = i * 60;
    gridLinesData.push({ x1: pos, y1: 40, x2: pos, y2: 560 }); // vertical
    gridLinesData.push({ x1: 40, y1: pos, x2: 560, y2: pos }); // horizontal
  }

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

        {/* Right — Secure Core Chamber */}
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
              <radialGradient id="sovCoreGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#7B61FF" stopOpacity={0.9} />
                <stop offset="40%" stopColor="#7B4DFF" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#7B4DFF" stopOpacity={0} />
              </radialGradient>
              <radialGradient id="sovAmbient" cx="50%" cy="50%" r="55%">
                <stop offset="0%" stopColor="#3D1F7A" stopOpacity={0.9} />
                <stop offset="60%" stopColor="#241034" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#0B0613" stopOpacity={0} />
              </radialGradient>
              <filter id="sovGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="sovCoreFilter" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="20" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Ambient center glow */}
            <circle cx="300" cy="300" r="250" fill="url(#sovAmbient)" />

            {/* Subtle grid */}
            {gridLinesData.map((l, i) => (
              <line
                key={i}
                className="sov-grid"
                x1={l.x1}
                y1={l.y1}
                x2={l.x2}
                y2={l.y2}
                stroke="rgba(123,77,255,0.15)"
                strokeWidth={1}
              />
            ))}

            {/* Outer ring — dashed, rotating */}
            <circle
              id="sov-outer"
              cx="300"
              cy="300"
              r="240"
              fill="none"
              stroke="rgba(123,77,255,0.2)"
              strokeWidth={2}
              strokeDasharray="10 18"
            />

            {/* Second subtle ring */}
            <circle
              cx="300"
              cy="300"
              r="190"
              fill="none"
              stroke="rgba(123,77,255,0.2)"
              strokeWidth={1.5}
            />

            {/* Light rays from core to anchors */}
            {ANCHORS.map((a, i) => (
              <line
                key={i}
                className="sov-ray"
                x1="300"
                y1="300"
                x2={a.cx}
                y2={a.cy}
                stroke="rgba(123,77,255,0.3)"
                strokeWidth={1.5}
              />
            ))}

            {/* Perimeter anchors */}
            {ANCHORS.map((a, i) => (
              <circle
                key={i}
                className="sov-anchor"
                cx={a.cx}
                cy={a.cy}
                r={8}
                fill="rgba(123,77,255,0.85)"
                opacity={0.8}
              />
            ))}

            {/* Expanding pulse rings */}
            <circle
              id="sov-pulse-1"
              cx="300"
              cy="300"
              r="70"
              fill="none"
              stroke="rgba(123,77,255,0.45)"
              strokeWidth={3}
            />
            <circle
              id="sov-pulse-2"
              cx="300"
              cy="300"
              r="70"
              fill="none"
              stroke="rgba(212,97,107,0.35)"
              strokeWidth={2.5}
            />

            {/* Core glow backdrop */}
            <circle cx="300" cy="300" r="120" fill="url(#sovCoreGlow)" filter="url(#sovCoreFilter)" />

            {/* Central core block */}
            <g id="sov-core" filter="url(#sovGlow)">
              <rect
                x="240"
                y="240"
                width="120"
                height="120"
                rx="18"
                fill="#7B4DFF"
                opacity={0.9}
              />
              <rect
                x="240"
                y="240"
                width="120"
                height="120"
                rx="18"
                fill="none"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth={1.5}
              />
              {/* Inner detail */}
              <rect
                x="265"
                y="265"
                width="70"
                height="70"
                rx="12"
                fill="rgba(255,255,255,0.12)"
              />
              <circle cx="300" cy="300" r="14" fill="rgba(255,255,255,0.5)" />
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default SovereigntySection;
