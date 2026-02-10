import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface LayerConfig {
  label: string;
  subtitle: string;
  translatePercent: number;
  speed: number; // seconds
  pathD: string;
  nodes: { cx: number; cy: number }[];
  lineColor: string;
  nodeColor: string;
}

const layers: LayerConfig[] = [
  {
    label: "AI Cortex",
    subtitle: "Reasoning · Context · Decision Support",
    translatePercent: 18,
    speed: 45,
    pathD: "",
    nodes: [],
    lineColor: "rgba(230, 220, 255, 0.65)",
    nodeColor: "rgba(245, 235, 255, 0.9)",
  },
  {
    label: "Workflow Orchestration",
    subtitle: "Routing · Decisions · Clinical Ops",
    translatePercent: 12,
    speed: 60,
    pathD: "",
    nodes: [],
    lineColor: "rgba(200, 185, 235, 0.45)",
    nodeColor: "rgba(220, 210, 245, 0.7)",
  },
  {
    label: "Sovereign Data Plane",
    subtitle: "Storage · Policy · Jurisdictional Control",
    translatePercent: 5,
    speed: 120,
    pathD: "",
    nodes: [],
    lineColor: "rgba(160, 145, 210, 0.3)",
    nodeColor: "rgba(190, 175, 230, 0.5)",
  },
];

const LayerPanel = ({ layer, index }: { layer: LayerConfig; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
      className="relative rounded-[18px] overflow-hidden"
      style={{
        background: index === 0 ? "rgba(255, 255, 255, 0.09)" : index === 2 ? "rgba(255, 255, 255, 0.035)" : "rgba(255, 255, 255, 0.06)",
        border: index === 0 ? "1px solid rgba(230, 230, 250, 0.24)" : index === 2 ? "1px solid rgba(230, 230, 250, 0.12)" : "1px solid rgba(230, 230, 250, 0.18)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        boxShadow: index === 0 ? "0 18px 60px rgba(10, 5, 25, 0.4)" : index === 2 ? "0 18px 60px rgba(10, 5, 25, 0.45)" : "0 18px 60px rgba(10, 5, 25, 0.35)",
      }}
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(230,230,250,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(230,230,250,0.4) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Animated paths + nodes */}
      <div className="relative h-[110px] md:h-[120px] overflow-hidden">
        <svg
          viewBox="0 0 640 100"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <filter id={`glow-${index}`}>
              <feGaussianBlur stdDeviation="4" />
            </filter>
          </defs>

          <g>
            {index === 0 ? (
              <>
                {/* AI CORTEX — 4 converging paths, traveling pulse, breathing nodes */}
                <path d="M -40 15 C 80 5, 180 28, 320 46 S 520 32, 680 18" fill="none" stroke={layer.lineColor} strokeWidth={2.5} strokeLinecap="round">
                  <animateTransform attributeName="transform" type="translate" from="-30 0" to={`${640 * layer.translatePercent / 100} 0`} dur={`${layer.speed}s`} repeatCount="indefinite" />
                </path>
                <path d="M -30 50 C 100 56, 230 38, 320 47 S 500 52, 670 48" fill="none" stroke={layer.lineColor} strokeWidth={2.2} strokeLinecap="round" opacity={0.75}>
                  <animateTransform attributeName="transform" type="translate" from="-30 0" to={`${640 * layer.translatePercent / 100} 0`} dur={`${layer.speed}s`} repeatCount="indefinite" />
                </path>
                <path d="M -20 80 C 100 84, 200 60, 320 48 S 510 58, 660 75" fill="none" stroke={layer.lineColor} strokeWidth={1.8} strokeLinecap="round" opacity={0.5}>
                  <animateTransform attributeName="transform" type="translate" from="-30 0" to={`${640 * layer.translatePercent / 100} 0`} dur={`${layer.speed}s`} repeatCount="indefinite" />
                </path>
                <path d="M -50 3 C 60 -2, 200 25, 320 47 S 540 28, 690 8" fill="none" stroke={layer.lineColor} strokeWidth={1.2} strokeLinecap="round" opacity={0.3}>
                  <animateTransform attributeName="transform" type="translate" from="-30 0" to={`${640 * layer.translatePercent / 100} 0`} dur={`${layer.speed}s`} repeatCount="indefinite" />
                </path>
                {/* Convergence glow */}
                <circle cx="320" cy="47" r="24" fill="rgba(230, 220, 255, 0.08)" filter={`url(#glow-${index})`}>
                  <animateTransform attributeName="transform" type="translate" from="-30 0" to={`${640 * layer.translatePercent / 100} 0`} dur={`${layer.speed}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.05;0.15;0.05" dur="4s" repeatCount="indefinite" />
                </circle>
                {/* Primary decision node — breathes */}
                <circle cx="320" cy="47" r="8" fill={layer.nodeColor}>
                  <animateTransform attributeName="transform" type="translate" from="-30 0" to={`${640 * layer.translatePercent / 100} 0`} dur={`${layer.speed}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;1;0.6" dur="4s" repeatCount="indefinite" />
                  <animate attributeName="r" values="7;9.5;7" dur="4s" repeatCount="indefinite" />
                </circle>
                {/* Secondary checkpoint */}
                <circle cx="490" cy="49" r="5.5" fill={layer.nodeColor}>
                  <animateTransform attributeName="transform" type="translate" from="-30 0" to={`${640 * layer.translatePercent / 100} 0`} dur={`${layer.speed}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.35;0.9;0.35" dur="5s" repeatCount="indefinite" begin="1.5s" />
                </circle>
                {/* Traveling data pulse along center path */}
                <circle r="3.5" fill={layer.nodeColor} opacity="0">
                  <animateMotion dur="3.5s" repeatCount="indefinite">
                    <mpath href="#cortex-spine" />
                  </animateMotion>
                  <animate attributeName="opacity" values="0;0.85;0.85;0" dur="3.5s" repeatCount="indefinite" />
                </circle>
                <path id="cortex-spine" d="M -30 50 C 100 56, 230 38, 320 47 S 500 52, 670 48" fill="none" stroke="none" />
              </>
            ) : index === 1 ? (
              <>
                {/* WORKFLOW ORCHESTRATION — straight routes, staggered handoff activations */}
                <path d="M -40 16 L 680 16" fill="none" stroke={layer.lineColor} strokeWidth={2.2} strokeLinecap="round">
                  <animateTransform attributeName="transform" type="translate" from="0 0" to={`${640 * layer.translatePercent / 100} 0`} dur={`${layer.speed}s`} repeatCount="indefinite" />
                </path>
                <path d="M -40 36 L 680 36" fill="none" stroke={layer.lineColor} strokeWidth={2} strokeLinecap="round" opacity={0.7}>
                  <animateTransform attributeName="transform" type="translate" from="0 0" to={`${640 * layer.translatePercent / 100} 0`} dur={`${layer.speed}s`} repeatCount="indefinite" />
                </path>
                <path d="M -40 56 L 680 56" fill="none" stroke={layer.lineColor} strokeWidth={1.6} strokeLinecap="round" opacity={0.5}>
                  <animateTransform attributeName="transform" type="translate" from="0 0" to={`${640 * layer.translatePercent / 100} 0`} dur={`${layer.speed}s`} repeatCount="indefinite" />
                </path>
                <path d="M -40 74 L 680 74" fill="none" stroke={layer.lineColor} strokeWidth={1.3} strokeLinecap="round" opacity={0.3}>
                  <animateTransform attributeName="transform" type="translate" from="0 0" to={`${640 * layer.translatePercent / 100} 0`} dur={`${layer.speed}s`} repeatCount="indefinite" />
                </path>
                {/* Vertical handoff connectors */}
                {[130, 290, 450, 580].map((x, i) => (
                  <line key={`v-${i}`} x1={x} y1={16} x2={x} y2={74} stroke={layer.lineColor} strokeWidth={0.8} opacity={0.15}>
                    <animateTransform attributeName="transform" type="translate" from="0 0" to={`${640 * layer.translatePercent / 100} 0`} dur={`${layer.speed}s`} repeatCount="indefinite" />
                  </line>
                ))}
                {/* Staggered handoff nodes with activation ring */}
                {[
                  { cx: 130, cy: 36, delay: 0 },
                  { cx: 290, cy: 36, delay: 1.5 },
                  { cx: 450, cy: 36, delay: 3 },
                  { cx: 580, cy: 36, delay: 4.5 },
                ].map((node, ni) => (
                  <g key={ni}>
                    <rect x={node.cx - 5} y={node.cy - 5} width={10} height={10} rx={2.5} fill={layer.nodeColor} opacity={0.5}>
                      <animateTransform attributeName="transform" type="translate" from="0 0" to={`${640 * layer.translatePercent / 100} 0`} dur={`${layer.speed}s`} repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.3;0.8;0.3" dur="6s" repeatCount="indefinite" begin={`${node.delay}s`} />
                    </rect>
                    <rect x={node.cx - 8} y={node.cy - 8} width={16} height={16} rx={4} fill="none" stroke={layer.nodeColor} strokeWidth={0.8} opacity={0}>
                      <animateTransform attributeName="transform" type="translate" from="0 0" to={`${640 * layer.translatePercent / 100} 0`} dur={`${layer.speed}s`} repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0;0.5;0" dur="6s" repeatCount="indefinite" begin={`${node.delay}s`} />
                    </rect>
                  </g>
                ))}
              </>
            ) : (
              <>
                {/* SOVEREIGN DATA PLANE — thick near-static lines, monolithic nodes */}
                <path d="M -40 24 L 680 24" fill="none" stroke={layer.lineColor} strokeWidth={3} strokeLinecap="round">
                  <animateTransform attributeName="transform" type="translate" from="0 0" to={`${640 * layer.translatePercent / 100} 0`} dur={`${layer.speed}s`} repeatCount="indefinite" />
                </path>
                <path d="M -40 50 L 680 50" fill="none" stroke={layer.lineColor} strokeWidth={2.5} strokeLinecap="round" opacity={0.55}>
                  <animateTransform attributeName="transform" type="translate" from="0 0" to={`${640 * layer.translatePercent / 100} 0`} dur={`${layer.speed}s`} repeatCount="indefinite" />
                </path>
                <path d="M -40 76 L 680 76" fill="none" stroke={layer.lineColor} strokeWidth={1.8} strokeLinecap="round" opacity={0.3}>
                  <animateTransform attributeName="transform" type="translate" from="0 0" to={`${640 * layer.translatePercent / 100} 0`} dur={`${layer.speed}s`} repeatCount="indefinite" />
                </path>
                <circle cx="240" cy="50" r="11" fill={layer.nodeColor} opacity={0.4}>
                  <animateTransform attributeName="transform" type="translate" from="0 0" to={`${640 * layer.translatePercent / 100} 0`} dur={`${layer.speed}s`} repeatCount="indefinite" />
                </circle>
                <circle cx="420" cy="50" r="11" fill={layer.nodeColor} opacity={0.4}>
                  <animateTransform attributeName="transform" type="translate" from="0 0" to={`${640 * layer.translatePercent / 100} 0`} dur={`${layer.speed}s`} repeatCount="indefinite" />
                </circle>
                <ellipse cx="330" cy="50" rx="65" ry="28" fill="rgba(160, 145, 210, 0.04)">
                  <animateTransform attributeName="transform" type="translate" from="0 0" to={`${640 * layer.translatePercent / 100} 0`} dur={`${layer.speed}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.02;0.09;0.02" dur="12s" repeatCount="indefinite" />
                </ellipse>
              </>
            )}
          </g>
        </svg>
      </div>

      {/* Label chip */}
      <div className="relative px-5 pb-4 pt-1 flex items-center justify-between">
        <div>
          <span
            className="text-[13px] md:text-[15px] font-semibold tracking-[0.05em]"
            style={{ color: "rgba(230, 225, 255, 0.92)" }}
          >
            {layer.label}
          </span>
          <p
            className="text-[10px] md:text-[11px] mt-0.5 tracking-wide"
            style={{ color: "rgba(160, 150, 200, 0.55)" }}
          >
            {layer.subtitle}
          </p>
        </div>
        <div
          className="px-2.5 py-1 rounded-full text-[9px] md:text-[10px] font-medium tracking-wider uppercase"
          style={{
            background: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(230, 230, 250, 0.12)",
            color: "rgba(200, 190, 240, 0.6)",
          }}
        >
          Active
        </div>
      </div>
    </motion.div>
  );
};

const ManifestoSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const headlineOpacity = useTransform(scrollYProgress, [0.06, 0.22], [0, 1]);
  const headlineY = useTransform(scrollYProgress, [0.06, 0.22], [36, 0]);

  return (
    <section
      ref={containerRef}
      className="relative py-32 md:py-40 lg:py-48 overflow-hidden"
      style={{
        background: `
          radial-gradient(50% 50% at 70% 45%, rgba(230,230,250,0.18), transparent 65%),
          linear-gradient(135deg, #2D1B4E 0%, #3A1F6B 100%)
        `,
        color: "rgba(237, 235, 255, 0.92)",
      }}
    >
      {/* Content grid: left text + right stack */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20 items-center">

          {/* Left column — text */}
          <motion.div style={{ opacity: headlineOpacity, y: headlineY }}>
            <p
              className="mono-label mb-5"
              style={{ color: "rgba(160, 150, 200, 0.5)" }}
            >
              THE INTELLIGENCE LAYER
            </p>
            <h2
              className="text-[26px] md:text-[34px] lg:text-[42px] font-bold leading-[1.15] tracking-tight mb-6"
              style={{ color: "rgba(235, 230, 255, 0.95)" }}
            >
              We are the layer
              <br />
              under everything.
            </h2>
            <p
              className="text-[14px] md:text-[16px] leading-relaxed max-w-md"
              style={{ color: "rgba(190, 180, 220, 0.7)" }}
            >
              Three system planes running beneath every clinical workflow — reasoning,
              orchestration, and sovereign data governance — engineered as
              infrastructure, not features.
            </p>
          </motion.div>

          {/* Right column — layer stack */}
          <div className="relative">
            {/* Power glow behind stack */}
            <div
              className="absolute pointer-events-none"
              style={{
                top: "-10%",
                left: "5%",
                width: "90%",
                height: "120%",
                background:
                  "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(160, 130, 240, 0.12) 0%, transparent 65%)",
              }}
            />

            <div className="relative z-10 space-y-4 md:space-y-5">
              {layers.map((layer, i) => (
                <LayerPanel key={layer.label} layer={layer} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManifestoSection;
