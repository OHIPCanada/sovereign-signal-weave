import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroOrb from "@/assets/emr-layer-hero-orb.svg";
import { Database, ArrowLeftRight, Layers, Lock, Activity, FileText } from "lucide-react";
import DataStreamBackground from "@/components/hero-backgrounds/DataStreamBackground";
import { useMouseParallax } from "@/hooks/useMouseParallax";

const integrations = [
  { icon: Database, title: "Deep EMR Integration", desc: "Bi-directional integration with Epic, Cerner, MEDITECH, and AllScripts — reading and writing clinical data in real-time." },
  { icon: ArrowLeftRight, title: "HL7 FHIR Native", desc: "First-class FHIR R4 support with automatic resource mapping, subscription handling, and bulk data operations." },
  { icon: Layers, title: "Data Normalization", desc: "Heterogeneous clinical data is automatically normalized into a unified schema, resolving conflicts and filling gaps." },
  { icon: Lock, title: "Consent-Aware Access", desc: "Every data access is governed by patient consent directives and institutional data policies — enforced at the query level." },
  { icon: Activity, title: "Real-Time Event Streams", desc: "Clinical events (admissions, discharges, lab results, orders) are captured and routed to AI workflows within milliseconds." },
  { icon: FileText, title: "Clinical Document Processing", desc: "Unstructured clinical notes, referral letters, and discharge summaries are parsed, coded, and structured automatically." },
];

const EMRLayer = () => {
  const { containerRef, orbRotateX, orbRotateY } = useMouseParallax();

  return (
    <div className="relative overflow-x-hidden">
      <SEOHead title="EMR Layer — Unified Medical Record Integration" description="Seamlessly integrate with existing EMR systems across Canadian clinics and hospitals. FHIR R4 & HL7 native, sovereign data processing with zero vendor lock-in." path="/platform/emr-layer" />
      <Navigation darkMode />

      <section
        ref={containerRef}
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{
          background: `
            radial-gradient(1200px 800px at 30% 40%, rgba(212,97,107,0.20), transparent 60%),
            radial-gradient(900px 600px at 70% 60%, rgba(123,97,255,0.15), transparent 55%),
            linear-gradient(180deg, #0B0613 0%, #1A0630 50%, #0B0613 100%)
          `,
        }}
      >
        <DataStreamBackground />

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
                [ EMR LAYER ]
              </p>
              <h1 style={{
                color: "rgba(255,255,255,0.95)", fontWeight: 800,
                fontSize: "clamp(44px, 5.2vw, 84px)", lineHeight: 0.95,
                letterSpacing: "-0.02em",
                textShadow: "0 10px 40px rgba(0,0,0,0.22)",
              }}>
                The bridge between records and intelligence.
              </h1>
              <p style={{
                color: "rgba(255,255,255,0.72)", fontSize: "clamp(15px, 1.25vw, 18px)",
                lineHeight: 1.55, maxWidth: "46ch",
              }}>
                DocG's EMR Layer creates a living data fabric over your existing clinical systems —
                normalizing, enriching, and routing health data without replacing what works.
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
                  View Integration Docs
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              className="flex justify-center"
              style={{ perspective: 800, rotateX: orbRotateX, rotateY: orbRotateY }}
            >
              <motion.img
                src={heroOrb}
                alt="EMR Layer visualization"
                className="w-full max-w-md"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                style={{ filter: "drop-shadow(0 0 80px rgba(212,97,107,0.3))" }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Integration Cards */}
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
              [ INTEGRATIONS ]
            </p>
            <h2 className="mb-5" style={{
              fontSize: "clamp(44px, 5.2vw, 84px)", fontWeight: 800,
              color: "#1B0F2E", lineHeight: 0.95,
              letterSpacing: "-0.02em",
              textShadow: "0 10px 40px rgba(0,0,0,0.10)",
            }}>
              Plug into everything.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.map((item, i) => (
              <motion.div
                key={item.title}
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
                <item.icon className="w-8 h-8 mb-4" style={{ color: "#D4616B" }} />
                <h3 className="text-lg font-semibold mb-2" style={{ color: "#1B0F2E" }}>{item.title}</h3>
                <p style={{ color: "rgba(27,15,46,0.72)", fontSize: 15, lineHeight: 1.55 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* EMR Compatibility */}
      <section className="relative overflow-hidden" style={{
        padding: "clamp(64px, 8vw, 120px) 0",
        background: `
          radial-gradient(1000px 600px at 50% 50%, rgba(212,97,107,0.15), transparent 55%),
          linear-gradient(180deg, #0B0613 0%, #1A0630 50%, #0B0613 100%)
        `,
      }}>
        <div className="mx-auto px-6 md:px-12" style={{ width: "min(1200px, 92vw)" }}>
          <div className="text-center mb-12">
            <h2 className="mb-5" style={{
              fontSize: "clamp(36px, 4vw, 64px)", fontWeight: 800,
              color: "rgba(255,255,255,0.95)", lineHeight: 0.95,
              letterSpacing: "-0.02em",
            }}>
              Compatible with your stack.
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Epic", "Cerner", "MEDITECH", "AllScripts", "HL7 v2", "FHIR R4", "CDA", "DICOM"].map((name, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="rounded-[16px] p-5 text-center"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
              >
                <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 16, fontWeight: 700 }}>{name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EMRLayer;
