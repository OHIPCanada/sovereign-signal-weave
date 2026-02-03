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
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: "#F2F3F4" }}
    >
      {/* Boot Animation Overlay */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isBooted ? 0 : 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        style={{ backgroundColor: "#2E2A4F" }}
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

      {/* Layer 1: Super-Graphic Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: showContent ? 0.08 : 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="font-black uppercase leading-none text-center"
          style={{
            fontSize: "15vw",
            letterSpacing: "-0.03em",
            lineHeight: 0.9,
            color: "#2E2A4F",
          }}
        >
          INTELLIGENCE
        </motion.h1>
      </div>

      {/* Layer 2: Central Visual - Breathing Nebula */}
      <div className="relative z-10 flex items-center justify-center">
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
            className="w-[300px] md:w-[420px] lg:w-[520px] xl:w-[600px] h-auto object-contain"
            style={{
              filter: "drop-shadow(0 0 60px rgba(0, 255, 255, 0.15))",
            }}
          />
          
          {/* Floating Labels around Nebula */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="absolute -top-8 left-1/2 -translate-x-1/2"
          >
            <span className="font-mono text-[10px] md:text-xs tracking-widest uppercase px-3 py-1.5 rounded-full border"
              style={{ color: "#2E2A4F", borderColor: "rgba(46, 42, 79, 0.2)", backgroundColor: "rgba(255,255,255,0.8)" }}>
              [ NEURAL_CORTEX ]
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: showContent ? 1 : 0, x: showContent ? 0 : -20 }}
            transition={{ delay: 1.7, duration: 0.6 }}
            className="absolute top-1/2 -left-24 md:-left-32 -translate-y-1/2"
          >
            <span className="font-mono text-[10px] md:text-xs tracking-widest uppercase px-3 py-1.5 rounded-full border"
              style={{ color: "#2E2A4F", borderColor: "rgba(46, 42, 79, 0.2)", backgroundColor: "rgba(255,255,255,0.8)" }}>
              [ CLINICAL_LOGIC ]
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: showContent ? 1 : 0, x: showContent ? 0 : 20 }}
            transition={{ delay: 1.9, duration: 0.6 }}
            className="absolute top-1/2 -right-24 md:-right-32 -translate-y-1/2"
          >
            <span className="font-mono text-[10px] md:text-xs tracking-widest uppercase px-3 py-1.5 rounded-full border"
              style={{ color: "#2E2A4F", borderColor: "rgba(46, 42, 79, 0.2)", backgroundColor: "rgba(255,255,255,0.8)" }}>
              [ DATA_SOVEREIGNTY ]
            </span>
          </motion.div>

          {/* Cyan Pulse Ring */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              border: "1px solid #00FFFF",
              boxShadow: "0 0 30px rgba(0, 255, 255, 0.2)",
            }}
          />
        </motion.div>
      </div>

      {/* Layer 3: The Narrative - Bottom */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 40 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-12 md:bottom-16 lg:bottom-20 left-6 md:left-12 lg:left-20 max-w-lg z-20"
      >
        <h2 
          className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight"
          style={{ color: "#2E2A4F" }}
        >
          Sovereign AI Infrastructure for Healthcare Systems.
        </h2>
        
        <div className="mt-6 flex flex-wrap gap-4 md:gap-6">
          <span className="font-mono text-[10px] md:text-xs tracking-widest uppercase" style={{ color: "#5F6368" }}>
            REGION: <span style={{ color: "#2E2A4F" }}>CANADA</span>
          </span>
          <span className="font-mono text-[10px] md:text-xs tracking-widest uppercase" style={{ color: "#5F6368" }}>
            STATUS: <span style={{ color: "#00FFFF" }}>AUDIT_READY</span>
          </span>
          <span className="font-mono text-[10px] md:text-xs tracking-widest uppercase" style={{ color: "#5F6368" }}>
            ENCRYPTION: <span style={{ color: "#2E2A4F" }}>AES-256</span>
          </span>
        </div>
      </motion.div>

      {/* Top Right Stats */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: showContent ? 1 : 0, x: showContent ? 0 : 20 }}
        transition={{ delay: 2.2, duration: 0.6 }}
        className="absolute top-28 md:top-32 right-6 md:right-12 lg:right-20 text-right z-20 hidden md:block"
      >
        <p className="font-mono text-[10px] md:text-xs tracking-widest uppercase leading-relaxed max-w-[200px]"
          style={{ color: "#5F6368" }}>
          PROCESSING 5M+ PATIENT RECORDS WITH JURISDICTIONAL PERMANENCE
        </p>
      </motion.div>
    </section>
  );
};

export default HeroSection;
