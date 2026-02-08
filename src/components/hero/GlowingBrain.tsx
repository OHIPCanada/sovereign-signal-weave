import { motion } from "framer-motion";

const GlowingBrain = () => {
  return (
    <motion.svg
      viewBox="0 0 300 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-[220px] md:w-[280px] lg:w-[320px] h-auto"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <defs>
        {/* Head glow */}
        <radialGradient id="head-glow" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="rgba(123, 97, 255, 0.25)" />
          <stop offset="60%" stopColor="rgba(123, 97, 255, 0.08)" />
          <stop offset="100%" stopColor="rgba(123, 97, 255, 0)" />
        </radialGradient>
        {/* Brain glow */}
        <radialGradient id="brain-glow" cx="50%" cy="45%" r="40%">
          <stop offset="0%" stopColor="rgba(46, 230, 214, 0.3)" />
          <stop offset="50%" stopColor="rgba(123, 97, 255, 0.15)" />
          <stop offset="100%" stopColor="rgba(123, 97, 255, 0)" />
        </radialGradient>
        {/* Outer aura */}
        <filter id="aura-blur">
          <feGaussianBlur stdDeviation="20" />
        </filter>
        <filter id="brain-blur">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <linearGradient id="head-stroke" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="rgba(123, 97, 255, 0.6)" />
          <stop offset="50%" stopColor="rgba(46, 230, 214, 0.4)" />
          <stop offset="100%" stopColor="rgba(123, 97, 255, 0.2)" />
        </linearGradient>
        <linearGradient id="brain-stroke" x1="30%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor="rgba(46, 230, 214, 0.7)" />
          <stop offset="50%" stopColor="rgba(123, 97, 255, 0.5)" />
          <stop offset="100%" stopColor="rgba(46, 230, 214, 0.3)" />
        </linearGradient>
      </defs>

      {/* Outer aura glow */}
      <ellipse cx="150" cy="160" rx="120" ry="130" fill="url(#head-glow)" filter="url(#aura-blur)">
        <animate attributeName="rx" values="120;130;120" dur="6s" repeatCount="indefinite" />
        <animate attributeName="ry" values="130;140;130" dur="6s" repeatCount="indefinite" />
      </ellipse>

      {/* Head silhouette */}
      <path
        d="M 150,30 
           C 210,30 260,70 265,130 
           C 268,165 255,195 240,220 
           C 230,238 225,255 225,275 
           L 225,310 
           C 225,325 215,335 200,335 
           L 100,335 
           C 85,335 75,325 75,310 
           L 75,275 
           C 75,255 70,238 60,220 
           C 45,195 32,165 35,130 
           C 40,70 90,30 150,30 Z"
        fill="none"
        stroke="url(#head-stroke)"
        strokeWidth="1.5"
        opacity="0.8"
      />

      {/* Neck */}
      <path
        d="M 110,335 L 110,370 M 190,335 L 190,370"
        stroke="url(#head-stroke)"
        strokeWidth="1.2"
        opacity="0.5"
      />
      <line x1="105" y1="370" x2="195" y2="370" stroke="url(#head-stroke)" strokeWidth="1.2" opacity="0.4" />

      {/* Brain inner glow */}
      <ellipse cx="150" cy="140" rx="75" ry="80" fill="url(#brain-glow)" filter="url(#brain-blur)" />

      {/* Brain — left hemisphere */}
      <path
        d="M 150,70 
           C 130,70 105,80 95,100 
           C 85,120 82,145 90,165 
           C 95,178 105,188 110,200 
           C 118,218 130,225 150,225"
        fill="none"
        stroke="url(#brain-stroke)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.9"
      />
      {/* Left folds */}
      <path d="M 100,110 C 115,115 130,108 140,100" fill="none" stroke="url(#brain-stroke)" strokeWidth="1" opacity="0.6" strokeLinecap="round" />
      <path d="M 92,140 C 110,148 130,140 145,132" fill="none" stroke="url(#brain-stroke)" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
      <path d="M 95,170 C 112,175 132,168 148,160" fill="none" stroke="url(#brain-stroke)" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
      <path d="M 108,195 C 120,200 138,195 150,188" fill="none" stroke="url(#brain-stroke)" strokeWidth="1" opacity="0.4" strokeLinecap="round" />

      {/* Brain — right hemisphere */}
      <path
        d="M 150,70 
           C 170,70 195,80 205,100 
           C 215,120 218,145 210,165 
           C 205,178 195,188 190,200 
           C 182,218 170,225 150,225"
        fill="none"
        stroke="url(#brain-stroke)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.9"
      />
      {/* Right folds */}
      <path d="M 200,110 C 185,115 170,108 160,100" fill="none" stroke="url(#brain-stroke)" strokeWidth="1" opacity="0.6" strokeLinecap="round" />
      <path d="M 208,140 C 190,148 170,140 155,132" fill="none" stroke="url(#brain-stroke)" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
      <path d="M 205,170 C 188,175 168,168 152,160" fill="none" stroke="url(#brain-stroke)" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
      <path d="M 192,195 C 180,200 162,195 150,188" fill="none" stroke="url(#brain-stroke)" strokeWidth="1" opacity="0.4" strokeLinecap="round" />

      {/* Central fissure */}
      <line x1="150" y1="70" x2="150" y2="225" stroke="url(#brain-stroke)" strokeWidth="1.2" opacity="0.7" />

      {/* Pulsing neural nodes */}
      {[
        { cx: 120, cy: 105 },
        { cx: 180, cy: 105 },
        { cx: 105, cy: 145 },
        { cx: 195, cy: 145 },
        { cx: 115, cy: 180 },
        { cx: 185, cy: 180 },
        { cx: 150, cy: 130 },
      ].map((node, i) => (
        <circle key={i} cx={node.cx} cy={node.cy} r="2.5" fill="rgba(46, 230, 214, 0.8)">
          <animate
            attributeName="opacity"
            values="0.4;1;0.4"
            dur={`${2.5 + i * 0.4}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="r"
            values="2;3.5;2"
            dur={`${2.5 + i * 0.4}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </motion.svg>
  );
};

export default GlowingBrain;
