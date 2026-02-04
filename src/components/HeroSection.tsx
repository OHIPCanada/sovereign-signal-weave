import { motion } from "framer-motion";
import { useMemo } from "react";

// Generate cortex nodes in a structured neural plexus pattern
const generateCortexNodes = () => {
  const nodes: Array<{ id: number; x: number; y: number; layer: number; size: number }> = [];
  
  // Core cluster - central reasoning hub
  const coreNodes = [
    { x: 600, y: 450, layer: 0, size: 8 },
    { x: 560, y: 420, layer: 0, size: 6 },
    { x: 640, y: 420, layer: 0, size: 6 },
    { x: 580, y: 480, layer: 0, size: 5 },
    { x: 620, y: 480, layer: 0, size: 5 },
    { x: 600, y: 400, layer: 0, size: 7 },
  ];

  // Inner ring - processing layer
  const innerRing = [
    { x: 500, y: 400, layer: 1, size: 5 },
    { x: 520, y: 350, layer: 1, size: 4 },
    { x: 580, y: 330, layer: 1, size: 5 },
    { x: 650, y: 340, layer: 1, size: 4 },
    { x: 700, y: 380, layer: 1, size: 5 },
    { x: 720, y: 440, layer: 1, size: 4 },
    { x: 700, y: 500, layer: 1, size: 5 },
    { x: 650, y: 540, layer: 1, size: 4 },
    { x: 580, y: 550, layer: 1, size: 5 },
    { x: 520, y: 530, layer: 1, size: 4 },
    { x: 490, y: 480, layer: 1, size: 5 },
    { x: 480, y: 430, layer: 1, size: 4 },
  ];

  // Outer ring - governance layer
  const outerRing = [
    { x: 420, y: 350, layer: 2, size: 3 },
    { x: 460, y: 290, layer: 2, size: 4 },
    { x: 540, y: 260, layer: 2, size: 3 },
    { x: 620, y: 250, layer: 2, size: 4 },
    { x: 700, y: 280, layer: 2, size: 3 },
    { x: 760, y: 340, layer: 2, size: 4 },
    { x: 790, y: 420, layer: 2, size: 3 },
    { x: 780, y: 500, layer: 2, size: 4 },
    { x: 740, y: 570, layer: 2, size: 3 },
    { x: 670, y: 610, layer: 2, size: 4 },
    { x: 580, y: 620, layer: 2, size: 3 },
    { x: 500, y: 600, layer: 2, size: 4 },
    { x: 440, y: 550, layer: 2, size: 3 },
    { x: 400, y: 480, layer: 2, size: 4 },
    { x: 400, y: 400, layer: 2, size: 3 },
  ];

  // Peripheral nodes - extended network
  const peripheralNodes = [
    { x: 350, y: 300, layer: 3, size: 2 },
    { x: 380, y: 240, layer: 3, size: 2 },
    { x: 480, y: 200, layer: 3, size: 3 },
    { x: 600, y: 180, layer: 3, size: 2 },
    { x: 720, y: 200, layer: 3, size: 3 },
    { x: 820, y: 280, layer: 3, size: 2 },
    { x: 860, y: 380, layer: 3, size: 2 },
    { x: 860, y: 480, layer: 3, size: 3 },
    { x: 820, y: 580, layer: 3, size: 2 },
    { x: 740, y: 660, layer: 3, size: 2 },
    { x: 620, y: 690, layer: 3, size: 3 },
    { x: 500, y: 670, layer: 3, size: 2 },
    { x: 400, y: 620, layer: 3, size: 2 },
    { x: 340, y: 540, layer: 3, size: 3 },
    { x: 320, y: 440, layer: 3, size: 2 },
    { x: 330, y: 360, layer: 3, size: 2 },
  ];

  let id = 0;
  [...coreNodes, ...innerRing, ...outerRing, ...peripheralNodes].forEach((node) => {
    nodes.push({ ...node, id: id++ });
  });

  return nodes;
};

// Generate connections between nodes (filaments)
const generateFilaments = (nodes: ReturnType<typeof generateCortexNodes>) => {
  const filaments: Array<{ from: number; to: number; opacity: number }> = [];
  
  // Connect nodes based on proximity and layer relationships
  nodes.forEach((node, i) => {
    nodes.forEach((other, j) => {
      if (i >= j) return;
      
      const dx = node.x - other.x;
      const dy = node.y - other.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Connect if within range, closer connections are more opaque
      const maxDist = node.layer === 0 || other.layer === 0 ? 120 : 100;
      if (distance < maxDist && distance > 20) {
        const opacity = Math.max(0.08, 0.25 - (distance / maxDist) * 0.2);
        filaments.push({ from: i, to: j, opacity });
      }
    });
  });

  return filaments;
};

// Cortex Node component
const CortexNode = ({
  x,
  y,
  size,
  layer,
  delay,
}: {
  x: number;
  y: number;
  size: number;
  layer: number;
  delay: number;
}) => {
  const baseOpacity = layer === 0 ? 0.6 : layer === 1 ? 0.45 : layer === 2 ? 0.3 : 0.2;
  const glowIntensity = layer === 0 ? 12 : layer === 1 ? 8 : 5;

  return (
    <motion.g>
      {/* Outer glow */}
      <motion.circle
        cx={x}
        cy={y}
        r={size * 2.5}
        fill={`rgba(180, 160, 220, ${baseOpacity * 0.3})`}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: [baseOpacity * 0.2, baseOpacity * 0.4, baseOpacity * 0.2],
          scale: [0.9, 1.1, 0.9]
        }}
        transition={{
          opacity: { duration: 8, delay: delay + 1, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 8, delay: delay + 1, repeat: Infinity, ease: "easeInOut" }
        }}
        style={{ filter: `blur(${glowIntensity}px)` }}
      />
      {/* Core node */}
      <motion.circle
        cx={x}
        cy={y}
        r={size}
        fill={`rgba(190, 175, 230, ${baseOpacity})`}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: baseOpacity, scale: 1 }}
        transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
      />
      {/* Inner highlight */}
      <motion.circle
        cx={x - size * 0.2}
        cy={y - size * 0.2}
        r={size * 0.4}
        fill={`rgba(220, 210, 250, ${baseOpacity * 0.8})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: baseOpacity * 0.6 }}
        transition={{ duration: 1.5, delay: delay + 0.3 }}
      />
    </motion.g>
  );
};

// Filament component
const Filament = ({
  x1,
  y1,
  x2,
  y2,
  opacity,
  delay,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity: number;
  delay: number;
}) => {
  // Create a slight curve for organic feel
  const midX = (x1 + x2) / 2 + (Math.random() - 0.5) * 20;
  const midY = (y1 + y2) / 2 + (Math.random() - 0.5) * 20;
  const path = `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;

  return (
    <motion.path
      d={path}
      fill="none"
      stroke={`rgba(170, 155, 210, ${opacity})`}
      strokeWidth={1}
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: opacity }}
      transition={{ duration: 2, delay, ease: "easeOut" }}
    />
  );
};

const HeroSection = () => {
  const nodes = useMemo(() => generateCortexNodes(), []);
  const filaments = useMemo(() => generateFilaments(nodes), [nodes]);

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#f8f5fc] via-[#f4f0fa] to-[#faf9fc]">
      
      {/* Subtle ambient lavender wash */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 50%, rgba(190, 175, 230, 0.15) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 30% 40%, rgba(200, 185, 240, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse 50% 60% at 70% 60%, rgba(195, 180, 235, 0.08) 0%, transparent 45%)
          `
        }}
      />

      {/* INTELLIGENCE - Background Text */}
      <div className="absolute inset-0 flex items-start justify-center pt-32 md:pt-40 lg:pt-48 pointer-events-none select-none overflow-hidden">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="hero-title text-center text-[clamp(110px,16vw,200px)]"
        >
          INTELLIGENCE
        </motion.h1>
      </div>

      {/* Glass Cortex - Neural Plexus */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.svg
          viewBox="0 0 1200 900"
          className="w-[900px] md:w-[1100px] lg:w-[1400px] h-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.8 }}
          style={{ overflow: "visible" }}
        >
          <defs>
            {/* Central glow filter */}
            <filter id="cortexGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="20" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            
            {/* Inner illumination gradient */}
            <radialGradient id="innerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(200, 180, 240, 0.4)" />
              <stop offset="40%" stopColor="rgba(190, 170, 230, 0.2)" />
              <stop offset="100%" stopColor="rgba(180, 160, 220, 0)" />
            </radialGradient>
          </defs>

          {/* Central inner glow - intelligence illuminating from within */}
          <motion.ellipse
            cx={600}
            cy={450}
            rx={180}
            ry={160}
            fill="url(#innerGlow)"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0.6, 0.8, 0.6],
              scale: [0.95, 1.05, 0.95]
            }}
            transition={{
              duration: 10,
              delay: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Filaments - connecting lines */}
          <g>
            {filaments.map((f, i) => (
              <Filament
                key={`filament-${i}`}
                x1={nodes[f.from].x}
                y1={nodes[f.from].y}
                x2={nodes[f.to].x}
                y2={nodes[f.to].y}
                opacity={f.opacity}
                delay={0.8 + i * 0.015}
              />
            ))}
          </g>

          {/* Nodes - neural plexus points */}
          <g>
            {nodes.map((node, i) => (
              <CortexNode
                key={`node-${node.id}`}
                x={node.x}
                y={node.y}
                size={node.size}
                layer={node.layer}
                delay={1 + i * 0.03}
              />
            ))}
          </g>
        </motion.svg>
      </div>

      {/* Breathing glow overlay for the cortex center */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 1.5 }}
      >
        <motion.div
          className="w-[300px] h-[260px] md:w-[400px] md:h-[350px] rounded-full"
          style={{
            background: "radial-gradient(ellipse at center, rgba(195, 175, 235, 0.25) 0%, rgba(185, 165, 225, 0.1) 40%, transparent 70%)",
            filter: "blur(40px)"
          }}
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.5, 0.7, 0.5]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
