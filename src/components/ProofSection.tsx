import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

/* ── Throughput Rings (Light Theme) ── */
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
      { radius: 0.22, strokeW: 1.5, speed: 0.035, color: "rgba(212,97,107,0.7)" },
      { radius: 0.32, strokeW: 2, speed: -0.025, color: "rgba(123,97,255,0.6)" },
      { radius: 0.42, strokeW: 2.5, speed: 0.018, color: "rgba(123,97,255,0.45)" },
    ];

    const packetColors = ["rgba(180,70,90,0.85)", "rgba(100,70,220,0.8)", "rgba(100,70,220,0.65)"];

    let packets: Packet[] = [];

    function initPackets() {
      packets = [];
      for (let r = 0; r < 3; r++) {
        const count = r === 0 ? 4 : r === 1 ? 6 : 5;
        for (let i = 0; i < count; i++) {
          packets.push({
            ring: r,
            angle: (Math.PI * 2 * i) / count + Math.random() * 0.3,
            speed: rings[r].speed * (0.8 + Math.random() * 0.4),
            r: 2.5 + Math.random() * 1.5,
            color: packetColors[r],
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
        ctx!.globalAlpha = 0.35;
        ctx!.lineWidth = ring.strokeW;
        ctx!.stroke();
        ctx!.globalAlpha = 1;
      }

      // Pulse trigger
      if (now - lastPulse > 4200) {
        lastPulse = now;
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

        let scale = 1;
        let glow = 0;
        if (p.splitting && now - p.splitTime < 600) {
          const t = (now - p.splitTime) / 600;
          scale = 1 + Math.sin(t * Math.PI) * 0.6;
          glow = Math.sin(t * Math.PI) * 7;
        } else if (p.splitting && now - p.splitTime >= 600) {
          p.splitting = false;
          if (packets.length + newPackets.length < 22) {
            newPackets.push({
              ring: p.ring,
              angle: p.angle + 0.3,
              speed: p.speed * (0.9 + Math.random() * 0.2),
              r: p.r * 0.7,
              color: p.ring === 0 ? "rgba(212,97,107,0.7)" : p.color,
              pulsePhase: Math.random() * Math.PI * 2,
              splitting: false,
              splitTime: 0,
              opacity: 0.5,
            });
          }
        }

        const breath = 1 + Math.sin(now * 0.002 + p.pulsePhase) * 0.12;
        const finalR = p.r * scale * breath;

        // Reduced glow
        if (glow > 0) {
          ctx!.beginPath();
          ctx!.arc(px, py, finalR + glow, 0, Math.PI * 2);
          ctx!.fillStyle = p.splitting ? "rgba(212,97,107,0.25)" : p.color;
          ctx!.globalAlpha = 0.1;
          ctx!.fill();
          ctx!.globalAlpha = 1;
        }

        ctx!.beginPath();
        ctx!.arc(px, py, finalR, 0, Math.PI * 2);
        ctx!.fillStyle = p.color;
        ctx!.globalAlpha = p.opacity;
        ctx!.fill();
        ctx!.globalAlpha = 1;
      }

      for (const np of newPackets) packets.push(np);
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
  { num: "4.3×", suffix: "faster", label: "Decision latency", desc: "From hours to minutes" },
  { num: "27%", suffix: "more", label: "Coordination rate", desc: "Tasks resolved per pathway" },
  { num: "38%", suffix: "fewer", label: "Workflow leakage", desc: "Dropped handoffs reduced" },
  { num: "100%", suffix: "traceable", label: "Audit readiness", desc: "Continuous system memory" },
];

/* ── Reveal wrapper ── */
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(8px)",
        transition: `all 0.8s cubic-bezier(.22,.65,.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ── Section 5 ── */
export default function ProofSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        padding: "140px 8vw",
        background: `
          radial-gradient(900px 600px at 85% 85%, rgba(242,193,174,0.35), transparent 60%),
          radial-gradient(800px 500px at 15% 10%, rgba(205,188,232,0.45), transparent 60%),
          linear-gradient(135deg, #F4EFFA 0%, #E9DFF4 50%, #F8F4FB 100%)
        `,
        color: "#1B0F2E",
      }}
    >
      <div className="relative z-10 mx-auto" style={{ width: "min(1400px, 94vw)" }}>
        {/* Top: Left text + Right rings */}
        <div
          className="grid grid-cols-1 lg:grid-cols-[0.45fr_1.55fr] items-center"
          style={{ gap: "clamp(28px, 4vw, 56px)" }}
        >
          {/* Left content */}
          <div className="flex flex-col">
            <Reveal>
              <p
                style={{
                  fontSize: 12,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  opacity: 0.6,
                  fontWeight: 500,
                }}
              >
                [ System Proof ]
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <h2
                style={{
                  marginTop: 24,
                  fontSize: "clamp(56px, 5.5vw, 88px)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.02em",
                  fontWeight: 700,
                }}
              >
                Intelligence you can{" "}
                <span
                  style={{
                    background: "linear-gradient(90deg, #D4616B, #E8967C)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  measure.
                </span>
              </h2>
            </Reveal>

            <Reveal delay={0.2}>
              <p
                style={{
                  marginTop: 20,
                  fontSize: 18,
                  lineHeight: 1.6,
                  maxWidth: "48ch",
                  opacity: 0.75,
                }}
              >
                DocG AI turns fragmented clinical signals into coordinated actions—at system scale.
              </p>
            </Reveal>
          </div>

          {/* Right: Throughput Rings */}
          <Reveal delay={0.25}>
            <div
              style={{
                borderRadius: 24,
                background: "rgba(255,255,255,0.55)",
                backdropFilter: "blur(14px)",
                border: "1px solid rgba(27,15,46,0.08)",
                overflow: "hidden",
                boxShadow: "0 20px 50px rgba(27,15,46,0.08)",
              }}
            >
              <ThroughputRings />
            </div>
          </Reveal>
        </div>

        {/* Proof Tiles Grid */}
        <div
          className="grid grid-cols-2 md:grid-cols-4"
          style={{ gap: 20, marginTop: 72 }}
        >
          {proofTiles.map((tile, i) => (
            <Reveal key={tile.label} delay={0.3 + i * 0.08}>
              <div
                className="group"
                style={{
                  background: "rgba(255,255,255,0.55)",
                  backdropFilter: "blur(14px)",
                  border: "1px solid rgba(27,15,46,0.08)",
                  borderRadius: 18,
                  padding: 20,
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 50px rgba(27,15,46,0.15)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                <p style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em", color: "#1B0F2E" }}>
                  {tile.num}{" "}
                  <span style={{ fontSize: 18, fontWeight: 600, opacity: 0.7 }}>{tile.suffix}</span>
                </p>
                <p style={{ marginTop: 6, fontSize: 14, fontWeight: 600, color: "#1B0F2E" }}>
                  {tile.label}
                </p>
                <p style={{ marginTop: 6, fontSize: 14, opacity: 0.7 }}>
                  {tile.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
