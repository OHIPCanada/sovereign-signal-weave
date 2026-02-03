import { motion } from "framer-motion";
import { ArrowUpRight, TrendingUp } from "lucide-react";

interface FloatingCardProps {
  title: string;
  subtitle?: string;
  metric?: string;
  trend?: string;
  variant?: "default" | "metric" | "cta";
  className?: string;
  delay?: number;
}

const FloatingCard = ({
  title,
  subtitle,
  metric,
  trend,
  variant = "default",
  className = "",
  delay = 0,
}: FloatingCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`floating-card flex items-center gap-3 ${className}`}
    >
      {variant === "default" && (
        <>
          <span className="text-sm font-medium text-foreground">{title}</span>
          <span className="connection-dot" />
        </>
      )}

      {variant === "metric" && (
        <div className="flex flex-col">
          <span className="text-lg font-bold text-foreground">{metric}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{subtitle}</span>
            {trend && (
              <span className="flex items-center gap-1 text-xs font-medium text-accent">
                {trend}
                <TrendingUp className="w-3 h-3" />
              </span>
            )}
          </div>
        </div>
      )}

      {variant === "cta" && (
        <div className="flex items-center justify-between w-full">
          <span className="text-xs text-muted-foreground">•</span>
          <div className="flex items-center gap-2">
            <ArrowUpRight className="w-4 h-4 text-foreground" />
          </div>
        </div>
      )}
    </motion.div>
  );
};

interface FloatingCardCTAProps {
  text: string;
  className?: string;
  delay?: number;
}

export const FloatingCardCTA = ({
  text,
  className = "",
  delay = 0,
}: FloatingCardCTAProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`floating-card group cursor-pointer ${className}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-sm font-semibold text-foreground uppercase tracking-wide leading-tight max-w-[160px]">
            {text}
          </span>
        </div>
        <ArrowUpRight className="w-5 h-5 text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </div>
    </motion.div>
  );
};

export default FloatingCard;
