import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import heroBlob from "@/assets/blob-seamless.png";

const HeroSection = () => {
  const [isBooted, setIsBooted] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Mouse tracking for blob rotation
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-5, 5]), springConfig);

  // Boot sequence
  useEffect(() => {
    const bootTimer = setTimeout(() => setIsBooted(true), 100);
    const contentTimer = setTimeout(() => setShowContent(true), 1500);
    return () => {
      clearTimeout(bootTimer);
      clearTimeout(contentTimer);
    };
  }, []);

  // Mouse move handler
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen overflow-hidden hero-fog-bg"
    >
      {/* Boot Animation Overlay */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isBooted ? 0 : 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        style={{ backgroundColor: "#181443" }}
      >
        <motion.div
          initial={{ scale: 0, opacity: 1 }}
          animate={{ 
            scale: isBooted ? 50 : 1,
            opacity: isBooted ? 0 : 1 
          }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: "#00FFFF", boxShadow: "0 0 40px #00FFFF" }}
        />
      </motion.div>

      {/* Single Coral Band - Left, structural */}
      <div 
        className="absolute left-0 top-0 w-16 md:w-24 lg:w-28 h-full coral-band-left opacity-70 pointer-events-none"
      />

      {/* Layer 1: INTELLIGENCE - The Environment */}
      <div className="absolute inset-0 flex items-end justify-center pointer-events-none select-none overflow-hidden pb-[8vh] md:pb-[12vh]">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: showContent ? 0.08 : 0 }}
          transition={{ duration: 2.5, ease: "easeOut" }}
          className="font-black uppercase text-center headline-gradient whitespace-nowrap"
          style={{
            fontSize: "clamp(6rem, 18vw, 22rem)",
            letterSpacing: "-0.03em",
            lineHeight: 0.85,
          }}
        >
          INTELLIGENCE
        </motion.span>
      </div>

      {/* Layer 2: Abstract Intelligence Form - Floating, No Container */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ paddingBottom: "5vh" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ 
            opacity: showContent ? 1 : 0, 
            scale: showContent ? 1 : 0.9,
          }}
          transition={{ duration: 1.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ 
            rotateX, 
            rotateY,
            perspective: 1000,
          }}
        >
          <motion.img
            src={heroBlob}
            alt=""
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-[300px] md:w-[420px] lg:w-[520px] xl:w-[600px] h-auto"
            style={{
              filter: "drop-shadow(0 0 60px rgba(0, 255, 255, 0.08))",
            }}
          />
        </motion.div>
      </div>

      {/* Layer 3: The Narrative - One Quiet Sentence */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
        transition={{ delay: 2.2, duration: 0.8 }}
        className="absolute bottom-16 md:bottom-20 lg:bottom-24 left-8 md:left-16 lg:left-24 z-20"
      >
        <h1 
          className="text-xl md:text-2xl lg:text-[1.75rem] font-semibold leading-snug tracking-tight max-w-sm"
          style={{ color: "#181443" }}
        >
          Sovereign AI Infrastructure<br />for Healthcare Systems.
        </h1>
        
        <p 
          className="mt-3 text-sm font-normal"
          style={{ color: "#5F6368" }}
        >
          Built in Canada. Designed for regulated healthcare.
        </p>
      </motion.div>
    </section>
  );
};

export default HeroSection;
