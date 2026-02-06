import { motion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";

/* ─── Premium SVG Icons ─── */
const icons = {
  cortex: (
    <svg viewBox="0 0 28 28" fill="none" className="w-5 h-5">
      {/* Neural node cluster */}
      <circle cx="14" cy="8" r="2" fill="currentColor" opacity="0.9" />
      <circle cx="8" cy="14" r="1.5" fill="currentColor" opacity="0.7" />
      <circle cx="20" cy="14" r="1.5" fill="currentColor" opacity="0.7" />
      <circle cx="10" cy="21" r="1.8" fill="currentColor" opacity="0.8" />
      <circle cx="18" cy="21" r="1.8" fill="currentColor" opacity="0.8" />
      <circle cx="14" cy="16" r="2.5" fill="currentColor" opacity="1" />
      <line x1="14" y1="10" x2="14" y2="13.5" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
      <line x1="8" y1="14" x2="11.5" y2="16" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
      <line x1="20" y1="14" x2="16.5" y2="16" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
      <line x1="12" y1="17.5" x2="10" y2="19.5" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
      <line x1="16" y1="17.5" x2="18" y2="19.5" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
    </svg>
  ),
  clinical: (
    <svg viewBox="0 0 28 28" fill="none" className="w-5 h-5">
      {/* Organic lattice with curved lines */}
      <path d="M6 8 Q14 6 22 8" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.6" />
      <path d="M6 14 Q14 12 22 14" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.8" />
      <path d="M6 20 Q14 18 22 20" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.6" />
      <path d="M10 5 Q8 14 10 23" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5" />
      <path d="M18 5 Q20 14 18 23" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5" />
      <circle cx="14" cy="14" r="2" fill="currentColor" opacity="0.9" />
      <circle cx="10" cy="14" r="1" fill="currentColor" opacity="0.6" />
      <circle cx="18" cy="14" r="1" fill="currentColor" opacity="0.6" />
    </svg>
  ),
  virtualCare: (
    <svg viewBox="0 0 28 28" fill="none" className="w-5 h-5">
      {/* Two glowing nodes connected by beam */}
      <circle cx="7" cy="14" r="3" fill="currentColor" opacity="0.3" />
      <circle cx="7" cy="14" r="1.8" fill="currentColor" opacity="0.9" />
      <circle cx="21" cy="14" r="3" fill="currentColor" opacity="0.3" />
      <circle cx="21" cy="14" r="1.8" fill="currentColor" opacity="0.9" />
      <line x1="9" y1="14" x2="19" y2="14" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
      <line x1="9" y1="14" x2="19" y2="14" stroke="currentColor" strokeWidth="3" opacity="0.15" />
      <path d="M7 10 Q7 7 10 7" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.4" />
      <path d="M21 10 Q21 7 18 7" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.4" />
    </svg>
  ),
  sovereign: (
    <svg viewBox="0 0 28 28" fill="none" className="w-5 h-5">
      {/* Shield with data stream inside */}
      <path d="M14 3 L22 7 V15 C22 19 18 22 14 24 C10 22 6 19 6 15 V7 L14 3Z" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.1" />
      <line x1="11" y1="11" x2="17" y2="11" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
      <line x1="10" y1="14" x2="18" y2="14" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
      <line x1="11" y1="17" x2="17" y2="17" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
      <circle cx="14" cy="14" r="1" fill="currentColor" opacity="0.9" />
    </svg>
  ),
  audit: (
    <svg viewBox="0 0 28 28" fill="none" className="w-5 h-5">
      {/* Document + magnifying lens + checkmark */}
      <path d="M8 3 H17 L21 7 V24 H8 V3Z" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity="0.08" />
      <polyline points="17,3 17,7 21,7" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.5" />
      <circle cx="14" cy="15" r="4" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5" />
      <line x1="17" y1="18" x2="20" y2="21" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
      <polyline points="12,15 13.5,17 16.5,13" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.9" />
    </svg>
  ),
};

/* ─── Hexagon clip path points ─── */
const hexClipPath = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

/* ─── Neural Thread SVG (connecting lines from brain to tiles) ─── */
const NeuralThreads = ({ tileCount, mouseX, mouseY }: { tileCount: number; mouseX: number; mouseY: number }) => {
  const threads = useMemo(() => {
    const spacing = 72;
    const startY = 0;
    return Array.from({ length: tileCount }, (_, i) => {
      const endY = startY + i * spacing + 36;
      return {
        id: i,
        endY,
        // Curved path from left origin to tile
        path: `M -60 ${endY - 20 + Math.sin(i * 1.2) * 30} Q ${-20 + i * 5} ${endY + (i % 2 === 0 ? -15 : 15)} 0 ${endY}`,
      };
    });
  }, [tileCount]);

  const offsetX = (mouseX - 0.5) * 4;
  const offsetY = (mouseY - 0.5) * 3;

  return (
    <svg
      className="absolute -left-16 top-0 w-20 pointer-events-none"
      style={{
        height: `${tileCount * 72 + 20}px`,
        transform: `translate(${offsetX}px, ${offsetY}px)`,
        transition: "transform 0.5s ease-out",
      }}
      viewBox={`-70 -10 80 ${tileCount * 72 + 20}`}
      fill="none"
    >
      <defs>
        <linearGradient id="threadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C8B8FF" stopOpacity="0" />
          <stop offset="40%" stopColor="#B8A4FF" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#D9CFFF" stopOpacity="0.7" />
        </linearGradient>
        <filter id="threadGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {threads.map((t) => (
        <g key={t.id}>
          {/* Base thread */}
          <motion.path
            d={t.path}
            stroke="url(#threadGrad)"
            strokeWidth="1.5"
            strokeLinecap="round"
            filter="url(#threadGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.6 + t.id * 0.15, ease: "easeOut" }}
          />
          {/* Traveling pulse */}
          <motion.circle
            r="2"
            fill="#B8A4FF"
            filter="url(#threadGlow)"
            animate={{
              opacity: [0, 0.9, 0],
            }}
            transition={{
              duration: 2,
              delay: 2.5 + t.id * 0.6,
              repeat: Infinity,
              repeatDelay: 4 + t.id * 0.8,
              ease: "easeInOut",
            }}
          >
            <animateMotion
              dur={`${2}s`}
              begin={`${2.5 + t.id * 0.6}s`}
              repeatCount="indefinite"
              path={t.path}
            />
          </motion.circle>
        </g>
      ))}
    </svg>
  );
};

/* ─── Single Hex Tile ─── */
interface HexTileProps {
  label: string;
  icon: React.ReactNode;
  delay: number;
  mouseX: number;
  mouseY: number;
  index: number;
  isActive: boolean;
}

const HexTile = ({ label, icon, delay, mouseX, mouseY, index, isActive }: HexTileProps) => {
  const parallaxX = (mouseX - 0.5) * 12 * (1 + index * 0.1);
  const parallaxY = (mouseY - 0.5) * 6 * (1 + index * 0.1);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40, filter: "blur(10px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{
        transform: `translate(${parallaxX}px, ${parallaxY}px)`,
        transition: "transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }}
      className="group cursor-default"
    >
      <div className="flex items-center gap-3">
        {/* Hexagon icon container */}
        <div className="relative w-[52px] h-[52px] flex-shrink-0">
          {/* Hex outer glow */}
          <motion.div
            className="absolute inset-[-4px]"
            style={{
              clipPath: hexClipPath,
              background: "linear-gradient(135deg, rgba(200, 180, 255, 0.3), rgba(180, 160, 255, 0.15))",
              filter: "blur(4px)",
            }}
            animate={isActive ? {
              opacity: [0.4, 0.8, 0.4],
            } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Hex glass body */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              clipPath: hexClipPath,
              background: "linear-gradient(160deg, rgba(240, 236, 255, 0.85) 0%, rgba(225, 218, 255, 0.65) 40%, rgba(210, 200, 250, 0.5) 100%)",
              boxShadow: "inset 0 1px 2px rgba(255, 255, 255, 0.6), inset 0 -1px 2px rgba(180, 160, 255, 0.15)",
            }}
          >
            {/* Inner shimmer */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{
                clipPath: hexClipPath,
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, transparent 40%, rgba(200, 180, 255, 0.2) 100%)",
              }}
            />
            {/* Hex border overlay */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 52 52" fill="none">
              <polygon
                points="26,1 51,13.5 51,38.5 26,51 1,38.5 1,13.5"
                stroke="rgba(200, 185, 255, 0.5)"
                strokeWidth="1"
                fill="none"
              />
            </svg>
            <motion.span
              className="relative z-10 text-[rgba(100, 70, 200, 0.9)]"
              style={{ color: "rgba(100, 70, 200, 0.9)" }}
              animate={isActive ? { opacity: [0.7, 1, 0.7] } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              {icon}
            </motion.span>
          </div>
        </div>

        {/* Label */}
        <motion.span
          className="text-[11px] font-semibold tracking-[0.16em] uppercase whitespace-nowrap"
          style={{
            color: "rgba(55, 35, 110, 0.8)",
            textShadow: "0 0 20px rgba(180, 160, 255, 0.15)",
          }}
          animate={isActive ? { opacity: [0.7, 1, 0.7] } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {label}
        </motion.span>
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
    { label: "AI Cortex", icon: icons.cortex },
    { label: "Clinical OS", icon: icons.clinical },
    { label: "Virtual Care", icon: icons.virtualCare },
    { label: "Sovereign Data", icon: icons.sovereign },
    { label: "Audit Integrity", icon: icons.audit },
  ];

  // Cycle through tiles to activate them with data pulses
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        const next = prev + 1;
        return next >= tiles.length ? -1 : next;
      });
    }, 2800);
    return () => clearInterval(interval);
  }, [tiles.length]);

  return (
    <div className="relative">
      {/* Neural connecting threads */}
      <NeuralThreads tileCount={tiles.length} mouseX={mouseX} mouseY={mouseY} />

      {/* Hex tile stack */}
      <div className="flex flex-col items-start gap-5">
        {tiles.map((tile, i) => (
          <HexTile
            key={tile.label}
            {...tile}
            delay={1.8 + i * 0.14}
            mouseX={mouseX}
            mouseY={mouseY}
            index={i}
            isActive={activeIndex === i}
          />
        ))}
      </div>
    </div>
  );
};

export default HexHUD;
