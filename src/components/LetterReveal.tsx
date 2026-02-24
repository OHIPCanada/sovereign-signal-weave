import React, { useRef, useEffect, useState } from "react";
import { useInView } from "framer-motion";

/**
 * Buzzworthy-inspired scroll-triggered letter-spacing text reveal.
 * Letters start widely spaced and compress to normal on scroll.
 */
interface LetterRevealProps {
  text: string;
  as?: "h2" | "h3" | "p" | "span" | "div";
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
}

export default function LetterReveal({
  text,
  as: Tag = "div",
  className = "",
  style = {},
  delay = 0,
}: LetterRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, amount: 0.4 });
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (inView) {
      const timeout = setTimeout(() => setTriggered(true), delay * 1000);
      return () => clearTimeout(timeout);
    }
  }, [inView, delay]);

  return (
    <Tag
      ref={ref as any}
      className={className}
      style={{
        ...style,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: style.textAlign === "center" ? "center" : "flex-start",
        gap: 0,
        overflow: "hidden",
      }}
    >
      {text.split("").map((char, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            letterSpacing: triggered ? "-0.02em" : "0.35em",
            opacity: triggered ? 1 : 0,
            transform: triggered ? "translateY(0)" : "translateY(12px)",
            transition: `all 0.7s cubic-bezier(.22,.65,.3,1) ${i * 0.025}s`,
            whiteSpace: char === " " ? "pre" : undefined,
          }}
        >
          {char}
        </span>
      ))}
    </Tag>
  );
}
