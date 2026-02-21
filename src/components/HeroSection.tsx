import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const HeroSection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0, DPR = 1;
    let animId: number;

    function resize() {
      DPR = Math.min(2, window.devicePixelRatio || 1);
      W = canvas!.width = Math.floor(window.innerWidth * DPR);
      H = canvas!.height = Math.floor(window.innerHeight * DPR);
      canvas!.style.width = window.innerWidth + "px";
      canvas!.style.height = window.innerHeight + "px";
    }
    window.addEventListener("resize", resize);
    resize();

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
    const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    function flowAngle(x: number, y: number, t: number) {
      const nx = x / W;
      const ny = y / H;
      return (
        Math.sin((nx * 3.2 + t * 0.12) * Math.PI * 2) +
        Math.cos((ny * 2.6 - t * 0.10) * Math.PI * 2) +
        Math.sin((nx * 1.2 + ny * 1.6 + t * 0.06) * Math.PI * 2)
      );
    }

    class Cell {
      type: "human" | "ai";
      x = 0; y = 0; r = 0; baseSpeed = 0; z = 0; vx = 0; vy = 0; p = 0; a = 1;

      constructor(type: "human" | "ai") {
        this.type = type;
        this.init(true);
      }

      init(initial = false) {
        this.x = rand(0, W);
        this.y = rand(0, H);
        this.r = this.type === "human" ? rand(1.4, 2.8) : rand(1.0, 2.2);
        this.baseSpeed = this.type === "human" ? rand(0.25, 0.55) : rand(0.35, 0.75);
        this.z = rand(0.3, 1.0);
        this.vx = rand(-0.2, 0.2);
        this.vy = rand(-0.2, 0.2);
        this.p = rand(0, Math.PI * 2);
        this.a = initial ? rand(0.2, 0.9) : 1;
      }

      step(t: number, convergeStrength: number) {
        const ang = flowAngle(this.x, this.y, t);
        const swirl = this.type === "human" ? 0.8 : 0.45;
        const sp = this.baseSpeed * (0.6 + this.z);

        this.vx += Math.cos(ang) * sp * swirl;
        this.vy += Math.sin(ang) * sp * swirl;
        this.vx *= 0.92;
        this.vy *= 0.92;

        if (convergeStrength > 0) {
          const cx = W * 0.5;
          const cy = H * 0.56;
          const dx = cx - this.x;
          const dy = cy - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy) + 0.001;
          const k = this.type === "ai" ? 0.9 : 0.75;
          this.vx += (dx / dist) * convergeStrength * k * (0.8 + this.z) * 0.9;
          this.vy += (dy / dist) * convergeStrength * k * (0.8 + this.z) * 0.9;
        }

        this.x += this.vx;
        this.y += this.vy;

        if (this.x < -20) this.x = W + 20;
        if (this.x > W + 20) this.x = -20;
        if (this.y < -20) this.y = H + 20;
        if (this.y > H + 20) this.y = -20;
      }

      draw(t: number, fusion: number) {
        const pulse = 0.6 + 0.4 * Math.sin(t * 0.8 + this.p);
        const human = { r: 170, g: 140, b: 255 };
        const ai = { r: 120, g: 210, b: 255 };
        const c = this.type === "human" ? human : ai;

        const warm = fusion * 0.35;
        const R = c.r + warm * 140;
        const G = c.g + warm * 95;
        const B = c.b + warm * 60;
        const alpha = clamp(0.10 + this.z * 0.55, 0.12, 0.75) * pulse;

        ctx!.beginPath();
        ctx!.fillStyle = `rgba(${R | 0},${G | 0},${B | 0},${alpha})`;
        ctx!.arc(this.x, this.y, this.r * (0.9 + this.z * 0.6), 0, Math.PI * 2);
        ctx!.fill();

        ctx!.beginPath();
        ctx!.fillStyle = `rgba(${R | 0},${G | 0},${B | 0},${alpha * 0.22})`;
        ctx!.arc(this.x, this.y, this.r * (3.0 + this.z * 3.5), 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    // Adjust count for mobile
    const isMobile = window.innerWidth < 768;
    const COUNT = isMobile ? 260 : 520;
    const cells: Cell[] = [];
    for (let i = 0; i < COUNT; i++) {
      cells.push(new Cell(i < COUNT / 2 ? "human" : "ai"));
    }

    const start = performance.now();

    function phase(now: number) {
      const t = (now - start) / 1000;
      const loop = t % 12;

      let converge = 0;
      if (loop > 4 && loop < 9) {
        const u = (loop - 4) / 5;
        converge = easeInOut(u) * 1.2;
      }

      let fusion = 0;
      const peak = 8.0;
      const d = Math.abs(loop - peak);
      fusion = clamp(1 - d / 1.1, 0, 1);
      fusion = Math.pow(fusion, 2.2);

      return { t, converge, fusion };
    }

    function drawFusionBurst(f: number) {
      if (f <= 0) return;
      const cx = W * 0.5;
      const cy = H * 0.56;
      const r = 220 * DPR + f * 280 * DPR;

      const g = ctx!.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, `rgba(242,193,174,${0.55 * f})`);
      g.addColorStop(0.35, `rgba(232,150,124,${0.28 * f})`);
      g.addColorStop(0.7, `rgba(212,97,107,${0.16 * f})`);
      g.addColorStop(1, "rgba(0,0,0,0)");

      ctx!.fillStyle = g;
      ctx!.fillRect(0, 0, W, H);
    }

    function frame(now: number) {
      const { t, converge, fusion } = phase(now);

      ctx!.fillStyle = `rgba(255,255,255,${0.10 * (1 - fusion * 0.4)})`;
      ctx!.fillRect(0, 0, W, H);

      ctx!.globalCompositeOperation = "lighter";

      for (const c of cells) {
        c.step(t, converge);
        c.draw(t, fusion);
      }

      drawFusionBurst(fusion);
      ctx!.globalCompositeOperation = "source-over";

      animId = requestAnimationFrame(frame);
    }
    animId = requestAnimationFrame(frame);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section
      className="relative overflow-hidden min-h-[50vh] md:min-h-[80vh] lg:min-h-screen"
      style={{
        background: `
          radial-gradient(1100px 900px at 30% 45%, rgba(177,120,255,.22), transparent 60%),
          radial-gradient(1100px 900px at 75% 50%, rgba(242,193,174,.28), transparent 62%),
          radial-gradient(900px 700px at 50% 55%, rgba(255,255,255,.75), rgba(255,255,255,.90)),
          linear-gradient(180deg, #F8F4FF, #FFF7F2)
        `,
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0"
      />

      {/* INTELLIGENCE title */}
      <div className="absolute inset-0 flex items-start justify-center pt-[88px] md:pt-24 lg:pt-32 pointer-events-none select-none overflow-hidden px-3 md:px-0 z-[2]">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center w-full"
          style={{
            fontWeight: 800,
            letterSpacing: "0.02em",
            fontSize: "clamp(72px, 10vw, 180px)",
            background: "linear-gradient(180deg, #2A1A6A, #5A67FF)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            opacity: 0.95,
            lineHeight: 0.92,
          }}
        >
          INTELLIGENCE
        </motion.h1>
      </div>
    </section>
  );
};

export default HeroSection;
