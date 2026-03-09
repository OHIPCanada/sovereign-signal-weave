import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import deploymentOrb from "@/assets/deployment-hero-orb.png";
import { Server, Cloud, Shield, Zap } from "lucide-react";
import { useRef, useEffect, useState } from "react";

const deploymentModels = [
  { icon: Server, title: "On-Premise", desc: "Full sovereign deployment within your data center. Zero external data exposure, complete control over infrastructure and security boundaries.", features: ["Air-gapped capability", "Hardware security modules", "Custom network topology", "Local key management"] },
  { icon: Cloud, title: "Private Cloud", desc: "Dedicated Canadian cloud infrastructure with isolated tenancy. Enterprise-grade security with managed operations.", features: ["Canadian data residency", "Dedicated compute resources", "99.9% SLA guarantee", "Managed updates"] },
  { icon: Zap, title: "Hybrid", desc: "Best of both worlds — sensitive data on-premise, compute-heavy AI workloads in private cloud with encrypted transit.", features: ["Flexible data routing", "Burst capacity", "Unified management", "Cost optimization"] },
];

const complianceItems = [
  { label: "PIPEDA", status: "Compliant" },
  { label: "PHIPA", status: "Compliant" },
  { label: "SOC 2 Type II", status: "Certified" },
  { label: "ISO 27001", status: "Certified" },
];

const stats = [
  { value: "99.9%", label: "Uptime SLA" },
  { value: "<50ms", label: "API Latency" },
  { value: "8 weeks", label: "Deployment time" },
  { value: "Zero", label: "Data breaches" },
];

/* ── Hexagonal Grid Background (unique to Deployment) ── */
const HexGrid = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.4 }}>
        <defs>
          <pattern id="hexGrid" width="60" height="52" patternUnits="userSpaceOnUse">
            <path d="M30 0 L60 15 L60 37 L30 52 L0 37 L0 15 Z" fill="none" stroke="rgba(123,97,255,0.12)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexGrid)" />
        {mounted && Array.from({ length: 8 }).map((_, i) => (
          <motion.circle
            key={i}
            cx={`${15 + (i % 4) * 25}%`}
            cy={`${20 + Math.floor(i / 4) * 40}%`}
            r="3"
            fill="rgba(212,97,107,0.5)"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.8, 0], scale: [0, 1.5, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.7, ease: "easeOut" }}
          />
        ))}
      </svg>
    </div>
  );
};

/* ── Deployment: HexGrid bg + magnetic cursor cards + perspective text ── */
const Deployment = () => {
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
    <div ref={containerRef} className="relative overflow-x-hidden">
      <Navigation darkMode />

      {/* HERO */}
      <section
        className="relative overflow-hidden flex items-end md:items-center"
        style={{
          minHeight: "80vh",
          padding: "clamp(120px, 14vw, 200px) 0 clamp(64px, 7vw, 110px)",
          background: `
            radial-gradient(800px 500px at 25% 35%, rgba(91,31,166,0.5), transparent 55%),
            radial-gradient(600px 400px at 75% 65%, rgba(212,97,107,0.2), transparent 50%),
            linear-gradient(155deg, #0D001A 0%, #1A0630 40%, #2A0B4E 100%)
          `,
        }}
      >
        <HexGrid />
        <div className="relative z-10 mx-auto px-6 md:px-12" style={{ width: "min(1400px, 94vw)" }}>
          <div className="grid grid-cols-1 md:grid-cols-[0.55fr_1.45fr] items-center split-layout-gap">
            <div className="flex flex-col gap-5">
              <motion.p
                initial={{ opacity: 0, letterSpacing: "0.5em" }}
                animate={{ opacity: 1, letterSpacing: "0.22em" }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="font-mono uppercase"
                style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}
              >
                Infrastructure · Deployment
              </motion.p>
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.01 }}
                style={{
                  color: "rgba(255,255,255,0.95)", fontWeight: 800, lineHeight: 0.95,
                  fontSize: "clamp(44px, 5.2vw, 84px)", letterSpacing: "-0.02em",
                }}
              >
                {["Deploy where", "your data", "already lives."].map((line, li) => (
                  <motion.span
                    key={li}
                    className="block"
                    initial={{ x: li % 2 === 0 ? -100 : 100, opacity: 0, skewX: li % 2 === 0 ? 10 : -10 }}
                    animate={{ x: 0, opacity: 1, skewX: 0 }}
                    transition={{ delay: 0.2 + li * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {line}
                  </motion.span>
                ))}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.8, duration: 0.6 }}
                style={{ color: "rgba(255,255,255,0.7)", fontSize: "clamp(15px, 1.25vw, 18px)", lineHeight: 1.55, maxWidth: "46ch" }}
              >
                Sovereign AI infrastructure that runs inside your security perimeter — on-premise, private cloud, or hybrid.
              </motion.p>
            </div>

            {/* Orb with magnetic cursor tracking */}
            <motion.div
              className="flex items-center justify-center"
              style={{ perspective: 1000, rotateX: orbRotateX, rotateY: orbRotateY }}
            >
              <motion.img
                src={deploymentOrb}
                alt="Deployment Infrastructure"
                className="w-full max-w-[480px] object-contain"
                initial={{ opacity: 0, scale: 0.7, rotateZ: -15 }}
                animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
                transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                style={{ filter: "drop-shadow(0 30px 80px rgba(91,31,166,0.5))" }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* DEPLOYMENT MODELS */}
      <section
        className="relative overflow-hidden"
        style={{
          padding: "clamp(64px, 7vw, 110px) 0",
          background: "linear-gradient(180deg, #0A0012 0%, #12001F 100%)",
        }}
      >
        <div className="relative z-10 mx-auto px-6 md:px-12" style={{ width: "min(1400px, 94vw)" }}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <span className="font-mono text-xs px-3 py-1.5 rounded" style={{ background: "rgba(123,97,255,0.12)", color: "rgba(123,97,255,0.8)", border: "1px solid rgba(123,97,255,0.2)" }}>
              DEPLOYMENT MODELS
            </span>
            <h2 className="mt-4" style={{ color: "#fff", fontWeight: 700, fontSize: "clamp(32px, 4vw, 56px)", lineHeight: 1.1 }}>
              Choose your surface.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {deploymentModels.map((model, i) => (
              <motion.div
                key={model.title}
                initial={{ opacity: 0, x: -40, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: 0.3 + i * 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ borderColor: "rgba(212,97,107,0.4)", boxShadow: "0 0 40px rgba(212,97,107,0.08)" }}
                className="rounded-lg p-6"
                style={{
                  background: "rgba(10,0,18,0.8)",
                  border: "1px solid rgba(123,97,255,0.15)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <motion.div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: "linear-gradient(135deg, rgba(212,97,107,0.15), rgba(123,97,255,0.15))" }}
                  whileHover={{ rotate: 90 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <model.icon className="w-6 h-6" style={{ color: "#E8967C" }} />
                </motion.div>
                <div className="mb-2" style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>{model.title}</div>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>{model.desc}</div>
                <div className="flex flex-col gap-2">
                  {model.features.map((f, fi) => (
                    <motion.div
                      key={f}
                      className="flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6 + i * 0.2 + fi * 0.1 }}
                    >
                      <span style={{ color: "#7B61FF", fontFamily: "monospace" }}>→</span>
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontFamily: "monospace" }}>{f}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPLIANCE & STATS */}
      <section
        className="relative overflow-hidden"
        style={{
          padding: "clamp(64px, 7vw, 110px) 0",
          background: "linear-gradient(180deg, #12001F 0%, #1A0630 100%)",
        }}
      >
        <div className="relative z-10 mx-auto px-6 md:px-12" style={{ width: "min(1400px, 94vw)" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Stats */}
            <div>
              <motion.p
                className="font-mono uppercase mb-6"
                style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, letterSpacing: "0.15em" }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                Performance Metrics
              </motion.p>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15, type: "spring", stiffness: 200, damping: 20 }}
                    className="relative p-5 rounded-lg overflow-hidden"
                    style={{ background: "rgba(123,97,255,0.08)", border: "1px solid rgba(123,97,255,0.15)" }}
                  >
                    <motion.div
                      className="absolute inset-0"
                      initial={{ x: "-100%" }}
                      whileInView={{ x: "100%" }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + i * 0.15, duration: 0.8, ease: "easeOut" }}
                      style={{ background: "linear-gradient(90deg, transparent, rgba(123,97,255,0.12), transparent)" }}
                    />
                    <div className="relative z-10">
                      <div className="font-mono" style={{ fontSize: "clamp(26px, 2.5vw, 38px)", fontWeight: 700, color: "#fff" }}>{s.value}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 4 }}>{s.label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Compliance */}
            <div>
              <motion.p
                className="font-mono uppercase mb-6"
                style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, letterSpacing: "0.15em" }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                Certifications
              </motion.p>
              <div className="flex flex-col gap-3">
                {complianceItems.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center justify-between p-4 rounded-lg"
                    style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(123,97,255,0.1)" }}
                  >
                    <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 14 }}>{item.label}</span>
                    <motion.div
                      className="flex items-center gap-2 px-3 py-1.5 rounded"
                      style={{ background: "rgba(212,97,107,0.1)", border: "1px solid rgba(212,97,107,0.25)" }}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + i * 0.12, type: "spring", stiffness: 400 }}
                    >
                      <motion.div
                        className="w-2 h-2 rounded-full"
                        style={{ background: "#D4616B" }}
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <span className="text-xs" style={{ color: "#E8967C" }}>{item.status}</span>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Deployment;
