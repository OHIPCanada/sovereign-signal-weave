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
  { key: "emr",      title: "EMR Events",    desc: "Data comes in, actions go out" },
  { key: "pathways", title: "Care Pathways",  desc: "Managing decisions & escalations" },
  { key: "ops",      title: "Clinical Ops",   desc: "Handling staffing & handoffs" },
  { key: "audit",    title: "Policy + Audit", desc: "Tracking everything by default" },
  { key: "access",   title: "Patient Access", desc: "Better triage & scheduling" },
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
  const seedHaloRef = useRef<SVGCircleElement>(null);
  const seedCoreRef = useRef<SVGCircleElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const hasAutoRun = useRef(false);
  const currentSeedIdxRef = useRef(0);
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
  const runDiffusion = useCallback((seedKey: string, manualIdx?: number) => {
    // Sync button index
    const idx = manualIdx ?? SURFACES.findIndex((s) => s.key === seedKey);
    if (idx !== -1) currentSeedIdxRef.current = idx;
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
        r.setAttribute("x", String(x + 5));
        r.setAttribute("y", String(y + 5));
        r.setAttribute("rx", "8");
        r.setAttribute("ry", "8");
        r.setAttribute("width", String(Math.max(0, CELL_W - 10)));
        r.setAttribute("height", String(Math.max(0, CELL_H - 10)));
        r.setAttribute("fill", "rgba(255,255,255,0.00)");
        r.setAttribute("stroke", "rgba(189,166,255,0.08)");
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
        c.setAttribute("r", "2");
        c.setAttribute("fill", "rgba(189,166,255,0.15)");

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
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
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

    // Seed halo breathing
    tl.to(seedHalo, { attr: { r: 130 }, duration: 1.5, ease: "sine.out" }, 0.3);
    tl.to(seedHalo, { attr: { r: 90 }, duration: 2, ease: "sine.inOut" }, 2);

    // Expanding wave rings from seed
    [0.2, 0.8, 1.6, 2.6].forEach((t0) => {
      tl.add(() => spawnRipple(seed.x, seed.y, seed.accent), t0);
    });

    // Reset + auto-advance to next surface
    tl.add(() => {
      cells.forEach((cell) => {
        cell.rect.setAttribute("stroke", "rgba(189,166,255,0.08)");
        cell.rect.setAttribute("fill", "rgba(255,255,255,0.00)");
        cell.dot.setAttribute("fill", "rgba(189,166,255,0.15)");
        cell.dot.setAttribute("r", "2");
        cell.halo.setAttribute("fill", seed.accent === "warm" ? "rgba(232,150,124,0.0)" : "rgba(189,166,255,0.0)");
        cell.halo.setAttribute("r", "0");
      });
      linesG.innerHTML = "";
      ripplesG.innerHTML = "";
      activated.length = 0;
      fillEl.style.width = "0%";
      valEl.textContent = "0%";

      // Advance to next surface after a short pause
      setTimeout(() => {
        const nextIdx = (currentSeedIdxRef.current + 1) % SURFACES.length;
        runDiffusion(SURFACES[nextIdx].key, nextIdx);
      }, 800);
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
            currentSeedIdxRef.current = 0;
            runDiffusion(SURFACES[0].key, 0);
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
      id="deployment-surfaces"
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
        className="mx-auto flex flex-col items-center px-4 sm:px-0"
        style={{
          width: "min(1200px, 92vw)",
          gap: "clamp(36px, 6vw, 80px)",
        }}
      >
        {/* ── Text block (top, centered) ── */}
        <div className="text-center">
          <p
            className="font-mono mb-5"
            style={{
              fontSize: 12,
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
            Start small.
            <br />
            Scale everywhere.
          </h2>

          <p
            style={{
              fontSize: "clamp(15px, 1.25vw, 18px)",
              lineHeight: 1.55,
              color: "rgba(255,255,255,0.72)",
              maxWidth: "46ch",
              margin: "0 auto",
            }}
          >
            You can start using DocG AI in one department. From there, it
            spreads its routing and governance across your whole system. You
            don't need to "rip and replace" anything.
          </p>

          {/* Surface tiles — segmented tab bar */}
          <div
            className="flex flex-nowrap mt-6 sm:mt-8 overflow-x-auto scrollbar-hide"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(189,166,255,0.18)",
              borderRadius: "16px",
              padding: "5px",
              gap: "2px",
              backdropFilter: "blur(12px)",
              justifyContent: "flex-start",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {SURFACES.map((s, i) => (
              <button
                key={s.key}
                onClick={() => runDiffusion(s.key, i)}
                style={{
                  position: "relative",
                  padding: "10px 18px",
                  borderRadius: "11px",
                  border: "none",
                  background: activeSeed === s.key
                    ? "linear-gradient(135deg, rgba(189,166,255,0.22), rgba(232,150,124,0.14))"
                    : "transparent",
                  boxShadow: activeSeed === s.key
                    ? "0 0 0 1px rgba(189,166,255,0.35), inset 0 1px 0 rgba(255,255,255,0.08)"
                    : "none",
                  cursor: "pointer",
                  transition: "all 0.22s ease",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                <div style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: activeSeed === s.key ? "rgba(243,239,255,0.95)" : "rgba(243,239,255,0.45)",
                  marginBottom: "2px",
                  transition: "color 0.22s ease",
                }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: activeSeed === s.key ? "rgba(243,239,255,0.95)" : "rgba(243,239,255,0.55)",
                  transition: "color 0.22s ease",
                  lineHeight: 1.2,
                }}>
                  {s.title}
                </div>
                <div style={{
                  fontSize: "10px",
                  color: activeSeed === s.key ? "rgba(189,166,255,0.75)" : "rgba(243,239,255,0.30)",
                  marginTop: "2px",
                  transition: "color 0.22s ease",
                  lineHeight: 1.2,
                }}>
                  {s.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Animation card (bottom, full width) ── */}
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
            minHeight: "clamp(300px, 60vw, 520px)",
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
            style={{ minHeight: "clamp(300px, 60vw, 520px)" }}
          >
            <defs>
              <radialGradient id="s9SeedGlow" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="#F2C1AE" stopOpacity="0.55" />
                <stop offset="35%" stopColor="#E8967C" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#BDA6FF" stopOpacity="0" />
              </radialGradient>
              <filter id="s9SoftGlow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="8" result="b" />
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

            {/* Seed */}
            <g>
              <circle ref={seedHaloRef} cx="450" cy="260" r="90" fill="url(#s9SeedGlow)" />
              <circle ref={seedCoreRef} cx="450" cy="260" r="8" fill="#BDA6FF" filter="url(#s9SoftGlow)" />
            </g>

            {/* Stamps layer (on top) */}
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
                  transition: "width 0.1s linear",
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

