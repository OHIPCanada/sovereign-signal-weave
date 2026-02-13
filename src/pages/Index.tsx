import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ManifestoSection from "@/components/ManifestoSection";
import PlatformSection from "@/components/PlatformSection";
import CapabilitiesSection from "@/components/CapabilitiesSection";
import InterfaceSection from "@/components/InterfaceSection";
import TrustSection from "@/components/TrustSection";

const Index = () => {
  return (
    <div className="relative overflow-x-hidden">
      <Navigation />
      <HeroSection />
      <ManifestoSection />
      <PlatformSection />
      <CapabilitiesSection />
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
