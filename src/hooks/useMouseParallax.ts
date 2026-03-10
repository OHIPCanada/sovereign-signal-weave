import { useRef, useEffect } from "react";
import { useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * Shared hook for mouse-follow parallax on hero orb images.
 * Returns containerRef and motion values for rotateX / rotateY.
 */
export function useMouseParallax(divisor = 25) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 150, damping: 15 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 15 });

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left - rect.width / 2) / divisor);
        mouseY.set((e.clientY - rect.top - rect.height / 2) / divisor);
      }
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [mouseX, mouseY, divisor]);

  const orbRotateX = useTransform(springY, [-20, 20], [8, -8]);
  const orbRotateY = useTransform(springX, [-20, 20], [-8, 8]);

  return { containerRef, orbRotateX, orbRotateY };
}
