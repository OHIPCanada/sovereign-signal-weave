import { motion } from "framer-motion";
import { Shield, Lock, CheckCircle } from "lucide-react";

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
    <section className="relative py-24 md:py-32 bg-background" id="pricing">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="mono-label text-secondary">[ SOVEREIGNTY AS A MOAT ]</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mt-4">
            Trust Center
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-6">
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
              className="group bg-card border border-border rounded-xl p-8 hover:border-accent hover:shadow-xl transition-all duration-300"
              style={{
                boxShadow: "0 0 0 0 transparent",
              }}
              whileHover={{
                boxShadow: "0 0 30px hsl(180 100% 50% / 0.15)",
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
            className="inline-flex items-center gap-2 text-foreground font-semibold hover:text-accent transition-colors group"
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
