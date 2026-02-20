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
const NS = "http://www.w3.org/2000/svg";

const Section9_DeploymentSurfaces = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const cellsRef = useRef<SVGGElement>(null);
  const linesRef = useRef<SVGGElement>(null);
  const ripplesRef = useRef<SVGGElement>(null);
  const stampsRef = useRef<SVGGElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const valRef = useRef<HTMLDivElement>(null);
  const seedHaloRef = useRef<SVGEllipseElement>(null);
  const seedCoreRef = useRef<SVGCircleElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const hasAutoRun = useRef(false);
  const [activeSeed, setActiveSeed] = useState("ops");

  /* ── stamp helper ── */
  const stamp = useCallback((text: string, x: number, y: number, accent: "lav" | "warm") => {
    const stampsG = stampsRef.current;
    if (!stampsG) return;

    const g = document.createElementNS(NS, "g");

    const bg = document.createElementNS(NS, "rect");
    bg.setAttribute("x", String(x - 44));
    bg.setAttribute("y", String(y - 14));
    bg.setAttribute("width", "88");
    bg.setAttribute("height", "28");
    bg.setAttribute("rx", "14");
    bg.setAttribute("fill", accent === "warm" ? "rgba(232,150,124,0.18)" : "rgba(189,166,255,0.16)");
    bg.setAttribute("stroke", accent === "warm" ? "rgba(232,150,124,0.45)" : "rgba(189,166,255,0.40)");
    bg.setAttribute("stroke-width", "1");

    const t = document.createElementNS(NS, "text");
    t.setAttribute("x", String(x));
    t.setAttribute("y", String(y + 5));
    t.setAttribute("text-anchor", "middle");
    t.setAttribute("font-size", "11");
    t.setAttribute("letter-spacing", "2");
    t.setAttribute("fill", accent === "warm" ? "rgba(242,193,174,0.95)" : "rgba(243,239,255,0.92)");
    t.setAttribute("font-family", "ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif");
    t.textContent = text;

    g.appendChild(bg);
    g.appendChild(t);
    stampsG.appendChild(g);

    gsap.fromTo(g, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.5)" });
    gsap.to(g, { opacity: 0, y: -8, duration: 0.5, delay: 1.6, ease: "power2.in", onComplete: () => g.remove() });
  }, []);

  /* ── ripple ring helper ── */
  const spawnRipple = useCallback((x: number, y: number, accent: "lav" | "warm") => {
    const ripplesG = ripplesRef.current;
    if (!ripplesG) return;

    const circle = document.createElementNS(NS, "circle");
    circle.setAttribute("cx", String(x));
    circle.setAttribute("cy", String(y));
    circle.setAttribute("r", "12");
    circle.setAttribute("fill", "none");
    circle.setAttribute("stroke", accent === "warm" ? "rgba(232,150,124,0.5)" : "rgba(189,166,255,0.45)");
    circle.setAttribute("stroke-width", "1.5");
    ripplesG.appendChild(circle);

    gsap.to(circle, {
      attr: { r: 65 },
      duration: 1.4,
      ease: "power2.out",
    });
    gsap.to(circle, {
      opacity: 0,
      duration: 1.4,
      ease: "power2.out",
      onComplete: () => circle.remove(),
    });
  }, []);

  /* ── connection line helper ── */
  const drawConnection = useCallback((x1: number, y1: number, x2: number, y2: number, accent: "lav" | "warm") => {
    const linesG = linesRef.current;
    if (!linesG) return;

    const line = document.createElementNS(NS, "line");
    line.setAttribute("x1", String(x1));
    line.setAttribute("y1", String(y1));
    line.setAttribute("x2", String(x1));
    line.setAttribute("y2", String(y1));
    line.setAttribute("stroke", accent === "warm" ? "rgba(232,150,124,0.15)" : "rgba(189,166,255,0.12)");
    line.setAttribute("stroke-width", "1");
    linesG.appendChild(line);

    gsap.to(line, {
      attr: { x2, y2 },
      duration: 0.4,
      ease: "power2.out",
    });
  }, []);

  /* ── run diffusion ── */
  const runDiffusion = useCallback((seedKey: string) => {
    const cellsG = cellsRef.current;
    const stampsG = stampsRef.current;
    const linesG = linesRef.current;
    const ripplesG = ripplesRef.current;
    const fillEl = fillRef.current;
    const valEl = valRef.current;
    const seedHalo = seedHaloRef.current;
    const seedCore = seedCoreRef.current;
    if (!cellsG || !stampsG || !linesG || !ripplesG || !fillEl || !valEl || !seedHalo || !seedCore) return;

    // Clear
    if (tlRef.current) tlRef.current.kill();
    gsap.killTweensOf([seedHalo, seedCore]);
    cellsG.innerHTML = "";
    stampsG.innerHTML = "";
    linesG.innerHTML = "";
    ripplesG.innerHTML = "";
    fillEl.style.width = "0%";
    valEl.textContent = "0%";

    const seed = SEEDS[seedKey] || SEEDS.ops;
    setActiveSeed(seedKey);

    // Build grid cells
    const cells: { ix: number; iy: number; x: number; y: number; rect: SVGRectElement; dot: SVGCircleElement; halo: SVGCircleElement }[] = [];

    for (let iy = 0; iy < ROWS; iy++) {
      for (let ix = 0; ix < COLS; ix++) {
        const x = PAD_X + ix * CELL_W;
        const y = PAD_Y + iy * CELL_H;
        const cx = x + CELL_W / 2;
        const cy = y + CELL_H / 2;

        const r = document.createElementNS(NS, "rect");
        r.setAttribute("x", String(x + 4));
        r.setAttribute("y", String(y + 4));
        r.setAttribute("rx", "7");
        r.setAttribute("ry", "7");
        r.setAttribute("width", String(Math.max(0, CELL_W - 8)));
        r.setAttribute("height", String(Math.max(0, CELL_H - 8)));
        r.setAttribute("fill", "rgba(60,30,120,0.35)");
        r.setAttribute("stroke", "rgba(140,110,220,0.22)");
        r.setAttribute("stroke-width", "1");

        // Glow halo behind dot
        const h = document.createElementNS(NS, "circle");
        h.setAttribute("cx", String(cx));
        h.setAttribute("cy", String(cy));
        h.setAttribute("r", "0");
        h.setAttribute("fill", seed.accent === "warm" ? "rgba(232,150,124,0.0)" : "rgba(189,166,255,0.0)");

        const c = document.createElementNS(NS, "circle");
        c.setAttribute("cx", String(cx));
        c.setAttribute("cy", String(cy));
        c.setAttribute("r", "1.8");
        c.setAttribute("fill", "rgba(160,130,255,0.30)");

        cellsG.appendChild(r);
        cellsG.appendChild(h);
        cellsG.appendChild(c);
        cells.push({ ix, iy, x: cx, y: cy, rect: r, dot: c, halo: h });
      }
    }

    // Move seed
    seedHalo.setAttribute("cx", String(seed.x));
    seedHalo.setAttribute("cy", String(seed.y));
    seedCore.setAttribute("cx", String(seed.x));
    seedCore.setAttribute("cy", String(seed.y));

    // Ambient pulse on seed core
    gsap.to(seedCore, { attr: { r: 12 }, yoyo: true, repeat: -1, duration: 2, ease: "sine.inOut" });

    // Sort by distance from seed
    const sorted = [...cells].sort((a, b) => {
      const da = (a.x - seed.x) ** 2 + (a.y - seed.y) ** 2;
      const db = (b.x - seed.x) ** 2 + (b.y - seed.y) ** 2;
      return da - db;
    });

    const total = sorted.length;
    const WAVE_DUR = 5;
    const tl = gsap.timeline({ defaults: { ease: "power2.out" }, repeat: -1, repeatDelay: 2 });
    tlRef.current = tl;

    // Track activated cells for connection lines
    const activated: { x: number; y: number }[] = [];

    sorted.forEach((cell, i) => {
      const p = i / total;
      const delay = p * WAVE_DUR;
      const isWarm = seed.accent === "warm";

      // Activate cell
      tl.add(() => {
        // Cell fill + stroke
        cell.rect.setAttribute("stroke", isWarm ? "rgba(232,150,124,0.28)" : "rgba(189,166,255,0.25)");
        cell.rect.setAttribute("fill", isWarm ? "rgba(232,150,124,0.05)" : "rgba(189,166,255,0.04)");
        // Dot color
        cell.dot.setAttribute("fill", isWarm ? "rgba(242,193,174,0.85)" : "rgba(189,166,255,0.75)");
        // Halo glow
        cell.halo.setAttribute("fill", isWarm ? "rgba(232,150,124,0.12)" : "rgba(189,166,255,0.10)");

        // Draw connection lines to nearest 2 already-activated cells
        const nearest = activated
          .map((a) => ({ ...a, d: (a.x - cell.x) ** 2 + (a.y - cell.y) ** 2 }))
          .sort((a, b) => a.d - b.d)
          .slice(0, 2);
        nearest.forEach((n) => {
          if (n.d < (CELL_W * 3) ** 2) {
            drawConnection(cell.x, cell.y, n.x, n.y, seed.accent);
          }
        });

        activated.push({ x: cell.x, y: cell.y });
      }, delay);

      // Dot grows
      tl.to(cell.dot, { attr: { r: 3.8 }, duration: 0.35 }, delay);
      // Halo grows
      tl.to(cell.halo, { attr: { r: 12 }, duration: 0.5 }, delay);

      // Ripple rings at wave front intervals
      if (i % 25 === 0 && i > 0) {
        tl.add(() => spawnRipple(cell.x, cell.y, seed.accent), delay);
      }

      // Stamps
      if (i % 30 === 0 && i > 0) {
        const labelIdx = Math.floor(i / 30) % 3;
        tl.add(() => stamp(STAMP_LABELS[labelIdx], cell.x, cell.y, seed.accent), delay + 0.25);
      }
    });

    // Coverage meter (synced to wave)
    tl.to({}, {
      duration: WAVE_DUR,
      onUpdate: function (this: gsap.core.Tween) {
        const prog = this.progress();
        const val = Math.round(TARGET_COVERAGE * prog);
        fillEl.style.width = `${val}%`;
        valEl.textContent = `${val}%`;
      },
    }, 0);

    // Seed halo breathing (ellipse uses rx/ry)
    tl.to(seedHalo, { attr: { rx: 130, ry: 195 }, duration: 1.5, ease: "sine.out" }, 0.3);
    tl.to(seedHalo, { attr: { rx: 90, ry: 140 }, duration: 2, ease: "sine.inOut" }, 2);

    // Expanding wave rings from seed
    [0.2, 0.8, 1.6, 2.6].forEach((t0) => {
      tl.add(() => spawnRipple(seed.x, seed.y, seed.accent), t0);
    });

    // Reset at end for clean loop
    tl.add(() => {
      cells.forEach((cell) => {
        cell.rect.setAttribute("stroke", "rgba(140,110,220,0.22)");
        cell.rect.setAttribute("fill", "rgba(60,30,120,0.35)");
        cell.dot.setAttribute("fill", "rgba(160,130,255,0.30)");
        cell.dot.setAttribute("r", "1.8");
        cell.halo.setAttribute("fill", seed.accent === "warm" ? "rgba(232,150,124,0.0)" : "rgba(189,166,255,0.0)");
        cell.halo.setAttribute("r", "0");
      });
      linesG.innerHTML = "";
      ripplesG.innerHTML = "";
      activated.length = 0;
      fillEl.style.width = "0%";
      valEl.textContent = "0%";
    }, WAVE_DUR + 2);
  }, [stamp, spawnRipple, drawConnection]);

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
      {/* Noise texture */}
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
          gridTemplateColumns: "3fr 9fr",
          gap: "clamp(120px, 14vw, 220px)",
          alignItems: "center",
        }}
      >
        {/* ── Left column ── */}
        <div>
          <p
            className="font-mono mb-5"
            style={{
              fontSize: "12px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.45)",
            }}
          >
            [ DEPLOYMENT SURFACES ]
          </p>

          <h2
            className="mb-5"
            style={{
              fontSize: "clamp(44px, 5.2vw, 84px)",
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
              fontWeight: 800,
              color: "rgba(255,255,255,0.95)",
              textShadow: "0 10px 40px rgba(0,0,0,0.22)",
            }}
          >
            Start anywhere.
            <br />
            Coordinate everywhere.
          </h2>

          <p
            style={{
              fontSize: "clamp(15px, 1.25vw, 18px)",
              lineHeight: 1.55,
              color: "rgba(255,255,255,0.72)",
              maxWidth: "46ch",
            }}
          >
            DocG enters through a single surface — then spreads routing,
            orchestration, and governance across the system without ripping or
            replacing.
          </p>

          {/* Surface tiles */}
          <div className="flex flex-col gap-3 mt-8">
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
            borderRadius: "20px",
            border: "1px solid rgba(120,90,200,0.22)",
            background: "#1A0A3E",
            boxShadow: "0 40px 120px rgba(0,0,0,0.6), inset 0 1px 0 rgba(189,166,255,0.08)",
            minHeight: "520px",
          }}
        >
          {/* Subtle inner vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(60,20,120,0.0) 0%, rgba(10,4,30,0.45) 100%)",
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
              {/* Tall elliptical warm gradient — matches screenshot */}
              <radialGradient id="s9SeedGlow" cx="50%" cy="50%" r="50%" gradientTransform="scale(1, 1.65) translate(0, -0.19)">
                <stop offset="0%" stopColor="#F2C1AE" stopOpacity="0.72" />
                <stop offset="18%" stopColor="#E8967C" stopOpacity="0.55" />
                <stop offset="45%" stopColor="#C07060" stopOpacity="0.28" />
                <stop offset="75%" stopColor="#7B3A8A" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#3A1060" stopOpacity="0" />
              </radialGradient>
              <filter id="s9SoftGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="5" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="s9CoreGlow" x="-200%" y="-200%" width="500%" height="500%">
                <feGaussianBlur stdDeviation="10" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Connection lines layer (behind cells) */}
            <g ref={linesRef} />

            {/* Cells layer */}
            <g ref={cellsRef} />

            {/* Ripple rings layer */}
            <g ref={ripplesRef} />

            {/* Seed — tall elliptical glow + bright white core */}
            <g>
              {/* Outer warm ellipse glow */}
              <ellipse ref={seedHaloRef} cx="450" cy="260" rx="90" ry="140" fill="url(#s9SeedGlow)" />
              {/* Bright white core dot */}
              <circle ref={seedCoreRef} cx="450" cy="260" r="8" fill="rgba(255,255,255,0.95)" filter="url(#s9CoreGlow)" />
            </g>

            {/* Stamps layer (on top) */}
            <g ref={stampsRef} />
          </svg>

          {/* Coverage meter */}
          <div
            className="absolute left-[20px] right-[20px] bottom-[18px] flex items-center gap-3 z-20"
            style={{
              color: "rgba(243,239,255,0.55)",
              fontSize: "11px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontFamily: "JetBrains Mono, Geist Mono, monospace",
            }}
          >
            <div style={{ whiteSpace: "nowrap" }}>System coverage</div>
            <div
              className="flex-1 overflow-hidden"
              style={{
                height: "4px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.07)",
              }}
            >
              <div
                ref={fillRef}
                style={{
                  height: "100%",
                  width: "0%",
                  borderRadius: "999px",
                  background: "linear-gradient(90deg, #BDA6FF 0%, #E8967C 60%, #F2C1AE 100%)",
                  transition: "width 0.1s linear",
                }}
              />
            </div>
            <div
              ref={valRef}
              style={{ minWidth: "36px", textAlign: "right", color: "rgba(243,239,255,0.75)" }}
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
