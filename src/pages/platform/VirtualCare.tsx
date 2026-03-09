import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import heroOrb from "@/assets/virtual-care-hero-orb.png";
import { Video, MessageSquare, Phone, Globe, Monitor, Users } from "lucide-react";
import { useRef, useEffect } from "react";

/* ── Signal Wave Canvas — rendered as hero background ── */
const SignalWaveBackground = () => {
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

    let raf: number;
    const t0 = performance.now();

    interface CareNode { x: number; y: number; label: string; pulse: number; }
    const careNodes: CareNode[] = [
      { x: 0.15, y: 0.3, label: "Patient", pulse: 0 },
      { x: 0.85, y: 0.3, label: "Clinician", pulse: Math.PI },
      { x: 0.5, y: 0.7, label: "AI Cortex", pulse: Math.PI * 0.5 },
      { x: 0.25, y: 0.7, label: "Pharmacy", pulse: Math.PI * 1.5 },
      { x: 0.75, y: 0.7, label: "Lab", pulse: Math.PI * 0.75 },
    ];

    const draw = (now: number) => {
      const t = (now - t0) / 1000;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const bg = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, h * 0.7);
      bg.addColorStop(0, "rgba(123,97,255,0.06)");
      bg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < careNodes.length; i++) {
        for (let j = i + 1; j < careNodes.length; j++) {
          const n1 = careNodes[i];
          const n2 = careNodes[j];
          const x1 = n1.x * w, y1 = n1.y * h;
          const x2 = n2.x * w, y2 = n2.y * h;

          ctx.beginPath();
          const steps = 60;
          for (let s = 0; s <= steps; s++) {
            const p = s / steps;
            const baseX = x1 + (x2 - x1) * p;
            const baseY = y1 + (y2 - y1) * p;
            const perpX = -(y2 - y1);
            const perpY = x2 - x1;
            const len = Math.sqrt(perpX * perpX + perpY * perpY);
            const waveAmp = Math.sin(p * Math.PI) * 15 * DPR;
            const wave = Math.sin(p * 8 + t * 3 + i + j) * waveAmp;
            const px = baseX + (perpX / len) * wave;
            const py = baseY + (perpY / len) * wave;
            if (s === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          const alpha = 0.12 + Math.sin(t * 1.5 + i * 2) * 0.05;
          ctx.strokeStyle = j === 2 ? `rgba(212,97,107,${alpha})` : `rgba(123,97,255,${alpha})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          const dotP = ((t * 0.2 + i * 0.3 + j * 0.2) % 1);
          const dotX = x1 + (x2 - x1) * dotP;
          const dotY = y1 + (y2 - y1) * dotP;
          const dotWaveAmp = Math.sin(dotP * Math.PI) * 15 * DPR;
          const dotWave = Math.sin(dotP * 8 + t * 3 + i + j) * dotWaveAmp;
          const perpX2 = -(y2 - y1), perpY2 = x2 - x1;
          const len2 = Math.sqrt(perpX2 * perpX2 + perpY2 * perpY2);
          ctx.beginPath();
          ctx.arc(dotX + (perpX2 / len2) * dotWave, dotY + (perpY2 / len2) * dotWave, 3 * DPR, 0, Math.PI * 2);
          ctx.fillStyle = j === 2 ? "rgba(242,193,174,0.8)" : "rgba(189,166,255,0.8)";
          ctx.fill();
        }
      }

      careNodes.forEach((node, i) => {
        const nx = node.x * w;
        const ny = node.y * h;
        const breathe = Math.sin(t * 1.2 + node.pulse) * 0.3 + 0.7;

        ctx.beginPath();
        ctx.arc(nx, ny, 30 * DPR, 0, Math.PI * 2);
        ctx.fillStyle = i === 2 ? `rgba(212,97,107,${0.08 * breathe})` : `rgba(123,97,255,${0.06 * breathe})`;
        ctx.fill();

        const pulseR = 20 * DPR + ((t * 0.5 + node.pulse) % 1) * 25 * DPR;
        const pulseAlpha = (1 - ((t * 0.5 + node.pulse) % 1)) * 0.15;
        ctx.beginPath();
        ctx.arc(nx, ny, pulseR, 0, Math.PI * 2);
        ctx.strokeStyle = i === 2 ? `rgba(212,97,107,${pulseAlpha})` : `rgba(123,97,255,${pulseAlpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(nx, ny, 8 * DPR, 0, Math.PI * 2);
        ctx.fillStyle = i === 2 ? "rgba(212,97,107,0.85)" : "rgba(123,97,255,0.75)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(nx, ny, 3 * DPR, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: 0.7 }} />;
};

const features = [
  { icon: Video, title: "Video Consultations", desc: "HD video with real-time AI assistance, automatic note generation, and clinical decision support overlay." },
  { icon: MessageSquare, title: "Async Messaging", desc: "Secure clinical messaging with AI-powered triage, routing, and response suggestions for care teams." },
  { icon: Phone, title: "Voice Intelligence", desc: "Ambient voice capture during consultations with automatic coding, summarization, and order generation." },
  { icon: Globe, title: "Multi-Language Support", desc: "Real-time translation across 40+ languages with medical terminology accuracy and cultural sensitivity." },
  { icon: Monitor, title: "Remote Monitoring", desc: "Continuous patient monitoring integration with intelligent alerting and escalation protocols." },
  { icon: Users, title: "Multi-Party Care", desc: "Coordinated virtual care sessions with multiple providers, specialists, and family members — seamlessly orchestrated." },
];

const VirtualCare = () => {
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

      {/* Hero with Signal Wave animation as background */}
      <section
        ref={containerRef}
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{
          background: `
            radial-gradient(1200px 800px at 30% 40%, rgba(123,97,255,0.20), transparent 60%),
            radial-gradient(900px 600px at 70% 60%, rgba(0,200,200,0.08), transparent 55%),
            linear-gradient(180deg, #0B0613 0%, #1A0630 50%, #0B0613 100%)
          `,
        }}
      >
        <SignalWaveBackground />

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
                [ VIRTUAL CARE ]
              </p>
              <h1 style={{
                color: "rgba(255,255,255,0.95)", fontWeight: 800,
                fontSize: "clamp(44px, 5.2vw, 84px)", lineHeight: 0.95,
                letterSpacing: "-0.02em",
                textShadow: "0 10px 40px rgba(0,0,0,0.22)",
              }}>
                Care that reaches beyond walls.
              </h1>
              <p style={{
                color: "rgba(255,255,255,0.72)", fontSize: "clamp(15px, 1.25vw, 18px)",
                lineHeight: 1.55, maxWidth: "46ch",
              }}>
                Intelligence-augmented virtual care that connects patients, clinicians, and AI
                across any modality — video, voice, messaging — with full clinical context and
                sovereign data governance.
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
                Schedule a Demo
              </motion.button>
            </motion.div>

            <motion.div
              className="flex justify-center"
              style={{ perspective: 800, rotateX: orbRotateX, rotateY: orbRotateY }}
            >
              <motion.img
                src={heroOrb}
                alt="Virtual Care visualization"
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

      {/* Features */}
      <section className="relative overflow-hidden" style={{
        padding: "clamp(64px, 8vw, 120px) 0",
        background: `
          radial-gradient(1200px 700px at 20% 20%, rgba(123,97,255,0.15), transparent 55%),
          radial-gradient(900px 600px at 80% 80%, rgba(212,97,107,0.08), transparent 60%),
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
              Every modality, intelligent.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
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
                <feat.icon className="w-8 h-8 mb-4" style={{ color: "#D4616B" }} />
                <h3 className="text-lg font-semibold mb-2" style={{ color: "#1B0F2E" }}>{feat.title}</h3>
                <p style={{ color: "rgba(27,15,46,0.72)", fontSize: 15, lineHeight: 1.55 }}>{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative overflow-hidden" style={{
        padding: "clamp(64px, 8vw, 120px) 0",
        background: `
          radial-gradient(1000px 600px at 50% 50%, rgba(123,97,255,0.15), transparent 55%),
          linear-gradient(180deg, #0B0613 0%, #1A0630 50%, #0B0613 100%)
        `,
      }}>
        <div className="mx-auto px-6 md:px-12" style={{ width: "min(1200px, 92vw)" }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "2.4M+", label: "Virtual visits powered" },
              { value: "40+", label: "Languages supported" },
              { value: "<2s", label: "Connection time" },
              { value: "98.7%", label: "Patient satisfaction" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="rounded-[20px] p-6 text-center"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
              >
                <div style={{ fontSize: "clamp(28px, 3vw, 42px)", fontWeight: 800, color: "rgba(255,255,255,0.95)", lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, marginTop: 8 }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default VirtualCare;
