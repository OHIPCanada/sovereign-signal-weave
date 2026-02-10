import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const InterfaceSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen text-primary-foreground py-24 md:py-32"
      style={{ background: 'linear-gradient(170deg, #1A1A4E 0%, #2A1B3D 40%, #3D2038 70%, #4A2540 100%)' }}
      id="features"
    >
      {/* Dark mode transition overlay */}
      <motion.div
        style={{ opacity }}
        className="absolute inset-0 bg-primary pointer-events-none"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-8"
          >
            <span className="mono-label text-secondary">[ TERMINAL REALITY ]</span>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              Intelligence
              <br />
              at your
              <br />
              <span className="text-secondary">fingertips.</span>
            </h2>

            <p className="text-primary-foreground/70 text-lg max-w-md">
              A high-fidelity dashboard designed for clinical operations. Real-time insights, 
              audit-ready compliance, and seamless EMR integration.
            </p>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-6 mt-8">
              <MetricCard value="99.9%" label="AUDIT ACCURACY" />
              <MetricCard value="<50ms" label="RESPONSE TIME" />
              <MetricCard value="24/7" label="SYSTEM UPTIME" />
              <MetricCard value="256-bit" label="ENCRYPTION" />
            </div>
          </motion.div>

          {/* Right - Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <DashboardMockup />
          </motion.div>
        </div>

        {/* Terminal Log */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16"
        >
          <TerminalLog />
        </motion.div>
      </div>
    </section>
  );
};

interface MetricCardProps {
  value: string;
  label: string;
}

const MetricCard = ({ value, label }: MetricCardProps) => {
  return (
    <div className="border border-secondary/30 rounded-lg p-6 hover:border-secondary transition-colors">
      <AnimatedCounter value={value} />
      <span className="mono-label text-primary-foreground/50 mt-2 block">{label}</span>
    </div>
  );
};

const AnimatedCounter = ({ value }: { value: string }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          // Simple reveal animation
          setDisplayValue(value);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <div ref={ref} className="text-3xl md:text-4xl font-bold text-primary-foreground">
      {displayValue}
    </div>
  );
};

const DashboardMockup = () => {
  return (
    <div className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-2xl p-6 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-destructive/60" />
          <div className="w-3 h-3 rounded-full bg-secondary/60" />
          <div className="w-3 h-3 rounded-full bg-accent/60" />
        </div>
        <span className="mono-label text-primary-foreground/40">docg-dashboard.ai</span>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Active Patients", value: "1,247" },
          { label: "Consultations Today", value: "89" },
          { label: "Pending Reviews", value: "12" },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-primary-foreground/5 rounded-lg p-4 border border-primary-foreground/10"
          >
            <span className="mono-label text-primary-foreground/40 text-[10px]">{item.label}</span>
            <p className="text-xl font-bold text-primary-foreground mt-1">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Chart Placeholder */}
      <div className="h-32 bg-primary-foreground/5 rounded-lg border border-primary-foreground/10 flex items-end justify-center gap-2 p-4">
        {[40, 65, 45, 80, 55, 70, 85, 60, 75, 90, 50, 95].map((height, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            whileInView={{ height: `${height}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="w-4 bg-secondary/60 rounded-t"
          />
        ))}
      </div>
    </div>
  );
};

const TerminalLog = () => {
  const logs = [
    "EMR_SYNC_INITIATED...",
    "PATIENT_DATA_ENCRYPTED...",
    "COMPLIANCE_CHECK_PASSED...",
    "AUDIT_LOG_UPDATED...",
  ];

  const [currentLog, setCurrentLog] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLog((prev) => (prev + 1) % logs.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-lg p-4 font-mono">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
        <span className="text-xs text-primary-foreground/40">SYSTEM LOG</span>
      </div>
      <div className="terminal-text">
        <span className="text-primary-foreground/50">{">"}</span> {logs[currentLog]}
        <span className="animate-pulse">_</span>
      </div>
    </div>
  );
};

export default InterfaceSection;
