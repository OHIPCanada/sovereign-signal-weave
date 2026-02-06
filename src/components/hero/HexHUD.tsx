import { motion } from "framer-motion";

interface HexTileProps {
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  delay: number;
  mouseX: number;
  mouseY: number;
  index: number;
}

const HexClipPath = () => (
  <svg width="0" height="0" style={{ position: "absolute" }}>
    <defs>
      <clipPath id="hexClip" clipPathUnits="objectBoundingBox">
        <polygon points="0.5,0 1,0.25 1,0.75 0.5,1 0,0.75 0,0.25" />
      </clipPath>
    </defs>
  </svg>
);

// Monochrome stroke-based icons (lavender/white)
const icons = {
  cortex: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <circle cx="32" cy="20" r="4" />
      <circle cx="20" cy="35" r="4" />
      <circle cx="44" cy="35" r="4" />
      <circle cx="26" cy="50" r="4" />
      <circle cx="38" cy="50" r="4" />
      <line x1="32" y1="24" x2="20" y2="31" />
      <line x1="32" y1="24" x2="44" y2="31" />
      <line x1="20" y1="39" x2="26" y2="46" />
      <line x1="44" y1="39" x2="38" y2="46" />
      <line x1="26" y1="50" x2="38" y2="50" />
    </svg>
  ),
  clinical: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <rect x="14" y="14" width="36" height="36" rx="4" />
      <line x1="14" y1="26" x2="50" y2="26" />
      <line x1="14" y1="38" x2="50" y2="38" />
      <line x1="26" y1="14" x2="26" y2="50" />
      <line x1="38" y1="14" x2="38" y2="50" />
    </svg>
  ),
  virtualCare: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <circle cx="22" cy="32" r="8" />
      <circle cx="42" cy="32" r="8" />
      <line x1="30" y1="32" x2="34" y2="32" />
      <path d="M22 24 Q22 16 32 16 Q42 16 42 24" />
      <path d="M22 40 Q22 48 32 48 Q42 48 42 40" />
    </svg>
  ),
  sovereign: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M32 8 L52 20 V40 C52 50 42 58 32 60 C22 58 12 50 12 40 V20 L32 8Z" />
      <path d="M32 20 V44" />
      <path d="M22 32 H42" />
    </svg>
  ),
  audit: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M18 8 H40 L50 18 V56 H18 V8Z" />
      <polyline points="40,8 40,18 50,18" />
      <polyline points="26,34 32,40 42,28" />
      <line x1="24" y1="46" x2="44" y2="46" />
    </svg>
  ),
};

const HexTile = ({ label, sublabel, icon, delay, mouseX, mouseY, index }: HexTileProps) => {
  const parallaxX = (mouseX - 0.5) * 8 * (1 + index * 0.15);
  const parallaxY = (mouseY - 0.5) * 6 * (1 + index * 0.15);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{
        transform: `translate(${parallaxX}px, ${parallaxY}px)`,
        transition: "transform 0.3s ease-out",
      }}
      className="relative group"
    >
      <div
        className="relative w-[110px] h-[120px] flex flex-col items-center justify-center"
        style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
      >
        {/* Frosted glass background */}
        <div
          className="absolute inset-0"
          style={{
            background: "rgba(230, 230, 250, 0.12)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        />
        {/* Subtle edge glow */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, rgba(230, 230, 250, 0.15) 0%, transparent 50%, rgba(123, 97, 255, 0.08) 100%)",
          }}
        />
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-1.5 text-[#E6E6FA]">
          {icon}
          <span className="text-[10px] font-semibold tracking-wider uppercase text-[#E6E6FA]/90 text-center leading-tight">
            {label}
          </span>
        </div>
      </div>
      {/* Hex border glow */}
      <svg
        className="absolute inset-0 w-[110px] h-[120px] pointer-events-none"
        viewBox="0 0 110 120"
      >
        <polygon
          points="55,2 108,30 108,90 55,118 2,90 2,30"
          fill="none"
          stroke="rgba(230, 230, 250, 0.2)"
          strokeWidth="1"
        />
      </svg>
    </motion.div>
  );
};

interface HexHUDProps {
  mouseX: number;
  mouseY: number;
}

const HexHUD = ({ mouseX, mouseY }: HexHUDProps) => {
  const tiles = [
    { label: "AI Cortex", sublabel: "Reasoning & Logic", icon: icons.cortex },
    { label: "Clinical OS", sublabel: "EMR Integration", icon: icons.clinical },
    { label: "Virtual Care", sublabel: "Patient Access", icon: icons.virtualCare },
    { label: "Sovereign", sublabel: "Data Security", icon: icons.sovereign },
    { label: "Audit", sublabel: "Compliance", icon: icons.audit },
  ];

  return (
    <>
      <HexClipPath />
      <div className="flex flex-col items-center gap-2">
        {tiles.map((tile, i) => (
          <HexTile
            key={tile.label}
            {...tile}
            delay={1.8 + i * 0.15}
            mouseX={mouseX}
            mouseY={mouseY}
            index={i}
          />
        ))}
      </div>
    </>
  );
};

export default HexHUD;
