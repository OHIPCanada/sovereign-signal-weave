import { motion } from "framer-motion";
import { useState, useEffect } from "react";

/* ─── Premium SVG Icons (larger, bolder, white) ─── */
const icons = {
  cortex: (
    <svg viewBox="0 0 64 64" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
      {/* Brain with circuit nodes */}
      <path d="M32 14 C26 14 22 18 22 22 C18 22 16 26 16 30 C16 34 18 37 22 38 C22 42 26 46 30 46" />
      <path d="M32 14 C38 14 42 18 42 22 C46 22 48 26 48 30 C48 34 46 37 42 38 C42 42 38 46 34 46" />
      <line x1="32" y1="14" x2="32" y2="46" strokeOpacity="0.4" />
      <circle cx="32" cy="20" r="2" fill="white" stroke="none" />
      <circle cx="24" cy="28" r="2" fill="white" stroke="none" />
      <circle cx="40" cy="28" r="2" fill="white" stroke="none" />
      <circle cx="26" cy="38" r="2" fill="white" stroke="none" />
      <circle cx="38" cy="38" r="2" fill="white" stroke="none" />
      <circle cx="32" cy="32" r="2.5" fill="white" stroke="none" />
      <line x1="32" y1="20" x2="24" y2="28" strokeOpacity="0.5" />
      <line x1="32" y1="20" x2="40" y2="28" strokeOpacity="0.5" />
      <line x1="24" y1="28" x2="26" y2="38" strokeOpacity="0.5" />
      <line x1="40" y1="28" x2="38" y2="38" strokeOpacity="0.5" />
      <line x1="32" y1="32" x2="24" y2="28" strokeOpacity="0.5" />
      <line x1="32" y1="32" x2="40" y2="28" strokeOpacity="0.5" />
      {/* Outer circuit spokes */}
      <line x1="24" y1="28" x2="16" y2="28" strokeOpacity="0.6" />
      <circle cx="14" cy="28" r="1.5" fill="white" stroke="none" opacity="0.7" />
      <line x1="40" y1="28" x2="48" y2="28" strokeOpacity="0.6" />
      <circle cx="50" cy="28" r="1.5" fill="white" stroke="none" opacity="0.7" />
      <line x1="32" y1="20" x2="32" y2="12" strokeOpacity="0.6" />
      <circle cx="32" cy="10" r="1.5" fill="white" stroke="none" opacity="0.7" />
      <line x1="26" y1="38" x2="20" y2="44" strokeOpacity="0.6" />
      <circle cx="18" cy="46" r="1.5" fill="white" stroke="none" opacity="0.7" />
      <line x1="38" y1="38" x2="44" y2="44" strokeOpacity="0.6" />
      <circle cx="46" cy="46" r="1.5" fill="white" stroke="none" opacity="0.7" />
    </svg>
  ),
  clinical: (
    <svg viewBox="0 0 64 64" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
      {/* Network mesh with circuit board elements */}
      <circle cx="32" cy="20" r="3" fill="white" fillOpacity="0.3" />
      <circle cx="18" cy="32" r="3" fill="white" fillOpacity="0.3" />
      <circle cx="46" cy="32" r="3" fill="white" fillOpacity="0.3" />
      <circle cx="24" cy="46" r="3" fill="white" fillOpacity="0.3" />
      <circle cx="40" cy="46" r="3" fill="white" fillOpacity="0.3" />
      {/* Mesh connections */}
      <line x1="32" y1="23" x2="18" y2="29" />
      <line x1="32" y1="23" x2="46" y2="29" />
      <line x1="18" y1="35" x2="24" y2="43" />
      <line x1="46" y1="35" x2="40" y2="43" />
      <line x1="18" y1="35" x2="46" y2="35" strokeOpacity="0.4" />
      <line x1="24" y1="46" x2="40" y2="46" strokeOpacity="0.4" />
      <line x1="32" y1="23" x2="24" y2="43" strokeOpacity="0.3" />
      <line x1="32" y1="23" x2="40" y2="43" strokeOpacity="0.3" />
      {/* Circuit traces on right */}
      <line x1="46" y1="32" x2="54" y2="32" />
      <line x1="54" y1="32" x2="54" y2="22" />
      <line x1="54" y1="22" x2="48" y2="22" />
      <rect x="46" y="20" width="4" height="4" rx="0.5" fill="white" fillOpacity="0.3" />
      <line x1="54" y1="32" x2="54" y2="42" />
      <rect x="52" y="42" width="4" height="4" rx="0.5" fill="white" fillOpacity="0.3" />
    </svg>
  ),
  virtualCare: (
    <svg viewBox="0 0 64 64" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
      {/* Chain link with person nodes */}
      <path d="M24 28 C24 22 28 20 32 20 C36 20 38 22 38 26" />
      <path d="M26 36 C26 42 30 44 34 44 C38 44 40 42 40 38" />
      <path d="M38 26 L38 32 C38 34 36 36 34 36 L26 36" />
      <path d="M26 36 L26 32 C26 30 28 28 30 28 L24 28" />
      {/* Person node top */}
      <circle cx="32" cy="13" r="3" fill="white" fillOpacity="0.4" />
      <circle cx="32" cy="13" r="1.5" fill="white" stroke="none" />
      {/* Person node bottom */}
      <circle cx="32" cy="51" r="3" fill="white" fillOpacity="0.4" />
      <circle cx="32" cy="51" r="1.5" fill="white" stroke="none" />
      <line x1="32" y1="16" x2="32" y2="20" strokeOpacity="0.6" />
      <line x1="34" y1="44" x2="34" y2="48" strokeOpacity="0.6" />
    </svg>
  ),
  sovereign: (
    <svg viewBox="0 0 64 64" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
      {/* Shield with lock */}
      <path d="M32 10 L48 18 V34 C48 42 40 50 32 54 C24 50 16 42 16 34 V18 L32 10Z" fill="white" fillOpacity="0.08" />
      {/* Lock body */}
      <rect x="26" y="32" width="12" height="10" rx="2" fill="white" fillOpacity="0.2" />
      {/* Lock shackle */}
      <path d="M28 32 V28 C28 24 30 22 32 22 C34 22 36 24 36 28 V32" />
      {/* Keyhole */}
      <circle cx="32" cy="36" r="1.5" fill="white" stroke="none" />
      <line x1="32" y1="37.5" x2="32" y2="40" strokeWidth="2" />
    </svg>
  ),
  audit: (
    <svg viewBox="0 0 64 64" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
      {/* Document */}
      <path d="M18 10 H38 L46 18 V54 H18 V10Z" fill="white" fillOpacity="0.08" />
      <polyline points="38,10 38,18 46,18" />
      {/* Text lines */}
      <line x1="24" y1="26" x2="40" y2="26" strokeOpacity="0.5" />
      <line x1="24" y1="32" x2="36" y2="32" strokeOpacity="0.5" />
      <line x1="24" y1="38" x2="34" y2="38" strokeOpacity="0.5" />
      {/* Magnifying glass with check */}
      <circle cx="40" cy="44" r="7" fill="white" fillOpacity="0.15" />
      <line x1="45" y1="49" x2="50" y2="54" strokeWidth="2.5" />
      <polyline points="36,44 39,47 44,41" strokeWidth="2" />
    </svg>
  ),
};

/* ─── Hexagon SVG border for glass tiles ─── */
const HexBorder = ({ glow }: { glow: boolean }) => (
  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 120 104" fill="none" preserveAspectRatio="none">
    <defs>
      <linearGradient id="hexBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(220, 210, 255, 0.6)" />
        <stop offset="50%" stopColor="rgba(200, 190, 255, 0.3)" />
        <stop offset="100%" stopColor="rgba(230, 225, 255, 0.5)" />
      </linearGradient>
    </defs>
    <polygon
      points="60,2 118,28 118,76 60,102 2,76 2,28"
      stroke="url(#hexBorderGrad)"
      strokeWidth={glow ? "2" : "1.2"}
      fill="none"
    />
    {glow && (
      <polygon
        points="60,2 118,28 118,76 60,102 2,76 2,28"
        stroke="rgba(200, 185, 255, 0.4)"
        strokeWidth="4"
        fill="none"
        filter="blur(4px)"
      />
    )}
  </svg>
);

/* ─── Sparkle dots inside hex ─── */
const Sparkles = () => {
  const dots = [
    { cx: 25, cy: 30, r: 1, delay: 0 },
    { cx: 75, cy: 25, r: 0.8, delay: 1.2 },
    { cx: 40, cy: 70, r: 1.2, delay: 0.6 },
    { cx: 85, cy: 60, r: 0.7, delay: 1.8 },
    { cx: 55, cy: 20, r: 0.9, delay: 0.3 },
    { cx: 30, cy: 55, r: 0.6, delay: 2.1 },
    { cx: 70, cy: 75, r: 1, delay: 1.5 },
    { cx: 90, cy: 40, r: 0.8, delay: 0.9 },
  ];

  return (
    <>
      {dots.map((d, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: d.r * 2,
            height: d.r * 2,
            left: `${d.cx}%`,
            top: `${d.cy}%`,
          }}
          animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1.2, 0.5] }}
          transition={{
            duration: 2.5,
            delay: d.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
};

/* ─── Single Hex Tile ─── */
const hexClipPath = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

interface HexTileProps {
  icon: React.ReactNode;
  delay: number;
  mouseX: number;
  mouseY: number;
  index: number;
  isActive: boolean;
}

const HexTile = ({ icon, delay, mouseX, mouseY, index, isActive }: HexTileProps) => {
  const parallaxX = (mouseX - 0.5) * 10 * (1 + index * 0.08);
  const parallaxY = (mouseY - 0.5) * 5 * (1 + index * 0.08);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, filter: "blur(12px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{
        transform: `translate(${parallaxX}px, ${parallaxY}px)`,
        transition: "transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }}
      className="group cursor-default"
    >
      <div className="relative w-[110px] h-[96px]">
        {/* Outer glow */}
        <motion.div
          className="absolute inset-[-8px] rounded-full"
          style={{
            background: "radial-gradient(ellipse at center, rgba(190, 170, 255, 0.25) 0%, transparent 70%)",
            filter: "blur(8px)",
          }}
          animate={isActive ? { opacity: [0.3, 0.7, 0.3] } : { opacity: 0.2 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Glass hex body */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            clipPath: hexClipPath,
            background: "linear-gradient(150deg, rgba(210, 195, 255, 0.55) 0%, rgba(190, 170, 255, 0.45) 30%, rgba(200, 190, 255, 0.35) 60%, rgba(220, 215, 255, 0.5) 100%)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        >
          {/* Internal light streaks */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 20%, transparent 40%, rgba(255,255,255,0.1) 60%, transparent 80%)",
            }}
          />

          {/* Sparkle particles */}
          <Sparkles />

          {/* Hover shimmer */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%, rgba(200,185,255,0.2) 100%)",
            }}
          />
        </div>

        {/* Hex border */}
        <HexBorder glow={isActive} />

        {/* Icon centered */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <motion.div
            className="text-white drop-shadow-[0_0_12px_rgba(200,185,255,0.5)]"
            animate={isActive ? { scale: [1, 1.08, 1], filter: ["drop-shadow(0 0 8px rgba(200,185,255,0.4))", "drop-shadow(0 0 16px rgba(200,185,255,0.7))", "drop-shadow(0 0 8px rgba(200,185,255,0.4))"] } : {}}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            {icon}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Main HexHUD Component ─── */
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
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % (tiles.length + 1) === tiles.length ? -1 : (prev + 1) % (tiles.length + 1));
    }, 2400);
    return () => clearInterval(interval);
  }, [tiles.length]);

  // Staggered grid layout: row 1 has 2, row 2 (center) has 1, row 3 has 2
  return (
    <div className="flex flex-col items-center gap-2">
      {/* Row 1: 2 hexagons */}
      <div className="flex gap-6">
        <HexTile icon={tiles[0].icon} delay={1.8} mouseX={mouseX} mouseY={mouseY} index={0} isActive={activeIndex === 0} />
        <HexTile icon={tiles[1].icon} delay={1.94} mouseX={mouseX} mouseY={mouseY} index={1} isActive={activeIndex === 1} />
      </div>
      {/* Row 2: 1 centered hexagon */}
      <div className="flex justify-center -mt-2">
        <HexTile icon={tiles[2].icon} delay={2.08} mouseX={mouseX} mouseY={mouseY} index={2} isActive={activeIndex === 2} />
      </div>
      {/* Row 3: 2 hexagons */}
      <div className="flex gap-6 -mt-2">
        <HexTile icon={tiles[3].icon} delay={2.22} mouseX={mouseX} mouseY={mouseY} index={3} isActive={activeIndex === 3} />
        <HexTile icon={tiles[4].icon} delay={2.36} mouseX={mouseX} mouseY={mouseY} index={4} isActive={activeIndex === 4} />
      </div>
    </div>
  );
};

export default HexHUD;
