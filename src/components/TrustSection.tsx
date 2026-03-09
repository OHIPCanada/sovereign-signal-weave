import { motion } from "framer-motion";
import { Shield, Lock, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const badges = [
  {
    id: "soc2",
    icon: Shield,
    title: "SOC2 Type II",
    description: "Enterprise-grade security controls verified by independent auditors.",
  },
  {
    id: "pipeda",
    icon: Lock,
    title: "PIPEDA Compliant",
    description: "Full compliance with Canadian privacy legislation for healthcare data.",
  },
  {
    id: "aida",
    icon: CheckCircle,
    title: "AIDA Ready",
    description: "Prepared for the Artificial Intelligence and Data Act requirements.",
  },
];

const TrustSection = () => {
  return (
    <section className="relative" style={{ padding: "clamp(64px, 8vw, 120px) 0", background: 'linear-gradient(180deg, #F6F7FB 0%, #F4F0EE 50%, #F0E8E4 100%)' }} id="pricing">
      <div
        className="relative z-10 mx-auto flex flex-col items-center"
        style={{
          width: "min(1200px, 92vw)",
          gap: "clamp(48px, 6vw, 80px)",
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="font-mono uppercase mb-5" style={{ fontSize: 12, letterSpacing: "0.22em", color: "rgba(20, 10, 42, 0.45)" }}>
            [ SOVEREIGNTY AS A MOAT ]
          </p>
          <h2 className="mb-5" style={{
            fontSize: "clamp(44px, 5.2vw, 84px)",
            fontWeight: 800,
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            color: "rgba(20, 10, 42, 0.95)",
            textShadow: "0 10px 40px rgba(0,0,0,0.08)",
          }}>
            Trust Center
          </h2>
          <p style={{
            fontSize: "clamp(15px, 1.25vw, 18px)",
            lineHeight: 1.55,
            color: "rgba(20, 10, 42, 0.72)",
            maxWidth: "46ch",
            margin: "0 auto",
          }}>
            Built for Canadian healthcare. Designed for data sovereignty. Audited for excellence.
          </p>
        </motion.div>

        {/* Compliance Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {badges.map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group rounded-xl p-8 transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.18)",
                border: "1px solid rgba(255,255,255,0.25)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.4)",
              }}
              whileHover={{
                boxShadow: "0 0 30px rgba(232, 150, 124, 0.2)",
                scale: 1.02,
              }}
            >
              <badge.icon className="w-10 h-10 text-secondary mb-6" />
              <h3 className="text-xl font-bold text-foreground mb-3">{badge.title}</h3>
              <p className="text-muted-foreground">{badge.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground mb-6">
            Ready to secure your healthcare operations?
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2 text-foreground font-semibold hover:text-secondary transition-colors group"
          >
            View Security Documentation
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustSection;
