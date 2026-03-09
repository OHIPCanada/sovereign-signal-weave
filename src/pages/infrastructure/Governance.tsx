import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion, useInView } from "framer-motion";
import governanceOrb from "@/assets/governance-hero-orb.png";
import { ShieldCheck, Globe, FileText, Lock, Users, Scale } from "lucide-react";
import { useRef, useEffect, useState } from "react";

const frameworks = [
  { icon: Globe, title: "PIPEDA", subtitle: "Federal Privacy Law", desc: "Full compliance with Canada's Personal Information Protection and Electronic Documents Act. Built-in consent management, purpose limitation, and data minimization." },
  { icon: ShieldCheck, title: "PHIPA", subtitle: "Ontario Health Privacy", desc: "Comprehensive adherence to the Personal Health Information Protection Act. Custodian controls, access logging, and breach notification workflows." },
  { icon: FileText, title: "Provincial Acts", subtitle: "BC, Alberta, Quebec", desc: "Multi-jurisdictional governance layer supporting PIPA (BC/AB) and Quebec's Law 25. Automatic policy routing based on data origin." },
  { icon: Scale, title: "ISO 42001", subtitle: "AI Management", desc: "Aligned with the international standard for AI management systems. Risk assessment, human oversight, and algorithmic accountability." },
];

const principles = [
  { icon: Lock, title: "Data Minimization", desc: "Only collect and process what's clinically necessary. Automated redaction and anonymization at the infrastructure level." },
  { icon: Users, title: "Purpose Limitation", desc: "Every data access is tied to a specific, documented purpose. No secondary use without explicit consent." },
  { icon: ShieldCheck, title: "Accountability", desc: "Clear chain of responsibility from data collection to deletion. Every processing activity has an owner." },
];

const stats = [
  { value: "100%", label: "Canadian data residency" },
  { value: "Real-time", label: "Policy enforcement" },
  { value: "Automated", label: "Consent management" },
  { value: "Multi-jurisdictional", label: "Governance routing" },
];

/* ── Shield Matrix Background ── */
const ShieldMatrix = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.5 }}>
      <defs>
        <radialGradient id="shieldFade" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id="shieldMask">
          <rect width="100%" height="100%" fill="url(#shieldFade)" />
        </mask>
      </defs>
      <g mask="url(#shieldMask)">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.path
            key={i}
            d={`M${40 + (i % 5) * 180} ${30 + Math.floor(i / 5) * 150} l20 12 l0 24 l-20 12 l-20 -12 l0 -24 z`}
            fill="none"
            stroke="rgba(123,97,255,0.2)"
            strokeWidth="0.8"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 0.6, 0.2] }}
            transition={{ duration: 3, delay: i * 0.15, repeat: Infinity, repeatDelay: 5 }}
          />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.circle
            key={`node-${i}`}
            cx={`${10 + (i % 5) * 20}%`}
            cy={`${15 + Math.floor(i / 5) * 50}%`}
            r="4"
            fill="rgba(232,150,124,0.6)"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 2, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, delay: i * 0.6, ease: "easeOut" }}
          />
        ))}
      </g>
    </svg>

    {/* Floating ambient orbs */}
    <motion.div
      className="absolute rounded-full"
      style={{
        width: 350, height: 350, top: "5%", right: "15%",
        background: "radial-gradient(circle, rgba(91,31,166,0.25) 0%, transparent 70%)",
        filter: "blur(60px)",
      }}
      animate={{ x: [0, 30, -20, 0], y: [0, -25, 15, 0], scale: [1, 1.15, 0.9, 1] }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute rounded-full"
      style={{
        width: 250, height: 250, bottom: "10%", left: "10%",
        background: "radial-gradient(circle, rgba(212,97,107,0.2) 0%, transparent 70%)",
        filter: "blur(50px)",
      }}
      animate={{ x: [0, -25, 20, 0], y: [0, 20, -25, 0], scale: [1, 0.85, 1.1, 1] }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute rounded-full"
      style={{
        width: 180, height: 180, top: "45%", left: "55%",
        background: "radial-gradient(circle, rgba(123,97,255,0.18) 0%, transparent 70%)",
        filter: "blur(45px)",
      }}
      animate={{ x: [0, 20, -15, 0], y: [0, -20, 25, 0] }}
      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
    />

    {/* Scanning line */}
    <motion.div
      className="absolute left-0 right-0"
      style={{
        height: 1,
        background: "linear-gradient(90deg, transparent, rgba(123,97,255,0.3), rgba(232,150,124,0.3), transparent)",
        boxShadow: "0 0 20px rgba(123,97,255,0.15)",
      }}
      animate={{ top: ["0%", "100%"] }}
      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
    />
  </div>
);

const Governance = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true });

  return (
    <div className="relative overflow-x-hidden">
      <Navigation darkMode />

      {/* HERO — Dark */}
      <section
        ref={heroRef}
        className="relative overflow-hidden flex items-end md:items-center"
        style={{
          minHeight: "80vh",
          padding: "clamp(120px, 14vw, 200px) 0 clamp(64px, 7vw, 110px)",
          background: `
            radial-gradient(700px 500px at 30% 40%, rgba(91,31,166,0.4), transparent 50%),
            radial-gradient(500px 400px at 70% 60%, rgba(212,97,107,0.12), transparent 50%),
            linear-gradient(165deg, #0A0015 0%, #150028 50%, #1A0630 100%)
          `,
        }}
      >
        <ShieldMatrix />
        <div className="relative z-10 mx-auto px-6 md:px-12" style={{ width: "min(1400px, 94vw)" }}>
          <div className="grid grid-cols-1 md:grid-cols-[0.55fr_1.45fr] items-center split-layout-gap">
            <div className="flex flex-col gap-5">
              <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -30 }}
                animate={heroInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6 }}
              >
                <motion.div
                  className="w-2 h-2 rounded-full"
                  style={{ background: "#E8967C" }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="font-mono uppercase text-xs" style={{ color: "rgba(255,255,255,0.5)", letterSpacing: "0.15em" }}>
                  Governance Active
                </span>
              </motion.div>
              
              <motion.h1
                style={{ color: "rgba(255,255,255,0.95)", fontWeight: 800, lineHeight: 0.95, fontSize: "clamp(44px, 5.2vw, 84px)", letterSpacing: "-0.02em", textShadow: "0 10px 40px rgba(0,0,0,0.22)" }}
              >
                {["Privacy by", "architecture,", "not policy."].map((line, li) => (
                  <motion.span
                    key={li}
                    className="block overflow-hidden"
                    initial={{ y: "120%" }}
                    animate={heroInView ? { y: 0 } : {}}
                    transition={{ delay: 0.2 + li * 0.12, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {line}
                  </motion.span>
                ))}
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={heroInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.7, duration: 0.6 }}
        style={{ color: "rgba(255,255,255,0.72)", fontSize: "clamp(15px, 1.25vw, 18px)", lineHeight: 1.55, maxWidth: "46ch" }}
              >
                Data governance isn't a checkbox — it's wired into how we store, route, and process every clinical signal.
              </motion.p>
            </div>

            <div className="relative flex items-center justify-center">
              <motion.img
                src={governanceOrb}
                alt="Governance Framework"
                className="w-full max-w-[420px] object-contain relative z-10"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={heroInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                style={{ filter: "drop-shadow(0 30px 80px rgba(91,31,166,0.35))" }}
              />
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(212,97,107,0.1)", border: "1px solid rgba(212,97,107,0.2)" }}
                  initial={{ opacity: 0 }}
                  animate={heroInView ? {
                    opacity: 1,
                    rotate: 360,
                    x: Math.cos((i * 120 * Math.PI) / 180) * 200,
                    y: Math.sin((i * 120 * Math.PI) / 180) * 200,
                  } : {}}
                  transition={{
                    opacity: { delay: 0.8 + i * 0.2, duration: 0.4 },
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    x: { delay: 0.8 + i * 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                    y: { delay: 0.8 + i * 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                  }}
                >
                  <ShieldCheck className="w-5 h-5" style={{ color: "#E8967C" }} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FRAMEWORKS — Light studio */}
      <section
        className="relative overflow-hidden"
        style={{
          padding: "clamp(64px, 7vw, 110px) 0",
          background: `
            radial-gradient(1100px 600px at 25% 50%, rgba(123,97,255,0.18), transparent 60%),
            radial-gradient(900px 500px at 80% 70%, rgba(232,150,124,0.2), transparent 55%),
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
            <span className="font-mono text-xs px-3 py-1.5 rounded" style={{ background: "rgba(212,97,107,0.08)", color: "#D4616B", border: "1px solid rgba(212,97,107,0.12)" }}>
              Regulatory Compliance
            </span>
            <h2 className="mt-4" style={{ color: "#1B0F2E", fontWeight: 800, fontSize: "clamp(44px, 5.2vw, 84px)", lineHeight: 0.95, letterSpacing: "-0.02em", textShadow: "0 10px 40px rgba(0,0,0,0.10)" }}>
              Built for Canadian healthcare.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {frameworks.map((fw, i) => (
              <motion.div
                key={fw.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4, boxShadow: "0 20px 60px rgba(0,0,0,0.08)" }}
                className="relative p-6 rounded-2xl overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.18)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.4)",
                }}
              >
                {/* Accent bar on hover */}
                <motion.div
                  className="absolute bottom-0 left-0 h-1"
                  style={{ background: "linear-gradient(90deg, #7B61FF, #D4616B)" }}
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.6 }}
                />
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(123,97,255,0.08)" }}>
                    <fw.icon className="w-6 h-6" style={{ color: "#D4616B" }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span style={{ fontWeight: 700, fontSize: 18, color: "#1B0F2E" }}>{fw.title}</span>
                      <span className="px-2 py-0.5 rounded text-xs" style={{ background: "rgba(212,97,107,0.1)", color: "#D4616B" }}>{fw.subtitle}</span>
                    </div>
                    <div style={{ fontSize: 14, color: "rgba(30,20,50,0.6)", lineHeight: 1.6 }}>{fw.desc}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRINCIPLES — Light warm */}
      <section
        className="relative overflow-hidden"
        style={{
          padding: "clamp(64px, 7vw, 110px) 0",
          background: `
            radial-gradient(800px 500px at 70% 30%, rgba(242,193,174,0.25), transparent 55%),
            radial-gradient(700px 400px at 20% 70%, rgba(205,188,232,0.35), transparent 55%),
            linear-gradient(180deg, #F4EFFA 0%, #F7F3FF 50%, #FFFAF8 100%)
          `,
        }}
      >
        <div className="relative z-10 mx-auto px-6 md:px-12" style={{ width: "min(1200px, 94vw)" }}>
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 style={{ color: "#1B0F2E", fontWeight: 800, fontSize: "clamp(44px, 5.2vw, 84px)", lineHeight: 0.95, letterSpacing: "-0.02em", textShadow: "0 10px 40px rgba(0,0,0,0.10)" }}>Privacy-first design.</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {principles.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4 }}
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
                  initial={{ rotate: -180, opacity: 0 }}
                  whileInView={{ rotate: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 + 0.3, duration: 0.6, type: "spring" }}
                >
                  <p.icon className="w-10 h-10 mb-4" style={{ color: "#E8967C" }} />
                </motion.div>
                <div style={{ fontWeight: 700, fontSize: 18, color: "#1B0F2E", marginBottom: 8 }}>{p.title}</div>
                <div style={{ fontSize: 14, color: "rgba(30,20,50,0.55)", lineHeight: 1.6 }}>{p.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS — Dark closing */}
      <section
        className="relative overflow-hidden"
        style={{
          padding: "clamp(64px, 7vw, 110px) 0",
          background: "linear-gradient(180deg, #0A0012 0%, #150028 100%)",
        }}
      >
        <div className="relative z-10 mx-auto px-6 md:px-12" style={{ width: "min(1200px, 94vw)" }}>
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <span className="font-mono uppercase text-xs" style={{ color: "rgba(255,255,255,0.45)", letterSpacing: "0.22em" }}>[ Governance Metrics ]</span>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ borderColor: "rgba(212,97,107,0.3)" }}
                className="p-6 rounded-xl text-center"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)" }}
              >
                <div className="font-mono" style={{ fontSize: "clamp(22px, 2.5vw, 32px)", fontWeight: 700, color: "#fff" }}>{s.value}</div>
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

export default Governance;
