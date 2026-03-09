import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion, useScroll, useTransform } from "framer-motion";
import auditOrb from "@/assets/audit-trails-hero-orb.png";
import { Clock, Link2, Eye, Database } from "lucide-react";
import { useRef, useState, useEffect } from "react";

const auditFeatures = [
  { icon: Clock, title: "Real-time Logging", desc: "Every clinical signal, AI inference, and user action is logged in real-time with millisecond precision timestamps." },
  { icon: Link2, title: "Immutable Records", desc: "Cryptographically signed audit entries that cannot be modified or deleted. Full chain of custody for regulatory review." },
  { icon: Eye, title: "Access Transparency", desc: "Complete visibility into who accessed what data, when, and why. Patient-facing audit reports available on demand." },
  { icon: Database, title: "Long-term Retention", desc: "Configurable retention policies meeting provincial requirements. Secure archival with instant retrieval capability." },
];

const logTypes = [
  { type: "Access Log", desc: "User authentication, session management, role changes", color: "#1B0F2E" },
  { type: "Data Log", desc: "Record views, edits, exports, and deletions", color: "#D4616B" },
  { type: "AI Inference", desc: "Model inputs, outputs, confidence scores, overrides", color: "#E8967C" },
  { type: "System Event", desc: "API calls, integrations, scheduled tasks", color: "#1B0F2E" },
  { type: "Consent Log", desc: "Patient consent grants, revocations, expiries", color: "#F2C1AE" },
];

const stats = [
  { value: "100%", label: "Event capture rate" },
  { value: "<10ms", label: "Log latency" },
  { value: "7+ years", label: "Retention support" },
  { value: "Immutable", label: "Cryptographic signing" },
];

/* ── Blockchain Cascade — unique to Audit Trails ── */
const ChainLinks = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

    // Falling block elements
    interface Block { x: number; y: number; speed: number; w: number; h: number; col: number; }
    const blocks: Block[] = Array.from({ length: 40 }, (_, i) => ({
      x: Math.random(),
      y: Math.random() * -1,
      speed: 0.15 + Math.random() * 0.25,
      w: 30 + Math.random() * 50,
      h: 14 + Math.random() * 10,
      col: i % 3,
    }));

    // Hash characters for matrix effect
    const chars = "0123456789abcdef";
    interface MatrixDrop { x: number; y: number; speed: number; char: string; }
    const drops: MatrixDrop[] = Array.from({ length: 60 }, () => ({
      x: Math.random(),
      y: Math.random(),
      speed: 0.002 + Math.random() * 0.004,
      char: chars[Math.floor(Math.random() * chars.length)],
    }));

    let raf: number;
    const t0 = performance.now();

    const draw = (now: number) => {
      const t = (now - t0) / 1000;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Matrix-style falling hex characters
      ctx.font = `${10 * DPR}px monospace`;
      drops.forEach(d => {
        d.y += d.speed;
        if (d.y > 1) {
          d.y = -0.02;
          d.x = Math.random();
          d.char = chars[Math.floor(Math.random() * chars.length)];
        }
        const alpha = 0.08 + Math.sin(t * 2 + d.x * 10) * 0.04;
        ctx.fillStyle = `rgba(212,97,107,${alpha})`;
        ctx.fillText(d.char, d.x * w, d.y * h);
      });

      // Falling blockchain blocks
      blocks.forEach(b => {
        b.y += b.speed * 0.002;
        if (b.y > 1.1) {
          b.y = -0.1;
          b.x = Math.random();
        }

        const bx = b.x * w;
        const by = b.y * h;
        const alpha = Math.min(1, Math.sin(b.y * Math.PI)) * 0.2;
        const colors = ["rgba(212,97,107,", "rgba(123,97,255,", "rgba(232,150,124,"];

        // Block outline
        ctx.strokeStyle = `${colors[b.col]}${alpha})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(bx, by, b.w * DPR, b.h * DPR);

        // Inner hash text
        ctx.fillStyle = `${colors[b.col]}${alpha * 0.6})`;
        ctx.font = `${7 * DPR}px monospace`;
        ctx.fillText("0x" + Math.floor(b.x * 0xffff).toString(16), bx + 3 * DPR, by + b.h * DPR * 0.7);

        // Chain link line to next block below
        ctx.beginPath();
        ctx.moveTo(bx + b.w * DPR * 0.5, by + b.h * DPR);
        ctx.lineTo(bx + b.w * DPR * 0.5, by + b.h * DPR + 20 * DPR);
        ctx.strokeStyle = `${colors[b.col]}${alpha * 0.4})`;
        ctx.setLineDash([3 * DPR, 3 * DPR]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Horizontal verification scan
      const scanY = ((t * 0.08) % 1) * h;
      const scanGrad = ctx.createLinearGradient(0, scanY - 10 * DPR, 0, scanY + 10 * DPR);
      scanGrad.addColorStop(0, "rgba(212,97,107,0)");
      scanGrad.addColorStop(0.5, "rgba(212,97,107,0.12)");
      scanGrad.addColorStop(1, "rgba(212,97,107,0)");
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 10 * DPR, w, 20 * DPR);

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: 0.8 }} />
    </div>
  );
};

const AuditTrails = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: scrollRef, offset: ["start end", "end start"] });
  const chainY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div className="relative overflow-x-hidden">
      <Navigation darkMode />

      {/* HERO — Dark */}
      <section
        className="relative overflow-hidden flex items-end md:items-center"
        style={{
          minHeight: "80vh",
          padding: "clamp(120px, 14vw, 200px) 0 clamp(64px, 7vw, 110px)",
          background: `
            radial-gradient(600px 400px at 35% 45%, rgba(212,97,107,0.2), transparent 50%),
            radial-gradient(500px 350px at 65% 55%, rgba(91,31,166,0.3), transparent 50%),
            linear-gradient(170deg, #0D0010 0%, #1A0020 50%, #150028 100%)
          `,
        }}
      >
        <ChainLinks />
        <div className="relative z-10 mx-auto px-6 md:px-12" style={{ width: "min(1400px, 94vw)" }}>
          <div className="grid grid-cols-1 md:grid-cols-[0.55fr_1.45fr] items-center split-layout-gap">
            <div className="flex flex-col gap-5">
              <motion.div
                className="font-mono text-xs overflow-hidden"
                style={{ color: "rgba(212,97,107,0.6)", letterSpacing: "0.05em" }}
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "linear" }}
              >
                0x8f4e2a1b9c3d7e6f…verified
              </motion.div>
              
              <h1 style={{ color: "rgba(255,255,255,0.95)", fontWeight: 800, lineHeight: 0.95, fontSize: "clamp(44px, 5.2vw, 84px)", letterSpacing: "-0.02em", textShadow: "0 10px 40px rgba(0,0,0,0.22)" }}>
                {["Every signal", "logged.", "Forever."].map((line, li) => (
                  <motion.span
                    key={li}
                    className="block"
                    initial={{ opacity: 0, x: -100, filter: "blur(10px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    transition={{ delay: 0.3 + li * 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {line}
                  </motion.span>
                ))}
              </h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
        style={{ color: "rgba(255,255,255,0.72)", fontSize: "clamp(15px, 1.25vw, 18px)", lineHeight: 1.55, maxWidth: "46ch" }}
              >
                Immutable, cryptographically signed audit trails for every clinical interaction.
              </motion.p>
            </div>

            <div className="relative flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <img
                  src={auditOrb}
                  alt="Audit Trails"
                  className="w-full max-w-[450px] object-contain"
                  style={{ filter: "drop-shadow(0 30px 80px rgba(212,97,107,0.25))" }}
                />
              </motion.div>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute font-mono text-[10px] px-3 py-1.5 rounded"
                  style={{
                    background: "rgba(212,97,107,0.08)",
                    border: "1px solid rgba(212,97,107,0.15)",
                    color: "rgba(212,97,107,0.6)",
                    top: `${25 + i * 25}%`,
                    right: `${5 + i * 10}%`,
                  }}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + i * 0.3, duration: 0.6 }}
                >
                  BLOCK_{1024 + i}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES — Light studio */}
      <section
        ref={scrollRef}
        className="relative overflow-hidden"
        style={{
          padding: "clamp(64px, 7vw, 110px) 0",
          background: `
            radial-gradient(1000px 600px at 30% 50%, rgba(212,97,107,0.15), transparent 55%),
            radial-gradient(800px 500px at 75% 40%, rgba(205,188,232,0.3), transparent 55%),
            linear-gradient(180deg, #F9F8FC 0%, #F4EFFA 100%)
          `,
        }}
      >
        <div className="relative z-10 mx-auto px-6 md:px-12" style={{ width: "min(1400px, 94vw)" }}>
          <motion.div
            className="mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mb-4" style={{ background: "rgba(212,97,107,0.06)", border: "1px solid rgba(212,97,107,0.1)" }}>
              <motion.div
                className="w-2 h-2 rounded-full"
                style={{ background: "#D4616B" }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-xs" style={{ color: "#D4616B", fontWeight: 500 }}>Recording</span>
            </div>
            <h2 style={{ color: "#1B0F2E", fontWeight: 800, fontSize: "clamp(44px, 5.2vw, 84px)", lineHeight: 0.95, letterSpacing: "-0.02em", textShadow: "0 10px 40px rgba(0,0,0,0.10)" }}>
              Complete accountability.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {auditFeatures.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, boxShadow: "0 16px 48px rgba(0,0,0,0.08)" }}
                className="p-6 rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.18)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.4)",
                }}
              >
                <motion.div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(212,97,107,0.08)" }}
                  whileInView={{ rotate: [0, -10, 10, 0] }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.12, duration: 0.6 }}
                >
                  <f.icon className="w-6 h-6" style={{ color: "#D4616B" }} />
                </motion.div>
                <div style={{ fontWeight: 700, fontSize: 17, color: "#1B0F2E", marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: "rgba(30,20,50,0.55)", lineHeight: 1.6 }}>{f.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LOG TYPES — Light warm */}
      <section
        className="relative overflow-hidden"
        style={{
          padding: "clamp(64px, 7vw, 110px) 0",
          background: `
            radial-gradient(900px 500px at 80% 60%, rgba(242,193,174,0.3), transparent 55%),
            radial-gradient(700px 500px at 10% 30%, rgba(123,97,255,0.12), transparent 55%),
            linear-gradient(180deg, #F4EFFA 0%, #F7F3FF 50%, #FFFAF8 100%)
          `,
        }}
      >
        <div className="relative z-10 mx-auto px-6 md:px-12" style={{ width: "min(1400px, 94vw)" }}>
          <div className="grid grid-cols-1 md:grid-cols-[0.35fr_1.65fr] items-start gap-12">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 style={{ color: "#1B0F2E", fontWeight: 800, fontSize: "clamp(44px, 5.2vw, 84px)", lineHeight: 0.95, letterSpacing: "-0.02em", textShadow: "0 10px 40px rgba(0,0,0,0.10)" }}>
                Structured signal capture.
              </h2>
              <p className="mt-4" style={{ color: "rgba(27,15,46,0.72)", fontSize: "clamp(15px, 1.25vw, 18px)", lineHeight: 1.55 }}>
                Every event is categorized, timestamped, and linked to its originating context.
              </p>
            </motion.div>

            <div className="rounded-2xl overflow-hidden" style={{
              background: "rgba(255,255,255,0.18)",
              border: "1px solid rgba(255,255,255,0.25)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.4)",
            }}>
              <div className="px-5 py-3 border-b" style={{ borderColor: "rgba(123,97,255,0.06)" }}>
                <span className="text-xs font-mono" style={{ color: "rgba(30,20,50,0.4)" }}>Signal Taxonomy</span>
              </div>
              
              <div className="p-5">
                {logTypes.map((log, i) => (
                  <motion.div
                    key={log.type}
                    className="flex items-center gap-3 py-3 border-b last:border-0"
                    style={{ borderColor: "rgba(123,97,255,0.05)" }}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12, duration: 0.5 }}
                  >
                    <motion.span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: log.color }}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    />
                    <span style={{ color: log.color, minWidth: 120, fontSize: 14, fontWeight: 600 }}>{log.type}</span>
                    <span style={{ color: "rgba(30,20,50,0.5)", fontSize: 13 }}>{log.desc}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS — Dark closing */}
      <section
        className="relative overflow-hidden"
        style={{
          padding: "clamp(64px, 7vw, 110px) 0",
          background: "linear-gradient(180deg, #0A000D 0%, #150028 100%)",
        }}
      >
        <div className="relative z-10 mx-auto px-6 md:px-12" style={{ width: "min(1200px, 94vw)" }}>
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 style={{ color: "rgba(255,255,255,0.95)", fontWeight: 800, fontSize: "clamp(44px, 5.2vw, 84px)", lineHeight: 0.95, letterSpacing: "-0.02em", textShadow: "0 10px 40px rgba(0,0,0,0.22)" }}>Built for scale.</h2>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, rotateY: -30 }}
                whileInView={{ opacity: 1, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.05 }}
                className="p-6 rounded-xl text-center"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)", perspective: 1000 }}
              >
                <div className="font-mono" style={{ fontSize: "clamp(24px, 2.5vw, 36px)", fontWeight: 700, color: "#fff" }}>{s.value}</div>
                <div className="font-mono mt-2" style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AuditTrails;
