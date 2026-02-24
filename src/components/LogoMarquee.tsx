import React from "react";

/**
 * Buzzworthy-inspired auto-scrolling logo marquee strip.
 * Infinite horizontal scroll with duplicated items for seamless loop.
 */

interface LogoItem {
  name: string;
  /** Optional SVG or text — we'll render text-based placeholders for now */
}

const logos: LogoItem[] = [
  { name: "MedFlow" },
  { name: "HealthBridge" },
  { name: "CareAxis" },
  { name: "NeuralMed" },
  { name: "VitaSync" },
  { name: "CliniqAI" },
  { name: "PulseNet" },
  { name: "MedSovereign" },
];

export default function LogoMarquee() {
  const doubled = [...logos, ...logos];

  return (
    <div className="relative w-full overflow-hidden" style={{ padding: "32px 0" }}>
      {/* Fade edges */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10"
        style={{ width: 80, background: "linear-gradient(90deg, rgba(244,239,250,1), transparent)" }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10"
        style={{ width: 80, background: "linear-gradient(270deg, rgba(244,239,250,1), transparent)" }}
      />

      <div
        className="flex items-center gap-16"
        style={{
          animation: "marqueeScroll 28s linear infinite",
          width: "max-content",
        }}
      >
        {doubled.map((logo, i) => (
          <div
            key={i}
            className="flex-shrink-0 select-none"
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "rgba(27,15,46,0.28)",
              whiteSpace: "nowrap",
            }}
          >
            {logo.name}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
