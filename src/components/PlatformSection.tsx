import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface PlatformLayer {
  id: string;
  label: string;
  title: string;
  description: string;
}

const layers: PlatformLayer[] = [
  {
    id: "memory",
    label: "MEMORY LAYER",
    title: "EMR",
    description: "Sovereign data gravity. Designed for jurisdictional permanence.",
  },
  {
    id: "delivery",
    label: "DELIVERY LAYER",
    title: "Virtual Care",
    description: "Intelligence reaching the edge of the system.",
  },
  {
    id: "access",
    label: "ACCESS LAYER",
    title: "Logistics",
    description: "The nervous system of clinical operations.",
  },
];

const PlatformSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section ref={containerRef} className="relative h-[300vh]" id="product">
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(165deg, #F6F7FB 0%, #F0EEF5 40%, #F4F0EE 70%, #F8F0EA 100%)' }}>
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text Content */}
            <div className="flex flex-col gap-8">
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="mono-label"
              >
                [ ARCHITECTURE OF THE CORTEX ]
              </motion.span>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight"
              >
                Three layers.
                <br />
                <span className="text-muted-foreground">One system.</span>
              </motion.h2>

              {/* Scrolling Layers */}
              <div className="space-y-8 mt-8">
                {layers.map((layer, index) => (
                  <LayerCard
                    key={layer.id}
                    layer={layer}
                    index={index}
                    progress={scrollYProgress}
                  />
                ))}
              </div>
            </div>

            {/* Right - Visual */}
            <div className="relative hidden lg:flex items-center justify-center">
              <ArchitectureVisual progress={scrollYProgress} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface LayerCardProps {
  layer: PlatformLayer;
  index: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}

const LayerCard = ({ layer, index, progress }: LayerCardProps) => {
  const start = index / 3;
  const end = (index + 1) / 3;

  const opacity = useTransform(progress, [start, start + 0.1, end - 0.1, end], [0.3, 1, 1, 0.3]);
  const scale = useTransform(progress, [start, start + 0.1, end - 0.1, end], [0.95, 1, 1, 0.95]);

  return (
    <motion.div
      style={{ opacity, scale }}
      className="group border-l-2 border-border pl-6 py-4 hover:border-accent transition-colors"
    >
      <span className="mono-label text-accent">{layer.label}</span>
      <h3 className="text-2xl font-bold text-foreground mt-2">{layer.title}</h3>
      <p className="text-muted-foreground mt-2 max-w-md">{layer.description}</p>
    </motion.div>
  );
};

interface ArchitectureVisualProps {
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}

const ArchitectureVisual = ({ progress }: ArchitectureVisualProps) => {
  const rotate = useTransform(progress, [0, 1], [0, 180]);
  const scale = useTransform(progress, [0, 0.5, 1], [0.8, 1, 0.9]);

  return (
    <motion.div
      style={{ rotateY: rotate, scale }}
      className="relative w-80 h-80"
    >
      {/* Layered Circles */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border border-border"
          style={{
            transform: `scale(${1 - i * 0.2}) translateY(${i * 20}px)`,
            opacity: 0.5 + i * 0.15,
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle at 30% 30%, hsl(10 60% 62% / ${0.12 - i * 0.03}), transparent 70%)`,
            }}
          />
        </motion.div>
      ))}

      {/* Center Glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-secondary/20 blur-xl" />
        <div className="absolute w-8 h-8 rounded-full bg-secondary" />
      </div>
    </motion.div>
  );
};

export default PlatformSection;
