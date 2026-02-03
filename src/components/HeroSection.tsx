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
      className="relative min-h-screen flex items-center justify-center overflow-hidden hero-fog-bg"
    >
      {/* Boot Animation Overlay */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isBooted ? 0 : 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        style={{ backgroundColor: "#181443" }}
      >
        {/* Cyan Pulse Dot */}
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

      {/* Left Coral Band - Narrow, soft fade */}
      <div 
        className="absolute left-0 top-0 w-12 md:w-20 lg:w-24 h-full coral-band-left opacity-80 pointer-events-none"
      />

      {/* Right Coral Band - Wider, semi-transparent */}
      <div 
        className="absolute right-0 top-0 w-24 md:w-40 lg:w-56 h-full coral-band-right pointer-events-none"
      />

      {/* Layer 1: Super-Graphic Background Text - SHARE */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: showContent ? 1 : 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="font-black uppercase leading-none text-center headline-gradient"
          style={{
            fontSize: "clamp(8rem, 20vw, 28rem)",
            letterSpacing: "-0.04em",
            lineHeight: 0.85,
          }}
        >
          SHARE
        </motion.h1>
      </div>

      {/* Layer 2: Central Visual - Breathing Nebula */}
      <div className="relative z-10 flex items-center justify-center mt-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: showContent ? 1 : 0, 
            scale: showContent ? 1 : 0.8,
          }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ 
            rotateX, 
            rotateY,
            perspective: 1000,
          }}
          className="relative"
        >
          {/* The Breathing Blob */}
          <motion.img
            src={heroBlob}
            alt="Cognitive Nebula"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-[280px] md:w-[380px] lg:w-[480px] xl:w-[560px] h-auto object-contain"
            style={{
              filter: "drop-shadow(0 0 80px rgba(0, 255, 255, 0.12))",
            }}
          />
          
          {/* Minimal floating labels - just 2 subtle chips */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: showContent ? 0.7 : 0, y: showContent ? 0 : 10 }}
            transition={{ delay: 2, duration: 0.6 }}
            className="absolute -bottom-4 left-1/2 -translate-x-1/2"
          >
            <span className="font-mono text-[9px] tracking-widest uppercase px-2 py-1 rounded"
              style={{ color: "#5F6368" }}>
              NEURAL_CORTEX
            </span>
          </motion.div>

          {/* Cyan Pulse Ring - subtle */}
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.2, 0.05, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              border: "1px solid #00FFFF",
            }}
          />
        </motion.div>
      </div>

      {/* Layer 3: The Narrative - Bottom Left (minimal) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 30 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-16 md:bottom-20 lg:bottom-24 left-8 md:left-16 lg:left-24 max-w-md z-20"
      >
        <h2 
          className="text-xl md:text-2xl lg:text-3xl font-semibold leading-snug tracking-tight"
          style={{ color: "#181443" }}
        >
          Sovereign AI Infrastructure<br />for Healthcare Systems.
        </h2>
        
        <p 
          className="mt-3 text-sm md:text-base font-normal"
          style={{ color: "#5F6368" }}
        >
          Built in Canada. Designed for regulated healthcare.
        </p>
      </motion.div>

      {/* Minimal top-right annotation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 0.6 : 0 }}
        transition={{ delay: 2.5, duration: 0.6 }}
        className="absolute top-28 md:top-32 right-8 md:right-16 lg:right-24 z-20 hidden md:block"
      >
        <p className="font-mono text-[10px] tracking-widest uppercase text-right"
          style={{ color: "#5F6368" }}>
          5M+ PATIENT RECORDS
        </p>
      </motion.div>
    </section>
  );
};

export default HeroSection;
