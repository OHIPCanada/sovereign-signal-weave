import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import PulseRings from "@/components/hero-backgrounds/PulseRings";
import governanceOrb from "@/assets/governance-hero-orb.png";
import { ShieldCheck, Globe, FileText, Lock, Users, Scale } from "lucide-react";

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

/* ── Governance: PulseRings bg + horizontal slide frameworks + pulsing shield icons ── */

const containerAnim = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const slideFromLeft = {
  hidden: { opacity: 0, x: -80, filter: "blur(6px)" },
  show: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const slideFromRight = {
  hidden: { opacity: 0, x: 80, filter: "blur(6px)" },
  show: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const Governance = () => (
  <div className="relative overflow-x-hidden">
    <Navigation darkMode />

    {/* HERO — PulseRings radar + text clip reveal */}
    <section
      className="relative overflow-hidden flex items-end md:items-center"
      style={{
        minHeight: "80vh",
        padding: "clamp(120px, 14vw, 200px) 0 clamp(64px, 7vw, 110px)",
        background: `
          radial-gradient(900px 600px at 18% 38%, rgba(143,83,255,0.45), transparent 60%),
          radial-gradient(700px 520px at 78% 22%, rgba(255,192,174,0.18), transparent 62%),
          radial-gradient(900px 700px at 70% 75%, rgba(212,97,107,0.14), transparent 66%),
          linear-gradient(135deg, #1A0630 0%, #3A0B6E 48%, #5B1FA6 120%)
        `,
      }}
    >
      <PulseRings />
      <div className="relative z-10 mx-auto px-6 md:px-12" style={{ width: "min(1400px, 94vw)" }}>
        <div className="grid grid-cols-1 md:grid-cols-[0.55fr_1.45fr] items-center split-layout-gap">
          <div className="flex flex-col gap-5 overflow-hidden">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-mono uppercase"
              style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, letterSpacing: "0.22em" }}
            >
              [ INFRASTRUCTURE / GOVERNANCE ]
            </motion.p>
            {/* Clip-path reveal for heading */}
            <motion.h1
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: 1.1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              style={{
                color: "rgba(255,255,255,0.95)", fontWeight: 800, lineHeight: 0.95,
                fontSize: "clamp(44px, 5.2vw, 84px)", letterSpacing: "-0.02em",
                textShadow: "0 10px 40px rgba(0,0,0,0.22)",
              }}
            >
              Privacy by<br />architecture,<br />not policy.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              style={{ color: "rgba(255,255,255,0.72)", fontWeight: 400, fontSize: "clamp(15px, 1.25vw, 18px)", lineHeight: 1.55, maxWidth: "46ch" }}
            >
              Data governance isn't a checkbox — it's wired into how we store, route, and process every clinical signal.
            </motion.p>
          </div>

          {/* Orb — pulse breathe + shield glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center"
          >
            <motion.img
              src={governanceOrb}
              alt="Governance Framework"
              className="w-full max-w-[500px] object-contain"
              style={{ filter: "drop-shadow(0 20px 60px rgba(123,97,255,0.3))" }}
              animate={{ scale: [1, 1.03, 1], filter: ["drop-shadow(0 20px 60px rgba(123,97,255,0.3))", "drop-shadow(0 20px 80px rgba(123,97,255,0.5))", "drop-shadow(0 20px 60px rgba(123,97,255,0.3))"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </div>
    </section>

    {/* FRAMEWORKS — alternating slide-in from left/right */}
    <section
      className="relative overflow-hidden"
      style={{
        padding: "clamp(64px, 7vw, 110px) 0",
        background: `
          radial-gradient(1200px 600px at 20% 50%, rgba(212,97,107,0.15), transparent 60%),
          radial-gradient(1000px 700px at 85% 30%, rgba(123,97,255,0.15), transparent 65%),
          linear-gradient(180deg, #F9F8FC 0%, #F1EEF8 100%)
        `,
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{
        background: "linear-gradient(90deg, transparent 5%, rgba(123, 97, 255, 0.5) 30%, rgba(0, 255, 255, 0.3) 60%, rgba(212, 97, 107, 0.4) 85%, transparent 95%)",
      }} />

      <div className="relative z-10 mx-auto px-6 md:px-12" style={{ width: "min(1400px, 94vw)" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <p className="font-mono uppercase" style={{ color: "rgba(17,17,17,0.45)", fontSize: 12, letterSpacing: "0.22em" }}>
            [ REGULATORY FRAMEWORKS ]
          </p>
          <h2 style={{ color: "#111111", fontWeight: 800, fontSize: "clamp(36px, 4vw, 64px)", lineHeight: 0.95, letterSpacing: "-0.02em", marginTop: 16 }}>
            Built for Canadian healthcare.
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerAnim}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
        >
          {frameworks.map((fw, i) => (
            <motion.div
              key={fw.title}
              variants={i % 2 === 0 ? slideFromLeft : slideFromRight}
              whileHover={{ y: -4, scale: 1.01 }}
              className="rounded-[20px] flex gap-5"
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.8), rgba(255,255,255,0.5))",
                border: "1px solid rgba(90,70,160,0.12)",
                boxShadow: "0 20px 60px rgba(60,40,120,0.1), inset 0 1px 0 rgba(255,255,255,0.8)",
                padding: "28px 24px",
              }}
            >
              <motion.div
                className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, rgba(123,97,255,0.15), rgba(212,97,107,0.1))" }}
                animate={{ boxShadow: ["0 0 0px rgba(123,97,255,0)", "0 0 20px rgba(123,97,255,0.25)", "0 0 0px rgba(123,97,255,0)"] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
              >
                <fw.icon className="w-7 h-7" style={{ color: "#5B1FA6" }} />
              </motion.div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span style={{ fontWeight: 700, fontSize: 18, color: "#111" }}>{fw.title}</span>
                  <span className="px-2 py-0.5 rounded-full" style={{ background: "rgba(212,97,107,0.1)", fontSize: 11, fontWeight: 600, color: "#D4616B" }}>{fw.subtitle}</span>
                </div>
                <div style={{ fontWeight: 400, fontSize: 14, color: "rgba(30,30,30,0.65)", lineHeight: 1.55 }}>{fw.desc}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* PRINCIPLES — vertical accordion reveal */}
    <section
      className="relative overflow-hidden"
      style={{
        padding: "clamp(64px, 7vw, 110px) 0",
        background: `
          radial-gradient(900px 500px at 50% 30%, rgba(91,29,179,.25), transparent 60%),
          radial-gradient(700px 500px at 80% 70%, rgba(232,150,124,.12), transparent 65%),
          linear-gradient(180deg, #140022 0%, #2A0B4E 100%)
        `,
      }}
    >
      <div className="relative z-10 mx-auto px-6 md:px-12" style={{ width: "min(1400px, 94vw)" }}>
        <div className="grid grid-cols-1 md:grid-cols-[0.4fr_1.6fr] items-start split-layout-gap">
          <motion.div
            initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="font-mono uppercase" style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, letterSpacing: "0.22em" }}>
              [ CORE PRINCIPLES ]
            </p>
            <h2 style={{ color: "rgba(255,255,255,0.95)", fontWeight: 800, fontSize: "clamp(32px, 3.5vw, 56px)", lineHeight: 0.95, letterSpacing: "-0.02em", marginTop: 16 }}>
              Privacy-first<br />design.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {principles.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, scaleY: 0.3, originY: 0 }}
                whileInView={{ opacity: 1, scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-[16px] p-6"
                style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.025))", border: "1px solid rgba(255,255,255,0.1)", transformOrigin: "top" }}
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: i * 0.8 }}
                >
                  <p.icon className="w-8 h-8 mb-4" style={{ color: "rgba(232,150,124,0.9)" }} />
                </motion.div>
                <div style={{ fontWeight: 700, fontSize: 16, color: "rgba(255,255,255,0.95)", marginBottom: 8 }}>{p.title}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.55 }}>{p.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* STATS — staggered counter pop with blur */}
    <section
      className="relative overflow-hidden"
      style={{
        padding: "clamp(64px, 7vw, 110px) 0",
        background: `
          radial-gradient(1000px 600px at 30% 50%, rgba(212,97,107,0.15), transparent 60%),
          radial-gradient(800px 600px at 70% 40%, rgba(123,97,255,0.12), transparent 65%),
          linear-gradient(180deg, #F7F3FF 0%, #FFFFFF 100%)
        `,
      }}
    >
      <div className="relative z-10 mx-auto px-6 md:px-12" style={{ width: "min(1200px, 92vw)" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <p className="font-mono uppercase" style={{ color: "rgba(17,17,17,0.45)", fontSize: 12, letterSpacing: "0.22em" }}>
            [ GOVERNANCE AT SCALE ]
          </p>
          <h2 style={{ color: "#111", fontWeight: 800, fontSize: "clamp(36px, 4vw, 64px)", lineHeight: 0.95, letterSpacing: "-0.02em", marginTop: 16 }}>
            Compliance, automated.
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.05 }}
              className="rounded-[20px] text-center"
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.8), rgba(255,255,255,0.5))",
                border: "1px solid rgba(90,70,160,0.1)",
                boxShadow: "0 16px 48px rgba(60,40,120,0.08)", padding: "32px 20px",
              }}
            >
              <div style={{ fontSize: "clamp(20px, 2vw, 28px)", fontWeight: 800, color: "#111", letterSpacing: "-0.02em" }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "rgba(30,30,30,0.55)", marginTop: 6 }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default Governance;
