import { useRef, useEffect, useCallback } from "react";

/**
 * Shared hook for canvas-based hero animations.
 * Handles DPR scaling, resize, and the requestAnimationFrame loop.
 */
export type DrawFn = (
  ctx: CanvasRenderingContext2D,
  t: number,
  w: number,
  h: number,
  dpr: number,
) => void;

export interface UseCanvasAnimationOptions {
  /** Called once after first resize — use to create particles, etc. */
  init?: (w: number, h: number, dpr: number) => void;
}

export function useCanvasAnimation(
  draw: DrawFn,
  options?: UseCanvasAnimationOptions,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const initRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const DPR = Math.min(2, window.devicePixelRatio || 1);

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * DPR;
      canvas.height = r.height * DPR;
      if (!initRef.current && options?.init) {
        options.init(canvas.width, canvas.height, DPR);
        initRef.current = true;
      }
    };
    resize();
    window.addEventListener("resize", resize);

    let raf: number;
    const t0 = performance.now();

    const loop = (now: number) => {
      const t = (now - t0) / 1000;
      const w = canvas.width;
      const h = canvas.height;
      if (w === 0 || h === 0) {
        raf = requestAnimationFrame(loop);
        return;
      }
      ctx.clearRect(0, 0, w, h);
      draw(ctx, t, w, h, DPR);
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [draw, options]);

  return canvasRef;
}
