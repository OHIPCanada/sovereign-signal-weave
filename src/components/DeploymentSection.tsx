import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

/* ─── TOPOLOGY CONFIGURATIONS ─── */
type Mode = "on-prem" | "hybrid" | "sovereign";

interface TopoNode {
  id: string;
  label: string;
  x: number;
  y: number;
  type: "core" | "edge" | "cloud" | "shield";
}

interface TopoLink {
  from: string;
  to: string;
}

const topologies: Record<Mode, { nodes: TopoNode[]; links: TopoLink[] }> = {
  "on-prem": {
    nodes: [
      { id: "core", label: "DocG AI", x: 300, y: 220, type: "core" },
      { id: "emr", label: "EMR", x: 100, y: 120, type: "edge" },
      { id: "pacs", label: "PACS", x: 500, y: 120, type: "edge" },
      { id: "firewall", label: "Firewall", x: 100, y: 320, type: "shield" },
      { id: "vault", label: "Data Vault", x: 500, y: 320, type: "shield" },
      { id: "his", label: "HIS", x: 300, y: 380, type: "edge" },
    ],
    links: [
      { from: "core", to: "emr" },
      { from: "core", to: "pacs" },
      { from: "core", to: "firewall" },
      { from: "core", to: "vault" },
      { from: "core", to: "his" },
      { from: "firewall", to: "emr" },
      { from: "vault", to: "pacs" },
    ],
  },
  hybrid: {
    nodes: [
      { id: "core", label: "DocG AI", x: 300, y: 220, type: "core" },
      { id: "local", label: "Local Node", x: 120, y: 140, type: "edge" },
      { id: "cloud-gw", label: "Cloud GW", x: 480, y: 140, type: "cloud" },
      { id: "emr", label: "EMR", x: 80, y: 310, type: "edge" },
      { id: "cdn", label: "CDN Edge", x: 520, y: 310, type: "cloud" },
      { id: "sync", label: "Sync Layer", x: 300, y: 380, type: "shield" },
    ],
    links: [
      { from: "core", to: "local" },
      { from: "core", to: "cloud-gw" },
      { from: "core", to: "sync" },
      { from: "local", to: "emr" },
      { from: "cloud-gw", to: "cdn" },
      { from: "sync", to: "emr" },
      { from: "sync", to: "cdn" },
    ],
  },
  sovereign: {
    nodes: [
      { id: "core", label: "DocG AI", x: 300, y: 220, type: "core" },
      { id: "gov", label: "Gov Cloud", x: 140, y: 100, type: "cloud" },
      { id: "compliance", label: "Compliance", x: 460, y: 100, type: "shield" },
      { id: "nat-db", label: "National DB", x: 100, y: 340, type: "shield" },
      { id: "region", label: "Region Node", x: 500, y: 340, type: "edge" },
      { id: "audit", label: "Audit Trail", x: 300, y: 400, type: "shield" },
    ],
    links: [
      { from: "core", to: "gov" },
      { from: "core", to: "compliance" },
      { from: "core", to: "nat-db" },
      { from: "core", to: "region" },
      { from: "core", to: "audit" },
      { from: "gov", to: "compliance" },
      { from: "nat-db", to: "audit" },
    ],
  },
};

const tabs: { key: Mode; label: string }[] = [
  { key: "on-prem", label: "On-Prem" },
  { key: "hybrid", label: "Hybrid" },
  { key: "sovereign", label: "Sovereign Cloud" },
];

/* ─── NODE SHAPES ─── */
const nodeColors: Record<string, { fill: string; stroke: string; glow: string }> = {
  core: { fill: "#D4616B", stroke: "#E8967C", glow: "rgba(212,97,107,0.4)" },
  edge: { fill: "rgba(110,43,255,0.15)", stroke: "rgba(110,43,255,0.5)", glow: "rgba(110,43,255,0.15)" },
  cloud: { fill: "rgba(0,180,255,0.12)", stroke: "rgba(0,180,255,0.5)", glow: "rgba(0,180,255,0.15)" },
  shield: { fill: "rgba(212,97,107,0.1)", stroke: "rgba(212,97,107,0.45)", glow: "rgba(212,97,107,0.12)" },
};

/* ─── TOPOLOGY VISUALIZATION ─── */
const StateMachinePanel = () => {
  const [active, setActive] = useState<Mode>("on-prem");
  const topo = topologies[active];

  /* Pulse signal state */
  const [pulseIdx, setPulseIdx] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setPulseIdx((p) => (p + 1) % topo.links.length), 4000);
    return () => clearInterval(iv);
  }, [active, topo.links.length]);

  const nodeMap = Object.fromEntries(topo.nodes.map((n) => [n.id, n]));

  return (
    <div
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.32) 100%)",
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        borderRadius: "32px",
        border: "1px solid rgba(110,43,255,0.1)",
        boxShadow: `
          0 60px 140px rgba(60,40,120,0.12),
          0 20px 60px rgba(60,40,120,0.06),
          inset 0 1px 0 rgba(255,255,255,0.7)
        `,
        overflow: "hidden",
      }}
    >
      {/* Tabs */}
      <div className="flex border-b" style={{ borderColor: "rgba(110,43,255,0.08)" }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => { setActive(t.key); setPulseIdx(0); }}
            className="relative flex-1 py-4 text-xs font-semibold tracking-widest uppercase transition-colors duration-300"
            style={{
              color: active === t.key ? "#6E2BFF" : "rgba(30,30,40,0.45)",
              background: active === t.key ? "rgba(110,43,255,0.04)" : "transparent",
            }}
          >
            {t.label}
            {active === t.key && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-[15%] right-[15%] h-[2px]"
                style={{ background: "linear-gradient(90deg, #D4616B, #E8967C, #F2C1AE)" }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* SVG topology */}
      <div className="relative p-6">
        <svg viewBox="0 0 600 460" className="w-full" style={{ aspectRatio: "600/460" }}>
          <defs>
            <filter id="dp-core-glow">
              <feGaussianBlur stdDeviation="14" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="dp-node-glow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="dp-pulse-glow">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <radialGradient id="dp-core-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#D4616B" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#E8967C" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#F2C1AE" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Links with animated transition */}
          <AnimatePresence mode="wait">
            <motion.g
              key={active + "-links"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {topo.links.map((link, i) => {
                const from = nodeMap[link.from];
                const to = nodeMap[link.to];
                if (!from || !to) return null;
                const isActive = i === pulseIdx;
                return (
                  <g key={`${link.from}-${link.to}`}>
                    <motion.line
                      x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                      stroke={isActive ? "rgba(212,97,107,0.5)" : "rgba(110,43,255,0.15)"}
                      strokeWidth={isActive ? 2 : 1.2}
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, delay: i * 0.06 }}
                    />
                    {/* Pulse signal dot */}
                    {isActive && (
                      <>
                        <circle r="6" fill="rgba(212,97,107,0.35)" filter="url(#dp-pulse-glow)">
                          <animateMotion dur="1.5s" repeatCount="indefinite" path={`M${from.x},${from.y} L${to.x},${to.y}`} />
                          <animate attributeName="opacity" values="0;0.8;0.8;0" keyTimes="0;0.1;0.8;1" dur="1.5s" repeatCount="indefinite" />
                        </circle>
                        <circle r="2.5" fill="#fff" opacity="0.9">
                          <animateMotion dur="1.5s" repeatCount="indefinite" path={`M${from.x},${from.y} L${to.x},${to.y}`} />
                          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.8;1" dur="1.5s" repeatCount="indefinite" />
                        </circle>
                      </>
                    )}
                  </g>
                );
              })}
            </motion.g>
          </AnimatePresence>

          {/* Nodes */}
          <AnimatePresence mode="wait">
            <motion.g
              key={active + "-nodes"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {topo.nodes.map((node, i) => {
                const c = nodeColors[node.type];
                const isCore = node.type === "core";
                return (
                  <motion.g
                    key={node.id}
                    initial={{ x: 300 - node.x, y: 220 - node.y, opacity: 0 }}
                    animate={{ x: 0, y: 0, opacity: 1 }}
                    transition={{ duration: 0.85, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {isCore ? (
                      <>
                        {/* Core breathing halo */}
                        <circle cx={node.x} cy={node.y} r="55" fill="url(#dp-core-grad)" opacity="0.3">
                          <animate attributeName="r" values="55;62;55" dur="6s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.3;0.15;0.3" dur="6s" repeatCount="indefinite" />
                        </circle>
                        <circle cx={node.x} cy={node.y} r="32" fill={c.fill} filter="url(#dp-core-glow)" opacity="0.85">
                          <animate attributeName="r" values="32;35;32" dur="5s" repeatCount="indefinite" />
                        </circle>
                        <circle cx={node.x} cy={node.y} r="14" fill="#fff" opacity="0.9">
                          <animate attributeName="r" values="14;16;14" dur="4s" repeatCount="indefinite" />
                        </circle>
                        <text x={node.x} y={node.y + 55} textAnchor="middle" fill="rgba(30,20,50,0.8)" fontSize="13" fontWeight="700" fontFamily="Inter, sans-serif" letterSpacing="0.04em">
                          {node.label}
                        </text>
                      </>
                    ) : (
                      <>
                        {/* Edge nodes */}
                        <circle cx={node.x} cy={node.y} r="18" fill={c.fill} stroke={c.stroke} strokeWidth="1.5" filter="url(#dp-node-glow)">
                          <animate attributeName="r" values="18;20;18" dur={`${5 + i * 0.5}s`} repeatCount="indefinite" />
                        </circle>
                        <circle cx={node.x} cy={node.y} r="6" fill={c.stroke} opacity="0.7" />
                        <text x={node.x} y={node.y + 32} textAnchor="middle" fill="rgba(30,20,50,0.65)" fontSize="11" fontWeight="600" fontFamily="Inter, sans-serif" letterSpacing="0.03em">
                          {node.label}
                        </text>
                      </>
                    )}
                  </motion.g>
                );
              })}
            </motion.g>
          </AnimatePresence>
        </svg>

        {/* Status line */}
        <div className="flex items-center gap-2 mt-2">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#D4616B" }} />
          <span className="text-[10px] font-mono tracking-wider" style={{ color: "rgba(30,20,50,0.4)" }}>
            MODE: {active.toUpperCase().replace("-", "_")} — ALL NODES ACTIVE
          </span>
        </div>
      </div>
    </div>
  );
};

/* ─── MAIN SECTION ─── */
const DeploymentSection = () => {
  return (
    <section
      className="relative overflow-hidden flex items-center"
      id="deployment"
      style={{
        padding: "clamp(64px, 7vw, 110px) 0",
        minHeight: "100vh",
        background: `
          radial-gradient(900px 500px at 80% 70%, rgba(212,97,107,0.08), transparent 60%),
          radial-gradient(800px 600px at 15% 30%, rgba(110,43,255,0.07), transparent 65%),
          linear-gradient(180deg, #F6F2FF 0%, #F0ECF8 50%, #F4F0FA 100%)
        `,
      }}
    >
      {/* Top gradient separator */}
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{
        background: "linear-gradient(90deg, transparent 5%, rgba(110,43,255,0.35) 30%, rgba(212,97,107,0.3) 70%, transparent 95%)",
      }} />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] items-center w-full" style={{ gap: "clamp(24px, 4vw, 64px)" }}>
          {/* ── Left: Text ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-7"
          >
            <span className="mono-label" style={{ color: "rgba(17,17,17,0.55)" }}>
              [ DEPLOYMENT MODES ]
            </span>

            <h2 style={{
              color: "#111111",
              fontWeight: 800,
              fontSize: "clamp(42px, 5.5vw, 72px)",
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              fontFamily: "Inter, sans-serif",
            }}>
              Sovereign by
              <br />design. Flexible
              <br />by default.
            </h2>

            <p style={{
              color: "rgba(30,30,30,0.72)",
              fontSize: "18px",
              fontWeight: 400,
              lineHeight: 1.65,
              maxWidth: "480px",
            }}>
              DocG AI ships across hospital networks, national programs, and
              private systems—without breaking workflows.
            </p>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="self-start px-8 py-4 rounded-full text-sm font-semibold tracking-wide transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #6E2BFF, #9B6BFF)",
                color: "#FFFAF8",
                border: "none",
                boxShadow: "0 8px 32px rgba(110,43,255,0.25)",
              }}
            >
              Request Deployment Brief
            </motion.button>
          </motion.div>

          {/* ── Right: State Machine Panel ── */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <StateMachinePanel />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DeploymentSection;
