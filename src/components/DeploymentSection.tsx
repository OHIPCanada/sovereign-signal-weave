import { motion } from "framer-motion";
import { useEffect, useRef, useCallback } from "react";

/* ─── PARTICLE FIELD CANVAS ─── */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: "purple" | "coral";
  baseAlpha: number;
}

interface Bloom {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  createdAt: number;
}

const ParticleField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const bloomsRef = useRef<Bloom[]>([]);
  const rafRef = useRef<number>(0);
  const tRef = useRef(0);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });

  const initParticles = useCallback((W: number, H: number) => {
    const count = 65;
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: 1.5 + Math.random() * 2,
        color: Math.random() > 0.35 ? "purple" : "coral",
        baseAlpha: 0.4 + Math.random() * 0.4,
      });
    }
    return particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      if (particlesRef.current.length === 0) {
        particlesRef.current = initParticles(rect.width, rect.height);
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top, active: true };
    };
    const handleMouseLeave = () => { mouseRef.current.active = false; };
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const CONNECT_DIST = 90;
    const CLUSTER_DIST = 60;
    const CLUSTER_MIN = 3;

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const W = rect.width;
      const H = rect.height;
      ctx.clearRect(0, 0, W, H);
      tRef.current += 0.016;
      const t = tRef.current;

      const particles = particlesRef.current;
      const blooms = bloomsRef.current;

      // Update positions
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        if (p.x > W) { p.x = W; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        if (p.y > H) { p.y = H; p.vy *= -1; }

        // Mouse attraction
        if (mouseRef.current.active) {
          const mdx = mouseRef.current.x - p.x;
          const mdy = mouseRef.current.y - p.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mDist < 180 && mDist > 1) {
            const force = 0.015 * (1 - mDist / 180);
            p.vx += (mdx / mDist) * force;
            p.vy += (mdy / mDist) * force;
          }
        }

        // Slight drift variation
        p.vx += (Math.random() - 0.5) * 0.01;
        p.vy += (Math.random() - 0.5) * 0.01;
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 0.7) {
          p.vx *= 0.7 / speed;
          p.vy *= 0.7 / speed;
        }
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.35;
            const isCoralPair = particles[i].color === "coral" || particles[j].color === "coral";
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = isCoralPair
              ? `rgba(232,150,124,${alpha})`
              : `rgba(155,123,255,${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Detect clusters and spawn blooms
      if (Math.floor(t * 2) % 3 === 0 && Math.random() < 0.008) {
        for (let i = 0; i < particles.length; i++) {
          let neighbors = 0;
          let cx = particles[i].x;
          let cy = particles[i].y;
          for (let j = 0; j < particles.length; j++) {
            if (i === j) continue;
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            if (Math.sqrt(dx * dx + dy * dy) < CLUSTER_DIST) {
              neighbors++;
              cx += particles[j].x;
              cy += particles[j].y;
            }
          }
          if (neighbors >= CLUSTER_MIN) {
            cx /= (neighbors + 1);
            cy /= (neighbors + 1);
            // Don't stack blooms
            const tooClose = blooms.some(
              (b) => Math.abs(b.x - cx) < 80 && Math.abs(b.y - cy) < 80 && t - b.createdAt < 3
            );
            if (!tooClose) {
              blooms.push({ x: cx, y: cy, radius: 0, alpha: 0.5, createdAt: t });
            }
            break;
          }
        }
      }

      // Draw + update blooms
      for (let i = blooms.length - 1; i >= 0; i--) {
        const b = blooms[i];
        const age = t - b.createdAt;
        b.radius = age * 25;
        b.alpha = Math.max(0, 0.4 - age * 0.1);
        if (b.alpha <= 0) {
          blooms.splice(i, 1);
          continue;
        }
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
        grad.addColorStop(0, `rgba(232,150,124,${b.alpha * 0.6})`);
        grad.addColorStop(0.4, `rgba(155,123,255,${b.alpha * 0.3})`);
        grad.addColorStop(1, `rgba(155,123,255,0)`);
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Draw particles
      particles.forEach((p) => {
        const pulse = Math.sin(t * 1.5 + p.x * 0.01) * 0.15;
        const alpha = p.baseAlpha + pulse;

        // Glow
        const gRad = p.radius * 4;
        const gColor = p.color === "coral"
          ? `rgba(232,150,124,${alpha * 0.3})`
          : `rgba(155,123,255,${alpha * 0.3})`;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, gRad);
        grad.addColorStop(0, gColor);
        grad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(p.x, p.y, gRad, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color === "coral"
          ? `rgba(232,150,124,${alpha})`
          : `rgba(155,123,255,${alpha})`;
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full"
      style={{ height: "clamp(400px, 50vh, 600px)", display: "block" }}
    />
  );
};

/* ─── MAIN SECTION ─── */
const DeploymentSection = () => {
  return (
    <section
      className="relative overflow-hidden"
      id="deployment"
      style={{
        padding: "clamp(80px, 9vw, 140px) 0 clamp(60px, 6vw, 100px)",
        background: `radial-gradient(circle at 50% 40%, #1a0833 0%, #120622 40%, #0b0417 100%)`,
      }}
    >
      {/* Noise texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />

      {/* Top edge */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{
        background: "linear-gradient(90deg, transparent 10%, rgba(110,43,255,0.2) 50%, transparent 90%)",
      }} />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full">
        {/* 2-column: text left, canvas right */}
        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
          {/* Left: Text */}
          <motion.div
            className="lg:w-[38%] flex-shrink-0 lg:sticky lg:top-32"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
          >
            <span
              className="inline-block mb-5 text-[11px] font-mono tracking-[0.22em] uppercase"
              style={{ color: "rgba(243,239,255,0.35)" }}
            >
              [ SYSTEM CONSCIOUSNESS ]
            </span>

            <h2
              style={{
                color: "#F3EFFF",
                fontWeight: 700,
                fontSize: "clamp(36px, 4.5vw, 58px)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              Intelligence operating as a living system.
            </h2>

            <p
              className="mt-5"
              style={{
                color: "rgba(243,239,255,0.5)",
                fontSize: "17px",
                lineHeight: 1.65,
                maxWidth: "420px",
              }}
            >
              Signals converge, align, resolve — continuously across the field.
            </p>

            {/* Status */}
            <div className="flex items-center gap-2.5 mt-10">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#E8967C" }} />
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase" style={{ color: "rgba(243,239,255,0.25)" }}>
                FIELD ACTIVE
              </span>
            </div>
          </motion.div>

          {/* Right: Particle field */}
          <motion.div
            className="lg:w-[62%] w-full relative"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {/* Subtle radial glow behind canvas */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at 50% 50%, rgba(110,43,255,0.06) 0%, transparent 70%)",
              }}
            />
            <ParticleField />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DeploymentSection;
