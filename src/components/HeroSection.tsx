import { useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import HeroScene from "@/components/hero/HeroScene";

const HeroSection = () => {
  const isMobile = useIsMobile();
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );

    const onMove = (e: MouseEvent) =>
      setMouse({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });

    const onTouch = (e: TouchEvent) => {
      if (e.touches.length) {
        setMouse({
          x: e.touches[0].clientX / window.innerWidth,
          y: e.touches[0].clientY / window.innerHeight,
        });
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
    };
  }, []);

  return (
    <section
      className="relative min-h-screen overflow-hidden"
      style={{ background: "#080612" }}
    >
      {/* WebGL Canvas — cinematic particle field */}
      <div className="absolute inset-0">
        <Canvas
          gl={{
            antialias: false,
            alpha: false,
            powerPreference: "high-performance",
          }}
          camera={{ position: [0, 0, 5], fov: 60 }}
          dpr={[1, isMobile ? 1.5 : 2]}
        >
          <Suspense fallback={null}>
            <HeroScene
              mouseX={mouse.x}
              mouseY={mouse.y}
              isMobile={isMobile}
              reducedMotion={reducedMotion}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* INTELLIGENCE — HTML overlay (crisp, accessible, responsive) */}
      <div className="absolute inset-0 flex items-start justify-center pt-[10vh] pointer-events-none select-none z-10">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="hero-title text-center text-[clamp(64px,12vw,240px)] w-full"
        >
          INTELLIGENCE
        </motion.h1>
      </div>
    </section>
  );
};

export default HeroSection;
