import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PILLS = ["Integrity", "Traceability", "Jurisdiction"];

/* ── Geometry ── */
const W = 1080;
const H = 480;
const LINE_COUNT = 4;
const LINE_Y = (i: number) => 90 + i * 100;

/* Noisy input path (left side) */
function inputD(i: number): string {
  const y0 = LINE_Y(i);
  const pts: string[] = [];
  for (let x = 30; x <= 400; x += 4) {
    const n =
      Math.sin(x * 0.06 + i * 1.5) * 18 +
      Math.cos(x * 0.13 + i * 0.9) * 10 +
      Math.sin(x * 0.21 + i * 2.4) * 5;
    pts.push(`${x},${y0 + n}`);
  }
  return `M${pts.join(" L")}`;
}

/* Clean output path (right side) */
function outputD(i: number): string {
  const y0 = LINE_Y(i);
  return `M${680},${y0} L${W - 30},${y0}`;
}

const SignalIntegritySection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const stage = stageRef.current;
    const textEl = textRef.current;
    const section = sectionRef.current;
    if (!svg || !stage || !textEl || !section) return;

    const ctx = gsap.context(() => {
      /* ── Query elements ── */
      const ins = svg.querySelectorAll<SVGPathElement>(".wIn");
      const outs = svg.querySelectorAll<SVGLineElement>(".wOut");
      const bloom = svg.querySelector("#bloom") as SVGEllipseElement;
      const warmRect = svg.querySelector("#warmRect") as SVGRectElement;
      const scanBar = svg.querySelector("#scanBar") as SVGRectElement;
      const pulse = svg.querySelector("#pulse") as SVGCircleElement;
      const verifyLabel = svg.querySelector("#verifyLabel") as SVGTextElement;

      /* ── Entrance fade ── */
      gsap.set(textEl, { opacity: 0, y: 40 });
      gsap.set(stage, { opacity: 0, y: 50 });

      ScrollTrigger.create({
        trigger: section,
        start: "top 78%",
        once: true,
        onEnter: () => {
          gsap.to(textEl, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" });
          gsap.to(stage, { opacity: 1, y: 0, duration: 1.1, delay: 0.12, ease: "power3.out" });
        },
      });

      /* ═══ A. AMBIENT — always running ═══ */

      // Input wobble: each path jiggles individually
      ins.forEach((p, i) => {
        gsap.to(p, {
          x: "random(-5, 5)",
          y: "random(-4, 4)",
          duration: 1.2 + i * 0.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.12,
        });
      });

      // Output: very subtle drift (alive but stable)
      outs.forEach((l, i) => {
        gsap.to(l, {
          y: 1.5,
          duration: 5 + i,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      // Bloom breathing
      gsap.to(bloom, {
        attr: { rx: 260, ry: 250 },
        opacity: 0.55,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      /* ═══ B. PULSE RUNNER ═══ */
      function runPulse() {
        const y = LINE_Y(1) + 20; // roughly center
        gsap.set(pulse, { attr: { cx: 520, cy: y, r: 6 }, opacity: 0 });
        gsap.to(pulse, { opacity: 1, duration: 0.15, ease: "power2.out" });
        gsap.to(pulse, { attr: { cx: W - 60 }, duration: 1.6, ease: "power1.inOut" });
        gsap.to(pulse, { opacity: 0, attr: { r: 12 }, duration: 0.4, delay: 1.2, ease: "power2.in" });
      }

      /* ═══ C. SCROLL-TRIGGERED VERIFICATION ═══ */
      const verifyTL = gsap.timeline({ paused: true });

      verifyTL
        // 1. Scan bar sweeps top → bottom
        .set(scanBar, { attr: { y: 0 }, opacity: 1 }, 0)
        .to(scanBar, { attr: { y: H }, duration: 1.2, ease: "power2.inOut" }, 0)
        .to(scanBar, { opacity: 0, duration: 0.2 }, 1.0)

        // 2. Warm rect glows during scan
        .to(warmRect, { opacity: 0.5, duration: 0.5, ease: "power2.out" }, 0.1)

        // 3. Dampen input wobble
        .to(ins, { x: 0, y: 0, duration: 1.0, ease: "power2.out", overwrite: "auto" }, 0.6)

        // 4. Brighten outputs
        .to(outs, { opacity: 0.8, strokeWidth: 2, duration: 0.7, ease: "power2.out" }, 0.8)

        // 5. Flash verify label
        .to(verifyLabel, { opacity: 0.6, duration: 0.4, ease: "power2.out" }, 0.9)

        // 6. First pulse
        .add(() => runPulse(), 1.1)

        // 7. Warm rect settles
        .to(warmRect, { opacity: 0.25, duration: 0.8, ease: "sine.out" }, 1.5);

      ScrollTrigger.create({
        trigger: stage,
        start: "top 68%",
        once: true,
        onEnter: () => {
          verifyTL.play();
          // Repeating pulses
          gsap.delayedCall(4, () => {
            runPulse();
            gsap.delayedCall(8, function loop() {
              runPulse();
              gsap.delayedCall(8, loop);
            });
          });
        },
      });
    }, section);

    return () => ctx.revert();
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

        {/* Right — Signal Integrity Stage */}
        <div
          ref={stageRef}
          style={{
            borderRadius: 28,
            border: "1px solid rgba(42,11,74,0.10)",
            background: "rgba(255,255,255,0.6)",
            boxShadow: "0 26px 80px rgba(0,0,0,0.12), 0 4px 20px rgba(90,32,184,0.06)",
            overflow: "hidden",
          }}
        >
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            className="w-full h-auto block"
            fill="none"
            style={{ background: "linear-gradient(135deg, rgba(251,247,255,0.5) 0%, rgba(253,238,229,0.3) 100%)" }}
          >
            <defs>
              <filter id="s9glow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="6" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="s9pulseGlow" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="12" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <radialGradient id="bloomGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#E8967C" stopOpacity={0.25} />
                <stop offset="40%" stopColor="#BFA7FF" stopOpacity={0.15} />
                <stop offset="100%" stopColor="transparent" stopOpacity={0} />
              </radialGradient>
              <linearGradient id="warmGrad9" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D4616B" stopOpacity={0.35} />
                <stop offset="50%" stopColor="#E8967C" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#F2C1AE" stopOpacity={0.15} />
              </linearGradient>
            </defs>

            {/* ── Central bloom ── */}
            <ellipse
              id="bloom"
              cx={540}
              cy={H / 2}
              rx={220}
              ry={210}
              fill="url(#bloomGrad)"
              opacity={0.45}
            />

            {/* ── Warm verification rect (starts invisible) ── */}
            <rect
              id="warmRect"
              x={500}
              y={10}
              width={80}
              height={H - 20}
              rx={6}
              fill="url(#warmGrad9)"
              opacity={0}
              filter="url(#s9glow)"
            />

            {/* ── Center structural lines ── */}
            <line x1={540} y1={20} x2={540} y2={H - 20} stroke="rgba(90,32,184,0.15)" strokeWidth={1.5} />
            <line x1={520} y1={30} x2={520} y2={H - 30} stroke="rgba(90,32,184,0.06)" strokeWidth={0.8} />
            <line x1={560} y1={30} x2={560} y2={H - 30} stroke="rgba(90,32,184,0.06)" strokeWidth={0.8} />

            {/* ── Watermark ── */}
            <text
              x={540} y={H / 2}
              textAnchor="middle" dominantBaseline="central"
              fill="rgba(90,32,184,0.07)"
              fontSize={20} fontWeight={700} letterSpacing="0.18em"
              style={{ fontFamily: "inherit" }}
            >
              DOCG AI
            </text>

            {/* ── INPUT waves (noisy, bold) ── */}
            {Array.from({ length: LINE_COUNT }, (_, i) => (
              <path
                key={`in${i}`}
                className="wIn"
                d={inputD(i)}
                stroke="rgba(90,32,184,0.55)"
                strokeWidth={2}
                strokeLinecap="round"
              />
            ))}

            {/* ── OUTPUT lines (clean, initially faint) ── */}
            {Array.from({ length: LINE_COUNT }, (_, i) => (
              <line
                key={`out${i}`}
                className="wOut"
                x1={680} y1={LINE_Y(i)}
                x2={W - 30} y2={LINE_Y(i)}
                stroke="rgba(90,32,184,0.2)"
                strokeWidth={1.5}
                strokeLinecap="round"
                opacity={0.35}
              />
            ))}

            {/* ── Scan bar ── */}
            <rect
              id="scanBar"
              x={460} y={0}
              width={160} height={5}
              rx={2.5}
              fill="#D4616B"
              opacity={0}
              filter="url(#s9glow)"
            />

            {/* ── Verification pulse ── */}
            <circle
              id="pulse"
              cx={540} cy={240}
              r={6}
              fill="#D4616B"
              filter="url(#s9pulseGlow)"
              opacity={0}
            />

            {/* ── Labels ── */}
            <text x={35} y={38} fill="rgba(90,32,184,0.5)" fontSize={11} letterSpacing="0.2em"
              style={{ fontFamily: "monospace" }}>SIGNAL IN</text>
            <text x={W - 35} y={38} textAnchor="end" fill="rgba(212,97,107,0.55)" fontSize={11}
              letterSpacing="0.2em" style={{ fontFamily: "monospace" }}>INTEGRITY VERIFIED</text>
            <text id="verifyLabel" x={540} y={H - 22} textAnchor="middle" fill="rgba(90,32,184,0.0)"
              fontSize={10} letterSpacing="0.25em" style={{ fontFamily: "monospace" }}>VERIFY</text>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default SignalIntegritySection;
