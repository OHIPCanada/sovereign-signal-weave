import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";

/* ── seed presets ── */
const SEEDS: Record<string, { x: number; y: number; accent: "lav" | "warm" }> = {
  emr:      { x: 210, y: 170, accent: "lav"  },
  pathways: { x: 320, y: 360, accent: "warm" },
  ops:      { x: 460, y: 240, accent: "lav"  },
  audit:    { x: 660, y: 200, accent: "warm" },
  access:   { x: 730, y: 360, accent: "lav"  },
};

const SURFACES = [
  { key: "emr",      title: "EMR Events",    desc: "Signals in / actions out" },
  { key: "pathways", title: "Care Pathways",  desc: "Decisions & escalation" },
  { key: "ops",      title: "Clinical Ops",   desc: "Handoffs & staffing" },
  { key: "audit",    title: "Policy + Audit", desc: "Traceability by default" },
  { key: "access",   title: "Patient Access", desc: "Triage & scheduling" },
];

const COLS = 18;
const ROWS = 10;
const PAD_X = 48;
const PAD_Y = 48;
const W = 900;
const H = 520;
const CELL_W = (W - PAD_X * 2) / COLS;
const CELL_H = (H - PAD_Y * 2) / ROWS;
const TARGET_COVERAGE = 87;
const STAMP_LABELS = ["ROUTED", "VERIFIED", "LOGGED"];

const Section9_DeploymentSurfaces = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const cellsRef = useRef<SVGGElement>(null);
  const stampsRef = useRef<SVGGElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const valRef = useRef<HTMLDivElement>(null);
  const seedHaloRef = useRef<SVGCircleElement>(null);
  const seedCoreRef = useRef<SVGCircleElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const hasAutoRun = useRef(false);
  const [activeSeed, setActiveSeed] = useState("ops");

  /* ── stamp helper ── */
  const stamp = useCallback((text: string, x: number, y: number, accent: "lav" | "warm") => {
    const stampsG = stampsRef.current;
    if (!stampsG) return;

    const ns = "http://www.w3.org/2000/svg";
    const g = document.createElementNS(ns, "g");

    const bg = document.createElementNS(ns, "rect");
    bg.setAttribute("x", String(x - 44));
    bg.setAttribute("y", String(y - 14));
    bg.setAttribute("width", "88");
    bg.setAttribute("height", "28");
    bg.setAttribute("rx", "14");
    bg.setAttribute("fill", accent === "warm" ? "rgba(232,150,124,0.16)" : "rgba(189,166,255,0.14)");
    bg.setAttribute("stroke", accent === "warm" ? "rgba(232,150,124,0.35)" : "rgba(189,166,255,0.30)");
    bg.setAttribute("stroke-width", "1");

    const t = document.createElementNS(ns, "text");
    t.setAttribute("x", String(x));
    t.setAttribute("y", String(y + 5));
    t.setAttribute("text-anchor", "middle");
    t.setAttribute("font-size", "11");
    t.setAttribute("letter-spacing", "2");
    t.setAttribute("fill", accent === "warm" ? "rgba(242,193,174,0.92)" : "rgba(243,239,255,0.90)");
    t.setAttribute("font-family", "ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif");
    t.textContent = text;

    g.appendChild(bg);
    g.appendChild(t);
    stampsG.appendChild(g);

    gsap.fromTo(g, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" });
    gsap.to(g, { opacity: 0, duration: 0.45, delay: 1.4, ease: "power2.out", onComplete: () => g.remove() });
  }, []);

  /* ── run diffusion ── */
  const runDiffusion = useCallback((seedKey: string) => {
    const cellsG = cellsRef.current;
    const stampsG = stampsRef.current;
    const fillEl = fillRef.current;
    const valEl = valRef.current;
    const seedHalo = seedHaloRef.current;
    const seedCore = seedCoreRef.current;
    if (!cellsG || !stampsG || !fillEl || !valEl || !seedHalo || !seedCore) return;

    // Clear
    if (tlRef.current) tlRef.current.kill();
    gsap.killTweensOf([seedHalo, seedCore]);
    cellsG.innerHTML = "";
    stampsG.innerHTML = "";
    fillEl.style.width = "0%";
    valEl.textContent = "0%";

    const seed = SEEDS[seedKey] || SEEDS.ops;
    setActiveSeed(seedKey);

    // Build grid cells
    const ns = "http://www.w3.org/2000/svg";
    const cells: { x: number; y: number; rect: SVGRectElement; dot: SVGCircleElement }[] = [];

    for (let iy = 0; iy < ROWS; iy++) {
      for (let ix = 0; ix < COLS; ix++) {
        const x = PAD_X + ix * CELL_W;
        const y = PAD_Y + iy * CELL_H;

        const r = document.createElementNS(ns, "rect");
        r.setAttribute("x", String(x + 5));
        r.setAttribute("y", String(y + 5));
        r.setAttribute("rx", "8");
        r.setAttribute("ry", "8");
        r.setAttribute("width", String(Math.max(0, CELL_W - 10)));
        r.setAttribute("height", String(Math.max(0, CELL_H - 10)));
        r.setAttribute("fill", "rgba(255,255,255,0.00)");
        r.setAttribute("stroke", "rgba(189,166,255,0.10)");
        r.setAttribute("stroke-width", "1");

        const c = document.createElementNS(ns, "circle");
        c.setAttribute("cx", String(x + CELL_W / 2));
        c.setAttribute("cy", String(y + CELL_H / 2));
        c.setAttribute("r", "2.2");
        c.setAttribute("fill", "rgba(189,166,255,0.18)");

        cellsG.appendChild(r);
        cellsG.appendChild(c);
        cells.push({ x: x + CELL_W / 2, y: y + CELL_H / 2, rect: r, dot: c });
      }
    }

    // Move seed
    seedHalo.setAttribute("cx", String(seed.x));
    seedHalo.setAttribute("cy", String(seed.y));
    seedCore.setAttribute("cx", String(seed.x));
    seedCore.setAttribute("cy", String(seed.y));

    // Ambient pulse
    gsap.to(seedCore, { attr: { r: 10 }, yoyo: true, repeat: -1, duration: 1.8, ease: "sine.inOut" });

    // Sort by distance
    const sorted = [...cells].sort((a, b) => {
      const da = (a.x - seed.x) ** 2 + (a.y - seed.y) ** 2;
      const db = (b.x - seed.x) ** 2 + (b.y - seed.y) ** 2;
      return da - db;
    });

    const total = sorted.length;
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    tlRef.current = tl;

    sorted.forEach((cell, i) => {
      const p = i / total;
      const delay = p * 2.2;
      const warmFill = seed.accent === "warm";

      // Use gsap.set for color strings (can't tween strings), tween numeric attrs separately
      tl.add(() => {
        cell.rect.setAttribute("stroke", "rgba(189,166,255,0.22)");
        cell.rect.setAttribute("fill", warmFill ? "rgba(232,150,124,0.06)" : "rgba(189,166,255,0.05)");
        cell.dot.setAttribute("fill", warmFill ? "rgba(242,193,174,0.65)" : "rgba(189,166,255,0.55)");
      }, delay);

      tl.to(cell.dot, {
        attr: { r: 3.4 },
        duration: 0.18,
      }, delay);

      if (i % 34 === 0) {
        const labelIdx = (i / 34) % 3;
        tl.add(() => stamp(STAMP_LABELS[labelIdx], cell.x, cell.y, seed.accent), delay + 0.15);
      }
    });

    // Coverage meter
    tl.to({}, {
      duration: 2.2,
      onUpdate: function (this: gsap.core.Tween) {
        const prog = this.progress();
        const val = Math.round(TARGET_COVERAGE * prog);
        fillEl.style.width = `${val}%`;
        valEl.textContent = `${val}%`;
      },
    }, 0);

    // Seed halo pulse
    tl.to(seedHalo, { attr: { r: 110 }, duration: 0.8, ease: "sine.out" }, 0.2);
    tl.to(seedHalo, { attr: { r: 90 }, duration: 1.2, ease: "sine.inOut" }, 1.0);
  }, [stamp]);

  /* ── Intersection Observer — auto run once ── */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!hasAutoRun.current && e.isIntersecting && e.intersectionRatio > 0.3) {
            hasAutoRun.current = true;
            runDiffusion("ops");
            io.disconnect();
          }
        });
      },
      { threshold: [0.25, 0.55, 0.75] }
    );
    io.observe(stage);
    return () => io.disconnect();
  }, [runDiffusion]);

  /* ── cleanup ── */
  useEffect(() => {
    return () => {
      if (tlRef.current) tlRef.current.kill();
    };
  }, []);

  return (
    <section
      className="relative overflow-hidden"
      style={{
        padding: "clamp(64px, 7vw, 110px) 0",
        background: `
          radial-gradient(1200px 700px at 15% 20%, rgba(91,29,179,0.35) 0%, transparent 55%),
          radial-gradient(900px 700px at 85% 80%, rgba(232,150,124,0.14) 0%, transparent 60%),
          linear-gradient(180deg, #220833, #16061f)
        `,
      }}
    >
      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />

      <div
        className="mx-auto"
        style={{
          width: "min(1180px, calc(100% - 48px))",
          display: "grid",
          gridTemplateColumns: "5fr 7fr",
          gap: "48px",
          alignItems: "center",
        }}
      >
        {/* ── Left column ── */}
        <div>
          <p
            className="font-mono"
            style={{
              fontSize: "12px",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "rgba(243,239,255,0.55)",
              marginBottom: "14px",
            }}
          >
            [ DEPLOYMENT SURFACES ]
          </p>

          <h2
            style={{
              fontSize: "clamp(36px, 5vw, 64px)",
              lineHeight: 1.02,
              letterSpacing: "-0.02em",
              fontWeight: 700,
              color: "#f3efff",
              margin: "0 0 18px 0",
            }}
          >
            Start anywhere.
            <br />
            Coordinate everywhere.
          </h2>

          <p
            style={{
              fontSize: "16px",
              lineHeight: 1.7,
              color: "rgba(243,239,255,0.72)",
              maxWidth: "44ch",
            }}
          >
            DocG enters through a single surface — then spreads routing,
            orchestration, and governance across the system without ripping or
            replacing.
          </p>

          {/* Surface tiles */}
          <div className="flex flex-col gap-2.5 mt-7">
            {SURFACES.map((s) => (
              <button
                key={s.key}
                onClick={() => runDiffusion(s.key)}
                className="text-left transition-all duration-250 ease-out"
                style={{
                  position: "relative",
                  padding: "14px",
                  borderRadius: "14px",
                  border: `1px solid ${activeSeed === s.key ? "rgba(189,166,255,0.45)" : "rgba(189,166,255,0.16)"}`,
                  background: activeSeed === s.key ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
                  backdropFilter: "blur(10px)",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  if (activeSeed !== s.key) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.borderColor = "rgba(189,166,255,0.35)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSeed !== s.key) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = "rgba(189,166,255,0.16)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                  }
                }}
              >
                <div style={{ fontSize: "14px", fontWeight: 600, color: "rgba(243,239,255,0.92)", marginBottom: "4px" }}>
                  {s.title}
                </div>
                <div style={{ fontSize: "12px", color: "rgba(243,239,255,0.62)" }}>
                  {s.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Right column: Stage ── */}
        <div
          ref={stageRef}
          className="relative overflow-hidden"
          style={{
            borderRadius: "26px",
            border: "1px solid rgba(189,166,255,0.18)",
            background: `
              radial-gradient(800px 520px at 40% 40%, rgba(91,29,179,0.25) 0%, transparent 60%),
              radial-gradient(520px 520px at 75% 65%, rgba(232,150,124,0.16) 0%, transparent 55%),
              rgba(255,255,255,0.02)
            `,
            boxShadow: "0 40px 120px rgba(0,0,0,0.45)",
            minHeight: "520px",
          }}
        >
          {/* Faint grid overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(189,166,255,0.12) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(189,166,255,0.12) 1px, transparent 1px)
              `,
              backgroundSize: "48px 48px",
              opacity: 0.25,
            }}
          />

          <svg
            ref={svgRef}
            viewBox="0 0 900 520"
            width="100%"
            height="100%"
            preserveAspectRatio="none"
            className="relative z-10"
            style={{ minHeight: "520px" }}
          >
            <defs>
              <radialGradient id="s9SeedGlow" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="#F2C1AE" stopOpacity="0.55" />
                <stop offset="35%" stopColor="#E8967C" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#BDA6FF" stopOpacity="0" />
              </radialGradient>
              <filter id="s9SoftGlow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="6" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <g ref={cellsRef} />

            <g>
              <circle ref={seedHaloRef} cx="450" cy="260" r="90" fill="url(#s9SeedGlow)" />
              <circle ref={seedCoreRef} cx="450" cy="260" r="8" fill="#BDA6FF" filter="url(#s9SoftGlow)" />
            </g>

            <g ref={stampsRef} />
          </svg>

          {/* Coverage meter */}
          <div
            className="absolute left-[22px] right-[22px] bottom-[18px] flex items-center gap-3 z-20"
            style={{
              color: "rgba(243,239,255,0.70)",
              fontSize: "12px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            <div>System coverage</div>
            <div
              className="flex-1 overflow-hidden"
              style={{
                height: "10px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(189,166,255,0.18)",
              }}
            >
              <div
                ref={fillRef}
                style={{
                  height: "100%",
                  width: "0%",
                  borderRadius: "999px",
                  background: "linear-gradient(90deg, #BDA6FF, #E8967C, #F2C1AE)",
                  filter: "drop-shadow(0 0 12px rgba(232,150,124,0.25))",
                }}
              />
            </div>
            <div
              ref={valRef}
              style={{ minWidth: "70px", textAlign: "right", color: "rgba(243,239,255,0.85)" }}
            >
              0%
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section9_DeploymentSurfaces;
