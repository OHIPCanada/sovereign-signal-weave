import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const ACTS = [
  {
    phase: "01",
    title: "The Biological Burden",
    mono: "ADMIN_ENTROPY :: DETECTED",
    desc: "The masterpiece of human intuition is currently submerged by fragmented legacy data and administrative noise."
  },
  {
    phase: "02",
    title: "The Geometric Cold",
    mono: "MACHINE_LOGIC :: ISOLATED",
    desc: "Standalone computational scale. A sterile, high-speed mathematical void lacking clinical context and empathy."
  },
  {
    phase: "03",
    title: "The Kinetic Merger",
    mono: "AUGMENTATION :: ENGAGED",
    desc: "Machine infrastructure envelops the neural pathways. Intuition and scale merge in a high-friction synthesis."
  },
  {
    phase: "04",
    title: "Intelligence Emerged",
    mono: "CLINIC_OS :: STABILIZED",
    desc: "A unified clinical operating system. Sovereign data, audit integrity, and virtual care operating in perfect rhythm."
  }
];

const SATELLITES = [
  { label: "VIRTUAL CARE", angle: -90 },
  { label: "SOVEREIGN DATA", angle: -162 },
  { label: "AUDIT INTEGRITY", angle: -18 },
  { label: "AI CORTEX", angle: -234 },
  { label: "CLINIC OS", angle: 54 }
];

const HeroSection = () => {
  const [act, setAct] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.inOut" } });
      tlRef.current = tl;

      // ACT I: Biological Burden
      tl.addLabel("act0")
        .set(".organic-silhouette", { opacity: 0.8, filter: "url(#cognitive-noise)" })
        .set(".data-shard", { y: -200, opacity: 0, filter: "blur(4px)" })
        .to(".data-shard", {
          y: (i: number) => 50 + i * 20,
          opacity: 0.7,
          duration: 2.5,
          ease: "expo.in",
          stagger: 0.2
        }, "act0");

      // ACT II: Geometric Cold
      tl.addLabel("act1")
        .to([".organic-silhouette", ".data-shard"], { opacity: 0, duration: 1 }, "act1")
        .to(".indigo-grid", { opacity: 1, scale: 1, duration: 1.5, ease: "expo.out" }, "act1+=0.5")
        .fromTo(".scan-line",
          { y: -100, opacity: 0 },
          { y: 500, opacity: 1, duration: 1.2, ease: "none", repeat: 1, yoyo: true },
          "act1+=1"
        );

      // ACT III: Kinetic Merger
      tl.addLabel("act2")
        .to(".indigo-grid", { scale: 0.8, opacity: 0.4, duration: 1.5 }, "act2")
        .to(".organic-silhouette", {
          opacity: 1,
          filter: "none",
          duration: 2,
        }, "act2")
        .fromTo(".violet-pulse",
          { scale: 0.5, opacity: 0 },
          { scale: 2, opacity: 0, duration: 2, ease: "expo.out", stagger: 0.3 },
          "act2"
        );

      // ACT IV: Intelligence Emerged
      tl.addLabel("act3")
        .to([".organic-silhouette", ".indigo-grid"], { opacity: 0, duration: 1 }, "act3")
        .to(".neural-head", { opacity: 1, scale: 1, duration: 2, filter: "url(#intelligence-glow)" }, "act3+=0.5")
        .fromTo(".satellite-node",
          { scale: 0, opacity: 0, x: 0, y: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: "circ.out",
            stagger: 0.1,
            x: (i: number) => Math.cos((SATELLITES[i].angle * Math.PI) / 180) * 220,
            y: (i: number) => Math.sin((SATELLITES[i].angle * Math.PI) / 180) * 220,
          },
          "act3+=1"
        )
        .to(".satellite-node", {
          scale: 1.05,
          duration: 3,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true
        });

      // Turbulence breathing
      gsap.to("#turb", {
        attr: { baseFrequency: "0.05 0.02" },
        duration: 8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const advanceAct = () => {
    if (act < 3 && tlRef.current) {
      const nextAct = act + 1;
      setAct(nextAct);
      tlRef.current.tweenTo(`act${nextAct}`, { duration: 2.5, ease: "expo.inOut" });
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-[#05070A] overflow-hidden text-white selection:bg-[#8A2BE2]/30">

      {/* SVG FILTERS */}
      <svg className="hidden">
        <defs>
          <filter id="cognitive-noise" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence id="turb" type="fractalNoise" baseFrequency="0.02 0.05" numOctaves="5" result="noise" />
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.5 0" in="noise" result="coloredNoise" />
            <feDisplacementMap in="SourceGraphic" in2="coloredNoise" scale="15" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="intelligence-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* LAYER 1: BACKGROUND TYPOGRAPHY */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] z-0">
        <h1 className="text-[15vw] font-black tracking-[-0.05em] leading-none whitespace-nowrap">
          INFRASTRUCTURE
        </h1>
      </div>

      {/* LAYER 2: THE VISUAL STAGE */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div className="relative w-[600px] h-[600px] flex items-center justify-center">

          {/* Act I: Organic Silhouette & Data Shards */}
          <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full organic-silhouette">
            <path d="M200 50 C280 50 320 120 320 200 C320 280 260 350 200 350 C120 350 80 280 80 200 C80 120 120 50 200 50 Z" fill="#2d3748" />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="data-shard w-64 h-12 bg-white/10 border border-white/20 backdrop-blur-md mb-2 flex items-center px-4 opacity-0">
                <div className="w-full h-2 bg-white/20 rounded-full" />
              </div>
            ))}
          </div>

          {/* Act II: Indigo Grid & Scanline */}
          <div className="absolute inset-0 indigo-grid opacity-0 scale-110 flex items-center justify-center">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#4f46e5" strokeWidth="1" opacity="0.4" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
            <div className="absolute top-0 w-full h-1 bg-[#00FFFF] scan-line shadow-[0_0_20px_#00FFFF] opacity-0" />
          </div>

          {/* Act III: Kinetic Merger Pulses */}
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="absolute w-64 h-64 rounded-full border-2 border-[#8A2BE2] violet-pulse opacity-0 mix-blend-screen" />
            ))}
          </div>

          {/* Act IV: Neural Head & Satellites */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full neural-head opacity-0 scale-90">
              <path d="M200 80 C260 80 290 130 290 200 C290 260 240 320 200 320 C140 320 110 260 110 200 C110 130 140 80 200 80 Z" fill="none" stroke="#00FFFF" strokeWidth="2" strokeDasharray="4 4" />
              <circle cx="200" cy="200" r="60" fill="url(#coreGradient)" />
              <defs>
                <radialGradient id="coreGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#8A2BE2" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#00FFFF" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>

            {SATELLITES.map((sat, i) => (
              <div key={i} className="absolute satellite-node flex flex-col items-center justify-center opacity-0">
                <div
                  className="w-16 h-16 border border-[#00FFFF]/50 bg-[#05070A]/80 backdrop-blur-md shadow-[0_0_15px_rgba(0,255,255,0.2)] flex items-center justify-center mb-2"
                  style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                >
                  <div className="w-2 h-2 rounded-full bg-[#00FFFF] animate-pulse" />
                </div>
                <span className="font-mono text-[10px] tracking-[0.1em] text-white/80 bg-black/60 px-2 py-1 rounded border border-white/10 whitespace-nowrap">
                  {sat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LAYER 3: NARRATIVE HUD */}
      <div className="relative z-20 w-full h-full flex flex-col justify-between p-8 sm:p-12 pointer-events-none">

        <header className="flex justify-between items-start">
          <div className="max-w-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-[2px] w-12 bg-[#8A2BE2]" />
              <p className="text-[#8A2BE2] font-mono text-[10px] tracking-[0.15em] uppercase font-semibold">
                PHASE {ACTS[act].phase} // DOCG AI CLINIC_OS
              </p>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-[-0.03em] leading-tight">
              {ACTS[act].title}
            </h1>
          </div>

          <div className="text-right font-mono text-[10px] text-white/40 tracking-[0.1em] leading-relaxed hidden sm:block">
            <p>DATA_RESIDENCY: CAN-EAST-01</p>
            <p>AUDIT_HASH: 0x9A4F...B2C1</p>
            <p className="text-[#00FFFF] mt-2">{ACTS[act].mono}</p>
          </div>
        </header>

        <footer className="flex flex-col sm:flex-row justify-between items-end gap-8 pointer-events-auto">
          <div className="max-w-md bg-black/40 backdrop-blur-md border border-white/5 p-6">
            <p className="text-white/70 text-sm leading-relaxed font-light mb-8">
              {ACTS[act].desc}
            </p>

            <button
              onClick={advanceAct}
              disabled={act === 3}
              className={`group flex items-center gap-4 py-3 px-6 border transition-all duration-500 ${
                act === 3
                  ? "border-[#00FFFF]/20 text-[#00FFFF]/50 cursor-default"
                  : "border-white/20 hover:border-[#8A2BE2] bg-white/5 hover:bg-[#8A2BE2]/10 cursor-pointer text-white"
              }`}
            >
              <span className="font-mono text-[10px] tracking-[0.15em] uppercase">
                {act === 3 ? "System Deployed" : "Advance Architecture"}
              </span>
              {act !== 3 && (
                <div className="w-6 h-[1px] bg-white/50 group-hover:bg-[#8A2BE2] group-hover:w-12 transition-all duration-500" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
            <span className="font-mono text-[10px] text-white/40 tracking-[0.1em] uppercase">
              Engineered in Canada
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HeroSection;
