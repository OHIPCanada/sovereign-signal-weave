import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PILLS = ["Integrity", "Traceability", "Jurisdiction"];

const SVG_W = 1080;
const SVG_H = 520;

/* ── Wave path generators ── */
function makeInputPath(i: number): string {
  const yBase = 100 + i * 90;
  const pts: string[] = [];
  for (let x = 40; x <= 420; x += 6) {
    const jitter =
      Math.sin(x * 0.09 + i * 1.3) * 14 +
      Math.cos(x * 0.15 + i * 0.8) * 7 +
      Math.sin(x * 0.22 + i * 2.1) * 4;
    pts.push(`${x},${yBase + jitter}`);
  }
  return `M${pts.join(" L")}`;
}

function makeOutputPath(i: number): string {
  const yBase = 100 + i * 90;
  const pts: string[] = [];
  for (let x = 660; x <= SVG_W - 40; x += 6) {
    const smooth = Math.sin(x * 0.02 + i * 0.9) * 2.5;
    pts.push(`${x},${yBase + smooth}`);
  }
  return `M${pts.join(" L")}`;
}

const SignalIntegritySection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const hasAnimated = useRef(false);

  const setupAnimations = useCallback(() => {
    const svg = svgRef.current;
    const stage = stageRef.current;
    if (!svg || !stage || hasAnimated.current) return;
    hasAnimated.current = true;

    const inLines = ["#in1", "#in2", "#in3", "#in4"].map((s) =>
      svg.querySelector(s)
    ).filter(Boolean) as SVGPathElement[];
    const outLines = ["#out1", "#out2", "#out3", "#out4"].map((s) =>
      svg.querySelector(s)
    ).filter(Boolean) as SVGPathElement[];

    const scanBar = svg.querySelector("#scanBar") as SVGRectElement;
    const planeWarm = svg.querySelector("#planeWarm") as SVGRectElement;
    const pulse = svg.querySelector("#pulse") as SVGCircleElement;

    /* ── 1. Ambient noise wobble (INPUT ONLY) ── */
    gsap.set(inLines, { transformOrigin: "50% 50%" });
    const wobble = gsap.timeline({ repeat: -1, yoyo: true });
    wobble.to(inLines, {
      x: 6,
      y: -3,
      rotation: 0.6,
      duration: 1.4,
      ease: "sine.inOut",
      stagger: 0.05,
    });

    // Output: calm but alive
    gsap.to(outLines, {
      y: 1.2,
      duration: 7,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    /* ── Pulse runner ── */
    function runPulse() {
      gsap.set(pulse, { opacity: 0, attr: { r: 7, cx: 540 } });
      gsap.to(pulse, { opacity: 0.9, duration: 0.18, ease: "power2.out" });
      gsap.to(pulse, {
        attr: { cx: 1000 },
        duration: 1.7,
        ease: "power1.inOut",
      });
      gsap.to(pulse, {
        opacity: 0,
        duration: 0.35,
        delay: 1.35,
        ease: "power2.in",
      });
    }

    /* ── 2. Verification timeline ── */
    const verifyTL = gsap.timeline({ paused: true });

    verifyTL
      // scan setup
      .set(scanBar, { attr: { y: 0 }, opacity: 0.9 }, 0)

      // warm plane ON during scan — high intensity
      .to(planeWarm, { opacity: 0.55, duration: 0.4, ease: "power2.out" }, 0.1)

      // scan sweep down
      .to(scanBar, { attr: { y: 500 }, duration: 1.0, ease: "power2.inOut" }, 0.1)
      .to(scanBar, { opacity: 0, duration: 0.3, ease: "power2.out" }, 0.9)

      // dampen input wobble after scan
      .to(inLines, { x: 0, y: 0, rotation: 0, duration: 0.9, ease: "power2.out" }, 0.8)

      // brighten output = verified
      .to(outLines, { attr: { "stroke-opacity": 0.75 }, duration: 0.6, ease: "power2.out" }, 0.85)

      // verification pulse
      .add(() => runPulse(), 1.05)

      // warm plane settles back (stays visible)
      .to(planeWarm, { opacity: 0.3, duration: 0.7, ease: "sine.out" }, 1.35);

    /* ── ScrollTrigger ── */
    ScrollTrigger.create({
      trigger: stage,
      start: "top 65%",
      once: true,
      onEnter: () => {
        verifyTL.play();
        // Repeat pulses after initial verify
        gsap.delayedCall(3.6, () => {
          runPulse();
          gsap.delayedCall(8.0, function loop() {
            runPulse();
            gsap.delayedCall(8.0, loop);
          });
        });
      },
    });

    return () => {
      verifyTL.kill();
      wobble.kill();
      gsap.killTweensOf([...inLines, ...outLines, scanBar, planeWarm, pulse]);
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

        {/* Right — Signal Integrity SVG Stage (light glass card) */}
        <div
          ref={stageRef}
          style={{
            borderRadius: 28,
            border: "1px solid rgba(42,11,74,0.10)",
            background: "rgba(255,255,255,0.55)",
            boxShadow: "0 26px 80px rgba(0,0,0,0.15)",
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
              <filter id="sigGlow9" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="5" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {/* Pulse glow */}
              <filter id="pulseGlow9" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="10" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {/* Warm gradient for verification plane */}
              <linearGradient id="warmPlaneGrad9" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D4616B" stopOpacity={0.3} />
                <stop offset="50%" stopColor="#E8967C" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#F2C1AE" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            {/* Subtle background radial for depth */}
            <ellipse cx={540} cy={260} rx={280} ry={260} fill="rgba(90,32,184,0.04)" />
            <ellipse cx={540} cy={260} rx={140} ry={200} fill="rgba(232,150,124,0.05)" />

            {/* ── INPUT wave paths (noisy, left side) ── */}
            {[0, 1, 2, 3].map((i) => (
              <path
                key={`in-${i}`}
                id={`in${i + 1}`}
                d={makeInputPath(i)}
                stroke="rgba(90,32,184,0.35)"
                strokeWidth={1.4}
                strokeLinecap="round"
                fill="none"
              />
            ))}

            {/* Noise flecks near input */}
            {Array.from({ length: 6 }, (_, i) => (
              <circle
                key={`nf-${i}`}
                cx={60 + Math.sin(i * 2.3) * 140 + 100}
                cy={120 + i * 65}
                r={1.1}
                fill="rgba(90,32,184,0.2)"
              />
            ))}

            {/* ── CENTER: Verification Plane ── */}
            {/* Warm glow rect — starts invisible, lights up during scan */}
            <rect
              id="planeWarm"
              x={490}
              y={10}
              width={100}
              height={SVG_H - 20}
              rx={8}
              fill="url(#warmPlaneGrad9)"
              opacity={0}
              filter="url(#sigGlow9)"
            />

            {/* Structural plane lines */}
            <line x1={520} y1={30} x2={520} y2={SVG_H - 30} stroke="rgba(90,32,184,0.12)" strokeWidth={1} />
            <line x1={560} y1={30} x2={560} y2={SVG_H - 30} stroke="rgba(90,32,184,0.08)" strokeWidth={0.8} />

            {/* Core center line */}
            <line x1={540} y1={20} x2={540} y2={SVG_H - 20} stroke="rgba(90,32,184,0.18)" strokeWidth={1.5} filter="url(#sigGlow9)" />

            {/* Watermark */}
            <text
              x={540}
              y={SVG_H / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fill="rgba(90,32,184,0.06)"
              fontSize={20}
              fontWeight={700}
              letterSpacing="0.15em"
              style={{ fontFamily: "inherit" }}
            >
              DOCG AI
            </text>

            {/* VERIFY label at plane */}
            <text
              x={540}
              y={SVG_H - 28}
              textAnchor="middle"
              fill="rgba(90,32,184,0.25)"
              fontSize={9}
              letterSpacing="0.22em"
              style={{ fontFamily: "monospace" }}
            >
              VERIFY
            </text>

            {/* ── Scan bar (animated top→bottom) ── */}
            <rect
              id="scanBar"
              x={470}
              y={0}
              width={140}
              height={6}
              rx={3}
              fill="#D4616B"
              opacity={0}
              filter="url(#pulseGlow9)"
            />

            {/* ── OUTPUT wave paths (clean, right side) ── */}
            {[0, 1, 2, 3].map((i) => (
              <path
                key={`out-${i}`}
                id={`out${i + 1}`}
                d={makeOutputPath(i)}
                stroke="rgba(90,32,184,0.25)"
                strokeWidth={1.4}
                strokeLinecap="round"
                fill="none"
                strokeOpacity={0.35}
              />
            ))}

            {/* ── Verification pulse circle ── */}
            <circle
              id="pulse"
              cx={540}
              cy={260}
              r={7}
              fill="#D4616B"
              filter="url(#pulseGlow9)"
              opacity={0}
            />

            {/* ── Labels ── */}
            <text
              x={50}
              y={30}
              fill="rgba(90,32,184,0.4)"
              fontSize={10}
              letterSpacing="0.18em"
              style={{ fontFamily: "monospace" }}
            >
              SIGNAL IN
            </text>
            <text
              x={SVG_W - 50}
              y={30}
              textAnchor="end"
              fill="rgba(212,97,107,0.45)"
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
