import { motion } from "framer-motion";
import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════════
   Design tokens — dark glass with electric cyan
   ═══════════════════════════════════════════════ */
const DARK_CORE = "#C45E5E";
const DARK_MID = "#D4856A";
const ACCENT = "#E8A87C";
const ICON_WHITE = "#FFFFFF";

/* ═══════════════════════════════════════════════
   Bold clinical icons — white
   ═══════════════════════════════════════════════ */
const icons = {
  cortex: (
    <svg viewBox="0 0 64 64" fill="none" stroke={ICON_WHITE} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
      <path d="M32 12 C25 12 21 17 21 22 C17 22 14 26 14 31 C14 36 17 39 21 40 C22 45 26 48 31 48" />
      <path d="M32 12 C39 12 43 17 43 22 C47 22 50 26 50 31 C50 36 47 39 43 40 C42 45 38 48 33 48" />
      <circle cx="32" cy="20" r="2.5" fill={ICON_WHITE} stroke="none" />
      <circle cx="23" cy="29" r="2" fill={ICON_WHITE} stroke="none" />
      <circle cx="41" cy="29" r="2" fill={ICON_WHITE} stroke="none" />
      <circle cx="32" cy="32" r="3" fill={ICON_WHITE} stroke="none" />
      <line x1="32" y1="20" x2="23" y2="29" strokeOpacity="0.55" />
      <line x1="32" y1="20" x2="41" y2="29" strokeOpacity="0.55" />
      <line x1="23" y1="29" x2="32" y2="32" strokeOpacity="0.45" />
      <line x1="41" y1="29" x2="32" y2="32" strokeOpacity="0.45" />
    </svg>
  ),
  clinical: (
    <svg viewBox="0 0 64 64" fill="none" stroke={ICON_WHITE} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
      <circle cx="32" cy="17" r="4" fill={ICON_WHITE} fillOpacity="0.2" />
      <circle cx="15" cy="32" r="4" fill={ICON_WHITE} fillOpacity="0.2" />
      <circle cx="49" cy="32" r="4" fill={ICON_WHITE} fillOpacity="0.2" />
      <circle cx="21" cy="49" r="4" fill={ICON_WHITE} fillOpacity="0.2" />
      <circle cx="43" cy="49" r="4" fill={ICON_WHITE} fillOpacity="0.2" />
      <line x1="32" y1="21" x2="15" y2="28" />
      <line x1="32" y1="21" x2="49" y2="28" />
      <line x1="15" y1="36" x2="21" y2="45" />
      <line x1="49" y1="36" x2="43" y2="45" />
    </svg>
  ),
  virtualCare: (
    <svg viewBox="0 0 64 64" fill="none" stroke={ICON_WHITE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
      <path d="M22 27 C22 19 27 17 32 17 C37 17 40 20 40 25" />
      <path d="M24 37 C24 45 29 47 34 47 C39 47 42 44 42 39" />
      <path d="M40 25 L40 33 C40 36 37 38 34 38 L24 37" />
      <circle cx="32" cy="10" r="4" fill={ICON_WHITE} fillOpacity="0.3" />
      <circle cx="32" cy="10" r="2" fill={ICON_WHITE} stroke="none" />
      <circle cx="32" cy="54" r="4" fill={ICON_WHITE} fillOpacity="0.3" />
      <circle cx="32" cy="54" r="2" fill={ICON_WHITE} stroke="none" />
    </svg>
  ),
  sovereign: (
    <svg viewBox="0 0 64 64" fill="none" stroke={ICON_WHITE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
      <path d="M32 7 L52 17 V37 C52 46 42 54 32 58 C22 54 12 46 12 37 V17 L32 7Z" fill={ICON_WHITE} fillOpacity="0.05" />
      <rect x="24" y="30" width="16" height="14" rx="3" fill={ICON_WHITE} fillOpacity="0.12" />
      <path d="M27 30 V25 C27 21 29 19 32 19 C35 19 37 21 37 25 V30" />
      <circle cx="32" cy="36" r="2.2" fill={ICON_WHITE} stroke="none" />
      <line x1="32" y1="38.2" x2="32" y2="42" strokeWidth="2.5" />
    </svg>
  ),
  audit: (
    <svg viewBox="0 0 64 64" fill="none" stroke={ICON_WHITE} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
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
   Single Glass Orb — dark, bold, high-contrast
   ═══════════════════════════════════════════════ */
interface OrbProps {
  icon: React.ReactNode;
  label: string;
  size: number;
  delay: number;
  mouseX: number;
  mouseY: number;
  left: number;
  top: number;
  index: number;
  isActive: boolean;
  floatY: number;
  floatDuration: number;
}

const GlassOrb = ({ icon, label, size, delay, mouseX, mouseY, left, top, index, isActive, floatY, floatDuration }: OrbProps) => {
  const px = (mouseX - 0.5) * 10 * (1 + index * 0.08);
  const py = (mouseY - 0.5) * 6 * (1 + index * 0.08);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.4, filter: "blur(20px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
      className="absolute group cursor-default"
      style={{
        left, top,
        transform: `translate(${px}px, ${py}px)`,
        transition: "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }}
    >
      <motion.div
        animate={{ y: [0, floatY, 0] }}
        transition={{ duration: floatDuration, repeat: Infinity, ease: "easeInOut" }}
        className="relative flex flex-col items-center gap-3"
      >
        {/* Orb container */}
        <div className="relative" style={{ width: size, height: size }}>
          {/* Outer glow — warm aura */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              inset: -16,
              background: `radial-gradient(circle, ${ACCENT}22 0%, ${ACCENT}08 50%, transparent 70%)`,
            }}
          />

          {/* Warm rim ring */}
          <motion.div
            className="absolute rounded-full"
            style={{
              inset: -2,
              background: `conic-gradient(from 0deg, ${ACCENT}66, ${DARK_CORE}44, ${ACCENT}55, ${DARK_MID}33, ${ACCENT}66)`,
              filter: "blur(2px)",
            }}
            animate={isActive
              ? { opacity: [0.5, 1, 0.5], rotate: [0, 360] }
              : { opacity: 0.4 }
            }
            transition={isActive
              ? { opacity: { duration: 2, repeat: Infinity }, rotate: { duration: 8, repeat: Infinity, ease: "linear" } }
              : { duration: 0.4 }
            }
          />

          {/* Transparent glass body — frosted with coral tint */}
          <div
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{
              background: `radial-gradient(ellipse at 35% 25%,
                rgba(232, 168, 124, 0.18) 0%,
                rgba(212, 133, 106, 0.12) 30%,
                rgba(196, 94, 94, 0.1) 60%,
                rgba(160, 64, 80, 0.08) 100%
              )`,
              backdropFilter: "blur(16px) saturate(1.3)",
              WebkitBackdropFilter: "blur(16px) saturate(1.3)",
              boxShadow: `
                inset 0 1px 3px rgba(255, 255, 255, 0.3),
                inset 0 -2px 6px rgba(196, 94, 94, 0.1),
                0 8px 32px rgba(196, 94, 94, 0.15),
                0 2px 8px rgba(0, 0, 0, 0.06)
              `,
            }}
          >
            {/* Top specular highlight */}
            <div
              className="absolute"
              style={{
                width: "60%", height: "35%",
                top: "5%", left: "15%",
                background: `linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.05) 100%)`,
                borderRadius: "50%",
                filter: "blur(1px)",
              }}
            />

            {/* Bottom warm reflection */}
            <div
              className="absolute"
              style={{
                width: "70%", height: "20%",
                bottom: "8%", left: "15%",
                background: `linear-gradient(0deg, rgba(232, 168, 124, 0.12) 0%, transparent 100%)`,
                borderRadius: "50%",
              }}
            />
          </div>

          {/* Border ring */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              border: `1px solid ${isActive ? `${ACCENT}88` : "rgba(232, 168, 124, 0.25)"}`,
            }}
          />

          {/* Active outer pulse */}
          {isActive && (
            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{
                inset: -8,
                border: `1px solid ${ACCENT}33`,
                boxShadow: `0 0 20px ${ACCENT}22`,
              }}
              animate={{ opacity: [0, 0.8, 0], scale: [0.96, 1.06, 0.96] }}
              transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
            />
          )}

          {/* Icon */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <motion.div
              style={{
                filter: `drop-shadow(0 0 8px rgba(255,255,255,0.5))`,
              }}
              animate={isActive
                ? {
                    filter: [
                      `drop-shadow(0 0 8px rgba(255,255,255,0.4))`,
                      `drop-shadow(0 0 20px rgba(255,255,255,0.7))`,
                      `drop-shadow(0 0 8px rgba(255,255,255,0.4))`,
                    ],
                    scale: [1, 1.08, 1],
                  }
                : {}
              }
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              {icon}
            </motion.div>
          </div>
        </div>

        {/* Label */}
        <motion.span
          className="text-[10px] tracking-[0.14em] uppercase font-semibold whitespace-nowrap"
          style={{
            color: isActive ? DARK_CORE : DARK_MID,
            textShadow: isActive ? `0 0 10px ${ACCENT}55` : "none",
            transition: "color 0.4s, text-shadow 0.4s",
          }}
        >
          {label}
        </motion.span>
      </motion.div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════
   Main — constellation of floating dark orbs
   ═══════════════════════════════════════════════ */
interface HexHUDProps {
  mouseX: number;
  mouseY: number;
}

const orbs = [
  { icon: icons.cortex, label: "AI Cortex", size: 88, x: 30, y: 0, floatY: -12, floatDur: 5.5 },
  { icon: icons.clinical, label: "Clinical OS", size: 76, x: 155, y: 55, floatY: -9, floatDur: 6.2 },
  { icon: icons.virtualCare, label: "Virtual Care", size: 82, x: 10, y: 130, floatY: -14, floatDur: 5.0 },
  { icon: icons.sovereign, label: "Sovereign Data", size: 70, x: 145, y: 195, floatY: -8, floatDur: 6.8 },
  { icon: icons.audit, label: "Audit Integrity", size: 78, x: 55, y: 275, floatY: -11, floatDur: 5.8 },
];

const HexHUD = ({ mouseX, mouseY }: HexHUDProps) => {
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        setActiveIndex((p) => (p >= orbs.length - 1 ? -1 : p + 1));
      }, 2800);
      return () => clearInterval(iv);
    }, 3200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative" style={{ width: 280, height: 390 }}>
      {orbs.map((orb, i) => (
        <GlassOrb
          key={i}
          icon={orb.icon}
          label={orb.label}
          size={orb.size}
          delay={1.4 + i * 0.2}
          mouseX={mouseX}
          mouseY={mouseY}
          left={orb.x}
          top={orb.y}
          index={i}
          isActive={activeIndex === i}
          floatY={orb.floatY}
          floatDuration={orb.floatDur}
        />
      ))}
    </div>
  );
};

export default HexHUD;
