import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import FloatingCard, { FloatingCardCTA } from "./FloatingCard";
import heroBlob from "@/assets/hero-blob.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Coral Stripes */}
      <div className="coral-stripe left-8 md:left-16 top-0 opacity-80" />
      <div className="coral-stripe right-8 md:right-16 top-0 opacity-60" />

      {/* Super-Graphic Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.08, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="super-graphic text-foreground"
        >
          INTELLIGENCE
        </motion.h1>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-4 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col gap-6 max-w-md"
          >
            <span className="mono-label">[ COGNITIVE INFRASTRUCTURE ]</span>
            
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight tracking-tight">
              A PLATFORM WHERE YOU CAN SEAMLESSLY DELIVER CARE, DATA, AND CONNECT WITH PATIENTS ACROSS THE DIGITAL LANDSCAPE.
            </h2>

            <div className="flex flex-wrap gap-4 mt-4">
              <Button variant="primary" size="lg">
                GET STARTED
              </Button>
              <Button variant="outline" size="lg">
                MORE
              </Button>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex items-center gap-4 mt-8"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-muted to-muted-foreground/20 border-2 border-background"
                  />
                ))}
              </div>
              <div>
                <p className="stat-number text-foreground">245K+</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  HEALTHCARE PROVIDERS JOINED
                  <br />
                  AND CHOOSE SIMPLICITY
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - 3D Visual */}
          <div className="relative flex items-center justify-center min-h-[500px] lg:min-h-[600px]">
            {/* Blob Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <img
                src={heroBlob}
                alt="AI Cognitive Brain Visualization"
                className="w-[350px] md:w-[450px] lg:w-[550px] h-auto object-contain float-gentle"
              />
              
              {/* Glow Effect Behind Blob */}
              <div className="absolute inset-0 -z-10 blur-3xl opacity-30 bg-gradient-radial from-accent/40 via-secondary/20 to-transparent" />
            </motion.div>

            {/* Floating Cards */}
            <FloatingCard
              title="EMR Integration"
              variant="default"
              className="absolute top-1/4 left-0 md:-left-4"
              delay={0.8}
            />

            <FloatingCard
              title="65 Consultations"
              subtitle="12 Jan, 2025"
              metric="65"
              trend="55%"
              variant="metric"
              className="absolute bottom-1/3 right-0 md:right-8"
              delay={1}
            />

            <FloatingCard
              title="PatientPortalHub"
              variant="default"
              className="absolute bottom-1/4 left-4 md:left-8"
              delay={1.2}
            />
          </div>
        </div>

        {/* Bottom Right CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="absolute bottom-8 right-6 md:right-12 hidden md:block"
        >
          <FloatingCardCTA
            text="FIND OUT MORE ABOUT THE POSSIBILITIES"
            delay={1.4}
          />
        </motion.div>

        {/* Right Side Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="absolute top-1/3 right-6 md:right-12 text-right hidden lg:block"
        >
          <p className="text-xs text-muted-foreground uppercase tracking-wide max-w-[180px] leading-relaxed">
            OVER 5 MILLION PATIENT RECORDS SECURED AND PROCESSED NATIONWIDE
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
