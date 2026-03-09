import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import heroOrb from "@/assets/ai-cortex-hero-orb.png";
import { Brain, Cpu, Network, Workflow, Shield, Zap } from "lucide-react";
import { useRef, useEffect, useCallback } from "react";

/* ── Neural Pulse Canvas (unique animation) ── */
const NeuralPulseCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const DPR = Math.min(2, window.devicePixelRatio || 1);

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * DPR;
      canvas.height = r.height * DPR;
    };
    resize();
    window.addEventListener("resize", resize);

    interface Node { x: number; y: number; vx: number; vy: number; layer: number; phase: number; }
    const nodes: Node[] = Array.from({ length: 60 }, () => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0004,
      vy: (Math.random() - 0.5) * 0.0004,
      layer: Math.floor(Math.random() * 3),
      phase: Math.random() * Math.PI * 2,
    }));

    let raf: number;
    const t0 = performance.now();

    const draw = (now: number) => {
      const t = (now - t0) / 1000;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Central cortex glow
      const cGrad = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, h * 0.6);
      cGrad.addColorStop(0, `rgba(123,97,255,${0.12 + Math.sin(t * 0.5) * 0.04})`);
      cGrad.addColorStop(0.5, "rgba(123,97,255,0.03)");
      cGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = cGrad;
      ctx.fillRect(0, 0, w, h);

      // Update + draw nodes
      nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > 1) n.vx *= -1;
        if (n.y < 0 || n.y > 1) n.vy *= -1;
        n.x = Math.max(0, Math.min(1, n.x));
        n.y = Math.max(0, Math.min(1, n.y));
      });

      // Connections
      const DIST = 120 * DPR;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = (nodes[i].x - nodes[j].x) * w;
          const dy = (nodes[i].y - nodes[j].y) * h;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < DIST) {
            const alpha = (1 - d / DIST) * 0.25;
            const pulse = Math.sin(t * 2 + nodes[i].phase + nodes[j].phase) * 0.5 + 0.5;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x * w, nodes[i].y * h);
            ctx.lineTo(nodes[j].x * w, nodes[j].y * h);
            ctx.strokeStyle = `rgba(123,97,255,${alpha * (0.5 + pulse * 0.5)})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Traveling pulse along connection
            if (pulse > 0.8) {
              const px = nodes[i].x * w + (nodes[j].x - nodes[i].x) * w * ((t * 0.3) % 1);
              const py = nodes[i].y * h + (nodes[j].y - nodes[i].y) * h * ((t * 0.3) % 1);
              ctx.beginPath();
              ctx.arc(px, py, 2 * DPR, 0, Math.PI * 2);
              ctx.fillStyle = "rgba(212,97,107,0.6)";
              ctx.fill();
            }
          }
        }
      }

      // Draw nodes
      nodes.forEach(n => {
        const px = n.x * w;
        const py = n.y * h;
        const breathe = Math.sin(t * 1.5 + n.phase) * 0.3 + 0.7;
        const r = (n.layer === 0 ? 2 : n.layer === 1 ? 3 : 4) * DPR;

        // Glow
        ctx.beginPath();
        ctx.arc(px, py, r * 4, 0, Math.PI * 2);
        ctx.fillStyle = n.layer === 2
          ? `rgba(212,97,107,${0.08 * breathe})`
          : `rgba(123,97,255,${0.06 * breathe})`;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = n.layer === 2
          ? `rgba(212,97,107,${0.7 * breathe})`
          : `rgba(123,97,255,${0.6 * breathe})`;
        ctx.fill();
      });

      // Concentric pulse rings from center
      for (let ring = 0; ring < 3; ring++) {
        const ringT = (t * 0.2 + ring * 0.33) % 1;
        const ringR = ringT * Math.min(w, h) * 0.5;
        const ringAlpha = (1 - ringT) * 0.08;
        ctx.beginPath();
        ctx.arc(w * 0.5, h * 0.5, ringR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(123,97,255,${ringAlpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="w-full" style={{ height: "clamp(300px, 40vh, 500px)", display: "block" }} />;
};

const capabilities = [
  { icon: Brain, title: "Clinical Reasoning Engine", desc: "Multi-modal AI reasoning across patient data, clinical guidelines, and institutional protocols — in real-time." },
  { icon: Cpu, title: "Context Assembly", desc: "Automatically aggregates relevant patient history, lab results, imaging, and clinical notes into a unified decision context." },
  { icon: Network, title: "Decision Graph Routing", desc: "Maps clinical decisions through a structured graph that ensures evidence-based pathways and catches edge cases." },
  { icon: Workflow, title: "Workflow Intelligence", desc: "Learns institutional patterns and optimizes clinical workflows without requiring manual rule configuration." },
  { icon: Shield, title: "Safety Boundaries", desc: "Built-in clinical safety rails that prevent hallucination, flag uncertainty, and enforce scope boundaries." },
  { icon: Zap, title: "Real-Time Inference", desc: "Sub-50ms inference latency ensures AI assistance arrives at the speed of clinical conversation." },
];

const AICortex = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 150, damping: 15 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 15 });

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left - rect.width / 2) / 25);
        mouseY.set((e.clientY - rect.top - rect.height / 2) / 25);
      }
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [mouseX, mouseY]);

  const orbRotateX = useTransform(springY, [-20, 20], [8, -8]);
  const orbRotateY = useTransform(springX, [-20, 20], [-8, 8]);

  return (
    <div className="relative overflow-x-hidden">
      <Navigation darkMode />

      {/* Hero */}
      <section
        ref={containerRef}
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{
          background: `
            radial-gradient(1200px 800px at 30% 40%, rgba(123,97,255,0.25), transparent 60%),
            radial-gradient(900px 600px at 70% 60%, rgba(212,97,107,0.12), transparent 55%),
            linear-gradient(180deg, #0B0613 0%, #1A0630 50%, #0B0613 100%)
          `,
        }}
      >
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }} />

        <div className="relative z-10 mx-auto px-6 md:px-12 pt-32 pb-20" style={{ width: "min(1400px, 94vw)" }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col gap-5"
            >
              <p className="font-mono uppercase" style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, letterSpacing: "0.22em" }}>
                [ AI CORTEX ]
              </p>
              <h1 style={{
                color: "rgba(255,255,255,0.95)", fontWeight: 800,
                fontSize: "clamp(44px, 5.2vw, 84px)", lineHeight: 0.95,
                letterSpacing: "-0.02em",
                textShadow: "0 10px 40px rgba(0,0,0,0.22)",
              }}>
                The reasoning layer beneath healthcare.
              </h1>
              <p style={{
                color: "rgba(255,255,255,0.72)", fontSize: "clamp(15px, 1.25vw, 18px)",
                lineHeight: 1.55, maxWidth: "46ch",
              }}>
                AI Cortex is the clinical intelligence engine that reasons across patient data,
                routes decisions through evidence-based pathways, and enforces safety boundaries
                — all without adding friction to care delivery.
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="self-start px-8 py-4 rounded-full text-sm font-semibold tracking-wide"
                style={{
                  background: "linear-gradient(135deg, #D4616B, #E8967C)",
                  color: "#FFFAF8",
                  boxShadow: "0 8px 32px rgba(212,97,107,0.3)",
                }}
              >
                Request Technical Brief
              </motion.button>
            </motion.div>

            <motion.div
              className="flex justify-center"
              style={{ perspective: 800, rotateX: orbRotateX, rotateY: orbRotateY }}
            >
              <motion.img
                src={heroOrb}
                alt="AI Cortex visualization"
                className="w-full max-w-md"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                style={{ filter: "drop-shadow(0 0 80px rgba(123,97,255,0.3))" }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Neural Pulse Animation Section */}
      <section className="relative overflow-hidden" style={{
        padding: "clamp(64px, 8vw, 120px) 0",
        background: `
          radial-gradient(1100px 600px at 50% 50%, rgba(123,97,255,0.15), transparent 55%),
          linear-gradient(180deg, #0B0613 0%, #140A2A 50%, #0B0613 100%)
        `,
      }}>
        <div className="mx-auto px-6 md:px-12" style={{ width: "min(1200px, 92vw)" }}>
          <div className="text-center mb-10">
            <p className="font-mono uppercase mb-5" style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, letterSpacing: "0.22em" }}>
              [ NEURAL ARCHITECTURE ]
            </p>
            <h2 className="mb-5" style={{
              fontSize: "clamp(44px, 5.2vw, 84px)", fontWeight: 800,
              color: "rgba(255,255,255,0.95)", lineHeight: 0.95,
              letterSpacing: "-0.02em",
              textShadow: "0 10px 40px rgba(0,0,0,0.22)",
            }}>
              Intelligence that thinks in networks.
            </h2>
            <p style={{
              color: "rgba(255,255,255,0.72)", fontSize: "clamp(15px, 1.25vw, 18px)",
              lineHeight: 1.55, maxWidth: "46ch", margin: "0 auto",
            }}>
              A living neural mesh that continuously processes, routes, and verifies clinical signals across the entire care system.
            </p>
          </div>

          <div className="rounded-[28px] overflow-hidden" style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}>
            <NeuralPulseCanvas />
          </div>
        </div>
      </section>

      {/* Capabilities Grid */}
      <section className="relative overflow-hidden" style={{
        padding: "clamp(64px, 8vw, 120px) 0",
        background: `
          radial-gradient(1200px 700px at 20% 20%, rgba(123,97,255,0.18), transparent 55%),
          radial-gradient(900px 600px at 80% 80%, rgba(212,97,107,0.10), transparent 60%),
          linear-gradient(180deg, #F9F8FC 0%, #F1EEF8 100%)
        `,
      }}>
        <div className="mx-auto px-6 md:px-12" style={{ width: "min(1200px, 92vw)" }}>
          <div className="text-center mb-14">
            <p className="font-mono uppercase mb-5" style={{ color: "rgba(17,17,17,0.45)", fontSize: 12, letterSpacing: "0.22em" }}>
              [ CAPABILITIES ]
            </p>
            <h2 className="mb-5" style={{
              fontSize: "clamp(44px, 5.2vw, 84px)", fontWeight: 800,
              color: "#1B0F2E", lineHeight: 0.95,
              letterSpacing: "-0.02em",
              textShadow: "0 10px 40px rgba(0,0,0,0.10)",
            }}>
              Built for clinical precision.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((cap, i) => (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="rounded-[20px] p-7"
                style={{
                  background: "rgba(255,255,255,0.18)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.4)",
                }}
              >
                <cap.icon className="w-8 h-8 mb-4" style={{ color: "#7B61FF" }} />
                <h3 className="text-lg font-semibold mb-2" style={{ color: "#1B0F2E" }}>{cap.title}</h3>
                <p style={{ color: "rgba(27,15,46,0.72)", fontSize: 15, lineHeight: 1.55 }}>{cap.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture Deep Dive */}
      <section className="relative overflow-hidden" style={{
        padding: "clamp(64px, 8vw, 120px) 0",
        background: `
          radial-gradient(1000px 600px at 30% 50%, rgba(123,97,255,0.20), transparent 55%),
          linear-gradient(180deg, #0B0613 0%, #1A0630 50%, #0B0613 100%)
        `,
      }}>
        <div className="mx-auto px-6 md:px-12" style={{ width: "min(1200px, 92vw)" }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="font-mono uppercase mb-5" style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, letterSpacing: "0.22em" }}>
                [ ARCHITECTURE ]
              </p>
              <h2 className="mb-6" style={{
                fontSize: "clamp(36px, 4vw, 64px)", fontWeight: 800,
                color: "rgba(255,255,255,0.95)", lineHeight: 0.95,
                letterSpacing: "-0.02em",
              }}>
                Three-layer reasoning stack.
              </h2>
              <div className="flex flex-col gap-6">
                {[
                  { title: "Signal Ingestion", desc: "Raw clinical data streams are normalized, deduplicated, and enriched with contextual metadata." },
                  { title: "Reasoning Core", desc: "Multi-model ensemble evaluates clinical context, applies evidence-based guidelines, and generates structured recommendations." },
                  { title: "Action Routing", desc: "Verified decisions are routed to appropriate clinical workflows with full audit trail and explainability." },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15, duration: 0.5 }}
                    className="rounded-[16px] p-5"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.10)",
                      backdropFilter: "blur(24px)",
                      WebkitBackdropFilter: "blur(24px)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                    }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{
                        background: "linear-gradient(135deg, rgba(123,97,255,0.3), rgba(212,97,107,0.3))",
                        color: "rgba(255,255,255,0.9)",
                      }}>{i + 1}</span>
                      <h4 className="font-semibold" style={{ color: "rgba(255,255,255,0.92)", fontSize: 16 }}>{item.title}</h4>
                    </div>
                    <p style={{ color: "rgba(255,255,255,0.62)", fontSize: 14, lineHeight: 1.55, paddingLeft: 36 }}>{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="rounded-[28px] p-8"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                boxShadow: "0 30px 80px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              {[
                { label: "Inference Latency", value: "<50ms", bar: 92 },
                { label: "Clinical Accuracy", value: "97.3%", bar: 97 },
                { label: "Safety Coverage", value: "99.9%", bar: 99 },
                { label: "Explainability Score", value: "94.1%", bar: 94 },
              ].map((stat, i) => (
                <div key={stat.label} className="mb-6 last:mb-0">
                  <div className="flex justify-between mb-2">
                    <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, letterSpacing: "0.04em" }}>{stat.label}</span>
                    <span style={{ color: "rgba(255,255,255,0.92)", fontSize: 14, fontWeight: 700 }}>{stat.value}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${stat.bar}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: i * 0.15, ease: "easeOut" }}
                      style={{ background: "linear-gradient(90deg, #7B61FF, #D4616B)" }}
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AICortex;
