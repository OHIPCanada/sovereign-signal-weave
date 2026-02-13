import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ManifestoSection from "@/components/ManifestoSection";
import PlatformSection from "@/components/PlatformSection";
import InterfaceSection from "@/components/InterfaceSection";
import TrustSection from "@/components/TrustSection";

const Index = () => {
  return (
    <div className="relative overflow-x-hidden">
      <Navigation />
      <HeroSection />
      <ManifestoSection />
      {/* Smooth transition from dark Intelligence Layer to light Platform Architecture */}
      <div
        className="relative h-32 md:h-48 -mt-1 -mb-1"
        style={{
          background: `linear-gradient(180deg, #1A0935 0%, #2A1B4A 20%, #5A3878 40%, #9A7098 55%, #C8A8B4 68%, #DCCCD0 78%, #E8E2EA 88%, #EEF2F6 100%)`,
        }}
      />
      <PlatformSection />
      <InterfaceSection />
      <TrustSection />
      
      {/* Footer */}
      <footer className="border-t border-border py-12" style={{ background: 'linear-gradient(180deg, #F0E8E4 0%, #EDE5E0 100%)' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-foreground">
                DOCG<span className="text-secondary">AI</span>
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            </div>
            <p className="text-sm text-muted-foreground">
              The Cognitive Infrastructure for Canadian Healthcare.
            </p>
            <p className="mono-label">
              © 2025 DocG AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
