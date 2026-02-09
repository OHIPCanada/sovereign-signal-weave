import { motion } from "framer-motion";
import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════════
   Design tokens — frosted clinical glass
   ═══════════════════════════════════════════════ */
const GLASS_BASE = "#E9F4F5";
const CLINICAL_CYAN = "#2EE6D6";
const ICON_WHITE = "#FFFFFF";

/* ═══════════════════════════════════════════════
   Bold clinical icons — white with cyan halo
   ═══════════════════════════════════════════════ */
const icons = {
  cortex: (
    <svg viewBox="0 0 64 64" fill="none" stroke={ICON_WHITE} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
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
    <svg viewBox="0 0 64 64" fill="none" stroke={ICON_WHITE} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
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
    <svg viewBox="0 0 64 64" fill="none" stroke={ICON_WHITE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
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
    <svg viewBox="0 0 64 64" fill="none" stroke={ICON_WHITE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <path d="M32 7 L52 17 V37 C52 46 42 54 32 58 C22 54 12 46 12 37 V17 L32 7Z" fill={ICON_WHITE} fillOpacity="0.05" />
      <rect x="24" y="30" width="16" height="14" rx="3" fill={ICON_WHITE} fillOpacity="0.12" />
      <path d="M27 30 V25 C27 21 29 19 32 19 C35 19 37 21 37 25 V30" />
      <circle cx="32" cy="36" r="2.2" fill={ICON_WHITE} stroke="none" />
      <line x1="32" y1="38.2" x2="32" y2="42" strokeWidth="2.5" />
    </svg>
  ),
  audit: (
    <svg viewBox="0 0 64 64" fill="none" stroke={ICON_WHITE} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
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
   Internal shimmer particles inside each orb
   ═══════════════════════════════════════════════ */
const OrbShimmer = () => {
  const pts = [
    { x: 30, y: 25, s: 1.2, d: 0 },
    { x: 70, y: 30, s: 1, d: 1.2 },
    { x: 40, y: 65, s: 1.4, d: 0.6 },
    { x: 75, y: 60, s: 0.8, d: 2.0 },
    { x: 55, y: 20, s: 1.1, d: 0.4 },
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
            background: `radial-gradient(circle, rgba(255,255,255,0.85) 0%, ${CLINICAL_CYAN}33 100%)`,
          }}
          animate={{ opacity: [0, 0.5, 0], scale: [0.5, 1.3, 0.5] }}
          transition={{ duration: 3.5, delay: p.d, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </>
  );
};

/* ═══════════════════════════════════════════════
   Single Glass Orb
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
        className="relative flex flex-col items-center gap-2"
      >
        <div
          className="relative rounded-full overflow-hidden"
          style={{ width: size, height: size }}
        >
          {/* Ambient glow behind orb */}
          <div
            className="absolute inset-[-40%] pointer-events-none rounded-full"
            style={{
              background: `radial-gradient(circle, ${CLINICAL_CYAN}18 0%, transparent 65%)`,
            }}
          />

          {/* Cyan rim glow */}
          <motion.div
            className="absolute inset-[-3px] rounded-full"
            style={{
              background: `linear-gradient(135deg, ${CLINICAL_CYAN}55, ${CLINICAL_CYAN}15, ${CLINICAL_CYAN}40)`,
              filter: "blur(5px)",
            }}
            animate={isActive
              ? { opacity: [0.4, 1, 0.4], scale: [1, 1.06, 1] }
              : { opacity: 0.35 }
            }
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Glass body — high-transmission frosted glass */}
          <div
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{
              background: `linear-gradient(155deg,
                rgba(233, 244, 245, 0.35) 0%,
                rgba(220, 240, 238, 0.25) 35%,
                rgba(210, 235, 233, 0.18) 65%,
                rgba(225, 242, 241, 0.30) 100%
              )`,
              backdropFilter: "blur(8px) saturate(1.4)",
              WebkitBackdropFilter: "blur(8px) saturate(1.4)",
              boxShadow: `
                inset 0 1px 2px rgba(255,255,255,0.4),
                inset 0 -1px 3px rgba(46,230,214,0.06),
                0 4px 24px rgba(46,230,214,0.10),
                0 1px 4px rgba(0,0,0,0.03)
              `,
            }}
          >
            {/* Glass refraction highlight */}
            <div
              className="absolute rounded-full"
              style={{
                width: "60%", height: "35%",
                top: "8%", left: "15%",
                background: "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.05) 100%)",
                borderRadius: "50%",
              }}
            />

            {/* Internal shimmer */}
            <OrbShimmer />
          </div>

          {/* Orb border ring */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              border: isActive
                ? `1.5px solid ${CLINICAL_CYAN}99`
                : `1px solid ${GLASS_BASE}`,
            }}
          />

          {/* Active pulse ring */}
          {isActive && (
            <motion.div
              className="absolute inset-[-6px] rounded-full pointer-events-none"
              style={{ border: `1.5px solid ${CLINICAL_CYAN}44` }}
              animate={{ opacity: [0, 0.7, 0], scale: [0.95, 1.08, 0.95] }}
              transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
            />
          )}

          {/* Icon — white with cyan halo */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <motion.div
              style={{
                color: ICON_WHITE,
                filter: `drop-shadow(0 0 6px ${CLINICAL_CYAN}66)`,
              }}
              animate={isActive
                ? {
                    filter: [
                      `drop-shadow(0 0 6px ${CLINICAL_CYAN}55)`,
                      `drop-shadow(0 0 16px ${CLINICAL_CYAN}AA)`,
                      `drop-shadow(0 0 6px ${CLINICAL_CYAN}55)`,
                    ],
                    scale: [1, 1.06, 1],
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
          className="text-[11px] tracking-[0.16em] uppercase whitespace-nowrap"
          style={{
            fontFamily: "'JetBrains Mono', 'Geist Mono', monospace",
            fontWeight: 500,
            color: isActive ? CLINICAL_CYAN : "#2D1B4E",
            textShadow: isActive ? `0 0 8px ${CLINICAL_CYAN}44` : "none",
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
   Main HexHUD — constellation of floating orbs
   ═══════════════════════════════════════════════ */
interface HexHUDProps {
  mouseX: number;
  mouseY: number;
}

const orbs = [
  { icon: icons.cortex, label: "AI Cortex", size: 90, x: 40, y: 0, floatY: -12, floatDur: 5.5 },
  { icon: icons.clinical, label: "Clinical OS", size: 78, x: 150, y: 60, floatY: -9, floatDur: 6.2 },
  { icon: icons.virtualCare, label: "Virtual Care", size: 84, x: 20, y: 140, floatY: -14, floatDur: 5.0 },
  { icon: icons.sovereign, label: "Sovereign Data", size: 72, x: 140, y: 200, floatY: -8, floatDur: 6.8 },
  { icon: icons.audit, label: "Audit Integrity", size: 80, x: 70, y: 280, floatY: -11, floatDur: 5.8 },
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

  // Center point of the constellation (approximate brain origin)
  const centerX = 130;
  const centerY = 190;

  return (
    <div className="relative" style={{ width: 260, height: 380 }}>
      {/* Connecting lines from brain center to each orb */}
      <svg
        className="absolute inset-0 pointer-events-none"
        style={{ width: 260, height: 380, overflow: "visible" }}
      >
        <defs>
          {orbs.map((orb, i) => {
            const orbCenterX = orb.x + orb.size / 2;
            const orbCenterY = orb.y + orb.size / 2;
            const dx = orbCenterX - centerX;
            const dy = orbCenterY - centerY;
            const angle = Math.atan2(dy, dx);
            const gradId = `line-grad-${i}`;
            return (
              <linearGradient
                key={gradId}
                id={gradId}
                x1={centerX}
                y1={centerY}
                x2={orbCenterX}
                y2={orbCenterY}
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#7B61FF" stopOpacity="0.6" />
                <stop offset="40%" stopColor="#00FFFF" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#00FFFF" stopOpacity="0.08" />
              </linearGradient>
            );
          })}
        </defs>
        {orbs.map((orb, i) => {
          const orbCenterX = orb.x + orb.size / 2;
          const orbCenterY = orb.y + orb.size / 2;
          return (
            <motion.line
              key={`line-${i}`}
              x1={centerX}
              y1={centerY}
              x2={orbCenterX}
              y2={orbCenterY}
              stroke={`url(#line-grad-${i})`}
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ opacity: 0 }}
              animate={{ opacity: activeIndex === i ? 1 : 0.5 }}
              transition={{ duration: 0.6 }}
            />
          );
        })}
      </svg>

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
