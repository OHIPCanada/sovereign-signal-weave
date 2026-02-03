import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import FloatingCard, { FloatingCardCTA } from "./FloatingCard";
import heroBlob from "@/assets/hero-blob-transparent.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Coral Stripes - Left */}
      <div className="absolute left-4 md:left-8 lg:left-16 top-0 bottom-0 w-14 md:w-20 lg:w-24 bg-gradient-coral" />
      
      {/* Coral Stripes - Right */}
      <div className="absolute right-4 md:right-8 lg:right-16 top-0 bottom-0 w-14 md:w-20 lg:w-24 bg-gradient-coral opacity-70" />

      {/* Super-Graphic Background Text - MASSIVE cropped typography like screenshot */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-foreground font-black uppercase leading-none"
          style={{
            fontSize: "clamp(180px, 28vw, 600px)",
            letterSpacing: "-0.04em",
            lineHeight: 0.82,
            opacity: 0.07,
          }}
        >
          SHARE
        </motion.h1>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 pt-20">
        {/* Central 3D Blob - The hero visual */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <img
              src={heroBlob}
              alt="AI Cognitive Visualization"
              className="w-[380px] md:w-[500px] lg:w-[620px] xl:w-[720px] h-auto object-contain float-gentle"
              style={{
                filter: "drop-shadow(0 30px 80px rgba(46, 42, 79, 0.12))",
              }}
            />
          </motion.div>
        </div>

        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute left-6 md:left-12 lg:left-28 top-[45%] -translate-y-1/2 max-w-[280px] md:max-w-[340px] z-20"
        >
          <p className="text-xs md:text-sm font-bold text-foreground uppercase tracking-wide leading-relaxed">
            A PLATFORM WHERE YOU CAN SEAMLESSLY SHARE MEDIA, LINKS, AND CONNECT WITH OTHERS ACROSS THE DIGITAL LANDSCAPE.
          </p>

          <div className="flex flex-wrap gap-3 mt-6 md:mt-8">
            <Button variant="primary" size="lg" className="text-xs md:text-sm">
              GET STARTED
            </Button>
            <Button variant="outline" size="lg" className="text-xs md:text-sm">
              MORE
            </Button>
          </div>

          {/* Stats - Bottom Left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="flex items-center gap-3 mt-12 md:mt-20"
          >
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-muted border-2 border-background overflow-hidden"
                  style={{
                    backgroundImage: `linear-gradient(135deg, hsl(30 20% 75%) 0%, hsl(30 15% 55%) 100%)`,
                  }}
                />
              ))}
            </div>
            <div>
              <p className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground tracking-tight">245K+</p>
              <p className="text-[9px] md:text-[10px] text-muted-foreground uppercase tracking-wider leading-tight">
                PEOPLE JOINED US AND<br />CHOOSE SIMPLICITY
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Content - Stats */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="absolute right-6 md:right-12 lg:right-28 top-[35%] text-right z-20 hidden md:block"
        >
          <p className="text-[10px] md:text-[11px] text-muted-foreground uppercase tracking-wider leading-relaxed max-w-[180px] ml-auto">
            OVER 5 MILLION GIGABYTES OF INFORMATION HAVE BEEN SHARED WORLDWIDE
          </p>
        </motion.div>

        {/* Floating Cards positioned around the blob */}
        <FloatingCard
          title="CollaborationTool"
          variant="default"
          className="absolute top-[38%] left-[36%] md:left-[40%] z-30 hidden lg:flex"
          delay={1}
        />

        <FloatingCard
          metric="65 Downloads"
          subtitle="12 Jan, 2023"
          trend="55%"
          variant="metric"
          className="absolute top-[58%] right-[22%] md:right-[26%] z-30 hidden lg:flex"
          delay={1.2}
        />

        <FloatingCard
          title="CloudStorageHub"
          variant="default"
          className="absolute bottom-[28%] left-[32%] md:left-[36%] z-30 hidden lg:flex"
          delay={1.4}
        />

        {/* Bottom Right CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="absolute bottom-10 right-6 md:right-12 lg:right-28 z-20 hidden lg:block"
        >
          <FloatingCardCTA
            text="FIND OUT MORE ABOUT THE POSSIBILITIES"
            delay={1.5}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
