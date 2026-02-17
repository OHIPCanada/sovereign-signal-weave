import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/* ── Throughput Rings Animation ── */
function ThroughputRings() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const DPR = Math.min(window.devicePixelRatio, 2);
    let w = 0, h = 0;
    let raf: number;

    const LAV = "#E6E6FA";
    const VIO = "#7B61FF";
    const CORAL = "#E8967C";

    interface Packet {
      ring: number;
      angle: number;
      speed: number;
      r: number;
      color: string;
      pulsePhase: number;
      splitting: boolean;
      splitTime: number;
      opacity: number;
    }

    const rings = [
      { radius: 0.22, strokeW: 1.5, speed: 0.035, color: LAV },
      { radius: 0.32, strokeW: 2, speed: -0.025, color: VIO },
      { radius: 0.42, strokeW: 2.5, speed: 0.018, color: CORAL },
    ];

    let packets: Packet[] = [];

    function initPackets() {
      packets = [];
      const colors = [LAV, VIO, CORAL];
      for (let r = 0; r < 3; r++) {
        const count = r === 0 ? 4 : r === 1 ? 6 : 5;
        for (let i = 0; i < count; i++) {
          packets.push({
            ring: r,
            angle: (Math.PI * 2 * i) / count + Math.random() * 0.3,
            speed: rings[r].speed * (0.8 + Math.random() * 0.4),
            r: 2.5 + Math.random() * 1.5,
            color: colors[r],
            pulsePhase: Math.random() * Math.PI * 2,
            splitting: false,
            splitTime: 0,
            opacity: 0.7 + Math.random() * 0.3,
          });
        }
      }
    }

    function resize() {
      const rect = wrap!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas!.width = w * DPR;
      canvas!.height = h * DPR;
      canvas!.style.width = w + "px";
      canvas!.style.height = h + "px";
      ctx!.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    let lastPulse = 0;

    function draw(now: number) {
      ctx!.clearRect(0, 0, w, h);
      const cx = w * 0.5;
      const cy = h * 0.5;
      const baseR = Math.min(w, h) * 0.5;
      const dt = 1 / 60;

      // Draw rings
      for (const ring of rings) {
        const rr = baseR * ring.radius;
        ctx!.beginPath();
        ctx!.arc(cx, cy, rr, 0, Math.PI * 2);
        ctx!.strokeStyle = ring.color;
        ctx!.globalAlpha = 0.15;
        ctx!.lineWidth = ring.strokeW;
        ctx!.stroke();
        ctx!.globalAlpha = 1;
      }

      // Pulse trigger
      if (now - lastPulse > 4200) {
        lastPulse = now;
        // Find a random packet to pulse
        const idx = Math.floor(Math.random() * packets.length);
        packets[idx].splitting = true;
        packets[idx].splitTime = now;
      }

      // Update & draw packets
      const newPackets: Packet[] = [];
      for (const p of packets) {
        p.angle += p.speed * dt;
        const rr = baseR * rings[p.ring].radius;
        const px = cx + Math.cos(p.angle) * rr;
        const py = cy + Math.sin(p.angle) * rr;

        // Pulse animation
        let scale = 1;
        let glow = 0;
        if (p.splitting && now - p.splitTime < 600) {
          const t = (now - p.splitTime) / 600;
          scale = 1 + Math.sin(t * Math.PI) * 0.9;
          glow = Math.sin(t * Math.PI) * 12;
        } else if (p.splitting && now - p.splitTime >= 600) {
          p.splitting = false;
          // Spawn a new packet nearby
          if (packets.length + newPackets.length < 22) {
            newPackets.push({
              ring: p.ring,
              angle: p.angle + 0.3,
              speed: p.speed * (0.9 + Math.random() * 0.2),
              r: p.r * 0.7,
              color: p.color,
              pulsePhase: Math.random() * Math.PI * 2,
              splitting: false,
              splitTime: 0,
              opacity: 0.5,
            });
          }
        }

        // Breathing
        const breath = 1 + Math.sin(now * 0.002 + p.pulsePhase) * 0.15;
        const finalR = p.r * scale * breath;

        // Glow
        if (glow > 0) {
          ctx!.beginPath();
          ctx!.arc(px, py, finalR + glow, 0, Math.PI * 2);
          ctx!.fillStyle = p.color;
          ctx!.globalAlpha = 0.15;
          ctx!.fill();
          ctx!.globalAlpha = 1;
        }

        // Dot
        ctx!.beginPath();
        ctx!.arc(px, py, finalR, 0, Math.PI * 2);
        ctx!.fillStyle = p.color;
        ctx!.globalAlpha = p.opacity;
        ctx!.fill();
        ctx!.globalAlpha = 1;
      }

      // Add new spawned packets
      for (const np of newPackets) packets.push(np);

      // Cap packets
      while (packets.length > 22) packets.shift();

      raf = requestAnimationFrame(draw);
    }

    initPackets();
    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative w-full h-full" style={{ minHeight: "clamp(320px, 40vw, 480px)" }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}

/* ── Proof Tiles ── */
const proofTiles = [
  { num: "X× faster", label: "Decision latency", desc: "From hours to minutes" },
  { num: "Y% more", label: "Coordination rate", desc: "More tasks resolved per pathway" },
  { num: "Y% fewer", label: "Workflow leakage", desc: "Fewer dropped handoffs" },
  { num: "100%", label: "Audit readiness", desc: "Continuous trace, zero scramble" },
];

/* ── Section 5 ── */
export default function ProofSection() {
  return (
    <motion.section
      className="relative overflow-hidden"
      style={{
        padding: "clamp(56px, 7vw, 96px) 0",
        minHeight: "100vh",
        background: `
          radial-gradient(900px 700px at 85% 85%, rgba(232,150,124,0.18), transparent 60%),
          radial-gradient(700px 500px at 75% 90%, rgba(212,97,107,0.12), transparent 60%),
          linear-gradient(135deg, #140A2A, #2A0B4F)
        `,
        color: "#F6F2FF",
      }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Subtle noise overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      <div className="relative z-10 mx-auto px-6 md:px-12" style={{ width: "min(1400px, 94vw)" }}>
        {/* Top: Left text + Right rings */}
        <div
          className="grid grid-cols-1 lg:grid-cols-[0.45fr_1.55fr] items-center"
          style={{ gap: "clamp(28px, 4vw, 56px)" }}
        >
          {/* Left content */}
          <div className="flex flex-col gap-5">
            <motion.p
              style={{
                fontSize: 12,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "rgba(246,242,255,0.55)",
              }}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              System Proof
            </motion.p>

            <motion.h2
              style={{
                fontSize: "clamp(44px, 4.6vw, 72px)",
                lineHeight: 0.95,
                letterSpacing: "-0.02em",
                fontWeight: 700,
              }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Intelligence you{" "}
              <span style={{ color: "#E8967C" }}>can measure.</span>
            </motion.h2>

            <motion.p
              style={{
                fontSize: 16,
                lineHeight: 1.6,
                color: "rgba(246,242,255,0.72)",
                maxWidth: "46ch",
              }}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              DocG AI turns fragmented clinical signals into coordinated actions—at system scale.
            </motion.p>
          </div>

          {/* Right: Throughput Rings */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{
              borderRadius: 24,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.10)",
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
            }}
          >
            <ThroughputRings />
          </motion.div>
        </div>

        {/* Proof Tiles Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 mt-8"
          style={{ gap: 14, marginTop: "clamp(28px, 3vw, 48px)" }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          {proofTiles.map((tile, i) => (
            <motion.div
              key={tile.label}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: 18,
                padding: "16px 16px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
              }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.55 + i * 0.1 }}
            >
              <p style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em" }}>
                {tile.num}
              </p>
              <p style={{ marginTop: 4, fontSize: 14, fontWeight: 600 }}>
                {tile.label}
              </p>
              <p style={{ marginTop: 6, fontSize: 13, color: "rgba(246,242,255,0.55)" }}>
                {tile.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
