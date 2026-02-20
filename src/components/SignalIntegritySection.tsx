import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PILLS = ["Integrity", "Traceability", "Jurisdiction"];

/* ── Wave path generators ── */
const SVG_W = 960;
const SVG_H = 520;
const WAVE_COUNT = 4;

// Input waves: slightly jittery sine paths on left third
function makeInputPath(i: number): string {
  const yBase = 120 + i * 80;
  const pts: string[] = [];
  for (let x = 0; x <= 320; x += 8) {
    const jitter = Math.sin(x * 0.08 + i * 1.2) * 12 + Math.cos(x * 0.14 + i * 0.7) * 6;
    pts.push(`${x},${yBase + jitter}`);
  }
  return `M${pts.join(" L")}`;
}

// Output waves: clean smooth paths on right third
function makeOutputPath(i: number): string {
  const yBase = 120 + i * 80;
  const pts: string[] = [];
  for (let x = 640; x <= SVG_W; x += 8) {
    const smooth = Math.sin(x * 0.025 + i * 0.8) * 3;
    pts.push(`${x},${yBase + smooth}`);
  }
  return `M${pts.join(" L")}`;
}

// Noise fleck positions
const NOISE_FLECKS = Array.from({ length: 8 }, (_, i) => ({
  cx: 40 + Math.random() * 260,
  cy: 100 + Math.random() * 320,
}));

const SignalIntegritySection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const hasAnimated = useRef(false);

  const setupAnimations = useCallback(() => {
    const svg = svgRef.current;
    if (!svg || hasAnimated.current) return;
    hasAnimated.current = true;

    const inPaths = svg.querySelectorAll<SVGPathElement>(".sig-in");
    const outPaths = svg.querySelectorAll<SVGPathElement>(".sig-out");
    const noiseDots = svg.querySelectorAll<SVGCircleElement>(".noise-fleck");
    const planeGroup = svg.querySelector("#plane-group") as SVGGElement;
    const planeGlow = svg.querySelector("#plane-glow") as SVGRectElement;
    const scanLine = svg.querySelector("#scan-line") as SVGLineElement;
    const pulse = svg.querySelector("#verify-pulse") as SVGCircleElement;
    const coreLine = svg.querySelector("#core-line") as SVGLineElement;

    /* ── Initial state ── */
    gsap.set(inPaths, { opacity: 0.6 });
    gsap.set(outPaths, { opacity: 0.3 });
    gsap.set(planeGroup, { opacity: 0.7 });
    gsap.set(scanLine, { opacity: 0, attr: { y1: 0, y2: 0 } });
    gsap.set(pulse, { opacity: 0, attr: { cx: 530, r: 4 } });

    /* ══ A. Always-on ambient ══ */

    // Input jitter: subtle continuous transform wiggle
    inPaths.forEach((p, i) => {
      gsap.to(p, {
        y: `random(-3, 3)`,
        x: `random(-2, 2)`,
        duration: `random(1.5, 2.5)`,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.15,
      });
    });

    // Output micro drift
    outPaths.forEach((p, i) => {
      gsap.to(p, {
        y: `random(-1, 1)`,
        duration: `random(4, 6)`,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.2,
      });
    });

    // Noise flecks drifting upward
    noiseDots.forEach((dot, i) => {
      gsap.to(dot, {
        y: "-=20",
        x: `random(-8, 8)`,
        opacity: `random(0.1, 0.35)`,
        duration: `random(3, 6)`,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.3,
      });
    });

    // Plane glow breathing
    gsap.to(planeGlow, {
      opacity: 0.5,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // Core line pulse
    gsap.to(coreLine, {
      opacity: 0.9,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    /* ══ Pulse runner function ══ */
    function runPulse() {
      gsap.set(pulse, { opacity: 0, attr: { cx: 530, r: 4 } });
      gsap.to(pulse, { opacity: 0.85, duration: 0.25, ease: "power2.out" });
      gsap.to(pulse, {
        attr: { cx: 940 },
        duration: 2,
        ease: "power1.inOut",
      });
      gsap.to(pulse, { opacity: 0, duration: 0.4, delay: 1.6, ease: "power2.in" });
    }

    /* ══ B. On-enter scroll-triggered transform ══ */
    const transformTL = gsap.timeline({ paused: true });

    // Increase noise briefly
    transformTL.to(inPaths, { x: 5, y: -4, duration: 0.8, ease: "sine.inOut" }, 0);

    // Scan sweep: line moves top to bottom
    transformTL.set(scanLine, { opacity: 0.6, attr: { y1: 20, y2: 20 } }, 0.2);
    transformTL.to(scanLine, {
      attr: { y1: SVG_H - 20, y2: SVG_H - 20 },
      duration: 1.4,
      ease: "power2.inOut",
    }, 0.2);
    transformTL.to(scanLine, { opacity: 0, duration: 0.3 }, 1.4);

    // Dampen jitter after scan
    transformTL.to(inPaths, { x: 0, y: 0, duration: 1, ease: "power2.out" }, 1.0);

    // Brighten output lines
    transformTL.to(outPaths, { opacity: 0.85, duration: 0.8, ease: "power2.out" }, 1.0);

    // Verification pulse
    transformTL.add(() => runPulse(), 1.5);

    /* ══ ScrollTrigger ══ */
    ScrollTrigger.create({
      trigger: svgRef.current,
      start: "top 65%",
      once: true,
      onEnter: () => {
        gsap.delayedCall(0.5, () => transformTL.play());
        // Start repeating pulses after transform settles
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
      transformTL.kill();
      gsap.killTweensOf([...inPaths, ...outPaths, ...noiseDots, planeGlow, coreLine, scanLine, pulse]);
    };
  }, []);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    const textEl = textRef.current;
    const stageEl = stageRef.current;
    const section = sectionRef.current;

    if (textEl && stageEl && section) {
      gsap.set(textEl, { opacity: 0, y: 40 });
      gsap.set(stageEl, { opacity: 0, y: 50, scale: 0.97 });

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top 75%",
        once: true,
        onEnter: () => {
          gsap.to(textEl, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" });
          gsap.to(stageEl, {
            opacity: 1, y: 0, scale: 1, duration: 1.1, delay: 0.15, ease: "power3.out",
            onComplete: () => { cleanup = setupAnimations(); },
          });
        },
      });

      return () => { cleanup?.(); st.kill(); };
    }
    return () => cleanup?.();
  }, [setupAnimations]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        padding: "clamp(64px, 7vw, 110px) 0",
        background: `
          radial-gradient(900px 500px at 70% 40%, rgba(90,32,184,0.25), transparent 60%),
          radial-gradient(700px 500px at 55% 50%, rgba(232,150,124,0.10), transparent 60%),
          linear-gradient(180deg, #2A0B4A, #0B0620)
        `,
        color: "#EDE7F6",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Noise texture */}
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
          maxWidth: "min(1180px, 92vw)",
          gridTemplateColumns: "1fr 1.35fr",
          gap: "54px",
        }}
      >
        {/* Left — Copy */}
        <div ref={textRef}>
          <div
            className="font-mono uppercase"
            style={{ fontSize: 12, letterSpacing: "0.28em", opacity: 0.45, marginBottom: 16 }}
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
              color: "#FFFFFF",
            }}
          >
            Trusted by systems that cannot fail.
          </h2>

          <p
            style={{
              fontSize: 16,
              lineHeight: 1.65,
              opacity: 0.68,
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
                  border: "1px solid rgba(255,255,255,0.14)",
                  color: "rgba(255,255,255,0.72)",
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

        {/* Right — Signal Integrity Plane SVG Stage */}
        <div
          ref={stageRef}
          style={{
            borderRadius: 28,
            border: "1px solid rgba(255,255,255,0.10)",
            background: "rgba(255,255,255,0.03)",
            boxShadow: "0 30px 90px rgba(0,0,0,0.45)",
            overflow: "hidden",
          }}
        >
          <svg
            ref={svgRef}
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            className="w-full h-auto block"
            fill="none"
          >
            <defs>
              {/* Soft glow filter */}
              <filter id="sigSoftGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {/* Pulse glow */}
              <filter id="sigPulseGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="8" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {/* Plane warm gradient */}
              <linearGradient id="planeWarmGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D4616B" stopOpacity={0.35} />
                <stop offset="50%" stopColor="#E8967C" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#F2C1AE" stopOpacity={0.15} />
              </linearGradient>
              {/* Radial bloom behind plane */}
              <radialGradient id="planeBloom" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#E8967C" stopOpacity={0.2} />
                <stop offset="60%" stopColor="#5A20B8" stopOpacity={0.08} />
                <stop offset="100%" stopColor="transparent" stopOpacity={0} />
              </radialGradient>
              {/* Scan gradient */}
              <linearGradient id="scanGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#D4616B" stopOpacity={0} />
                <stop offset="40%" stopColor="#D4616B" stopOpacity={0.7} />
                <stop offset="60%" stopColor="#E8967C" stopOpacity={0.7} />
                <stop offset="100%" stopColor="#F2C1AE" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Background radial bloom */}
            <ellipse cx={480} cy={260} rx={200} ry={260} fill="url(#planeBloom)" />

            {/* ── Input wave paths (noisy) ── */}
            {Array.from({ length: WAVE_COUNT }, (_, i) => (
              <path
                key={`in-${i}`}
                className="sig-in"
                d={makeInputPath(i)}
                stroke="#BFA7FF"
                strokeWidth={1.2}
                strokeLinecap="round"
                fill="none"
                opacity={0.6}
              />
            ))}

            {/* ── Noise flecks ── */}
            {NOISE_FLECKS.map((f, i) => (
              <circle
                key={`nf-${i}`}
                className="noise-fleck"
                cx={f.cx}
                cy={f.cy}
                r={1.2}
                fill="#BFA7FF"
                opacity={0.2}
              />
            ))}

            {/* ── Center processing plane ── */}
            <g id="plane-group">
              {/* Translucent light curtain */}
              <rect
                id="plane-glow"
                x={450}
                y={20}
                width={100}
                height={SVG_H - 40}
                rx={8}
                fill="url(#planeWarmGrad)"
                opacity={0.35}
                filter="url(#sigSoftGlow)"
              />
              {/* Bright core line (scanner) */}
              <line
                id="core-line"
                x1={500}
                y1={30}
                x2={500}
                y2={SVG_H - 30}
                stroke="#E8967C"
                strokeWidth={1.5}
                opacity={0.65}
                filter="url(#sigSoftGlow)"
              />
              {/* Watermark label */}
              <text
                x={500}
                y={SVG_H / 2}
                textAnchor="middle"
                dominantBaseline="central"
                fill="rgba(255,255,255,0.06)"
                fontSize={22}
                fontWeight={700}
                letterSpacing="0.15em"
                style={{ fontFamily: "inherit" }}
              >
                DOCG AI
              </text>
            </g>

            {/* ── Scan line (animated top→bottom on enter) ── */}
            <line
              id="scan-line"
              x1={440}
              y1={20}
              x2={560}
              y2={20}
              stroke="url(#scanGrad)"
              strokeWidth={2}
              opacity={0}
            />

            {/* ── Output wave paths (clean) ── */}
            {Array.from({ length: WAVE_COUNT }, (_, i) => (
              <path
                key={`out-${i}`}
                className="sig-out"
                d={makeOutputPath(i)}
                stroke="#BFA7FF"
                strokeWidth={1.2}
                strokeLinecap="round"
                fill="none"
                opacity={0.4}
              />
            ))}

            {/* ── Verification pulse circle ── */}
            <circle
              id="verify-pulse"
              cx={530}
              cy={260}
              r={5}
              fill="#D4616B"
              filter="url(#sigPulseGlow)"
              opacity={0}
            />

            {/* ── Labels ── */}
            <text
              x={20}
              y={32}
              fill="rgba(191,167,255,0.45)"
              fontSize={10}
              letterSpacing="0.18em"
              style={{ fontFamily: "monospace" }}
            >
              SIGNAL IN
            </text>
            <text
              x={SVG_W - 20}
              y={32}
              textAnchor="end"
              fill="rgba(212,97,107,0.55)"
              fontSize={10}
              letterSpacing="0.18em"
              style={{ fontFamily: "monospace" }}
            >
              INTEGRITY VERIFIED
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default SignalIntegritySection;
