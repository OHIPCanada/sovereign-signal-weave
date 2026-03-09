import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import RisingParticles from "@/components/hero-backgrounds/RisingParticles";
import aiCortexOrb from "@/assets/ai-cortex-orb-new.png";
import clinicOsOrb from "@/assets/clinic-os-orb-new.png";
import sovereignOrb from "@/assets/sovereign-data-orb.png";
import auditOrb from "@/assets/audit-integrity-orb.png";

const leaders = [
  {
    name: "Dr. Amira Khalil",
    role: "Chief Executive Officer",
    bio: "Former Chief Medical Informatics Officer at a national health system. 15 years bridging clinical practice with infrastructure engineering.",
    orb: aiCortexOrb,
  },
  {
    name: "Marcus Chen",
    role: "Chief Technology Officer",
    bio: "Ex-principal architect at a hyperscale cloud provider. Built sovereign compute infrastructure for regulated industries across three continents.",
    orb: clinicOsOrb,
  },
  {
    name: "Dr. Fatima Osei",
    role: "Chief Medical Officer",
    bio: "Board-certified internist and clinical AI researcher. Published extensively on decision-support systems in primary care.",
    orb: sovereignOrb,
  },
  {
    name: "James Whitfield",
    role: "Chief Operating Officer",
    bio: "Two decades scaling healthcare operations from single-clinic practices to multi-provincial networks. Deep expertise in regulatory compliance.",
    orb: auditOrb,
  },
];

const stats = [
  { value: "60+", label: "Years combined healthcare experience" },
  { value: "4", label: "Founding executives" },
  { value: "3", label: "Clinical PhDs on team" },
  { value: "12", label: "Countries of operational experience" },
];

const advisors = [
  { name: "Dr. Priya Sharma", focus: "Health Policy & Governance", desc: "Former deputy minister of digital health. Advises on jurisdictional compliance and public-sector deployment strategy." },
  { name: "Tomás Reyes", focus: "AI Safety & Ethics", desc: "Leads research on clinical AI accountability frameworks. Previously at a major AI safety institute." },
  { name: "Sarah Lindström", focus: "Infrastructure & Scale", desc: "Scaled distributed systems for financial-grade workloads. Brings deep expertise in zero-downtime sovereign architectures." },
];

const principles = [
  { title: "Clinician-led design", body: "Every product decision flows through clinical context. We don't build tools for clinicians — we build with them." },
  { title: "Institutional patience", body: "Healthcare infrastructure isn't built in sprints. We invest in foundational layers that compound over decades." },
  { title: "Operational transparency", body: "Our leadership operates with the same auditability we build into our platform — open, traceable, accountable." },
];

const Leadership = () => (
  <div className="relative overflow-x-hidden">
    <Navigation darkMode />

    {/* ─── HERO ─── */}
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
      <RisingParticles />
      <div className="relative z-10 mx-auto px-6 md:px-12" style={{ width: "min(1400px, 94vw)" }}>
        <div className="grid grid-cols-1 md:grid-cols-[0.55fr_1.45fr] items-center split-layout-gap">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-5"
          >
            <p className="font-mono uppercase" style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, letterSpacing: "0.22em" }}>
              [ LEADERSHIP ]
            </p>
            <h1 style={{
              color: "rgba(255,255,255,0.95)",
              fontWeight: 800,
              lineHeight: 0.95,
              fontSize: "clamp(44px, 5.2vw, 84px)",
              letterSpacing: "-0.02em",
              textShadow: "0 10px 40px rgba(0,0,0,0.22)",
            }}>
              Built by
              <br />people who
              <br />understand care.
            </h1>
            <p style={{ color: "rgba(255,255,255,0.72)", fontWeight: 400, fontSize: "clamp(15px, 1.25vw, 18px)", lineHeight: 1.55, maxWidth: "46ch" }}>
              Our leadership team brings deep expertise in healthcare delivery, AI infrastructure, and clinical operations — united by the conviction that healthcare deserves better systems.
            </p>
          </motion.div>

          {/* Stats grid */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                className="rounded-[20px] overflow-hidden"
                style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.025))",
                  border: "1px solid rgba(255,255,255,0.12)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
                  padding: "28px 24px",
                }}
              >
                <div style={{ fontSize: "clamp(28px, 3vw, 42px)", fontWeight: 800, color: "rgba(255,255,255,0.95)", letterSpacing: "-0.02em", lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 8, fontWeight: 500, letterSpacing: "0.02em" }}>
                  {s.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>

    {/* ─── TEAM ─── */}
    <section
      className="relative overflow-hidden"
      style={{
        padding: "clamp(64px, 7vw, 110px) 0",
        background: `
          radial-gradient(1200px 600px at 20% 50%, rgba(212,97,107,0.25), transparent 60%),
          radial-gradient(1000px 700px at 85% 30%, rgba(123,97,255,0.25), transparent 65%),
          linear-gradient(180deg, #F9F8FC 0%, #F1EEF8 100%)
        `,
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{
        background: "linear-gradient(90deg, transparent 5%, rgba(123, 97, 255, 0.5) 30%, rgba(0, 255, 255, 0.3) 60%, rgba(212, 97, 107, 0.4) 85%, transparent 95%)",
      }} />

      <div className="relative z-10 mx-auto px-6 md:px-12" style={{ width: "min(1400px, 94vw)" }}>
        <div className="grid grid-cols-1 md:grid-cols-[0.55fr_1.45fr] items-start split-layout-gap">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-5"
          >
            <p className="font-mono uppercase" style={{ color: "rgba(17,17,17,0.45)", fontSize: 12, letterSpacing: "0.22em" }}>
              [ FOUNDING TEAM ]
            </p>
            <h2 style={{
              color: "#111111",
              fontWeight: 800,
              fontSize: "clamp(36px, 4vw, 64px)",
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
            }}>
              Operators,
              <br />not observers.
            </h2>
            <p style={{
              color: "rgba(30,30,30,0.72)",
              fontSize: "clamp(15px, 1.25vw, 18px)",
              fontWeight: 400,
              lineHeight: 1.55,
              maxWidth: "46ch",
            }}>
              Each member of our leadership team has built and scaled systems inside healthcare — not adjacent to it.
            </p>
          </motion.div>

          {/* Leader cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {leaders.map((l, i) => (
              <motion.article
                key={l.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ y: -4 }}
                style={{
                  background: "rgba(255,255,255,0.18)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  borderRadius: 20,
                  border: "1px solid rgba(255,255,255,0.25)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.4)",
                  padding: 20,
                  transition: "transform 0.2s ease-out",
                }}
              >
                <div className="rounded-xl overflow-hidden mb-3 flex items-center justify-center" style={{
                  height: 120,
                  background: "radial-gradient(ellipse at center, rgba(123,97,255,0.06), transparent 70%)",
                }}>
                  <img src={l.orb} alt={l.name} className="w-20 h-20 object-contain" style={{ filter: "drop-shadow(0 4px 20px rgba(123,97,255,0.2))" }} />
                </div>
                <div style={{ fontWeight: 700, fontSize: 17, color: "#111", letterSpacing: "-0.01em" }}>
                  {l.name}
                </div>
                <div style={{ fontWeight: 600, fontSize: 12, color: "rgba(212,97,107,0.85)", marginTop: 2, letterSpacing: "0.04em", textTransform: "uppercase" as const }}>
                  {l.role}
                </div>
                <div style={{ fontWeight: 400, fontSize: 13, color: "rgba(30,30,30,0.6)", marginTop: 8, lineHeight: 1.5 }}>
                  {l.bio}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* ─── ADVISORS (TIMELINE-STYLE) ─── */}
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
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{
        background: "linear-gradient(90deg, transparent 5%, rgba(212,97,107,0.4) 30%, rgba(123,97,255,0.5) 70%, transparent 95%)",
      }} />

      <div className="relative z-10 mx-auto px-6 md:px-12" style={{ width: "min(1400px, 94vw)" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <p className="font-mono uppercase" style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, letterSpacing: "0.22em" }}>
            [ ADVISORY BOARD ]
          </p>
          <h2 style={{
            color: "rgba(255,255,255,0.95)",
            fontWeight: 800,
            fontSize: "clamp(36px, 4vw, 64px)",
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            marginTop: 16,
          }}>
            Extended signal network.
          </h2>
        </motion.div>

        <div className="relative">
          <div className="absolute left-[22px] md:left-[28px] top-0 bottom-0 w-px" style={{
            background: "linear-gradient(180deg, rgba(212,97,107,0.4), rgba(123,97,255,0.3), transparent)",
          }} />

          <div className="flex flex-col gap-6">
            {advisors.map((a, i) => (
              <motion.div
                key={a.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                className="flex gap-6 items-start pl-2"
              >
                <div className="relative flex-shrink-0 mt-1">
                  <div style={{
                    width: 14, height: 14, borderRadius: "50%",
                    background: i === 0
                      ? "linear-gradient(135deg, #D4616B, #E8967C)"
                      : "rgba(200,185,255,0.6)",
                    boxShadow: i === 0
                      ? "0 0 16px 6px rgba(212,97,107,0.3)"
                      : "0 0 8px 3px rgba(160,130,255,0.15)",
                  }} />
                </div>

                <div className="rounded-[16px] flex-1" style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.025))",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(16px)",
                  padding: "20px 24px",
                }}>
                  <div style={{ fontWeight: 700, fontSize: 17, color: "rgba(255,255,255,0.92)", letterSpacing: "-0.01em" }}>
                    {a.name}
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 12, color: "rgba(232,150,124,0.9)", letterSpacing: "0.06em", textTransform: "uppercase" as const, marginTop: 2 }}>
                    {a.focus}
                  </div>
                  <div style={{ fontWeight: 400, fontSize: 15, color: "rgba(255,255,255,0.72)", marginTop: 8, lineHeight: 1.55, maxWidth: "56ch" }}>
                    {a.desc}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* ─── LEADERSHIP PRINCIPLES ─── */}
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
            [ HOW WE LEAD ]
          </p>
          <h2 style={{
            color: "#111",
            fontWeight: 800,
            fontSize: "clamp(36px, 4vw, 64px)",
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            marginTop: 16,
          }}>
            Principles over posture.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {principles.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="rounded-[20px]"
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.8), rgba(255,255,255,0.5))",
                border: "1px solid rgba(90,70,160,0.1)",
                boxShadow: "0 16px 48px rgba(60,40,120,0.08), inset 0 1px 0 rgba(255,255,255,0.8)",
                padding: "32px 28px",
              }}
            >
              <div className="mb-4" style={{
                width: 40, height: 4, borderRadius: 2,
                background: "linear-gradient(90deg, #D4616B, #E8967C)",
              }} />
              <div style={{ fontWeight: 700, fontSize: 18, color: "#111", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                {p.title}
              </div>
              <div style={{ fontWeight: 400, fontSize: 15, color: "rgba(30,30,30,0.65)", marginTop: 10, lineHeight: 1.55 }}>
                {p.body}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default Leadership;
