import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PILLARS = [
  "Jurisdiction Control",
  "Cryptographic Audit Trails",
  "Deployment Flexibility",
];

/* Arc definitions — 3 concentric rings with partial arcs */
const RINGS = [
  { r: 140, arcs: [{ start: 0, sweep: 100 }, { start: 140, sweep: 80 }, { start: 260, sweep: 60 }], color: "#00CED1", width: 1.2, speed: 18 },
  { r: 105, arcs: [{ start: 30, sweep: 120 }, { start: 200, sweep: 90 }], color: "#C084FC", width: 1, speed: -25 },
  { r: 70,  arcs: [{ start: 60, sweep: 70 }, { start: 170, sweep: 100 }, { start: 310, sweep: 40 }], color: "#D4616B", width: 0.8, speed: 15 },
];

/* Small node dots at arc endpoints */
const NODE_RADIUS = 2;

function describeArc(cx: number, cy: number, r: number, startAngle: number, sweepAngle: number) {
  const startRad = (startAngle - 90) * (Math.PI / 180);
  const endRad = (startAngle + sweepAngle - 90) * (Math.PI / 180);
  const x1 = cx + r * Math.cos(startRad);
  const y1 = cy + r * Math.sin(startRad);
  const x2 = cx + r * Math.cos(endRad);
  const y2 = cy + r * Math.sin(endRad);
  const large = sweepAngle > 180 ? 1 : 0;
  return {
    d: `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`,
    startX: x1, startY: y1, endX: x2, endY: y2,
  };
}

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

    const cx = 300, cy = 300;

    /* Query elements */
    const ringGroups = svg.querySelectorAll<SVGGElement>(".vault-ring");
    const arcPaths = svg.querySelectorAll<SVGPathElement>(".vault-arc");
    const arcNodes = svg.querySelectorAll<SVGCircleElement>(".vault-node");
    const coreBg = svg.querySelector("#vault-core-bg") as SVGElement;
    const coreIcon = svg.querySelector("#vault-core-icon") as SVGElement;
    const pulseRing = svg.querySelector("#vault-pulse") as SVGCircleElement;
    const innerGlow = svg.querySelector("#vault-inner-glow") as SVGCircleElement;
    const tickMarks = svg.querySelectorAll<SVGLineElement>(".vault-tick");

    /* Initial state */
    gsap.set(ringGroups, { opacity: 0, transformOrigin: `${cx}px ${cy}px` });
    gsap.set(arcPaths, { strokeDashoffset: (_, target: SVGPathElement) => target.getTotalLength() });
    gsap.set(arcNodes, { opacity: 0, scale: 0, transformOrigin: "center center" });
    gsap.set(coreBg, { opacity: 0, scale: 0.6, transformOrigin: `${cx}px ${cy}px` });
    gsap.set(coreIcon, { opacity: 0 });
    gsap.set(pulseRing, { opacity: 0, scale: 0.5, transformOrigin: `${cx}px ${cy}px` });
    gsap.set(innerGlow, { opacity: 0 });
    gsap.set(tickMarks, { opacity: 0 });

    /* ═══ INTRO ═══ */
    const intro = gsap.timeline({ delay: 0.3 });

    // Core appears
    intro.to(coreBg, { opacity: 1, scale: 1, duration: 0.9, ease: "power3.out" });
    intro.to(innerGlow, { opacity: 0.4, duration: 0.6, ease: "power2.out" }, "-=0.5");
    intro.to(coreIcon, { opacity: 0.8, duration: 0.5, ease: "power2.out" }, "-=0.3");

    // Tick marks fade in
    intro.to(tickMarks, { opacity: 0.15, duration: 0.8, stagger: 0.02, ease: "power2.out" }, "-=0.4");

    // Rings appear and arcs draw
    RINGS.forEach((_, i) => {
      intro.to(ringGroups[i], { opacity: 1, duration: 0.6, ease: "power2.out" }, `-=${i === 0 ? 0.3 : 0.4}`);
    });

    // Arcs draw in
    intro.to(arcPaths, {
      strokeDashoffset: 0,
      duration: 1.2,
      stagger: 0.08,
      ease: "power2.inOut",
    }, "-=0.5");

    // Nodes pop in
    intro.to(arcNodes, {
      opacity: 1, scale: 1,
      duration: 0.4, stagger: 0.03, ease: "back.out(2)",
    }, "-=0.5");

    /* ═══ CONTINUOUS ROTATION ═══ */
    RINGS.forEach((ring, i) => {
      gsap.to(ringGroups[i], {
        rotation: ring.speed > 0 ? 360 : -360,
        duration: Math.abs(360 / ring.speed),
        repeat: -1,
        ease: "none",
      });
    });

    /* ═══ PULSE LOOP — periodic "lock" moment ═══ */
    const pulse = gsap.timeline({ repeat: -1, repeatDelay: 4, delay: 2.5 });

    // Rings briefly pause (slow down and speed back up)
    RINGS.forEach((ring, i) => {
      pulse.to(ringGroups[i], {
        timeScale: 0.1,
        duration: 0.8,
        ease: "power2.inOut",
      }, 0);
    });

    // Glow pulse from center
    pulse.to(pulseRing, {
      opacity: 0.5, scale: 1, duration: 0.5, ease: "power2.out",
    }, 0.4);
    pulse.to(innerGlow, {
      opacity: 0.7, duration: 0.4, ease: "power2.in",
    }, 0.4);

    // Arc brightness boost
    pulse.to(arcPaths, {
      opacity: 1, strokeWidth: "+=0.5",
      duration: 0.3, ease: "power2.out",
    }, 0.5);

    // Hold
    pulse.to({}, { duration: 1.2 });

    // Release — everything returns
    RINGS.forEach((ring, i) => {
      pulse.to(ringGroups[i], {
        timeScale: 1,
        duration: 1.0,
        ease: "power2.inOut",
      }, "release");
    });

    pulse.to(pulseRing, {
      opacity: 0, scale: 0.5, duration: 1.0, ease: "power2.inOut",
    }, "release");
    pulse.to(innerGlow, {
      opacity: 0.4, duration: 0.8, ease: "power2.out",
    }, "release");
    pulse.to(arcPaths, {
      opacity: (_, target: SVGPathElement) => parseFloat(target.getAttribute("data-base-opacity") || "0.7"),
      strokeWidth: (_, target: SVGPathElement) => parseFloat(target.getAttribute("data-base-width") || "1"),
      duration: 0.6, ease: "power2.out",
    }, "release");

    /* ═══ Subtle tick shimmer ═══ */
    tickMarks.forEach((tick, i) => {
      gsap.to(tick, {
        opacity: gsap.utils.random(0.08, 0.2),
        duration: gsap.utils.random(3, 6),
        yoyo: true, repeat: -1, delay: i * 0.1, ease: "sine.inOut",
      });
    });

    return () => {
      intro.kill();
      pulse.kill();
      ringGroups.forEach(g => gsap.killTweensOf(g));
      arcPaths.forEach(p => gsap.killTweensOf(p));
      arcNodes.forEach(n => gsap.killTweensOf(n));
      tickMarks.forEach(t => gsap.killTweensOf(t));
      gsap.killTweensOf([coreBg, coreIcon, pulseRing, innerGlow]);
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
            onComplete: () => { cleanup = setupAnimations(); },
          });
        },
      });

      return () => { cleanup?.(); st.kill(); };
    }
    return () => cleanup?.();
  }, [setupAnimations]);

  const cx = 300, cy = 300;

  /* Tick marks — subtle radial lines like a vault dial */
  const tickData: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 0; i < 72; i++) {
    const angle = (i * 5 - 90) * (Math.PI / 180);
    const inner = i % 6 === 0 ? 155 : 160;
    const outer = i % 6 === 0 ? 175 : 168;
    tickData.push({
      x1: cx + inner * Math.cos(angle),
      y1: cy + inner * Math.sin(angle),
      x2: cx + outer * Math.cos(angle),
      y2: cy + outer * Math.sin(angle),
    });
  }

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        padding: "clamp(64px, 7vw, 110px) 0",
        background: "radial-gradient(circle at 50% 40%, #0F1A3D 0%, #060B1E 70%)",
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

        {/* Right — Vault Visual */}
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
              <radialGradient id="vaultCoreGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#7B61FF" stopOpacity={0.6} />
                <stop offset="70%" stopColor="#4A3B8C" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#1A1040" stopOpacity={0.2} />
              </radialGradient>
              <radialGradient id="vaultGlowGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#7B61FF" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#7B61FF" stopOpacity={0} />
              </radialGradient>
              <filter id="vaultGlow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="vaultSoftGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="12" />
              </filter>
            </defs>

            {/* Inner glow */}
            <circle id="vault-inner-glow" cx={cx} cy={cy} r="90" fill="url(#vaultGlowGrad)" />

            {/* Tick marks — vault dial */}
            {tickData.map((t, i) => (
              <line
                key={`tick-${i}`}
                className="vault-tick"
                x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
                stroke="rgba(123,97,255,0.12)"
                strokeWidth={i % 6 === 0 ? 0.8 : 0.4}
              />
            ))}

            {/* Concentric ring groups with arcs */}
            {RINGS.map((ring, ri) => (
              <g key={`ring-${ri}`} className="vault-ring" style={{ transformOrigin: `${cx}px ${cy}px` }}>
                {/* Faint full circle guide */}
                <circle
                  cx={cx} cy={cy} r={ring.r}
                  stroke={ring.color}
                  strokeWidth={0.3}
                  strokeDasharray="3 8"
                  opacity={0.15}
                  fill="none"
                />

                {/* Arc segments */}
                {ring.arcs.map((arc, ai) => {
                  const { d, startX, startY, endX, endY } = describeArc(cx, cy, ring.r, arc.start, arc.sweep);
                  return (
                    <g key={`arc-${ri}-${ai}`}>
                      <path
                        className="vault-arc"
                        d={d}
                        stroke={ring.color}
                        strokeWidth={ring.width}
                        strokeLinecap="round"
                        fill="none"
                        opacity={0.7}
                        data-base-opacity="0.7"
                        data-base-width={ring.width}
                        style={{
                          strokeDasharray: `${(arc.sweep / 360) * 2 * Math.PI * ring.r}`,
                          strokeDashoffset: `${(arc.sweep / 360) * 2 * Math.PI * ring.r}`,
                        }}
                        filter="url(#vaultGlow)"
                      />
                      {/* Endpoint nodes */}
                      <circle
                        className="vault-node"
                        cx={startX} cy={startY} r={NODE_RADIUS}
                        fill={ring.color} opacity={0.8}
                      />
                      <circle
                        className="vault-node"
                        cx={endX} cy={endY} r={NODE_RADIUS}
                        fill={ring.color} opacity={0.8}
                      />
                    </g>
                  );
                })}
              </g>
            ))}

            {/* Pulse ring */}
            <circle
              id="vault-pulse"
              cx={cx} cy={cy} r="160"
              stroke="#7B61FF"
              strokeWidth={1.5}
              fill="none"
              opacity={0}
              filter="url(#vaultSoftGlow)"
            />

            {/* Core */}
            <g id="vault-core-bg">
              <circle cx={cx} cy={cy} r="32" fill="url(#vaultCoreGrad)" />
              <circle cx={cx} cy={cy} r="32" fill="none" stroke="rgba(123,97,255,0.25)" strokeWidth={0.8} />
              <circle cx={cx} cy={cy} r="24" fill="none" stroke="rgba(123,97,255,0.12)" strokeWidth={0.5} />
            </g>

            {/* Lock icon in core */}
            <g id="vault-core-icon">
              <rect
                x="291" y="298" width="18" height="13" rx="2"
                fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={0.9}
              />
              <path
                d="M294 298 V294 A6 6 0 0 1 306 294 V298"
                fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={0.9} strokeLinecap="round"
              />
              <circle cx="300" cy="304" r="1.3" fill="rgba(255,255,255,0.5)" />
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default SovereigntySection;
