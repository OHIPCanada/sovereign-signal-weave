import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const sentences = [
  "Healthcare is not a series of transactions.",
  "It is a continuum.",
  "Yet, our systems are fragmented—records in one silo, schedules in another, patients in the dark.",
  "DocG AI is not an app; it is the bridge.",
  "We build the cognitive rails that allow intelligence to flow securely between the EMR, the physician, and the patient.",
];

const RevealLine = ({
  children,
  scrollYProgress,
  index,
  total,
}: {
  children: string;
  scrollYProgress: any;
  index: number;
  total: number;
}) => {
  // Each line gets its own reveal window within the scroll progress
  const start = index / (total + 1);
  const end = (index + 1.5) / (total + 1);

  const opacity = useTransform(scrollYProgress, [start, end], [0.15, 1]);

  return (
    <motion.span
      style={{ opacity }}
      className="block mb-6 md:mb-8 last:mb-0"
    >
      {children}
    </motion.span>
  );
};

const ManifestoSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  return (
    <section
      ref={containerRef}
      className="relative py-32 md:py-44 lg:py-56 bg-background"
    >
      {/* Subtle top/bottom fade borders */}
      <div className="absolute inset-x-0 top-0 h-px bg-border" />

      <div className="max-w-[720px] mx-auto px-8 md:px-12">
        {/* Section label */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mono-label mb-12 md:mb-16"
        >
          THE PROBLEM
        </motion.p>

        {/* Manifesto text */}
        <div
          className="text-[20px] md:text-[24px] lg:text-[26px] leading-[1.55] font-normal text-foreground"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {sentences.map((sentence, i) => (
            <RevealLine
              key={i}
              index={i}
              total={sentences.length}
              scrollYProgress={scrollYProgress}
            >
              {sentence}
            </RevealLine>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-border" />
    </section>
  );
};

export default ManifestoSection;
