import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden">
      
      {/* CSS-Only Atmospheric Background */}
      {/* Layer 1: Base - Soft lavender intelligence glow fading to clean white */}
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(60% 50% at 50% 40%, rgba(230, 230, 250, 0.6) 0%, rgba(248, 249, 252, 1) 65%)`
        }}
      />
      
      {/* Layer 2: Left ambient wash - intelligence presence */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, rgba(170, 160, 220, 0.25) 0%, rgba(170, 160, 220, 0.0) 35%)`
        }}
      />
      
      {/* Layer 3: Right coral wash - warmth + humanity (extremely restrained) */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(270deg, rgba(245, 195, 175, 0.35) 0%, rgba(245, 195, 175, 0.0) 40%)`
        }}
      />
      
      {/* Layer 4: Dotted signal field - NOT particles, soft and static */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(180, 170, 220, 0.15) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
          backgroundPosition: 'center'
        }}
      />

      {/* INTELLIGENCE - Background Text */}
      <div className="absolute inset-0 flex items-start justify-center pt-32 md:pt-40 lg:pt-48 pointer-events-none select-none overflow-hidden">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 900,
            fontSize: 'clamp(110px, 16vw, 200px)',
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            lineHeight: 0.92,
            background: 'linear-gradient(180deg, #2E1A6B 0%, #3C2A8E 50%, #4B5ED7 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent'
          }}
        >
          INTELLIGENCE
        </motion.h1>
      </div>

      {/* Abstract Intelligence Blob - Central volumetric form */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.svg
          viewBox="0 0 800 700"
          className="w-[500px] md:w-[650px] lg:w-[800px] h-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ overflow: "visible" }}
        >
          <defs>
            {/* Main blob gradient - deep violet core to lavender edge */}
            <radialGradient id="blobCore" cx="45%" cy="40%" r="55%">
              <stop offset="0%" stopColor="rgba(75, 55, 130, 0.85)" />
              <stop offset="35%" stopColor="rgba(100, 80, 160, 0.65)" />
              <stop offset="60%" stopColor="rgba(140, 120, 190, 0.45)" />
              <stop offset="85%" stopColor="rgba(180, 165, 220, 0.25)" />
              <stop offset="100%" stopColor="rgba(200, 190, 235, 0.1)" />
            </radialGradient>

            {/* Inner depth layer - creates volumetric feel */}
            <radialGradient id="blobInner" cx="55%" cy="55%" r="50%">
              <stop offset="0%" stopColor="rgba(90, 70, 150, 0.7)" />
              <stop offset="50%" stopColor="rgba(120, 100, 175, 0.35)" />
              <stop offset="100%" stopColor="rgba(160, 145, 200, 0)" />
            </radialGradient>

            {/* Cool blue highlight */}
            <radialGradient id="blueHighlight" cx="30%" cy="30%" r="40%">
              <stop offset="0%" stopColor="rgba(140, 160, 210, 0.4)" />
              <stop offset="60%" stopColor="rgba(140, 160, 210, 0.1)" />
              <stop offset="100%" stopColor="rgba(140, 160, 210, 0)" />
            </radialGradient>

            {/* Subtle coral warmth - very minimal */}
            <radialGradient id="coralWarmth" cx="65%" cy="60%" r="35%">
              <stop offset="0%" stopColor="rgba(220, 170, 160, 0.15)" />
              <stop offset="100%" stopColor="rgba(220, 170, 160, 0)" />
            </radialGradient>

            {/* Soft internal glow filter */}
            <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="15" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Glass surface blur */}
            <filter id="glassBlur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
          </defs>

          {/* Outer glow - soft internal illumination */}
          <motion.ellipse
            cx={400}
            cy={370}
            rx={220}
            ry={200}
            fill="rgba(160, 145, 210, 0.2)"
            filter="url(#softGlow)"
            animate={{
              rx: [220, 230, 220],
              ry: [200, 210, 200],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Main blob shape - organic but controlled */}
          <motion.path
            d="M400 120
               C520 120, 620 180, 660 280
               C700 380, 680 480, 620 550
               C560 620, 480 660, 400 660
               C320 660, 240 620, 180 550
               C120 480, 100 380, 140 280
               C180 180, 280 120, 400 120Z"
            fill="url(#blobCore)"
            animate={{
              d: [
                "M400 120 C520 120, 620 180, 660 280 C700 380, 680 480, 620 550 C560 620, 480 660, 400 660 C320 660, 240 620, 180 550 C120 480, 100 380, 140 280 C180 180, 280 120, 400 120Z",
                "M400 115 C525 118, 625 185, 665 285 C705 385, 685 485, 625 555 C565 625, 485 665, 400 665 C315 665, 235 625, 175 555 C115 485, 95 385, 135 285 C175 185, 275 118, 400 115Z",
                "M400 120 C520 120, 620 180, 660 280 C700 380, 680 480, 620 550 C560 620, 480 660, 400 660 C320 660, 240 620, 180 550 C120 480, 100 380, 140 280 C180 180, 280 120, 400 120Z"
              ]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Inner depth layer - layered fold effect */}
          <motion.path
            d="M400 160
               C500 165, 580 210, 610 290
               C640 370, 625 450, 580 510
               C535 570, 470 600, 400 600
               C330 600, 265 570, 220 510
               C175 450, 160 370, 190 290
               C220 210, 300 165, 400 160Z"
            fill="url(#blobInner)"
            animate={{
              d: [
                "M400 160 C500 165, 580 210, 610 290 C640 370, 625 450, 580 510 C535 570, 470 600, 400 600 C330 600, 265 570, 220 510 C175 450, 160 370, 190 290 C220 210, 300 165, 400 160Z",
                "M400 165 C495 168, 575 215, 605 295 C635 375, 620 455, 575 515 C530 575, 465 605, 400 605 C335 605, 270 575, 225 515 C180 455, 165 375, 195 295 C225 215, 305 168, 400 165Z",
                "M400 160 C500 165, 580 210, 610 290 C640 370, 625 450, 580 510 C535 570, 470 600, 400 600 C330 600, 265 570, 220 510 C175 450, 160 370, 190 290 C220 210, 300 165, 400 160Z"
              ]
            }}
            transition={{
              duration: 15,
              delay: 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Cool blue highlight region */}
          <motion.ellipse
            cx={320}
            cy={280}
            rx={120}
            ry={100}
            fill="url(#blueHighlight)"
            animate={{
              cx: [320, 330, 320],
              cy: [280, 290, 280],
              opacity: [0.6, 0.8, 0.6]
            }}
            transition={{
              duration: 12,
              delay: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Coral warmth - very subtle */}
          <motion.ellipse
            cx={480}
            cy={450}
            rx={90}
            ry={80}
            fill="url(#coralWarmth)"
            animate={{
              opacity: [0.5, 0.7, 0.5]
            }}
            transition={{
              duration: 14,
              delay: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Internal flow lines - data processing currents */}
          <g opacity={0.35}>
            {/* Flow line 1 */}
            <motion.path
              d="M280 300 Q350 280, 420 320 Q490 360, 520 420"
              fill="none"
              stroke="rgba(140, 120, 180, 0.5)"
              strokeWidth={2}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: [0, 1, 1, 0],
                opacity: [0, 0.5, 0.5, 0]
              }}
              transition={{
                duration: 10,
                delay: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Flow line 2 */}
            <motion.path
              d="M500 250 Q450 300, 380 340 Q310 380, 280 450"
              fill="none"
              stroke="rgba(130, 110, 170, 0.4)"
              strokeWidth={1.5}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: [0, 1, 1, 0],
                opacity: [0, 0.4, 0.4, 0]
              }}
              transition={{
                duration: 12,
                delay: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Flow line 3 */}
            <motion.path
              d="M320 420 Q380 400, 440 430 Q500 460, 530 520"
              fill="none"
              stroke="rgba(150, 130, 190, 0.45)"
              strokeWidth={1.5}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: [0, 1, 1, 0],
                opacity: [0, 0.45, 0.45, 0]
              }}
              transition={{
                duration: 11,
                delay: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Flow line 4 - crossing current */}
            <motion.path
              d="M250 380 Q320 360, 400 380 Q480 400, 550 370"
              fill="none"
              stroke="rgba(145, 125, 185, 0.35)"
              strokeWidth={1.5}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: [0, 1, 1, 0],
                opacity: [0, 0.35, 0.35, 0]
              }}
              transition={{
                duration: 13,
                delay: 7,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Flow line 5 - vertical current */}
            <motion.path
              d="M400 200 Q420 280, 400 360 Q380 440, 400 520"
              fill="none"
              stroke="rgba(135, 115, 175, 0.3)"
              strokeWidth={2}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: [0, 1, 1, 0],
                opacity: [0, 0.3, 0.3, 0]
              }}
              transition={{
                duration: 14,
                delay: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </g>

          {/* Glass surface highlight - top edge reflection */}
          <motion.ellipse
            cx={360}
            cy={200}
            rx={100}
            ry={40}
            fill="rgba(220, 215, 240, 0.25)"
            filter="url(#glassBlur)"
            animate={{
              opacity: [0.2, 0.35, 0.2],
              ry: [40, 45, 40]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Deep core - innermost layer for depth */}
          <motion.ellipse
            cx={400}
            cy={380}
            rx={80}
            ry={70}
            fill="rgba(70, 50, 120, 0.5)"
            animate={{
              rx: [80, 85, 80],
              ry: [70, 75, 70],
              opacity: [0.5, 0.6, 0.5]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.svg>
      </div>

      {/* Breathing internal glow - soft illumination from within */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 1.2 }}
      >
        <motion.div
          className="w-[280px] h-[260px] md:w-[380px] md:h-[350px] rounded-full"
          style={{
            background: "radial-gradient(ellipse at center, rgba(130, 110, 180, 0.2) 0%, rgba(150, 130, 200, 0.08) 50%, transparent 75%)",
            filter: "blur(50px)"
          }}
          animate={{
            scale: [1, 1.06, 1],
            opacity: [0.35, 0.5, 0.35]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
