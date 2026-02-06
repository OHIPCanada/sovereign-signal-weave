import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";

/* ═══════════════════════════════════════════════
   Design tokens from brief
   ═══════════════════════════════════════════════ */
const CORTEX_VIOLET = "#800080";
const BIO_ELECTRIC_BLUE = "#7B61FF";
const SOVEREIGN_LAVENDER = "#E6E6FA";
const HEX_CORE = "#D8C9FF";

/* ═══════════════════════════════════════════════
   Premium SVG Icons — bold, white, clinical
   ═══════════════════════════════════════════════ */
const icons = {
  cortex: (
    <svg viewBox="0 0 64 64" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
      <path d="M32 14 C26 14 22 18 22 22 C18 22 16 26 16 30 C16 34 18 37 22 38 C22 42 26 46 30 46" />
      <path d="M32 14 C38 14 42 18 42 22 C46 22 48 26 48 30 C48 34 46 37 42 38 C42 42 38 46 34 46" />
      <circle cx="32" cy="20" r="2.5" fill="white" stroke="none" />
      <circle cx="24" cy="28" r="2" fill="white" stroke="none" />
      <circle cx="40" cy="28" r="2" fill="white" stroke="none" />
      <circle cx="26" cy="38" r="2" fill="white" stroke="none" />
      <circle cx="38" cy="38" r="2" fill="white" stroke="none" />
      <circle cx="32" cy="32" r="3" fill="white" stroke="none" />
      <line x1="32" y1="20" x2="24" y2="28" strokeOpacity="0.6" />
      <line x1="32" y1="20" x2="40" y2="28" strokeOpacity="0.6" />
      <line x1="24" y1="28" x2="32" y2="32" strokeOpacity="0.5" />
      <line x1="40" y1="28" x2="32" y2="32" strokeOpacity="0.5" />
      <line x1="26" y1="38" x2="32" y2="32" strokeOpacity="0.5" />
      <line x1="38" y1="38" x2="32" y2="32" strokeOpacity="0.5" />
      <line x1="24" y1="28" x2="14" y2="26" strokeOpacity="0.5" />
      <circle cx="12" cy="25" r="1.5" fill="white" stroke="none" opacity="0.6" />
      <line x1="40" y1="28" x2="50" y2="26" strokeOpacity="0.5" />
      <circle cx="52" cy="25" r="1.5" fill="white" stroke="none" opacity="0.6" />
      <line x1="32" y1="20" x2="32" y2="10" strokeOpacity="0.5" />
      <circle cx="32" cy="8" r="1.5" fill="white" stroke="none" opacity="0.6" />
    </svg>
  ),
  clinical: (
    <svg viewBox="0 0 64 64" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
      <circle cx="32" cy="18" r="3.5" fill="white" fillOpacity="0.25" />
      <circle cx="16" cy="32" r="3.5" fill="white" fillOpacity="0.25" />
      <circle cx="48" cy="32" r="3.5" fill="white" fillOpacity="0.25" />
      <circle cx="22" cy="48" r="3.5" fill="white" fillOpacity="0.25" />
      <circle cx="42" cy="48" r="3.5" fill="white" fillOpacity="0.25" />
      <line x1="32" y1="21.5" x2="16" y2="28.5" />
      <line x1="32" y1="21.5" x2="48" y2="28.5" />
      <line x1="16" y1="35.5" x2="22" y2="44.5" />
      <line x1="48" y1="35.5" x2="42" y2="44.5" />
      <line x1="22" y1="48" x2="42" y2="48" strokeOpacity="0.4" />
      <line x1="16" y1="32" x2="48" y2="32" strokeOpacity="0.3" />
      <line x1="32" y1="21.5" x2="22" y2="44.5" strokeOpacity="0.2" />
      <line x1="32" y1="21.5" x2="42" y2="44.5" strokeOpacity="0.2" />
      <line x1="48" y1="32" x2="56" y2="32" strokeOpacity="0.5" />
      <line x1="56" y1="32" x2="56" y2="22" strokeOpacity="0.5" />
      <rect x="54" y="18" width="5" height="5" rx="1" fill="white" fillOpacity="0.2" />
      <line x1="56" y1="32" x2="56" y2="44" strokeOpacity="0.5" />
      <rect x="54" y="44" width="5" height="5" rx="1" fill="white" fillOpacity="0.2" />
    </svg>
  ),
  virtualCare: (
    <svg viewBox="0 0 64 64" fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
      <path d="M22 28 C22 20 27 18 32 18 C37 18 40 21 40 26" />
      <path d="M24 38 C24 44 29 46 34 46 C39 46 42 43 42 38" />
      <path d="M40 26 L40 33 C40 36 37 38 34 38 L24 38" />
      <path d="M24 38 L24 31 C24 28 27 26 30 26 L22 28" />
      <circle cx="32" cy="11" r="3.5" fill="white" fillOpacity="0.35" />
      <circle cx="32" cy="11" r="1.8" fill="white" stroke="none" />
      <circle cx="32" cy="53" r="3.5" fill="white" fillOpacity="0.35" />
      <circle cx="32" cy="53" r="1.8" fill="white" stroke="none" />
      <line x1="32" y1="14.5" x2="32" y2="18" strokeOpacity="0.5" />
      <line x1="34" y1="46" x2="34" y2="49.5" strokeOpacity="0.5" />
    </svg>
  ),
  sovereign: (
    <svg viewBox="0 0 64 64" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
      <path d="M32 8 L50 17 V36 C50 44 42 52 32 56 C22 52 14 44 14 36 V17 L32 8Z" fill="white" fillOpacity="0.06" />
      <rect x="25" y="31" width="14" height="12" rx="2.5" fill="white" fillOpacity="0.15" />
      <path d="M28 31 V27 C28 23 30 21 32 21 C34 21 36 23 36 27 V31" />
      <circle cx="32" cy="36" r="2" fill="white" stroke="none" />
      <line x1="32" y1="38" x2="32" y2="41" strokeWidth="2.5" />
    </svg>
  ),
  audit: (
    <svg viewBox="0 0 64 64" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
      <path d="M16 8 H38 L48 18 V56 H16 V8Z" fill="white" fillOpacity="0.06" />
      <polyline points="38,8 38,18 48,18" />
      <line x1="22" y1="26" x2="40" y2="26" strokeOpacity="0.5" />
      <line x1="22" y1="32" x2="36" y2="32" strokeOpacity="0.5" />
      <line x1="22" y1="38" x2="32" y2="38" strokeOpacity="0.5" />
      <circle cx="41" cy="45" r="8" fill="white" fillOpacity="0.12" />
      <line x1="47" y1="51" x2="53" y2="57" strokeWidth="2.8" />
      <polyline points="37,45 40,48 46,42" strokeWidth="2.2" />
    </svg>
  ),
};

/* ═══════════════════════════════════════════════
   Neural Data Threads — emanate from brain (left)
   ═══════════════════════════════════════════════ */
interface ThreadTarget {
  x: number;
  y: number;
}

const NeuralThreads = ({ targets, activeIndex, mouseX, mouseY }: {
  targets: ThreadTarget[];
  activeIndex: number;
  mouseX: number;
  mouseY: number;
}) => {
  const svgW = 160;
  const svgH = 380;
  const originX = -20;

  const threads = useMemo(() => targets.map((t, i) => {
    const originY = svgH * 0.4 + (i - 2) * 25; // spread origins vertically from brain center
    const cp1x = originX + 40 + i * 8;
    const cp1y = originY + (i % 2 === 0 ? -20 : 20);
    const cp2x = t.x - 40;
    const cp2y = t.y + (i % 2 === 0 ? 10 : -10);
    return {
      path: `M ${originX} ${originY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${t.x} ${t.y}`,
      originY,
    };
  }), [targets]);

  const offsetX = (mouseX - 0.5) * 3;
  const offsetY = (mouseY - 0.5) * 2;

  return (
    <svg
      className="absolute pointer-events-none z-0"
      style={{
        left: -svgW + 20,
        top: 0,
        width: svgW,
        height: svgH,
        transform: `translate(${offsetX}px, ${offsetY}px)`,
        transition: "transform 0.5s ease-out",
      }}
      viewBox={`${originX - 10} 0 ${svgW + 20} ${svgH}`}
      fill="none"
    >
      <defs>
        <linearGradient id="threadFill" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={CORTEX_VIOLET} stopOpacity="0" />
          <stop offset="30%" stopColor={CORTEX_VIOLET} stopOpacity="0.12" />
          <stop offset="70%" stopColor={CORTEX_VIOLET} stopOpacity="0.18" />
          <stop offset="100%" stopColor={SOVEREIGN_LAVENDER} stopOpacity="0.25" />
        </linearGradient>
        <filter id="tGlow">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <radialGradient id="pulseGrad">
          <stop offset="0%" stopColor={BIO_ELECTRIC_BLUE} stopOpacity="0.9" />
          <stop offset="100%" stopColor={BIO_ELECTRIC_BLUE} stopOpacity="0" />
        </radialGradient>
      </defs>

      {threads.map((t, i) => (
        <g key={i}>
          {/* Base thread line */}
          <motion.path
            d={t.path}
            stroke="url(#threadFill)"
            strokeWidth="1.8"
            strokeLinecap="round"
            filter="url(#tGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.4, delay: 1.5 + i * 0.2, ease: "easeOut" }}
          />

          {/* Traveling pulse */}
          <motion.circle
            r="4"
            fill="url(#pulseGrad)"
            animate={{ opacity: activeIndex === i ? [0, 1, 0.8, 0] : 0 }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
          >
            <animateMotion
              dur="2.2s"
              begin={activeIndex === i ? "0s" : "indefinite"}
              fill="freeze"
              path={t.path}
              keyPoints="0;1"
              keyTimes="0;1"
            />
          </motion.circle>
        </g>
      ))}
    </svg>
  );
};

/* ═══════════════════════════════════════════════
   Sparkle micro-particles inside hex glass
   ═══════════════════════════════════════════════ */
const Sparkles = () => {
  const dots = [
    { cx: 22, cy: 28, r: 1.2, d: 0 },
    { cx: 78, cy: 22, r: 1, d: 1.4 },
    { cx: 38, cy: 72, r: 1.4, d: 0.7 },
    { cx: 82, cy: 62, r: 0.8, d: 2 },
    { cx: 52, cy: 18, r: 1, d: 0.4 },
    { cx: 28, cy: 58, r: 0.9, d: 2.3 },
    { cx: 68, cy: 78, r: 1.1, d: 1.6 },
    { cx: 88, cy: 38, r: 0.7, d: 1 },
    { cx: 45, cy: 45, r: 1.3, d: 0.2 },
    { cx: 60, cy: 55, r: 0.9, d: 1.8 },
  ];

  return (
    <>
      {dots.map((d, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{ width: d.r * 2, height: d.r * 2, left: `${d.cx}%`, top: `${d.cy}%` }}
          animate={{ opacity: [0, 0.7, 0], scale: [0.5, 1.3, 0.5] }}
          transition={{ duration: 3, delay: d.d, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </>
  );
};

/* ═══════════════════════════════════════════════
   Single Hex Tile — frosted glass hologram
   ═══════════════════════════════════════════════ */
const hexClip = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

interface HexTileProps {
  icon: React.ReactNode;
  delay: number;
  mouseX: number;
  mouseY: number;
  index: number;
  isActive: boolean;
}

const HexTile = ({ icon, delay, mouseX, mouseY, index, isActive }: HexTileProps) => {
  const px = (mouseX - 0.5) * 8 * (1 + index * 0.06);
  const py = (mouseY - 0.5) * 4 * (1 + index * 0.06);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.65, filter: "blur(14px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{
        transform: `translate(${px}px, ${py}px)`,
        transition: "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }}
      className="group cursor-default"
    >
      <div className="relative w-[130px] h-[114px]">
        {/* Soft radial vignette behind tile — helps it pop on white bg */}
        <div
          className="absolute inset-[-30px] pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, rgba(216, 201, 255, 0.18) 0%, transparent 65%)`,
          }}
        />

        {/* Rim glow — Sovereign Lavender */}
        <motion.div
          className="absolute inset-[-6px]"
          style={{
            clipPath: hexClip,
            background: `linear-gradient(135deg, ${SOVEREIGN_LAVENDER}66, ${SOVEREIGN_LAVENDER}33, ${SOVEREIGN_LAVENDER}55)`,
            filter: "blur(5px)",
          }}
          animate={isActive
            ? { opacity: [0.4, 0.9, 0.4], scale: [1, 1.04, 1] }
            : { opacity: 0.35 }
          }
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Glass hex body — darker lavender core */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            clipPath: hexClip,
            background: `linear-gradient(155deg,
              rgba(220, 212, 255, 0.7) 0%,
              ${HEX_CORE}AA 35%,
              ${HEX_CORE}88 60%,
              rgba(230, 225, 255, 0.65) 100%
            )`,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          {/* Internal light refraction streaks */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.2) 15%, transparent 30%),
                linear-gradient(250deg, transparent 50%, rgba(255,255,255,0.12) 70%, transparent 85%)
              `,
            }}
          />

          {/* Sparkle micro-particles */}
          <Sparkles />

          {/* Hover shimmer sweep */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100"
            style={{
              background: "linear-gradient(120deg, rgba(255,255,255,0.35) 0%, transparent 40%, rgba(200,185,255,0.15) 80%, transparent 100%)",
              transition: "opacity 0.6s ease",
            }}
          />
        </div>

        {/* Hex border SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 130 114" fill="none">
          <polygon
            points="65,2 128,29.5 128,84.5 65,112 2,84.5 2,29.5"
            stroke={isActive ? BIO_ELECTRIC_BLUE : `${SOVEREIGN_LAVENDER}88`}
            strokeWidth={isActive ? "2" : "1"}
            fill="none"
            opacity={isActive ? 0.8 : 0.5}
          />
        </svg>

        {/* Active pulse ring */}
        {isActive && (
          <motion.div
            className="absolute inset-[-3px]"
            style={{
              clipPath: hexClip,
              border: `2px solid ${BIO_ELECTRIC_BLUE}`,
              boxShadow: `0 0 20px ${BIO_ELECTRIC_BLUE}44, inset 0 0 15px ${BIO_ELECTRIC_BLUE}22`,
            }}
            animate={{ opacity: [0, 0.7, 0] }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
          />
        )}

        {/* Icon — white with lavender glow */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <motion.div
            style={{
              color: "white",
              filter: `drop-shadow(0 0 10px rgba(200, 185, 255, 0.5))`,
            }}
            animate={isActive
              ? {
                  filter: [
                    `drop-shadow(0 0 8px rgba(123, 97, 255, 0.4))`,
                    `drop-shadow(0 0 20px rgba(123, 97, 255, 0.8))`,
                    `drop-shadow(0 0 8px rgba(123, 97, 255, 0.4))`,
                  ],
                  scale: [1, 1.1, 1],
                }
              : {}
            }
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            {icon}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════
   Main HexHUD — 2-1-2 diamond layout + threads
   ═══════════════════════════════════════════════ */
interface HexHUDProps {
  mouseX: number;
  mouseY: number;
}

const HexHUD = ({ mouseX, mouseY }: HexHUDProps) => {
  const tiles = [
    { icon: icons.cortex },
    { icon: icons.clinical },
    { icon: icons.virtualCare },
    { icon: icons.sovereign },
    { icon: icons.audit },
  ];

  // Cycle active tile for pulse animation (2.5s per tile)
  const [activeIndex, setActiveIndex] = useState(-1);
  useEffect(() => {
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setActiveIndex((prev) => {
          if (prev >= tiles.length - 1) return -1; // brief pause
          return prev + 1;
        });
      }, 2500);
      return () => clearInterval(interval);
    }, 3000); // initial delay for entrance animations
    return () => clearTimeout(timeout);
  }, [tiles.length]);

  // Thread target positions relative to the HexHUD container
  // Corresponds to center of each hex in the 2-1-2 layout
  const tileH = 114;
  const gap = 8;
  const row1Y = tileH / 2;
  const row2Y = tileH + gap + tileH / 2 - 10;
  const row3Y = 2 * (tileH + gap) + tileH / 2 - 20;
  const threadTargets: ThreadTarget[] = [
    { x: 140, y: row1Y - 5 },       // top-left
    { x: 140 + 130 + 24, y: row1Y - 5 }, // top-right
    { x: 140 + 77, y: row2Y },      // center
    { x: 140, y: row3Y + 5 },       // bottom-left
    { x: 140 + 130 + 24, y: row3Y + 5 }, // bottom-right
  ];

  return (
    <div className="relative">
      {/* Neural data threads from brain */}
      <NeuralThreads
        targets={threadTargets}
        activeIndex={activeIndex}
        mouseX={mouseX}
        mouseY={mouseY}
      />

      {/* Hex tile diamond grid */}
      <div className="flex flex-col items-center" style={{ gap: `${gap}px` }}>
        {/* Row 1: 2 hexagons */}
        <div className="flex gap-6">
          <HexTile icon={tiles[0].icon} delay={1.7} mouseX={mouseX} mouseY={mouseY} index={0} isActive={activeIndex === 0} />
          <HexTile icon={tiles[1].icon} delay={1.85} mouseX={mouseX} mouseY={mouseY} index={1} isActive={activeIndex === 1} />
        </div>
        {/* Row 2: 1 centered */}
        <div className="flex justify-center -mt-3">
          <HexTile icon={tiles[2].icon} delay={2.0} mouseX={mouseX} mouseY={mouseY} index={2} isActive={activeIndex === 2} />
        </div>
        {/* Row 3: 2 hexagons */}
        <div className="flex gap-6 -mt-3">
          <HexTile icon={tiles[3].icon} delay={2.15} mouseX={mouseX} mouseY={mouseY} index={3} isActive={activeIndex === 3} />
          <HexTile icon={tiles[4].icon} delay={2.3} mouseX={mouseX} mouseY={mouseY} index={4} isActive={activeIndex === 4} />
        </div>
      </div>
    </div>
  );
};

export default HexHUD;
