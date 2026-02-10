import { useRef, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// Deterministic pseudo-random
const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
};

const generateCurvedPaths = (
  bandIndex: number,
  count: number,
  yOffset: number,
  amplitude: number,
  width: number
) => {
  const paths: string[] = [];
  for (let i = 0; i < count; i++) {
    const y = yOffset + (i / count) * 120;
    const seed = bandIndex * 100 + i;
    const a = amplitude * (0.6 + seededRandom(seed) * 0.8);
    const phase = seed * 50;
    const cp1x = width * 0.25;
    const cp1y = y - a + Math.sin(phase) * 15;
    const cp2x = width * 0.75;
    const cp2y = y + a * 0.7 + Math.cos(phase) * 10;
    const endY = y + (seededRandom(seed + 99) - 0.5) * 30;
    paths.push(`M 0 ${y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${width} ${endY}`);
  }
  return paths;
};

const generateNodes = (
  bandIndex: number,
  count: number,
  yMin: number,
  yMax: number,
  width: number
) => {
  const nodes: { x: number; y: number; size: number; delay: number }[] = [];
  for (let i = 0; i < count; i++) {
    const seed = bandIndex * 100 + i;
    nodes.push({
      x: 80 + seededRandom(seed * 3) * (width - 160),
      y: yMin + seededRandom(seed * 7) * (yMax - yMin),
      size: 1.5 + (seed % 3),
      delay: (seed % 40) / 10,
    });
  }
  return nodes;
};

interface BandConfig {
  label: string;
  subtext: string;
  strokeColor: string;
  glowColor: string;
  nodeColor: string;
  yOffset: number;
  pathCount: number;
  nodeCount: number;
  amplitude: number;
  speed: number;
}

const bands: BandConfig[] = [
  {
    label: "Clinical Intelligence",
    subtext: "Decision support, context awareness, reasoning",
    strokeColor: "rgba(140, 130, 200, 0.4)",
    glowColor: "rgba(140, 130, 200, 0.18)",
    nodeColor: "rgba(130, 115, 195, 0.7)",
    yOffset: 60,
    pathCount: 8,
    nodeCount: 18,
    amplitude: 25,
    speed: 18,
  },
  {
    label: "System Orchestration",
    subtext: "Workflows, EMRs, clinical operations",
    strokeColor: "rgba(110, 120, 180, 0.35)",
    glowColor: "rgba(110, 120, 180, 0.15)",
    nodeColor: "rgba(100, 115, 175, 0.65)",
    yOffset: 220,
    pathCount: 6,
    nodeCount: 12,
    amplitude: 20,
    speed: 22,
  },
  {
    label: "Sovereign Governance",
    subtext: "Compliance, auditability, jurisdictional control",
    strokeColor: "rgba(90, 80, 150, 0.3)",
    glowColor: "rgba(90, 80, 150, 0.12)",
    nodeColor: "rgba(85, 75, 145, 0.55)",
    yOffset: 380,
    pathCount: 5,
    nodeCount: 8,
    amplitude: 15,
    speed: 28,
  },
];

const SVG_WIDTH = 1200;
const SVG_HEIGHT = 520;

const CortexBand = ({
  band,
  scrollProgress,
  index,
}: {
  band: BandConfig;
  scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  index: number;
}) => {
  const paths = useMemo(
    () => generateCurvedPaths(index, band.pathCount, band.yOffset, band.amplitude, SVG_WIDTH),
    [index, band.pathCount, band.yOffset, band.amplitude]
  );
  const nodes = useMemo(
    () => generateNodes(index, band.nodeCount, band.yOffset, band.yOffset + 120, SVG_WIDTH),
    [index, band.nodeCount, band.yOffset]
  );

  const labelOpacity = useTransform(
    scrollProgress,
    [0.15 + index * 0.15, 0.3 + index * 0.15],
    [0, 1]
  );
  const labelY = useTransform(
    scrollProgress,
    [0.15 + index * 0.15, 0.3 + index * 0.15],
    [20, 0]
  );

  return (
    <g>
      {paths.map((d, i) => (
        <path
          key={`glow-${index}-${i}`}
          d={d}
          fill="none"
          stroke={band.glowColor}
          strokeWidth={6}
          filter="url(#bandBlur)"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values={`0,0; ${30 + i * 5},${Math.sin(i) * 3}; 0,0`}
            dur={`${band.speed + i * 2}s`}
            repeatCount="indefinite"
          />
        </path>
      ))}

      {paths.map((d, i) => (
        <path
          key={`line-${index}-${i}`}
          d={d}
          fill="none"
          stroke={band.strokeColor}
          strokeWidth={1.2}
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values={`0,0; ${30 + i * 5},${Math.sin(i) * 3}; 0,0`}
            dur={`${band.speed + i * 2}s`}
            repeatCount="indefinite"
          />
        </path>
      ))}

      {nodes.map((node, i) => (
        <circle
          key={`node-${index}-${i}`}
          cx={node.x}
          cy={node.y}
          r={node.size}
          fill={band.nodeColor}
        >
          <animate
            attributeName="opacity"
            values="0.3;0.9;0.3"
            dur={`${3 + node.delay}s`}
            begin={`${node.delay}s`}
            repeatCount="indefinite"
          />
          <animateTransform
            attributeName="transform"
            type="translate"
            values={`0,0; ${8 + (i % 5) * 3},0; 0,0`}
            dur={`${band.speed}s`}
            begin={`${node.delay}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}

      <foreignObject
        x={SVG_WIDTH * 0.58}
        y={band.yOffset + 30}
        width={380}
        height={80}
        className="hidden md:block"
      >
        <motion.div
          style={{ opacity: labelOpacity, y: labelY }}
          className="flex flex-col"
        >
          <span
            className="text-[15px] lg:text-[17px] font-semibold tracking-wide"
            style={{ color: "hsl(248, 45%, 25%)" }}
          >
            {band.label}
          </span>
          <span
            className="text-[11px] lg:text-[13px] mt-1 tracking-wide"
            style={{ color: "rgba(90, 80, 140, 0.65)" }}
          >
            {band.subtext}
          </span>
        </motion.div>
      </foreignObject>
    </g>
  );
};

const ManifestoSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const headlineOpacity = useTransform(scrollYProgress, [0.05, 0.2], [0, 1]);
  const headlineY = useTransform(scrollYProgress, [0.05, 0.2], [40, 0]);

  return (
    <section
      ref={containerRef}
      className="relative py-32 md:py-40 lg:py-48 overflow-hidden"
      style={{
        background: `linear-gradient(135deg,
          #E6E6FA 0%,
          #DAD8F3 18%,
          #D5D4EE 30%,
          #E8E9F5 42%,
          #F6F7FB 50%,
          #F4F2F0 62%,
          #F6F7FB 75%,
          #EDE8E5 100%
        )`,
      }}
    >
      {/* Left: cool lavender / periwinkle field */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 90% at 10% 50%, rgba(199, 201, 242, 0.55) 0%, transparent 65%)",
        }}
      />
      {/* Center: neutral off-white breathing space */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 70% at 50% 45%, rgba(246, 247, 251, 0.6) 0%, transparent 60%)",
        }}
      />
      {/* Right: restrained coral wash at 30% opacity */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 80% at 92% 60%, rgba(242, 193, 174, 0.3) 0%, transparent 55%)",
        }}
      />
      {/* Subtle vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 75% 65% at 50% 50%, transparent 40%, rgba(218, 216, 243, 0.25) 100%)",
        }}
      />

      <div className="relative z-10 max-w-[1200px] mx-auto px-8 md:px-12 mb-16 md:mb-24">
        <motion.div style={{ opacity: headlineOpacity, y: headlineY }}>
          <p
            className="mono-label mb-6"
            style={{ color: "rgba(90, 80, 140, 0.6)" }}
          >
            THE INTELLIGENCE LAYER
          </p>
          <h2
            className="text-[28px] md:text-[38px] lg:text-[46px] font-bold leading-[1.15] tracking-tight"
            style={{
              color: "hsl(248, 50%, 20%)",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Intelligence,
            <br />
            Engineered as Infrastructure
          </h2>
        </motion.div>
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 md:px-8">
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="w-full h-auto"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <filter id="bandBlur">
              <feGaussianBlur stdDeviation="3" />
            </filter>
          </defs>

          {bands.map((band, i) => (
            <CortexBand
              key={band.label}
              band={band}
              scrollProgress={scrollYProgress}
              index={i}
            />
          ))}
        </svg>
      </div>

      <div className="md:hidden relative z-10 max-w-[1200px] mx-auto px-8 mt-8 space-y-6">
        {bands.map((band, i) => (
          <motion.div
            key={band.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
          >
            <p
              className="text-[14px] font-semibold tracking-wide"
              style={{ color: "hsl(248, 45%, 25%)" }}
            >
              {band.label}
            </p>
            <p
              className="text-[12px] mt-0.5"
              style={{ color: "rgba(90, 80, 140, 0.55)" }}
            >
              {band.subtext}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ManifestoSection;
