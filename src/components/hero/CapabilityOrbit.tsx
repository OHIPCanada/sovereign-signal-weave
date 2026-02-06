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
            {/* Capability name — bold architectural text */}
            <motion.h2
              className="font-black uppercase tracking-tight leading-none select-none"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "clamp(24px, 3.5vw, 52px)",
                letterSpacing: "-0.02em",
                background: isActive
                  ? "linear-gradient(135deg, #2E1A6B 0%, #4B5ED7 60%, #7B61FF 100%)"
                  : "linear-gradient(180deg, #2E1A6B 0%, #4B5ED7 100%)",
                opacity: isActive ? 1 : 0.25,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
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
                      color: "#3A3F4B",
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
