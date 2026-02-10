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
    translatePercent: 12,
    speed: 70,
    pathD: "M 30 45 C 120 20, 260 70, 370 40 S 520 55, 600 35",
    nodes: [
      { cx: 150, cy: 33 },
      { cx: 370, cy: 40 },
      { cx: 520, cy: 50 },
    ],
    lineColor: "rgba(200, 180, 255, 0.5)",
    nodeColor: "rgba(220, 200, 255, 0.8)",
  },
  {
    label: "Workflow Orchestration",
    subtitle: "Routing · Decisions · Clinical Ops",
    translatePercent: 8,
    speed: 95,
    pathD: "M 20 50 C 140 30, 280 65, 400 45 S 530 40, 620 50",
    nodes: [
      { cx: 200, cy: 42 },
      { cx: 430, cy: 46 },
    ],
    lineColor: "rgba(170, 155, 230, 0.38)",
    nodeColor: "rgba(200, 185, 255, 0.65)",
  },
  {
    label: "Sovereign Data Plane",
    subtitle: "Storage · Policy · Jurisdictional Control",
    translatePercent: 5,
    speed: 120,
    pathD: "M 25 48 C 160 60, 300 35, 420 52 S 540 45, 610 48",
    nodes: [
      { cx: 180, cy: 54 },
      { cx: 420, cy: 52 },
      { cx: 540, cy: 46 },
    ],
    lineColor: "rgba(140, 125, 210, 0.28)",
    nodeColor: "rgba(180, 165, 240, 0.5)",
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
        background: "rgba(255, 255, 255, 0.06)",
        border: "1px solid rgba(230, 230, 250, 0.18)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        boxShadow: "0 18px 60px rgba(10, 5, 25, 0.35)",
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
      <div className="relative h-[90px] md:h-[100px] overflow-hidden">
        <svg
          viewBox="0 0 640 90"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <filter id={`glow-${index}`}>
              <feGaussianBlur stdDeviation="3" />
            </filter>
          </defs>

          {/* Animated group */}
          <g>
            {/* Glow path */}
            <path
              d={layer.pathD}
              fill="none"
              stroke={layer.lineColor}
              strokeWidth={8}
              opacity={0.3}
              filter={`url(#glow-${index})`}
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                from="0 0"
                to={`${640 * layer.translatePercent / 100} 0`}
                dur={`${layer.speed}s`}
                repeatCount="indefinite"
              />
            </path>

            {/* Main path */}
            <path
              d={layer.pathD}
              fill="none"
              stroke={layer.lineColor}
              strokeWidth={1.8}
              strokeLinecap="round"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                from="0 0"
                to={`${640 * layer.translatePercent / 100} 0`}
                dur={`${layer.speed}s`}
                repeatCount="indefinite"
              />
            </path>

            {/* Second subtle path */}
            <path
              d={layer.pathD}
              fill="none"
              stroke={layer.lineColor}
              strokeWidth={1}
              strokeLinecap="round"
              opacity={0.4}
              transform="translate(0, 18)"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                from="0 18"
                to={`${640 * layer.translatePercent / 100} 18`}
                dur={`${layer.speed}s`}
                repeatCount="indefinite"
              />
            </path>

            {/* Checkpoint nodes */}
            {layer.nodes.map((node, ni) => (
              <circle
                key={ni}
                cx={node.cx}
                cy={node.cy}
                r={ni === 0 ? 5 : ni === 1 ? 7 : 6}
                fill={layer.nodeColor}
              >
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from="0 0"
                  to={`${640 * layer.translatePercent / 100} 0`}
                  dur={`${layer.speed}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.6;1;0.6"
                  dur="5s"
                  repeatCount="indefinite"
                  begin={`${ni * 1.2}s`}
                />
              </circle>
            ))}
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
