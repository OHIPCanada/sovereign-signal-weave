import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════════
   Five Capabilities — Bold typographic stack
   Matches the INTELLIGENCE headline aesthetic
   ═══════════════════════════════════════════════ */

interface Capability {
  label: string;
  narrative: string;
}

const capabilities: Capability[] = [
  {
    label: "AI CORTEX",
    narrative:
      "Quiet intuition that sees patterns humans cannot — amplifying insight while remaining respectful.",
  },
  {
    label: "CLINICAL OS",
    narrative:
      "Order from complexity — precise, reliable, deeply aware. Nothing lost, nothing fragmented.",
  },
  {
    label: "VIRTUAL CARE",
    narrative:
      "Connection across distance and time — empathy flowing where it is needed most.",
  },
  {
    label: "SOVEREIGN DATA",
    narrative:
      "Unwavering protection — knowledge held with deep respect, ethical and sovereign.",
  },
  {
    label: "AUDIT INTEGRITY",
    narrative:
      "The moral backbone — every action traceable, honest, aligned with human values.",
  },
];

const CapabilityOrbit = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % capabilities.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, delay: 1.8 }}
      className="flex flex-col gap-1 md:gap-2"
    >
      {capabilities.map((cap, i) => {
        const isActive = activeIndex === i;

        return (
          <motion.div
            key={cap.label}
            className="relative cursor-default"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 2 + i * 0.15 }}
            onMouseEnter={() => setActiveIndex(i)}
          >
            {/* Capability name — gradient stripe with white text */}
            <motion.h2
              className="font-black uppercase tracking-tight leading-none select-none px-5 py-3 rounded-md"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "clamp(20px, 3vw, 44px)",
                letterSpacing: "-0.01em",
                color: "#FFFFFF",
                background: isActive
                  ? "linear-gradient(135deg, #D4856A 0%, #E5736F 35%, #E39A96 65%, #EBC6C4 100%)"
                  : "linear-gradient(135deg, rgba(212,133,106,0.3) 0%, rgba(229,115,111,0.25) 35%, rgba(227,154,150,0.2) 65%, rgba(235,198,196,0.15) 100%)",
                transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              animate={isActive ? { scale: 1 } : { scale: 0.97 }}
              transition={{ duration: 0.4 }}
            >
              {cap.label}
            </motion.h2>

            {/* Narrative text — reveals on active */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -4 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -4 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <p
                    className="text-[11px] md:text-[13px] leading-[1.6] max-w-[320px] pt-1 pb-2"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 400,
                      color: "#2E1A6B",
                    }}
                  >
                    {cap.narrative}
                  </p>

                  {/* Active indicator line */}
                  <motion.div
                    className="h-[2px] rounded-full mb-1"
                    style={{
                      background:
                        "linear-gradient(90deg, #4B5ED7 0%, rgba(123,97,255,0.3) 100%)",
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3.5, ease: "linear" }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default CapabilityOrbit;
