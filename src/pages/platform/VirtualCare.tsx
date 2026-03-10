import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroOrb from "@/assets/virtual-care-hero-orb.svg";
import { Video, MessageSquare, Phone, Globe, Monitor, Users } from "lucide-react";
import SignalWaveBackground from "@/components/hero-backgrounds/SignalWaveBackground";
import { useMouseParallax } from "@/hooks/useMouseParallax";

const features = [
  { icon: Video, title: "Video Consultations", desc: "HD video with real-time AI assistance, automatic note generation, and clinical decision support overlay." },
  { icon: MessageSquare, title: "Async Messaging", desc: "Secure clinical messaging with AI-powered triage, routing, and response suggestions for care teams." },
  { icon: Phone, title: "Voice Intelligence", desc: "Ambient voice capture during consultations with automatic coding, summarization, and order generation." },
  { icon: Globe, title: "Multi-Language Support", desc: "Real-time translation across 40+ languages with medical terminology accuracy and cultural sensitivity." },
  { icon: Monitor, title: "Remote Monitoring", desc: "Continuous patient monitoring integration with intelligent alerting and escalation protocols." },
  { icon: Users, title: "Multi-Party Care", desc: "Coordinated virtual care sessions with multiple providers, specialists, and family members — seamlessly orchestrated." },
];

const VirtualCare = () => {
  const { containerRef, orbRotateX, orbRotateY } = useMouseParallax();

  return (
    <div className="relative overflow-x-hidden">
      <Navigation darkMode />

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
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/company/contact"
                  className="inline-block self-start px-8 py-4 rounded-full text-sm font-semibold tracking-wide no-underline"
                  style={{
                    background: "linear-gradient(135deg, #D4616B, #E8967C)",
                    color: "#FFFAF8",
                    boxShadow: "0 8px 32px rgba(212,97,107,0.3)",
                  }}
                >
                  Schedule a Demo
                </Link>
              </motion.div>
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
          radial-gradient(900px 600px at 85% 85%, rgba(242,193,174,0.35), transparent 60%),
          radial-gradient(800px 500px at 15% 10%, rgba(205,188,232,0.45), transparent 60%),
          linear-gradient(135deg, #F4EFFA 0%, #E9DFF4 50%, #F8F4FB 100%)
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

      {/* Stats */}
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
