import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import aiCortexOrb from "@/assets/ai-cortex-orb-new.png";
import clinicOsOrb from "@/assets/clinic-os-orb-new.png";
import sovereignOrb from "@/assets/sovereign-data-orb.png";
import auditOrb from "@/assets/audit-integrity-orb.png";

const stats = [
  { value: "3", label: "Open positions" },
  { value: "100%", label: "Remote-first culture" },
  { value: "CAD", label: "Sovereign infrastructure" },
  { value: "∞", label: "Growth potential" },
];

const openings = [
  {
    title: "Jr. AI Developer",
    type: "Full-time · Remote (Canada)",
    department: "Engineering",
    orb: aiCortexOrb,
    salary: "$65,000 – $85,000 CAD",
    posted: "March 1, 2026",
    description:
      "Work alongside senior engineers to build and fine-tune clinical AI models. You'll contribute to prompt engineering, model evaluation pipelines, and integration with our sovereign compute layer.",
    responsibilities: [
      "Develop and maintain AI/ML pipelines for clinical NLP tasks",
      "Assist in fine-tuning large language models on healthcare datasets",
      "Build evaluation harnesses to measure model accuracy and safety",
      "Collaborate with clinical advisors to validate AI outputs",
      "Write clean, tested, production-grade Python and TypeScript code",
      "Participate in code reviews and architecture discussions",
    ],
    requirements: [
      "BSc in Computer Science, AI/ML, or related field",
      "Familiarity with Python, PyTorch or TensorFlow",
      "Understanding of NLP fundamentals",
      "Interest in healthcare AI and responsible deployment",
    ],
    niceToHave: [
      "Experience with LLM fine-tuning or RLHF",
      "Exposure to FHIR, HL7, or clinical data standards",
      "Contributions to open-source ML projects",
    ],
    benefits: [
      "100% remote-first with flexible hours",
      "Health & dental benefits from day one",
      "Annual learning stipend ($2,500)",
      "Equity participation program",
      "Home office setup allowance",
    ],
  },
  {
    title: "Sales Executive",
    type: "Full-time · Hybrid (Toronto)",
    department: "Growth",
    orb: clinicOsOrb,
    salary: "$90,000 – $130,000 CAD + Commission",
    posted: "February 20, 2026",
    description:
      "Drive enterprise adoption of our clinical intelligence platform across Canadian healthcare networks. You'll build relationships with hospital administrators, clinic groups, and provincial health authorities.",
    responsibilities: [
      "Identify and qualify enterprise healthcare prospects",
      "Lead full-cycle sales from discovery to contract close",
      "Deliver compelling product demos tailored to clinical workflows",
      "Build relationships with C-suite and procurement leaders",
      "Collaborate with product and engineering on customer feedback",
      "Manage pipeline and forecasting in CRM tools",
    ],
    requirements: [
      "3+ years B2B SaaS sales experience",
      "Healthcare or regulated industry background preferred",
      "Strong consultative selling skills",
      "Experience with long-cycle enterprise deals",
    ],
    niceToHave: [
      "Existing network in Canadian healthcare systems",
      "Understanding of provincial health procurement processes",
      "Experience selling AI or data infrastructure products",
    ],
    benefits: [
      "Uncapped commission structure",
      "Hybrid work model — Toronto office 2 days/week",
      "Health & dental benefits from day one",
      "Annual President's Club trip",
      "Equity participation program",
    ],
  },
  {
    title: "Computer Science Intern",
    type: "Internship · Remote (Canada)",
    department: "Engineering",
    orb: sovereignOrb,
    salary: "$25 – $32/hr CAD",
    posted: "March 5, 2026",
    description:
      "A hands-on internship building real features inside a clinical intelligence platform. You'll work on frontend components, data pipelines, and testing infrastructure — shipping code that matters.",
    responsibilities: [
      "Build and ship frontend features using React and TypeScript",
      "Write integration tests and contribute to CI/CD pipelines",
      "Assist with data pipeline development and monitoring",
      "Participate in daily standups and sprint planning",
      "Document technical decisions and component APIs",
      "Present a capstone project at the end of your term",
    ],
    requirements: [
      "Currently enrolled in CS or Software Engineering program",
      "Comfortable with TypeScript and React",
      "Eagerness to learn healthcare domain",
      "Available for 4–8 month term",
    ],
    niceToHave: [
      "Previous internship or co-op experience",
      "Familiarity with Tailwind CSS and component libraries",
      "Interest in AI/ML or healthcare technology",
    ],
    benefits: [
      "100% remote with flexible scheduling around classes",
      "Dedicated mentor and weekly 1-on-1s",
      "Real production codebase — not toy projects",
      "Full-time offer pathway for top performers",
      "Conference attendance sponsorship",
    ],
  },
];

const values = [
  {
    title: "Build with clinicians, not for them",
    body: "Every feature starts from clinical context. We embed ourselves in the workflows we're building for.",
  },
  {
    title: "Ship with conviction",
    body: "We move deliberately — not fast and broken. Quality in healthcare infrastructure isn't optional, it's foundational.",
  },
  {
    title: "Own your surface area",
    body: "Everyone here operates with full context and full accountability. We trust our people to make the right call.",
  },
];

const Careers = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    position: "",
    message: "",
  });
  const [fileName, setFileName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleApply = (jobTitle: string) => {
    setFormData((prev) => ({ ...prev, position: jobTitle }));
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.position) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      toast({ title: "Application received", description: "We'll review your submission and get back to you soon." });
      setFormData({ name: "", email: "", position: "", message: "" });
      setFileName("");
      setSubmitting(false);
    }, 1200);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  return (
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
        <div className="relative z-10 mx-auto px-6 md:px-12" style={{ width: "min(1400px, 94vw)" }}>
          <div className="grid grid-cols-1 md:grid-cols-[0.55fr_1.45fr] items-center split-layout-gap">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="flex flex-col gap-5"
            >
              <p className="font-mono uppercase" style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, letterSpacing: "0.22em" }}>
                [ CAREERS ]
              </p>
              <h1
                style={{
                  color: "rgba(255,255,255,0.95)",
                  fontWeight: 800,
                  lineHeight: 0.95,
                  fontSize: "clamp(44px, 5.2vw, 84px)",
                  letterSpacing: "-0.02em",
                  textShadow: "0 10px 40px rgba(0,0,0,0.22)",
                }}
              >
                Build what
                <br />
                healthcare
                <br />
                deserves.
              </h1>
              <p
                style={{
                  color: "rgba(255,255,255,0.72)",
                  fontWeight: 400,
                  fontSize: "clamp(15px, 1.25vw, 18px)",
                  lineHeight: 1.55,
                  maxWidth: "46ch",
                }}
              >
                We're assembling a team of engineers, operators, and domain experts who believe clinical infrastructure should be sovereign, auditable, and built to last.
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

      {/* ─── OPEN POSITIONS ─── */}
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
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, transparent 5%, rgba(123,97,255,0.5) 30%, rgba(0,255,255,0.3) 60%, rgba(212,97,107,0.4) 85%, transparent 95%)" }} />

        <div className="relative z-10 mx-auto px-6 md:px-12" style={{ width: "min(1400px, 94vw)" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            className="mb-12"
          >
            <p className="font-mono uppercase" style={{ color: "rgba(17,17,17,0.45)", fontSize: 12, letterSpacing: "0.22em" }}>
              [ OPEN ROLES ]
            </p>
            <h2
              style={{
                color: "#111111",
                fontWeight: 800,
                fontSize: "clamp(36px, 4vw, 64px)",
                lineHeight: 0.95,
                letterSpacing: "-0.02em",
                marginTop: 16,
              }}
            >
              Current openings.
            </h2>
          </motion.div>

          <div className="flex flex-col gap-8">
            {openings.map((job, i) => (
              <motion.article
                key={job.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="rounded-[20px] overflow-hidden"
                style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.45) 100%)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  border: "1px solid rgba(90,70,160,0.12)",
                  boxShadow: "0 20px 60px rgba(60,40,120,0.1), inset 0 1px 0 rgba(255,255,255,0.7)",
                }}
              >
                <div className="p-6 md:p-8">
                  {/* Header */}
                  <div className="flex flex-col md:flex-row md:items-start gap-5 mb-6">
                    <div
                      className="flex items-center justify-center rounded-xl shrink-0"
                      style={{
                        width: 80,
                        height: 80,
                        background: "radial-gradient(ellipse at center, rgba(123,97,255,0.06), transparent 70%)",
                      }}
                    >
                      <img src={job.orb} alt="" className="w-14 h-14 object-contain" style={{ filter: "drop-shadow(0 4px 20px rgba(123,97,255,0.2))" }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-1">
                        <span style={{ fontWeight: 700, fontSize: 22, color: "#111", letterSpacing: "-0.01em" }}>{job.title}</span>
                        <span
                          className="rounded-full px-3 py-0.5"
                          style={{
                            fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" as const,
                            color: "rgba(212,97,107,0.85)", background: "rgba(212,97,107,0.08)", border: "1px solid rgba(212,97,107,0.15)",
                          }}
                        >
                          {job.department}
                        </span>
                      </div>
                      <div style={{ fontSize: 13, color: "rgba(30,30,30,0.55)", fontWeight: 500 }}>{job.type}</div>
                      <div className="flex flex-wrap gap-4 mt-2" style={{ fontSize: 13, color: "rgba(30,30,30,0.6)", fontWeight: 500 }}>
                        <span>💰 {job.salary}</span>
                        <span>📅 Posted {job.posted}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p style={{ fontSize: 15, color: "rgba(30,30,30,0.7)", lineHeight: 1.6, maxWidth: "72ch", marginBottom: 24 }}>{job.description}</p>

                  {/* Responsibilities */}
                  <div className="mb-6">
                    <h4 style={{ fontWeight: 700, fontSize: 14, color: "#111", letterSpacing: "0.04em", textTransform: "uppercase" as const, marginBottom: 12 }}>
                      Responsibilities
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {job.responsibilities.map((r) => (
                        <li key={r} className="flex items-start gap-2" style={{ fontSize: 14, color: "rgba(30,30,30,0.65)", lineHeight: 1.5 }}>
                          <span style={{ color: "#D4616B", fontWeight: 700, marginTop: 2 }}>›</span>
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Requirements */}
                  <div className="mb-6">
                    <h4 style={{ fontWeight: 700, fontSize: 14, color: "#111", letterSpacing: "0.04em", textTransform: "uppercase" as const, marginBottom: 12 }}>
                      Requirements
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.map((r) => (
                        <span key={r} className="rounded-full px-3 py-1" style={{ fontSize: 12, fontWeight: 500, color: "rgba(30,30,30,0.6)", background: "rgba(123,97,255,0.06)", border: "1px solid rgba(123,97,255,0.1)" }}>
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Nice to have */}
                  <div className="mb-6">
                    <h4 style={{ fontWeight: 700, fontSize: 14, color: "#111", letterSpacing: "0.04em", textTransform: "uppercase" as const, marginBottom: 12 }}>
                      Nice to Have
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {job.niceToHave.map((r) => (
                        <span key={r} className="rounded-full px-3 py-1" style={{ fontSize: 12, fontWeight: 500, color: "rgba(30,30,30,0.5)", background: "rgba(212,97,107,0.05)", border: "1px solid rgba(212,97,107,0.1)" }}>
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="mb-6">
                    <h4 style={{ fontWeight: 700, fontSize: 14, color: "#111", letterSpacing: "0.04em", textTransform: "uppercase" as const, marginBottom: 12 }}>
                      What We Offer
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {job.benefits.map((b) => (
                        <li key={b} className="flex items-start gap-2" style={{ fontSize: 14, color: "rgba(30,30,30,0.65)", lineHeight: 1.5 }}>
                          <span style={{ color: "#7B61FF", fontWeight: 700, marginTop: 2 }}>✦</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Apply Button */}
                  <motion.button
                    onClick={() => handleApply(job.title)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="rounded-xl px-8 py-3 font-semibold transition-all"
                    style={{
                      background: "linear-gradient(135deg, #D4616B, #E8967C)",
                      color: "#fff",
                      fontSize: 15,
                      letterSpacing: "0.02em",
                      boxShadow: "0 8px 32px rgba(212,97,107,0.3)",
                    }}
                  >
                    Apply for {job.title} →
                  </motion.button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── APPLICATION FORM (dark timeline style) ─── */}
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
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, transparent 5%, rgba(212,97,107,0.4) 30%, rgba(123,97,255,0.5) 70%, transparent 95%)" }} />

        <div className="relative z-10 mx-auto px-6 md:px-12" style={{ width: "min(1400px, 94vw)" }}>
          <div className="grid grid-cols-1 md:grid-cols-[0.45fr_1.55fr] split-layout-gap">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="font-mono uppercase" style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, letterSpacing: "0.22em" }}>
                [ APPLY NOW ]
              </p>
              <h2
                style={{
                  color: "rgba(255,255,255,0.95)",
                  fontWeight: 800,
                  fontSize: "clamp(36px, 4vw, 64px)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.02em",
                  marginTop: 16,
                }}
              >
                Send your signal.
              </h2>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, lineHeight: 1.55, marginTop: 16, maxWidth: "40ch" }}>
                Upload your resume and tell us which role interests you. We review every application personally.
              </p>
            </motion.div>

            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="rounded-[20px] flex flex-col gap-5"
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.025))",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(16px)",
                padding: "32px 28px",
              }}
            >
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em", textTransform: "uppercase" as const }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your full name"
                  maxLength={100}
                  className="rounded-xl px-4 py-3 outline-none"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.9)",
                    fontSize: 15,
                  }}
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em", textTransform: "uppercase" as const }}>
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  maxLength={255}
                  className="rounded-xl px-4 py-3 outline-none"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.9)",
                    fontSize: 15,
                  }}
                />
              </div>

              {/* Position */}
              <div className="flex flex-col gap-1.5">
                <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em", textTransform: "uppercase" as const }}>
                  Position *
                </label>
                <select
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="rounded-xl px-4 py-3 outline-none appearance-none cursor-pointer"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: formData.position ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)",
                    fontSize: 15,
                  }}
                >
                  <option value="" disabled>Select a position</option>
                  {openings.map((j) => (
                    <option key={j.title} value={j.title} style={{ color: "#111", background: "#fff" }}>
                      {j.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Resume upload */}
              <div className="flex flex-col gap-1.5">
                <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em", textTransform: "uppercase" as const }}>
                  Resume / CV
                </label>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.doc,.docx" className="hidden" />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-xl px-4 py-3 text-left flex items-center gap-3 transition-colors"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px dashed rgba(255,255,255,0.15)",
                    color: fileName ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)",
                    fontSize: 15,
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  {fileName || "Upload PDF, DOC, or DOCX"}
                </button>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em", textTransform: "uppercase" as const }}>
                  Cover Note (optional)
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us why you're interested..."
                  maxLength={1000}
                  rows={4}
                  className="rounded-xl px-4 py-3 outline-none resize-none"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.9)",
                    fontSize: 15,
                  }}
                />
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-xl px-6 py-3.5 font-semibold mt-2 transition-all"
                style={{
                  background: "linear-gradient(135deg, #D4616B, #E8967C)",
                  color: "#fff",
                  fontSize: 15,
                  letterSpacing: "0.02em",
                  boxShadow: "0 8px 32px rgba(212,97,107,0.3)",
                  opacity: submitting ? 0.7 : 1,
                }}
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </motion.button>
            </motion.form>
          </div>
        </div>
      </section>

      {/* ─── CULTURE PRINCIPLES ─── */}
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
              [ HOW WE WORK ]
            </p>
            <h2
              style={{
                color: "#111",
                fontWeight: 800,
                fontSize: "clamp(36px, 4vw, 64px)",
                lineHeight: 0.95,
                letterSpacing: "-0.02em",
                marginTop: 16,
              }}
            >
              Culture is infrastructure.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
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
                <div className="mb-4" style={{ width: 40, height: 4, borderRadius: 2, background: "linear-gradient(90deg, #D4616B, #E8967C)" }} />
                <div style={{ fontWeight: 700, fontSize: 18, color: "#111", letterSpacing: "-0.01em", lineHeight: 1.2 }}>{v.title}</div>
                <div style={{ fontWeight: 400, fontSize: 15, color: "rgba(30,30,30,0.65)", marginTop: 10, lineHeight: 1.55 }}>{v.body}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Careers;
