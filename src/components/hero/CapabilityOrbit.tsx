import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════════
   Five Capabilities — orbital nodes around the neural profile
   ═══════════════════════════════════════════════ */

interface Capability {
  id: string;
  label: string;
  narrative: string;
  icon: React.ReactNode;
  /** Angle in degrees on the orbit (0 = top) */
  angle: number;
}

const ICON_COLOR = "#FFF5E6";

const capabilities: Capability[] = [
  {
    id: "cortex",
    label: "AI Cortex",
    narrative:
      "A quiet, brilliant intuition that sees patterns humans cannot see alone — amplifying insight while remaining gentle and respectful.",
    angle: -60,
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke={ICON_COLOR} strokeWidth="1.8" strokeLinecap="round" className="w-6 h-6">
        <circle cx="20" cy="12" r="1.8" fill={ICON_COLOR} stroke="none" />
        <circle cx="13" cy="22" r="1.4" fill={ICON_COLOR} stroke="none" />
        <circle cx="27" cy="22" r="1.4" fill={ICON_COLOR} stroke="none" />
        <circle cx="20" cy="25" r="2" fill={ICON_COLOR} stroke="none" />
        <path d="M20 8C15 8 12 12 12 16C9 16 7 19 7 22C7 25 9 27 12 28" />
        <path d="M20 8C25 8 28 12 28 16C31 16 33 19 33 22C33 25 31 27 28 28" />
      </svg>
    ),
  },
  {
    id: "clinical",
    label: "Clinical OS",
    narrative:
      "Order emerging from complexity — a calm, intelligent structure that ensures nothing is lost, misunderstood, or fragmented.",
    angle: 0,
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke={ICON_COLOR} strokeWidth="1.8" strokeLinecap="round" className="w-6 h-6">
        <circle cx="20" cy="10" r="3" fill={ICON_COLOR} fillOpacity="0.2" />
        <circle cx="10" cy="22" r="3" fill={ICON_COLOR} fillOpacity="0.2" />
        <circle cx="30" cy="22" r="3" fill={ICON_COLOR} fillOpacity="0.2" />
        <circle cx="14" cy="33" r="3" fill={ICON_COLOR} fillOpacity="0.2" />
        <circle cx="26" cy="33" r="3" fill={ICON_COLOR} fillOpacity="0.2" />
        <line x1="20" y1="13" x2="10" y2="19" />
        <line x1="20" y1="13" x2="30" y2="19" />
        <line x1="10" y1="25" x2="14" y2="30" />
        <line x1="30" y1="25" x2="26" y2="30" />
      </svg>
    ),
  },
  {
    id: "virtualcare",
    label: "Virtual Care",
    narrative:
      "A bridge between people, across distance and time — empathy traveling through intelligence, warm, accessible, and deeply human.",
    angle: 60,
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke={ICON_COLOR} strokeWidth="2" strokeLinecap="round" className="w-6 h-6">
        <path d="M14 18C14 13 17 11 20 11C23 11 25 13 25 16" />
        <path d="M15 25C15 30 18 32 21 32C24 32 26 30 26 27" />
        <path d="M25 16L25 22C25 24 23 25 21 25L15 25" />
        <circle cx="20" cy="7" r="2.5" fill={ICON_COLOR} fillOpacity="0.3" />
        <circle cx="20" cy="7" r="1.2" fill={ICON_COLOR} stroke="none" />
        <circle cx="20" cy="35" r="2.5" fill={ICON_COLOR} fillOpacity="0.3" />
        <circle cx="20" cy="35" r="1.2" fill={ICON_COLOR} stroke="none" />
      </svg>
    ),
  },
  {
    id: "sovereign",
    label: "Sovereign Data",
    narrative:
      "A quiet, unwavering sense of protection — a guardian ensuring knowledge remains safe, ethical, and sovereign. Only trust.",
    angle: 130,
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke={ICON_COLOR} strokeWidth="1.8" strokeLinecap="round" className="w-6 h-6">
        <path d="M20 5L33 11V23C33 29 27 34 20 37C13 34 7 29 7 23V11L20 5Z" fill={ICON_COLOR} fillOpacity="0.05" />
        <rect x="15" y="20" width="10" height="9" rx="2" fill={ICON_COLOR} fillOpacity="0.12" />
        <path d="M17 20V17C17 14 18 13 20 13C22 13 23 14 23 17V20" />
        <circle cx="20" cy="24" r="1.4" fill={ICON_COLOR} stroke="none" />
      </svg>
    ),
  },
  {
    id: "audit",
    label: "Audit Integrity",
    narrative:
      "The moral backbone — transparency, accountability, and truth. Every action traceable, honest, and aligned with human values.",
    angle: -130,
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke={ICON_COLOR} strokeWidth="1.8" strokeLinecap="round" className="w-6 h-6">
        <path d="M10 5H25L31 11V36H10V5Z" fill={ICON_COLOR} fillOpacity="0.05" />
        <polyline points="25,5 25,11 31,11" />
        <line x1="14" y1="17" x2="27" y2="17" strokeOpacity="0.4" />
        <line x1="14" y1="21" x2="24" y2="21" strokeOpacity="0.4" />
        <line x1="14" y1="25" x2="21" y2="25" strokeOpacity="0.4" />
        <circle cx="27" cy="30" r="5.5" fill={ICON_COLOR} fillOpacity="0.1" />
        <polyline points="24,30 26,32 30,28" strokeWidth="1.8" />
      </svg>
    ),
  },
];

interface CapabilityOrbitProps {
  mouseX: number;
  mouseY: number;
}

const CapabilityOrbit = ({ mouseX, mouseY }: CapabilityOrbitProps) => {
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    // Start cycling after initial load
    const startTimer = setTimeout(() => {
      setActiveIndex(0);
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % capabilities.length);
      }, 4500);
      return () => clearInterval(interval);
    }, 2500);
    return () => clearTimeout(startTimer);
  }, []);

  // Orbit radii — responsive
  const orbitRx = 340;
  const orbitRy = 300;

  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      {/* Orbital ring — subtle dashed ellipse */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        style={{ opacity: 0.08 }}
      >
        <ellipse
          cx="50"
          cy="55"
          rx="34"
          ry="28"
          fill="none"
          stroke="#B49BEB"
          strokeWidth="0.15"
          strokeDasharray="1 1.5"
        />
      </svg>

      {/* Capability nodes */}
      {capabilities.map((cap, i) => {
        const isActive = activeIndex === i;
        const rad = (cap.angle * Math.PI) / 180;

        // Position on orbit ellipse, centered on the composition
        const centerX = 50; // percentage
        const centerY = 55;
        const nodeX = centerX + Math.sin(rad) * 34;
        const nodeY = centerY - Math.cos(rad) * 28;

        // Parallax from mouse
        const px = (mouseX - 0.5) * 8 * (1 + i * 0.05);
        const py = (mouseY - 0.5) * 5 * (1 + i * 0.05);

        return (
          <motion.div
            key={cap.id}
            className="absolute flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 1.8 + i * 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              left: `${nodeX}%`,
              top: `${nodeY}%`,
              transform: `translate(-50%, -50%) translate(${px}px, ${py}px)`,
              transition: "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            }}
          >
            <motion.div
              animate={{ y: [0, -6 - i * 1.5, 0] }}
              transition={{ duration: 5 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-2"
            >
              {/* Node orb */}
              <motion.div
                className="relative flex items-center justify-center"
                style={{ width: 52, height: 52 }}
                animate={isActive ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Glow ring */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `radial-gradient(circle, rgba(180,155,235,${isActive ? 0.35 : 0.1}) 0%, transparent 70%)`,
                  }}
                  animate={isActive ? { scale: [1, 1.6, 1], opacity: [0.6, 1, 0.6] } : {}}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Orb body */}
                <div
                  className="absolute inset-1 rounded-full"
                  style={{
                    background: isActive
                      ? `radial-gradient(ellipse at 35% 30%, rgba(255,245,230,0.9) 0%, rgba(220,195,255,0.6) 50%, rgba(180,155,235,0.4) 100%)`
                      : `radial-gradient(ellipse at 35% 30%, rgba(255,245,230,0.5) 0%, rgba(200,185,235,0.25) 60%, rgba(180,155,235,0.15) 100%)`,
                    border: `1px solid rgba(255,245,230,${isActive ? 0.6 : 0.2})`,
                    boxShadow: isActive
                      ? `0 0 24px rgba(180,155,235,0.4), inset 0 1px 4px rgba(255,255,255,0.3)`
                      : `0 0 8px rgba(180,155,235,0.1)`,
                    transition: "all 0.6s ease",
                  }}
                />

                {/* Icon */}
                <div className="relative z-10" style={{ opacity: isActive ? 1 : 0.6, transition: "opacity 0.4s" }}>
                  {cap.icon}
                </div>
              </motion.div>

              {/* Label */}
              <span
                className="text-[9px] md:text-[10px] tracking-[0.14em] uppercase font-semibold whitespace-nowrap"
                style={{
                  color: isActive ? "#2E1A6B" : "#7B6FA0",
                  textShadow: isActive ? "0 0 12px rgba(180,155,235,0.4)" : "none",
                  transition: "color 0.4s, text-shadow 0.4s",
                }}
              >
                {cap.label}
              </span>

              {/* Narrative text — appears when active */}
              <AnimatePresence>
                {isActive && (
                  <motion.p
                    initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -4, filter: "blur(4px)" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-[10px] md:text-[11px] leading-[1.5] text-center max-w-[180px] md:max-w-[200px] font-normal"
                    style={{
                      color: "#3A3F4B",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {cap.narrative}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default CapabilityOrbit;
