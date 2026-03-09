import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import heroOrb from "@/assets/patient-access-hero-orb.png";
import { Users, CalendarCheck, Clock, Shield, Smartphone, HeartPulse } from "lucide-react";
import { useRef, useEffect } from "react";

/* ── Radial Gateway Canvas — rendered as hero background ── */
const GatewayBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const DPR = Math.min(2, window.devicePixelRatio || 1);

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * DPR;
      canvas.height = r.height * DPR;
    };
    resize();
    window.addEventListener("resize", resize);

    interface AccessPoint {
      angle: number; radius: number; speed: number;
      size: number; color: string; label: string;
    }
    const accessPoints: AccessPoint[] = [
      { angle: 0, radius: 0.28, speed: 0.15, size: 6, color: "rgba(232,150,124,0.85)", label: "Booking" },
      { angle: Math.PI * 0.4, radius: 0.32, speed: 0.12, size: 5, color: "rgba(123,97,255,0.75)", label: "Triage" },
      { angle: Math.PI * 0.8, radius: 0.25, speed: 0.18, size: 7, color: "rgba(212,97,107,0.8)", label: "Check-In" },
      { angle: Math.PI * 1.2, radius: 0.30, speed: 0.14, size: 5, color: "rgba(123,97,255,0.7)", label: "Referral" },
      { angle: Math.PI * 1.6, radius: 0.35, speed: 0.11, size: 6, color: "rgba(232,150,124,0.75)", label: "Follow-Up" },
    ];

    interface Signal { angle: number; dist: number; speed: number; }
    const signals: Signal[] = Array.from({ length: 30 }, () => ({
      angle: Math.random() * Math.PI * 2,
      dist: 0.45 + Math.random() * 0.15,
      speed: 0.003 + Math.random() * 0.004,
    }));

    let raf: number;
    const t0 = performance.now();

    const draw = (now: number) => {
      const t = (now - t0) / 1000;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w * 0.5;
      const cy = h * 0.5;
      const minDim = Math.min(w, h);
      ctx.clearRect(0, 0, w, h);

      const gateGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, minDim * 0.15);
      gateGrad.addColorStop(0, `rgba(232,150,124,${0.25 + Math.sin(t * 0.8) * 0.08})`);
      gateGrad.addColorStop(0.5, "rgba(212,97,107,0.08)");
      gateGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gateGrad;
      ctx.fillRect(0, 0, w, h);

      [0.2, 0.28, 0.35, 0.42].forEach((r, i) => {
        ctx.beginPath();
        ctx.arc(cx, cy, minDim * r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(123,97,255,${0.06 + Math.sin(t * 0.5 + i) * 0.02})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([4 * DPR, 8 * DPR]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      signals.forEach(s => {
        s.dist -= s.speed;
        if (s.dist < 0.05) {
          s.dist = 0.45 + Math.random() * 0.15;
          s.angle = Math.random() * Math.PI * 2;
        }
        const sx = cx + Math.cos(s.angle) * minDim * s.dist;
        const sy = cy + Math.sin(s.angle) * minDim * s.dist;
        const alpha = s.dist < 0.15 ? s.dist / 0.15 : 1;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        const trailEnd = s.dist + 0.03;
        ctx.lineTo(cx + Math.cos(s.angle) * minDim * trailEnd, cy + Math.sin(s.angle) * minDim * trailEnd);
        ctx.strokeStyle = `rgba(232,150,124,${alpha * 0.15})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(sx, sy, 2 * DPR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232,150,124,${alpha * 0.6})`;
        ctx.fill();
      });

      accessPoints.forEach(ap => {
        const a = ap.angle + t * ap.speed;
        const px = cx + Math.cos(a) * minDim * ap.radius;
        const py = cy + Math.sin(a) * minDim * ap.radius;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(px, py);
        ctx.strokeStyle = ap.color.replace(/[\d.]+\)$/, "0.12)");
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(px, py, ap.size * 3 * DPR, 0, Math.PI * 2);
        ctx.fillStyle = ap.color.replace(/[\d.]+\)$/, "0.08)");
        ctx.fill();
        ctx.beginPath();
        ctx.arc(px, py, ap.size * DPR, 0, Math.PI * 2);
        ctx.fillStyle = ap.color;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(px, py, 2 * DPR, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.fill();
      });

      ctx.beginPath();
      ctx.arc(cx, cy, 12 * DPR, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(232,150,124,0.9)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy, 5 * DPR, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.fill();

      for (let ring = 0; ring < 2; ring++) {
        const ringT = (t * 0.3 + ring * 0.5) % 1;
        const ringR = ringT * minDim * 0.2;
        const ringAlpha = (1 - ringT) * 0.12;
        ctx.beginPath();
        ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(232,150,124,${ringAlpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: 0.7 }} />;
};

const features = [
  { icon: CalendarCheck, title: "Intelligent Scheduling", desc: "AI-powered scheduling that considers provider availability, patient preferences, urgency levels, and resource optimization." },
  { icon: Clock, title: "Smart Triage", desc: "Automated symptom assessment and triage routing that ensures patients reach the right care level at the right time." },
  { icon: Users, title: "Self-Service Portal", desc: "Patient-facing portal with appointment management, health records access, secure messaging, and care plan tracking." },
  { icon: Shield, title: "Identity & Consent", desc: "Secure identity verification with granular consent management — patients control exactly how their data is used." },
  { icon: Smartphone, title: "Mobile-First Experience", desc: "Native mobile experience with push notifications, digital check-in, wait time estimates, and navigation assistance." },
  { icon: HeartPulse, title: "Care Continuity", desc: "Seamless handoffs between virtual and in-person care with full context preservation across every transition." },
];

const PatientAccess = () => {
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
    <div className="relative overflow-x-hidden">
      <Navigation darkMode />

      {/* Hero with Gateway animation as background */}
      <section
        ref={containerRef}
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{
          background: `
            radial-gradient(1200px 800px at 30% 40%, rgba(232,150,124,0.18), transparent 60%),
            radial-gradient(900px 600px at 70% 60%, rgba(212,97,107,0.12), transparent 55%),
            linear-gradient(180deg, #0B0613 0%, #1A0630 50%, #0B0613 100%)
          `,
        }}
      >
        <GatewayBackground />

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
                [ PATIENT ACCESS ]
              </p>
              <h1 style={{
                color: "rgba(255,255,255,0.95)", fontWeight: 800,
                fontSize: "clamp(44px, 5.2vw, 84px)", lineHeight: 0.95,
                letterSpacing: "-0.02em",
                textShadow: "0 10px 40px rgba(0,0,0,0.22)",
              }}>
                The front door to intelligent care.
              </h1>
              <p style={{
                color: "rgba(255,255,255,0.72)", fontSize: "clamp(15px, 1.25vw, 18px)",
                lineHeight: 1.55, maxWidth: "46ch",
              }}>
                A unified patient gateway that handles scheduling, triage, check-in, and
                navigation — powered by AI and governed by sovereign data policies.
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="self-start px-8 py-4 rounded-full text-sm font-semibold tracking-wide"
                style={{
                  background: "linear-gradient(135deg, #D4616B, #E8967C)",
                  color: "#FFFAF8",
                  boxShadow: "0 8px 32px rgba(212,97,107,0.3)",
                }}
              >
                Explore Patient Portal
              </motion.button>
            </motion.div>

            <motion.div
              className="flex justify-center"
              style={{ perspective: 800, rotateX: orbRotateX, rotateY: orbRotateY }}
            >
              <motion.img
                src={heroOrb}
                alt="Patient Access visualization"
                className="w-full max-w-md"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                style={{ filter: "drop-shadow(0 0 80px rgba(232,150,124,0.3))" }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative overflow-hidden" style={{
        padding: "clamp(64px, 8vw, 120px) 0",
        background: `
          radial-gradient(1200px 700px at 20% 20%, rgba(232,150,124,0.12), transparent 55%),
          radial-gradient(900px 600px at 80% 80%, rgba(123,97,255,0.10), transparent 60%),
          linear-gradient(180deg, #F9F8FC 0%, #F1EEF8 100%)
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
              Access redesigned.
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

      {/* Journey Flow */}
      <section className="relative overflow-hidden" style={{
        padding: "clamp(64px, 8vw, 120px) 0",
        background: `
          radial-gradient(1000px 600px at 50% 50%, rgba(232,150,124,0.12), transparent 55%),
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
              The patient journey, reimagined.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { step: "01", title: "Discover", desc: "Find the right provider through intelligent search and AI-powered matching." },
              { step: "02", title: "Book", desc: "Schedule appointments with real-time availability and preference-aware suggestions." },
              { step: "03", title: "Prepare", desc: "Digital intake, insurance verification, and pre-visit preparation — all automated." },
              { step: "04", title: "Arrive", desc: "Frictionless check-in with wayfinding, wait time updates, and care team introduction." },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                className="rounded-[16px] p-6 relative"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
              >
                <div style={{
                  fontSize: 32, fontWeight: 800,
                  background: "linear-gradient(135deg, rgba(232,150,124,0.4), rgba(123,97,255,0.3))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginBottom: 12,
                }}>{item.step}</div>
                <h4 className="font-semibold mb-2" style={{ color: "rgba(255,255,255,0.92)", fontSize: 16 }}>{item.title}</h4>
                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, lineHeight: 1.55 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PatientAccess;
