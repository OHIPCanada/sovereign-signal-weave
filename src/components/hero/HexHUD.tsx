import { motion } from "framer-motion";

interface ServiceTileProps {
  label: string;
  icon: React.ReactNode;
  delay: number;
  mouseX: number;
  mouseY: number;
  index: number;
}

const icons = {
  cortex: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="8" r="2" />
      <circle cx="7" cy="14" r="2" />
      <circle cx="17" cy="14" r="2" />
      <circle cx="9" cy="20" r="2" />
      <circle cx="15" cy="20" r="2" />
      <line x1="12" y1="10" x2="7" y2="12" />
      <line x1="12" y1="10" x2="17" y2="12" />
      <line x1="7" y1="16" x2="9" y2="18" />
      <line x1="17" y1="16" x2="15" y2="18" />
    </svg>
  ),
  clinical: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="3" y1="15" x2="21" y2="15" />
      <line x1="9" y1="3" x2="9" y2="21" />
    </svg>
  ),
  virtualCare: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="8" cy="12" r="3" />
      <circle cx="16" cy="12" r="3" />
      <line x1="11" y1="12" x2="13" y2="12" />
      <path d="M8 9 Q8 5 12 5 Q16 5 16 9" />
    </svg>
  ),
  sovereign: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M12 2 L20 7 V14 C20 18 16 21 12 22 C8 21 4 18 4 14 V7 L12 2Z" />
      <polyline points="9,12 11,14 15,10" />
    </svg>
  ),
  audit: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M6 2 H14 L18 6 V22 H6 V2Z" />
      <polyline points="14,2 14,6 18,6" />
      <polyline points="9,13 11,15 15,11" />
    </svg>
  ),
};

const ServiceTile = ({ label, icon, delay, mouseX, mouseY, index }: ServiceTileProps) => {
  const parallaxX = (mouseX - 0.5) * 10 * (1 + index * 0.12);
  const parallaxY = (mouseY - 0.5) * 6 * (1 + index * 0.12);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30, filter: "blur(8px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{
        transform: `translate(${parallaxX}px, ${parallaxY}px)`,
        transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }}
      className="group cursor-default"
    >
      <div
        className="relative flex items-center gap-3 px-5 py-3 rounded-xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(120, 90, 220, 0.15) 0%, rgba(80, 50, 180, 0.08) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(180, 160, 255, 0.15)",
          boxShadow: "0 4px 24px -4px rgba(100, 70, 200, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
        }}
      >
        {/* Shimmer on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: "linear-gradient(135deg, rgba(180, 160, 255, 0.1) 0%, transparent 50%, rgba(123, 97, 255, 0.06) 100%)",
          }}
        />

        {/* Left accent line */}
        <div
          className="absolute left-0 top-[20%] bottom-[20%] w-[2px] rounded-full"
          style={{
            background: "linear-gradient(180deg, transparent, rgba(160, 130, 255, 0.6), transparent)",
          }}
        />

        {/* Icon */}
        <div
          className="relative z-10 flex items-center justify-center w-8 h-8 rounded-lg"
          style={{
            background: "linear-gradient(135deg, rgba(140, 110, 255, 0.2) 0%, rgba(100, 70, 220, 0.1) 100%)",
            border: "1px solid rgba(180, 160, 255, 0.12)",
          }}
        >
          <span className="text-[rgba(210,195,255,0.9)]">{icon}</span>
        </div>

        {/* Label */}
        <span className="relative z-10 text-[11px] font-medium tracking-[0.12em] uppercase text-[rgba(220,210,255,0.85)]">
          {label}
        </span>
      </div>
    </motion.div>
  );
};

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

  return (
    <div className="flex flex-col items-start gap-2.5">
      {tiles.map((tile, i) => (
        <ServiceTile
          key={tile.label}
          {...tile}
          delay={1.8 + i * 0.12}
          mouseX={mouseX}
          mouseY={mouseY}
          index={i}
        />
      ))}
    </div>
  );
};

export default HexHUD;
