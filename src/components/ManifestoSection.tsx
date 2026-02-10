import { useRef, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// Deterministic pseudo-random
const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
};

// Generate clean, readable curved paths — 6-8 per band max
const generateBandPaths = (
  bandIndex: number,
  count: number,
  yCenter: number,
  bandHeight: number,
  amplitude: number,
  width: number
) => {
  const paths: string[] = [];
  for (let i = 0; i < count; i++) {
    const y = yCenter - bandHeight / 2 + (i / (count - 1)) * bandHeight;
    const seed = bandIndex * 50 + i;
    const a = amplitude * (0.5 + seededRandom(seed) * 0.5);
    const cp1x = width * 0.3;
    const cp1y = y - a;
    const cp2x = width * 0.7;
    const cp2y = y + a * 0.6;
    const endY = y + (seededRandom(seed + 50) - 0.5) * 12;
    paths.push(`M -20 ${y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${width + 20} ${endY}`);
  }
  return paths;
};

// Place nodes intentionally ON lines — like checkpoints
const generateCheckpointNodes = (
  bandIndex: number,
  count: number,
  paths: string[],
  width: number
) => {
  const nodes: { x: number; y: number; size: number; pathIndex: number }[] = [];
  // Distribute nodes across paths at specific x positions
  const xPositions = [0.15, 0.3, 0.45, 0.55, 0.7, 0.85, 0.25, 0.6];
  for (let i = 0; i < Math.min(count, xPositions.length); i++) {
    const pathIdx = i % paths.length;
    const x = width * xPositions[i];
    // Approximate y from path — parse the start y and end y, interpolate
    const pathStr = paths[pathIdx];
    const startY = parseFloat(pathStr.split(" ")[2]);
    const endMatch = pathStr.match(/(\d+\.?\d*)\s*$/);
    const endY = endMatch ? parseFloat(endMatch[1]) : startY;
    const t = xPositions[i];
    const y = startY + (endY - startY) * t + (seededRandom(bandIndex * 100 + i) - 0.5) * 8;
    nodes.push({
      x,
      y,
      size: 4 + seededRandom(bandIndex * 30 + i) * 3,
      pathIndex: pathIdx,
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
  yCenter: number;
  bandHeight: number;
  pathCount: number;
  nodeCount: number;
  amplitude: number;
  strokeWidth: number;
  speed: number; // seconds for one cycle
}

const SVG_WIDTH = 1400;
const SVG_HEIGHT = 600;

const bands: BandConfig[] = [
  {
    label: "Clinical Intelligence",
    subtext: "Decision support, context awareness, reasoning",
    strokeColor: "rgba(210, 190, 255, 0.45)",
    glowColor: "rgba(210, 190, 255, 0.12)",
    nodeColor: "rgba(230, 220, 255, 0.55)",
    yCenter: 120,
    bandHeight: 90,
    pathCount: 8,
    nodeCount: 7,
    amplitude: 18,
    strokeWidth: 2,
    speed: 25,
  },
  {
    label: "System Orchestration",
    subtext: "Workflows, EMRs, clinical operations",
    strokeColor: "rgba(180, 160, 230, 0.30)",
    glowColor: "rgba(180, 160, 230, 0.08)",
    nodeColor: "rgba(230, 220, 255, 0.55)",
    yCenter: 300,
    bandHeight: 80,
    pathCount: 7,
    nodeCount: 6,
    amplitude: 14,
    strokeWidth: 1.8,
    speed: 32,
  },
  {
    label: "Sovereign Governance",
    subtext: "Compliance, auditability, jurisdictional control",
    strokeColor: "rgba(140, 120, 210, 0.18)",
    glowColor: "rgba(140, 120, 210, 0.06)",
    nodeColor: "rgba(230, 220, 255, 0.55)",
    yCenter: 480,
    bandHeight: 70,
    pathCount: 6,
    nodeCount: 5,
    amplitude: 10,
    strokeWidth: 1.5,
    speed: 40,
  },
];

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
    () => generateBandPaths(index, band.pathCount, band.yCenter, band.bandHeight, band.amplitude, SVG_WIDTH),
    [index, band.pathCount, band.yCenter, band.bandHeight, band.amplitude]
  );
  const nodes = useMemo(
    () => generateCheckpointNodes(index, band.nodeCount, paths, SVG_WIDTH),
    [index, band.nodeCount, paths]
  );

  const labelOpacity = useTransform(
    scrollProgress,
    [0.12 + index * 0.14, 0.26 + index * 0.14],
    [0, 1]
  );
  const labelY = useTransform(
    scrollProgress,
    [0.12 + index * 0.14, 0.26 + index * 0.14],
    [16, 0]
  );

  const translateAmount = 40 + index * 10;

  return (
    <g>
      {/* Glow behind lines */}
      {paths.map((d, i) => (
        <path
          key={`glow-${index}-${i}`}
          d={d}
          fill="none"
          stroke={band.glowColor}
          strokeWidth={8}
          filter="url(#bandBlur)"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values={`0,0; ${translateAmount},0; 0,0`}
            dur={`${band.speed + i * 1.5}s`}
            repeatCount="indefinite"
          />
        </path>
      ))}

      {/* Main lines — clean, readable strokes */}
      {paths.map((d, i) => (
        <path
          key={`line-${index}-${i}`}
          d={d}
          fill="none"
          stroke={band.strokeColor}
          strokeWidth={band.strokeWidth}
          strokeLinecap="round"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values={`0,0; ${translateAmount},0; 0,0`}
            dur={`${band.speed + i * 1.5}s`}
            repeatCount="indefinite"
          />
        </path>
      ))}

      {/* Checkpoint nodes — on lines, moving with their band */}
      {nodes.map((node, i) => (
        <g key={`node-${index}-${i}`}>
          {/* Node glow */}
          <circle
            cx={node.x}
            cy={node.y}
            r={node.size + 4}
            fill="none"
            stroke={band.nodeColor}
            strokeWidth={1}
            opacity={0.25}
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values={`0,0; ${translateAmount},0; 0,0`}
              dur={`${band.speed}s`}
              repeatCount="indefinite"
            />
          </circle>
          {/* Node core */}
          <circle
            cx={node.x}
            cy={node.y}
            r={node.size}
            fill={band.nodeColor}
          >
            <animate
              attributeName="opacity"
              values="0.4;0.75;0.4"
              dur={`${4 + i}s`}
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="translate"
              values={`0,0; ${translateAmount},0; 0,0`}
              dur={`${band.speed}s`}
              repeatCount="indefinite"
            />
          </circle>
        </g>
      ))}

      {/* Band label — right side */}
      <foreignObject
        x={SVG_WIDTH * 0.62}
        y={band.yCenter - 20}
        width={400}
        height={70}
        className="hidden md:block"
      >
        <motion.div
          style={{ opacity: labelOpacity, y: labelY }}
          className="flex flex-col"
        >
          <span
            className="text-[15px] lg:text-[17px] font-semibold tracking-[0.06em]"
            style={{ color: "rgba(220, 210, 255, 0.9)" }}
          >
            {band.label}
          </span>
          <span
            className="text-[11px] lg:text-[13px] mt-1.5 tracking-wide"
            style={{ color: "rgba(160, 150, 200, 0.6)" }}
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
        background: "linear-gradient(90deg, #1B1038 0%, #24124A 50%, #2A154F 100%)",
      }}
    >
      {/* Lavender haze overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 40%, rgba(140, 120, 200, 0.08) 0%, transparent 70%)",
        }}
      />

      {/* Power anchor — radial glow behind center of bands */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "30%",
          left: "25%",
          width: "50%",
          height: "60%",
          background:
            "radial-gradient(circle at 50% 50%, rgba(170, 140, 255, 0.18) 0%, rgba(27, 16, 56, 0) 60%)",
        }}
      />

      {/* Dark overlay behind text area for readability */}
      <div
        className="absolute top-0 left-0 pointer-events-none"
        style={{
          width: "55%",
          height: "45%",
          background:
            "radial-gradient(ellipse 100% 100% at 0% 0%, rgba(15, 8, 35, 0.35) 0%, transparent 70%)",
        }}
      />

      {/* Headline */}
      <div className="relative z-20 max-w-[1200px] mx-auto px-8 md:px-12 mb-12 md:mb-20">
        <motion.div style={{ opacity: headlineOpacity, y: headlineY }}>
          <p
            className="mono-label mb-6"
            style={{ color: "rgba(160, 150, 200, 0.5)" }}
          >
            THE INTELLIGENCE LAYER
          </p>
          <h2
            className="text-[28px] md:text-[38px] lg:text-[46px] font-bold leading-[1.15] tracking-tight"
            style={{
              color: "rgba(235, 230, 255, 0.95)",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Intelligence,
            <br />
            Engineered as Infrastructure
          </h2>
        </motion.div>
      </div>

      {/* Cortex bands */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-4 md:px-8">
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="w-full h-auto"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <filter id="bandBlur">
              <feGaussianBlur stdDeviation="4" />
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

      {/* Mobile labels */}
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
              style={{ color: "rgba(220, 210, 255, 0.85)" }}
            >
              {band.label}
            </p>
            <p
              className="text-[12px] mt-0.5"
              style={{ color: "rgba(160, 150, 200, 0.55)" }}
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
