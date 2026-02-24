import React from "react";

/**
 * Buzzworthy-inspired "(SCROLL)" indicator with subtle bounce animation.
 */
export default function ScrollIndicator() {
  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 pointer-events-none select-none"
      style={{
        bottom: "4vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        animation: "scrollBounce 2.4s ease-in-out infinite",
      }}
    >
      {/* Down arrow line */}
      <svg
        width="16"
        height="28"
        viewBox="0 0 16 28"
        fill="none"
        style={{ opacity: 0.45 }}
      >
        <line x1="8" y1="0" x2="8" y2="22" stroke="rgba(243,239,255,0.6)" strokeWidth="1.2" />
        <path d="M3 18 L8 24 L13 18" stroke="rgba(243,239,255,0.6)" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      <span
        style={{
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace",
          fontSize: 10,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: "rgba(243,239,255,0.40)",
        }}
      >
        ( scroll )
      </span>

      <style>{`
        @keyframes scrollBounce {
          0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.7; }
          50% { transform: translateX(-50%) translateY(8px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
