import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const ConvergenceOfCare = () => {
  const [scene, setScene] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const C = {
    bg: "#02060a",
    silo: "#475569",
    railTop: "#0ea5e9",
    railMid: "#8b5cf6",
    railBot: "#14b8a6",
    prism: "#f8fafc",
    insight: "#f43f5e",
    health: "#10b981"
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Scene 1: Floating silos
      gsap.to(".silo-group", {
        y: "random(-15, 15)",
        x: "random(-15, 15)",
        rotation: "random(-10, 10)",
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.2
      });

      if (scene >= 2) {
        gsap.to(".silo-group", { opacity: 0, scale: 0.5, duration: 1, stagger: 0.1 });
        gsap.fromTo(".interop-rail",
          { strokeDashoffset: 1000 },
          { strokeDashoffset: 0, duration: 2, ease: "power2.inOut", stagger: 0.2 }
        );
        gsap.to(".data-pulse", { opacity: 1, duration: 1, delay: 1 });
      }

      if (scene >= 3) {
        gsap.to(".prism-core", { opacity: 1, scale: 1, rotation: 180, duration: 1.5, ease: "back.out(1.7)" });
        gsap.to(".data-icon", { opacity: 1, x: 0, duration: 1, stagger: 0.2, ease: "power2.out" });
        gsap.fromTo(".insight-beam",
          { strokeDashoffset: 1000 },
          { strokeDashoffset: 0, duration: 1.5, delay: 1, ease: "power3.out" }
        );
      }

      if (scene >= 4) {
        gsap.to(".copilot-node", { opacity: 1, scale: 1, duration: 1, ease: "elastic.out(1, 0.5)" });
        gsap.to(".xai-card", { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, delay: 0.5, ease: "power2.out" });
      }

      if (scene >= 5) {
        gsap.to(["#Scene2", "#Scene3", "#Scene4"], { opacity: 0, duration: 1 });
        gsap.to(".health-grid-node", {
          opacity: 1, scale: 1, duration: 1.5, stagger: { amount: 1, from: "center" }, ease: "expo.out"
        });
        gsap.to(".health-grid-node", {
          scale: 1.1, opacity: 0.7, duration: 2, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 0.05
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [scene]);

  const advanceScene = () => {
    setScene((prev) => Math.min(prev + 1, 5));
  };

  const narratives = [
    {
      title: "Administrative Friction",
      text: "Fragmented records and siloed institutional data create administrative bloat, leading to severe clinician burnout and missed insights."
    },
    {
      title: "The Interoperable Backbone",
      text: "AI first acts as infrastructure—a unified integration layer (FHIR/APIs) that ensures data flows seamlessly to the point of care."
    },
    {
      title: "Multi-Modal Synthesis",
      text: "The model synthesizes disparate data types—EHR timelines, genomic sequencing, and imaging—into a single, high-fidelity diagnostic rationale."
    },
    {
      title: "The Augmented Decision",
      text: "Explainable AI (XAI) acts as a clinical co-pilot, presenting verifiable evidence and accountable rationale, keeping the human in the loop."
    },
    {
      title: "Circulatory Health Grid",
      text: "The final operating system: A proactive population health grid where value is circulated, predicting and preventing acute events before they happen."
    }
  ];

  // Pre-generate grid nodes to avoid random values on each render
  const gridNodes = useRef(
    [...Array(30)].map((_, i) => {
      const angle = (i / 30) * Math.PI * 2;
      const radius = 100 + Math.random() * 150;
      const x = 500 + Math.cos(angle) * radius;
      const y = 300 + Math.sin(angle) * radius;
      const r = Math.random() * 4 + 2;
      return { x, y, r };
    })
  ).current;

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-[#02060a] overflow-hidden font-sans text-white flex flex-col justify-between">

      <svg viewBox="0 0 1000 600" className="absolute inset-0 w-full h-full object-contain pointer-events-none">
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={C.prism} stopOpacity={0.2} />
            <stop offset="100%" stopColor={C.insight} stopOpacity={1} />
          </linearGradient>
        </defs>

        {/* SCENE 1: Silos */}
        <g id="Scene1" className={scene !== 1 ? "hidden" : ""}>
          <g className="silo-group" transform="translate(150, 150)">
            <rect x="0" y="0" width="60" height="80" fill={C.silo} rx="4" opacity={0.8} transform="rotate(-15)" />
            <rect x="10" y="10" width="60" height="80" fill="#334155" rx="4" transform="rotate(5)" />
            <line x1="20" y1="30" x2="50" y2="30" stroke="#1e293b" strokeWidth="4" />
            <line x1="20" y1="45" x2="40" y2="45" stroke="#1e293b" strokeWidth="4" />
          </g>
          <g className="silo-group" transform="translate(350, 400)">
            <rect x="0" y="0" width="90" height="90" fill={C.silo} rx="8" opacity={0.6} transform="rotate(20)" />
            <circle cx="45" cy="45" r="25" fill="#334155" />
          </g>
          <g className="silo-group" transform="translate(600, 200)">
            <polygon points="30,0 60,80 0,80" fill={C.silo} opacity={0.7} transform="rotate(-30)" />
            <polygon points="40,10 70,90 10,90" fill="#334155" transform="rotate(10)" />
          </g>
        </g>

        {/* SCENE 2: Interoperable Rails */}
        <g id="Scene2">
          <path className="interop-rail" d="M -100 150 C 200 150, 300 300, 450 300" fill="none" stroke={C.railTop} strokeWidth="4" strokeDasharray="1000" opacity={0.4} />
          <path className="interop-rail" d="M -100 300 C 200 300, 300 300, 450 300" fill="none" stroke={C.railMid} strokeWidth="4" strokeDasharray="1000" opacity={0.4} />
          <path className="interop-rail" d="M -100 450 C 200 450, 300 300, 450 300" fill="none" stroke={C.railBot} strokeWidth="4" strokeDasharray="1000" opacity={0.4} />
          <g className="data-pulse" opacity={0}>
            <circle r="6" fill={C.railTop} filter="url(#glow)">
              <animateMotion dur="3s" repeatCount="indefinite" path="M -100 150 C 200 150, 300 300, 450 300" />
            </circle>
            <circle r="6" fill={C.railMid} filter="url(#glow)">
              <animateMotion dur="2.5s" repeatCount="indefinite" path="M -100 300 C 200 300, 300 300, 450 300" />
            </circle>
            <circle r="6" fill={C.railBot} filter="url(#glow)">
              <animateMotion dur="3.2s" repeatCount="indefinite" path="M -100 450 C 200 450, 300 300, 450 300" />
            </circle>
          </g>
        </g>

        {/* SCENE 3: Multi-Modal Prism */}
        <g id="Scene3">
          <g className="data-icon opacity-0" transform="translate(350, 230)">
            <text x="0" y="0" fill={C.railTop} fontSize="20" fontFamily="sans-serif" fontWeight="bold">EHR</text>
          </g>
          <g className="data-icon opacity-0" transform="translate(320, 295)">
            <text x="0" y="0" fill={C.railMid} fontSize="20" fontFamily="sans-serif" fontWeight="bold">DNA</text>
          </g>
          <g className="data-icon opacity-0" transform="translate(340, 360)">
            <text x="0" y="0" fill={C.railBot} fontSize="20" fontFamily="sans-serif" fontWeight="bold">IMG</text>
          </g>
          <polygon className="prism-core opacity-0" points="450,220 520,300 450,380" fill="none" stroke={C.prism} strokeWidth="4" filter="url(#glow)" style={{ transformOrigin: "485px 300px" }} />
          <polygon className="prism-core opacity-0" points="460,240 510,300 460,360" fill={C.prism} opacity={0.1} />
          <line className="insight-beam" x1="520" y1="300" x2="750" y2="300" stroke="url(#beamGrad)" strokeWidth="8" strokeDasharray="1000" strokeLinecap="round" filter="url(#glow)" />
        </g>

        {/* SCENE 4: Clinical Co-pilot */}
        <g id="Scene4">
          <g className="copilot-node opacity-0" transform="translate(750, 300)" style={{ transformOrigin: "750px 300px", scale: 0.5 }}>
            <circle cx="0" cy="0" r="30" fill="none" stroke={C.insight} strokeWidth="4" filter="url(#glow)" />
            <circle cx="0" cy="0" r="15" fill={C.insight} />
            <path d="M -10 -15 Q 0 -25 10 -15 T 10 5" fill="none" stroke={C.bg} strokeWidth="3" />
          </g>
          <g className="xai-card opacity-0" transform="translate(800, 200)" style={{ translate: "0 16px" }}>
            <rect x="0" y="0" width="140" height="40" fill="#1e293b" rx="4" stroke={C.insight} strokeWidth="1" opacity={0.8} />
            <line x1="10" y1="15" x2="100" y2="15" stroke={C.prism} strokeWidth="2" opacity={0.5} />
            <line x1="10" y1="25" x2="60" y2="25" stroke={C.prism} strokeWidth="2" opacity={0.3} />
            <text x="110" y="25" fill={C.insight} fontSize="12" fontWeight="bold">98%</text>
          </g>
          <g className="xai-card opacity-0" transform="translate(820, 250)" style={{ translate: "0 16px" }}>
            <rect x="0" y="0" width="120" height="30" fill="#1e293b" rx="4" stroke={C.railTop} strokeWidth="1" opacity={0.8} />
            <text x="10" y="18" fill={C.railTop} fontSize="10">EHR Note Match</text>
          </g>
          <g className="xai-card opacity-0" transform="translate(810, 290)" style={{ translate: "0 16px" }}>
            <rect x="0" y="0" width="130" height="30" fill="#1e293b" rx="4" stroke={C.railMid} strokeWidth="1" opacity={0.8} />
            <text x="10" y="18" fill={C.railMid} fontSize="10">Gene Variant: (+)</text>
          </g>
        </g>

        {/* SCENE 5: Health Grid */}
        <g id="Scene5">
          {gridNodes.map((node, i) => (
            <g key={`grid-node-${i}`}>
              <line
                className="health-grid-node opacity-0"
                x1="500" y1="300" x2={node.x} y2={node.y}
                stroke={C.health} strokeWidth="1" opacity={0.3}
                style={{ transformOrigin: "500px 300px", scale: 0.5 }}
              />
              <circle
                className="health-grid-node opacity-0"
                cx={node.x} cy={node.y} r={node.r}
                fill={C.health} filter="url(#glow)"
                style={{ transformOrigin: `${node.x}px ${node.y}px`, scale: 0.5 }}
              />
            </g>
          ))}
          <circle className="health-grid-node opacity-0" cx="500" cy="300" r="40" fill="none" stroke={C.health} strokeWidth="4" filter="url(#glow)" style={{ transformOrigin: "500px 300px" }} />
          <circle className="health-grid-node opacity-0" cx="500" cy="300" r="20" fill={C.health} style={{ transformOrigin: "500px 300px" }} />
        </g>
      </svg>

      {/* HUD Overlay */}
      <div className="relative z-10 p-8 sm:p-16 h-full flex flex-col justify-between pointer-events-none">
        <header className="flex justify-between items-start">
          <div>
            <h2 className="font-mono text-[10px] tracking-[0.3em] text-cyan-500 uppercase mb-2">
              Phase 0{scene} // Convergence Sequence
            </h2>
            <h1 className="text-3xl font-light tracking-tight text-white/90">
              {narratives[scene - 1].title}
            </h1>
          </div>
          <div className="text-right font-mono text-[10px] text-white/40 leading-relaxed hidden sm:block">
            <p>SYSTEM_STATUS: {scene === 5 ? "OPTIMAL" : "PROCESSING"}</p>
            <p>INTEGRATION_TIER: {scene}/5</p>
          </div>
        </header>

        <footer className="flex justify-between items-end pointer-events-auto">
          <div className="max-w-md space-y-6 bg-black/40 backdrop-blur-md p-6 border border-white/10 rounded-lg">
            <p className="text-sm font-light leading-relaxed text-white/80">
              {narratives[scene - 1].text}
            </p>
            <button
              onClick={advanceScene}
              disabled={scene === 5}
              className={`group flex items-center gap-4 px-6 py-3 border transition-all ${
                scene === 5
                  ? "border-emerald-500/30 text-emerald-500/50 cursor-not-allowed"
                  : "border-cyan-500/50 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 cursor-pointer"
              }`}
            >
              <span className="font-mono text-[10px] tracking-widest uppercase">
                {scene === 5 ? "Sequence Complete" : "Advance Architecture"}
              </span>
              {scene !== 5 && (
                <div className="w-4 h-[1px] bg-cyan-400 group-hover:w-8 transition-all" />
              )}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ConvergenceOfCare;
