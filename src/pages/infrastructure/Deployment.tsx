import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import FloatingOrbs from "@/components/hero-backgrounds/FloatingOrbs";
import deploymentOrb from "@/assets/deployment-hero-orb.png";
import { Server, Cloud, Shield, Zap, CheckCircle2 } from "lucide-react";

const deploymentModels = [
  {
    icon: Server,
    title: "On-Premise",
    desc: "Full sovereign deployment within your data center. Zero external data exposure, complete control over infrastructure and security boundaries.",
    features: ["Air-gapped capability", "Hardware security modules", "Custom network topology", "Local key management"],
  },
  {
    icon: Cloud,
    title: "Private Cloud",
    desc: "Dedicated Canadian cloud infrastructure with isolated tenancy. Enterprise-grade security with managed operations.",
    features: ["Canadian data residency", "Dedicated compute resources", "99.9% SLA guarantee", "Managed updates"],
  },
  {
    icon: Zap,
    title: "Hybrid",
    desc: "Best of both worlds — sensitive data on-premise, compute-heavy AI workloads in private cloud with encrypted transit.",
    features: ["Flexible data routing", "Burst capacity", "Unified management", "Cost optimization"],
  },
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

const Deployment = () => (
  <div className="relative overflow-x-hidden">
    <Navigation darkMode />

    {/* HERO */}
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
      <FloatingOrbs />
      <div className="relative z-10 mx-auto px-6 md:px-12" style={{ width: "min(1400px, 94vw)" }}>
        <div className="grid grid-cols-1 md:grid-cols-[0.55fr_1.45fr] items-center split-layout-gap">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-5"
          >
            <p className="font-mono uppercase" style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, letterSpacing: "0.22em" }}>
              [ INFRASTRUCTURE / DEPLOYMENT ]
            </p>
            <h1 style={{
              color: "rgba(255,255,255,0.95)",
              fontWeight: 800,
              lineHeight: 0.95,
              fontSize: "clamp(44px, 5.2vw, 84px)",
              letterSpacing: "-0.02em",
              textShadow: "0 10px 40px rgba(0,0,0,0.22)",
            }}>
              Deploy where
              <br />your data
              <br />already lives.
            </h1>
            <p style={{ color: "rgba(255,255,255,0.72)", fontWeight: 400, fontSize: "clamp(15px, 1.25vw, 18px)", lineHeight: 1.55, maxWidth: "46ch" }}>
              Sovereign AI infrastructure that runs inside your security perimeter — on-premise, private cloud, or hybrid. PHI never leaves your control.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center justify-center"
          >
            <img
              src={deploymentOrb}
              alt="Deployment Infrastructure"
              className="w-full max-w-[500px] object-contain"
              style={{ filter: "drop-shadow(0 20px 60px rgba(123,97,255,0.3))" }}
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
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <p className="font-mono uppercase" style={{ color: "rgba(17,17,17,0.45)", fontSize: 12, letterSpacing: "0.22em" }}>
            [ DEPLOYMENT MODELS ]
          </p>
          <h2 style={{
            color: "#111111",
            fontWeight: 800,
            fontSize: "clamp(36px, 4vw, 64px)",
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            marginTop: 16,
          }}>
            Your infrastructure, your rules.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {deploymentModels.map((model, i) => (
            <motion.div
              key={model.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ y: -4 }}
              className="rounded-[20px]"
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.8), rgba(255,255,255,0.5))",
                border: "1px solid rgba(90,70,160,0.12)",
                boxShadow: "0 20px 60px rgba(60,40,120,0.1), inset 0 1px 0 rgba(255,255,255,0.8)",
                padding: "32px 28px",
              }}
            >
              <div className="mb-4 w-12 h-12 rounded-xl flex items-center justify-center" style={{
                background: "linear-gradient(135deg, rgba(123,97,255,0.15), rgba(212,97,107,0.1))",
              }}>
                <model.icon className="w-6 h-6" style={{ color: "#5B1FA6" }} />
              </div>
              <div style={{ fontWeight: 700, fontSize: 20, color: "#111", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                {model.title}
              </div>
              <div style={{ fontWeight: 400, fontSize: 14, color: "rgba(30,30,30,0.65)", marginTop: 10, lineHeight: 1.55 }}>
                {model.desc}
              </div>
              <div className="mt-5 flex flex-col gap-2">
                {model.features.map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" style={{ color: "#D4616B" }} />
                    <span style={{ fontSize: 13, color: "rgba(30,30,30,0.7)" }}>{f}</span>
                  </div>
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
        background: `
          radial-gradient(900px 500px at 50% 30%, rgba(91,29,179,.25), transparent 60%),
          radial-gradient(700px 500px at 80% 70%, rgba(232,150,124,.12), transparent 65%),
          linear-gradient(180deg, #140022 0%, #2A0B4E 100%)
        `,
      }}
    >
      <div className="relative z-10 mx-auto px-6 md:px-12" style={{ width: "min(1400px, 94vw)" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="font-mono uppercase" style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, letterSpacing: "0.22em" }}>
              [ PERFORMANCE ]
            </p>
            <h2 style={{
              color: "rgba(255,255,255,0.95)",
              fontWeight: 800,
              fontSize: "clamp(28px, 3vw, 48px)",
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
              marginTop: 16,
              marginBottom: 24,
            }}>
              Enterprise-grade reliability.
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                  className="rounded-[16px] p-5"
                  style={{
                    background: "linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.025))",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <div style={{ fontSize: "clamp(24px, 2.5vw, 36px)", fontWeight: 800, color: "rgba(255,255,255,0.95)" }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Compliance */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <p className="font-mono uppercase" style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, letterSpacing: "0.22em" }}>
              [ COMPLIANCE ]
            </p>
            <h2 style={{
              color: "rgba(255,255,255,0.95)",
              fontWeight: 800,
              fontSize: "clamp(28px, 3vw, 48px)",
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
              marginTop: 16,
              marginBottom: 24,
            }}>
              Certified & audited.
            </h2>
            <div className="flex flex-col gap-3">
              {complianceItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                  className="flex items-center justify-between rounded-[12px] px-5 py-4"
                  style={{
                    background: "linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: 15, color: "rgba(255,255,255,0.85)" }}>
                    {item.label}
                  </span>
                  <span className="flex items-center gap-2 px-3 py-1 rounded-full" style={{
                    background: "rgba(74, 222, 128, 0.15)",
                    border: "1px solid rgba(74, 222, 128, 0.3)",
                  }}>
                    <Shield className="w-3.5 h-3.5" style={{ color: "#4ade80" }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#4ade80" }}>{item.status}</span>
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default Deployment;
