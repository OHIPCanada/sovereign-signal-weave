import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";

/* ═══════════════════════════════════════════════
   Design tokens — cool clinical mint/cyan world
   ═══════════════════════════════════════════════ */
const CLINICAL_BASE = "#E7F3F2";
const CLINICAL_CYAN = "#2EE6D6";
const CLINICAL_CYAN_DIM = "rgba(46, 230, 214, 0.25)";
const ICON_WHITE = "#FFFFFF";

/* ═══════════════════════════════════════════════
   Bold clinical icons — thick strokes, white
   ═══════════════════════════════════════════════ */
const icons = {
  cortex: (
    <svg viewBox="0 0 64 64" fill="none" stroke={ICON_WHITE} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="w-11 h-11">
      <path d="M32 12 C25 12 21 17 21 22 C17 22 14 26 14 31 C14 36 17 39 21 40 C22 45 26 48 31 48" />
      <path d="M32 12 C39 12 43 17 43 22 C47 22 50 26 50 31 C50 36 47 39 43 40 C42 45 38 48 33 48" />
      <circle cx="32" cy="20" r="2.5" fill={ICON_WHITE} stroke="none" />
      <circle cx="23" cy="29" r="2" fill={ICON_WHITE} stroke="none" />
      <circle cx="41" cy="29" r="2" fill={ICON_WHITE} stroke="none" />
      <circle cx="25" cy="40" r="2" fill={ICON_WHITE} stroke="none" />
      <circle cx="39" cy="40" r="2" fill={ICON_WHITE} stroke="none" />
      <circle cx="32" cy="32" r="3" fill={ICON_WHITE} stroke="none" />
      <line x1="32" y1="20" x2="23" y2="29" strokeOpacity="0.55" />
      <line x1="32" y1="20" x2="41" y2="29" strokeOpacity="0.55" />
      <line x1="23" y1="29" x2="32" y2="32" strokeOpacity="0.45" />
      <line x1="41" y1="29" x2="32" y2="32" strokeOpacity="0.45" />
      <line x1="25" y1="40" x2="32" y2="32" strokeOpacity="0.45" />
      <line x1="39" y1="40" x2="32" y2="32" strokeOpacity="0.45" />
      <line x1="23" y1="29" x2="12" y2="27" strokeOpacity="0.4" />
      <circle cx="10" cy="26" r="1.5" fill={ICON_WHITE} stroke="none" opacity="0.5" />
      <line x1="41" y1="29" x2="52" y2="27" strokeOpacity="0.4" />
      <circle cx="54" cy="26" r="1.5" fill={ICON_WHITE} stroke="none" opacity="0.5" />
    </svg>
  ),
  clinical: (
    <svg viewBox="0 0 64 64" fill="none" stroke={ICON_WHITE} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-11 h-11">
      <circle cx="32" cy="17" r="4" fill={ICON_WHITE} fillOpacity="0.2" />
      <circle cx="15" cy="32" r="4" fill={ICON_WHITE} fillOpacity="0.2" />
      <circle cx="49" cy="32" r="4" fill={ICON_WHITE} fillOpacity="0.2" />
      <circle cx="21" cy="49" r="4" fill={ICON_WHITE} fillOpacity="0.2" />
      <circle cx="43" cy="49" r="4" fill={ICON_WHITE} fillOpacity="0.2" />
      <line x1="32" y1="21" x2="15" y2="28" />
      <line x1="32" y1="21" x2="49" y2="28" />
      <line x1="15" y1="36" x2="21" y2="45" />
      <line x1="49" y1="36" x2="43" y2="45" />
      <line x1="21" y1="49" x2="43" y2="49" strokeOpacity="0.35" />
      <line x1="15" y1="32" x2="49" y2="32" strokeOpacity="0.25" />
      <line x1="49" y1="32" x2="57" y2="32" strokeOpacity="0.4" />
      <line x1="57" y1="32" x2="57" y2="22" strokeOpacity="0.4" />
      <rect x="55" y="17" width="5" height="5" rx="1" fill={ICON_WHITE} fillOpacity="0.2" />
    </svg>
  ),
  virtualCare: (
    <svg viewBox="0 0 64 64" fill="none" stroke={ICON_WHITE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-11 h-11">
      <path d="M22 27 C22 19 27 17 32 17 C37 17 40 20 40 25" />
      <path d="M24 37 C24 45 29 47 34 47 C39 47 42 44 42 39" />
      <path d="M40 25 L40 33 C40 36 37 38 34 38 L24 37" />
      <path d="M24 37 L24 29 C24 26 27 25 30 25 L22 27" />
      <circle cx="32" cy="10" r="4" fill={ICON_WHITE} fillOpacity="0.3" />
      <circle cx="32" cy="10" r="2" fill={ICON_WHITE} stroke="none" />
      <circle cx="32" cy="54" r="4" fill={ICON_WHITE} fillOpacity="0.3" />
      <circle cx="32" cy="54" r="2" fill={ICON_WHITE} stroke="none" />
      <line x1="32" y1="14" x2="32" y2="17" strokeOpacity="0.5" />
      <line x1="34" y1="47" x2="34" y2="50" strokeOpacity="0.5" />
    </svg>
  ),
  sovereign: (
    <svg viewBox="0 0 64 64" fill="none" stroke={ICON_WHITE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-11 h-11">
      <path d="M32 7 L52 17 V37 C52 46 42 54 32 58 C22 54 12 46 12 37 V17 L32 7Z" fill={ICON_WHITE} fillOpacity="0.05" />
      <rect x="24" y="30" width="16" height="14" rx="3" fill={ICON_WHITE} fillOpacity="0.12" />
      <path d="M27 30 V25 C27 21 29 19 32 19 C35 19 37 21 37 25 V30" />
      <circle cx="32" cy="36" r="2.2" fill={ICON_WHITE} stroke="none" />
      <line x1="32" y1="38.2" x2="32" y2="42" strokeWidth="2.5" />
    </svg>
  ),
  audit: (
    <svg viewBox="0 0 64 64" fill="none" stroke={ICON_WHITE} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-11 h-11">
      <path d="M15 7 H39 L49 17 V57 H15 V7Z" fill={ICON_WHITE} fillOpacity="0.05" />
      <polyline points="39,7 39,17 49,17" />
      <line x1="22" y1="25" x2="42" y2="25" strokeOpacity="0.45" />
      <line x1="22" y1="31" x2="38" y2="31" strokeOpacity="0.45" />
      <line x1="22" y1="37" x2="34" y2="37" strokeOpacity="0.45" />
      <circle cx="42" cy="46" r="9" fill={ICON_WHITE} fillOpacity="0.1" />
      <line x1="49" y1="53" x2="55" y2="59" strokeWidth="3" />
      <polyline points="38,46 41,49 47,43" strokeWidth="2.5" />
    </svg>
  ),
};

/* ═══════════════════════════════════════════════
   Neural data filaments — electric cyan
   ═══════════════════════════════════════════════ */
interface ThreadTarget { x: number; y: number; }

const NeuralThreads = ({ targets, activeIndex, mouseX, mouseY }: {
  targets: ThreadTarget[];
  activeIndex: number;
  mouseX: number;
  mouseY: number;
}) => {
  const svgW = 180;
  const svgH = 420;
  const originX = -30;

  const threads = useMemo(() => targets.map((t, i) => {
    const originY = svgH * 0.42 + (i - 2) * 30;
    const cp1x = originX + 50 + i * 6;
    const cp1y = originY + (i % 2 === 0 ? -25 : 25);
    const cp2x = t.x - 50;
    const cp2y = t.y + (i % 2 === 0 ? 12 : -12);
    return {
      path: `M ${originX} ${originY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${t.x} ${t.y}`,
    };
  }), [targets]);

  const ox = (mouseX - 0.5) * 3;
  const oy = (mouseY - 0.5) * 2;

  return (
    <svg
      className="absolute pointer-events-none z-0"
      style={{
        left: -svgW + 30,
        top: -10,
        width: svgW,
        height: svgH,
        transform: `translate(${ox}px, ${oy}px)`,
        transition: "transform 0.5s ease-out",
      }}
      viewBox={`${originX - 15} -10 ${svgW + 30} ${svgH + 20}`}
      fill="none"
    >
      <defs>
        <linearGradient id="cyanThread" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={CLINICAL_CYAN} stopOpacity="0" />
          <stop offset="25%" stopColor={CLINICAL_CYAN} stopOpacity="0.2" />
          <stop offset="75%" stopColor={CLINICAL_CYAN} stopOpacity="0.35" />
          <stop offset="100%" stopColor={CLINICAL_CYAN} stopOpacity="0.5" />
        </linearGradient>
        <filter id="cGlow">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <radialGradient id="pulseDot">
          <stop offset="0%" stopColor={CLINICAL_CYAN} stopOpacity="1" />
          <stop offset="60%" stopColor={CLINICAL_CYAN} stopOpacity="0.5" />
          <stop offset="100%" stopColor={CLINICAL_CYAN} stopOpacity="0" />
        </radialGradient>
      </defs>

      {threads.map((t, i) => (
        <g key={i}>
          <motion.path
            d={t.path}
            stroke="url(#cyanThread)"
            strokeWidth="1.6"
            strokeLinecap="round"
            filter="url(#cGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 1.4 + i * 0.18, ease: "easeOut" }}
          />
          {/* Traveling pulse dot */}
          <motion.circle
            r="5"
            fill="url(#pulseDot)"
            animate={{ opacity: activeIndex === i ? [0, 1, 0.9, 0] : 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          >
            <animateMotion
              dur="2s"
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
   Internal shimmer particles
   ═══════════════════════════════════════════════ */
const GlassParticles = () => {
  const pts = [
    { x: 20, y: 25, s: 1.3, d: 0 },
    { x: 75, y: 20, s: 1, d: 1.5 },
    { x: 35, y: 70, s: 1.5, d: 0.8 },
    { x: 80, y: 65, s: 0.9, d: 2.2 },
    { x: 50, y: 15, s: 1.1, d: 0.3 },
    { x: 25, y: 55, s: 0.8, d: 2.5 },
    { x: 65, y: 80, s: 1.2, d: 1.8 },
    { x: 90, y: 35, s: 0.7, d: 1.1 },
  ];
  return (
    <>
      {pts.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: p.s * 2, height: p.s * 2,
            left: `${p.x}%`, top: `${p.y}%`,
            background: `radial-gradient(circle, rgba(255,255,255,0.9) 0%, ${CLINICAL_CYAN}44 100%)`,
          }}
          animate={{ opacity: [0, 0.6, 0], scale: [0.5, 1.4, 0.5] }}
          transition={{ duration: 3.5, delay: p.d, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </>
  );
};

/* ═══════════════════════════════════════════════
   Single Hex Tile — cool clinical glass crystal
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
  const px = (mouseX - 0.5) * 8 * (1 + index * 0.05);
  const py = (mouseY - 0.5) * 4 * (1 + index * 0.05);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, filter: "blur(16px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{
        transform: `translate(${px}px, ${py}px)`,
        transition: "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }}
      className="group cursor-default"
    >
      <div className="relative w-[140px] h-[122px]">
        {/* Soft vignette behind tile */}
        <div
          className="absolute inset-[-35px] pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, rgba(46, 230, 214, 0.08) 0%, transparent 60%)`,
          }}
        />

        {/* Cyan rim glow */}
        <motion.div
          className="absolute inset-[-7px]"
          style={{
            clipPath: hexClip,
            background: `linear-gradient(135deg, ${CLINICAL_CYAN}55, ${CLINICAL_CYAN}22, ${CLINICAL_CYAN}44)`,
            filter: "blur(6px)",
          }}
          animate={isActive
            ? { opacity: [0.3, 1, 0.3], scale: [1, 1.05, 1] }
            : { opacity: 0.3 }
          }
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Glass body — cool clinical mint */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            clipPath: hexClip,
            background: `linear-gradient(155deg,
              rgba(231, 243, 242, 0.8) 0%,
              rgba(220, 240, 238, 0.7) 30%,
              rgba(210, 235, 233, 0.6) 60%,
              rgba(225, 242, 241, 0.75) 100%
            )`,
            backdropFilter: "blur(24px) saturate(1.2)",
            WebkitBackdropFilter: "blur(24px) saturate(1.2)",
          }}
        >
          {/* Glass refraction streaks */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.3) 12%, transparent 25%),
                linear-gradient(255deg, transparent 45%, rgba(255,255,255,0.15) 65%, transparent 80%),
                linear-gradient(180deg, rgba(46,230,214,0.06) 0%, transparent 40%, rgba(46,230,214,0.04) 100%)
              `,
            }}
          />

          {/* Micro particles */}
          <GlassParticles />

          {/* Hover sweep */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100"
            style={{
              background: "linear-gradient(120deg, rgba(255,255,255,0.4) 0%, transparent 35%, rgba(46,230,214,0.12) 75%, transparent 100%)",
              transition: "opacity 0.5s ease",
            }}
          />
        </div>

        {/* Hex border */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 140 122" fill="none">
          <polygon
            points="70,2 138,32 138,90 70,120 2,90 2,32"
            stroke={isActive ? CLINICAL_CYAN : `${CLINICAL_BASE}`}
            strokeWidth={isActive ? "2.5" : "1.2"}
            fill="none"
            opacity={isActive ? 0.9 : 0.6}
          />
          {/* Double border for thickness */}
          <polygon
            points="70,5 135,33.5 135,88.5 70,117 5,88.5 5,33.5"
            stroke={isActive ? `${CLINICAL_CYAN}88` : `rgba(200, 230, 228, 0.3)`}
            strokeWidth="0.8"
            fill="none"
          />
        </svg>

        {/* Active pulse ring */}
        {isActive && (
          <motion.div
            className="absolute inset-[-4px] pointer-events-none"
            style={{ clipPath: hexClip }}
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
          >
            <div className="w-full h-full" style={{
              boxShadow: `inset 0 0 20px ${CLINICAL_CYAN}44, 0 0 25px ${CLINICAL_CYAN}33`,
              clipPath: hexClip,
            }} />
          </motion.div>
        )}

        {/* Icon — white with thin cyan halo */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <motion.div
            style={{
              color: ICON_WHITE,
              filter: `drop-shadow(0 0 8px ${CLINICAL_CYAN}66)`,
            }}
            animate={isActive
              ? {
                  filter: [
                    `drop-shadow(0 0 6px ${CLINICAL_CYAN}55)`,
                    `drop-shadow(0 0 18px ${CLINICAL_CYAN}AA)`,
                    `drop-shadow(0 0 6px ${CLINICAL_CYAN}55)`,
                  ],
                  scale: [1, 1.08, 1],
                }
              : {}
            }
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            {icon}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════
   Main HexHUD — 2-1-2 diamond + data threads
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

  const [activeIndex, setActiveIndex] = useState(-1);
  useEffect(() => {
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        setActiveIndex((p) => (p >= tiles.length - 1 ? -1 : p + 1));
      }, 2800);
      return () => clearInterval(iv);
    }, 3200);
    return () => clearTimeout(t);
  }, [tiles.length]);

  // Thread targets — approximate centers of each hex in layout
  const tH = 122;
  const gapY = 4;
  const r1Y = tH / 2;
  const r2Y = tH + gapY + tH / 2 - 14;
  const r3Y = 2 * (tH + gapY) + tH / 2 - 28;
  const threadTargets: ThreadTarget[] = [
    { x: 155, y: r1Y },
    { x: 155 + 140 + 24, y: r1Y },
    { x: 155 + 82, y: r2Y },
    { x: 155, y: r3Y },
    { x: 155 + 140 + 24, y: r3Y },
  ];

  return (
    <div className="relative">
      <NeuralThreads
        targets={threadTargets}
        activeIndex={activeIndex}
        mouseX={mouseX}
        mouseY={mouseY}
      />
      <div className="flex flex-col items-center" style={{ gap: `${gapY}px` }}>
        <div className="flex gap-6">
          <HexTile icon={tiles[0].icon} delay={1.6} mouseX={mouseX} mouseY={mouseY} index={0} isActive={activeIndex === 0} />
          <HexTile icon={tiles[1].icon} delay={1.75} mouseX={mouseX} mouseY={mouseY} index={1} isActive={activeIndex === 1} />
        </div>
        <div className="flex justify-center -mt-4">
          <HexTile icon={tiles[2].icon} delay={1.9} mouseX={mouseX} mouseY={mouseY} index={2} isActive={activeIndex === 2} />
        </div>
        <div className="flex gap-6 -mt-4">
          <HexTile icon={tiles[3].icon} delay={2.05} mouseX={mouseX} mouseY={mouseY} index={3} isActive={activeIndex === 3} />
          <HexTile icon={tiles[4].icon} delay={2.2} mouseX={mouseX} mouseY={mouseY} index={4} isActive={activeIndex === 4} />
        </div>
      </div>
    </div>
  );
};

export default HexHUD;
