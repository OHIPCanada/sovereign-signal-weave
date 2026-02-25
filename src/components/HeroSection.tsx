import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Network, Cpu, Database, Stethoscope } from "lucide-react";

const NODES = [
  { id: "virtual-care", label: "VIRTUAL CARE", icon: Network, angle: -90, radius: 220 },
  { id: "sovereign-data", label: "SOVEREIGN DATA", icon: Database, angle: -150, radius: 260 },
  { id: "audit-integrity", label: "AUDIT INTEGRITY", icon: ShieldCheck, angle: -30, radius: 260 },
  { id: "ai-cortex", label: "AI CORTEX", icon: Cpu, angle: -210, radius: 240 },
  { id: "clinic-os", label: "CLINIC OS", icon: Stethoscope, angle: 30, radius: 240 },
];

const STORY_STEPS = [
  {
    title: "The Friction",
    description: "Healthcare data is trapped in isolated, fragmented silos. Administrative bloat prevents true clinical insight.",
  },
  {
    title: "The Backbone",
    description: "Interoperable rails align the chaos, creating a high-speed, standardized data pipeline across the institution.",
  },
  {
    title: "The Core",
    description: "Disparate data streams collapse into a single, high-density intelligence model. Raw data becomes clinical certainty.",
  },
  {
    title: "The Ecosystem",
    description: "Intelligence becomes infrastructure. A proactive, unified clinical operating system built on sovereign data and audit integrity.",
  },
];

const HeroSection = () => {
  const [step, setStep] = useState(0);
  const chaosPositions = useRef(
    NODES.map(() => ({
      x: (Math.random() - 0.5) * 600,
      y: (Math.random() - 0.5) * 400,
      rotate: (Math.random() - 0.5) * 45,
    }))
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev < 3 ? prev + 1 : 0));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#030508] overflow-hidden font-sans text-white flex flex-col justify-between selection:bg-indigo-500/30">
      
      {/* 1. MASSIVE BACKGROUND TYPOGRAPHY */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <motion.h1 
          className="text-[16vw] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white/[0.07] to-transparent whitespace-nowrap"
          animate={{
            scale: step === 3 ? 1.05 : 1,
            opacity: step === 0 ? 0.5 : 1
          }}
          transition={{ duration: 2, ease: "easeInOut" }}
        >
          INTELLIGENCE
        </motion.h1>
      </div>

      {/* 2. THE VISUAL STAGE */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-full max-w-4xl aspect-square flex items-center justify-center">
          
          {/* Connecting Lines */}
          <svg className="absolute inset-0 w-full h-full z-0" viewBox="-300 -300 600 600">
            {NODES.map((node, i) => {
              const rad = (node.angle * Math.PI) / 180;
              const x = Math.cos(rad) * node.radius;
              const y = Math.sin(rad) * node.radius;
              return (
                <motion.line
                  key={`line-${i}`}
                  x1="0" y1="0" x2={x} y2={y}
                  stroke="rgba(99, 102, 241, 0.3)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: step === 3 ? 1 : 0, 
                    opacity: step === 3 ? 1 : 0 
                  }}
                  transition={{ duration: 1.5, delay: i * 0.1, ease: "circOut" }}
                />
              );
            })}
          </svg>

          {/* Central Core */}
          <motion.div
            className="absolute z-10 flex items-center justify-center"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: step >= 2 ? 1 : 0,
              opacity: step >= 2 ? 1 : 0,
            }}
            transition={{ duration: 1, ease: "backOut" }}
          >
            <div className="absolute w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl" />
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="relative w-32 h-32 border border-indigo-400/30 rounded-full flex items-center justify-center border-dashed"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full blur-md opacity-80 mix-blend-screen animate-pulse" />
              <div className="absolute w-16 h-16 bg-white rounded-full shadow-[0_0_40px_rgba(99,102,241,0.8)]" />
            </motion.div>
          </motion.div>

          {/* Data Nodes */}
          {NODES.map((node, i) => {
            const Icon = node.icon;
            const rad = (node.angle * Math.PI) / 180;
            const finalX = Math.cos(rad) * node.radius;
            const finalY = Math.sin(rad) * node.radius;
            const chaos = chaosPositions.current[i];
            const pipeX = (i - 2) * 120;
            const pipeY = 0;

            return (
              <motion.div
                key={node.id}
                className="absolute z-20 flex flex-col items-center gap-3"
                initial={false}
                animate={{
                  x: step === 0 ? chaos.x : step === 1 ? pipeX : step === 2 ? 0 : finalX,
                  y: step === 0 ? chaos.y : step === 1 ? pipeY : step === 2 ? 0 : finalY,
                  scale: step === 2 ? 0 : 1,
                  rotate: step === 0 ? chaos.rotate : 0,
                  opacity: step === 2 ? 0 : 1,
                }}
                transition={{ 
                  duration: 1.2, 
                  ease: [0.16, 1, 0.3, 1],
                  delay: step === 1 ? i * 0.05 : 0
                }}
              >
                <div 
                  className="relative w-14 h-14 flex items-center justify-center bg-[#0d1117] border border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.2)] backdrop-blur-md"
                  style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                >
                  <Icon className="w-5 h-5 text-indigo-300" strokeWidth={1.5} />
                </div>
                <motion.div
                  animate={{ opacity: step === 3 ? 1 : 0 }}
                  className="bg-black/50 backdrop-blur-sm border border-white/10 px-3 py-1.5 rounded-full"
                >
                  <span className="font-mono text-[9px] tracking-[0.2em] text-cyan-50/80 whitespace-nowrap">
                    {node.label}
                  </span>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 3. NARRATIVE HEADER */}
      <header className="relative z-30 p-8 sm:p-12 flex justify-between items-start pointer-events-none">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[1px] w-8 bg-indigo-500" />
            <h2 className="text-indigo-400 font-mono text-[10px] tracking-[0.3em] uppercase">
              Phase 0{step + 1} // Architecture
            </h2>
          </div>
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.h1
                key={`title-${step}`}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-3xl sm:text-5xl font-light tracking-tight text-white"
              >
                {STORY_STEPS[step].title}
              </motion.h1>
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* 4. NARRATIVE FOOTER & CONTROLS */}
      <footer className="relative z-30 p-8 sm:p-12 flex flex-col sm:flex-row justify-between items-end gap-8">
        <div className="max-w-md">
          <AnimatePresence mode="wait">
            <motion.p
              key={`desc-${step}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
              className="text-white/60 text-sm leading-relaxed font-light mb-8"
            >
              {STORY_STEPS[step].description}
            </motion.p>
          </AnimatePresence>
          
          <div className="flex items-center gap-4">
            {STORY_STEPS.map((_, i) => (
              <button 
                key={i}
                onClick={() => setStep(i)}
                className="relative group py-2 flex items-center"
              >
                <div className={`h-[2px] transition-all duration-500 ${
                  step === i ? "w-12 bg-indigo-500" : "w-6 bg-white/20 group-hover:bg-white/40 group-hover:w-8"
                }`} />
              </button>
            ))}
          </div>
        </div>
        
        <div className="font-mono text-[9px] text-white/20 tracking-[0.2em] hidden sm:block uppercase">
          Integration_Protocol // Active
        </div>
      </footer>
    </div>
  );
};

export default HeroSection;
