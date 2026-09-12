import { useEffect, useRef, useState, type ReactNode } from "react";

interface ScaledSlideProps {
  children: ReactNode;
  className?: string;
  label?: string;
}

const ScaledSlide = ({ children, className = "", label }: ScaledSlideProps) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const updateScale = () => {
      const width = frame.clientWidth;
      const height = frame.clientHeight;
      setScale(Math.min(width / 1920, height / 1080));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={frameRef} className="slide-frame" aria-label={label}>
      <div className={`slide-wrapper ${className}`} style={{ "--scale": scale } as React.CSSProperties}>
        {children}
      </div>
    </div>
  );
};

export default ScaledSlide;
