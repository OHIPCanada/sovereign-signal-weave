import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ManifestoSection from "@/components/ManifestoSection";
import PlatformSection from "@/components/PlatformSection";
import Section4SystemTransformation from "@/components/Section4SystemTransformation";
import ProofSection from "@/components/ProofSection";
import DeploymentSection from "@/components/DeploymentSection";
import InterfaceSection from "@/components/InterfaceSection";
import SovereigntySection from "@/components/SovereigntySection";
import SignalIntegritySection from "@/components/SignalIntegritySection";
import Section9_DeploymentSurfaces from "@/components/Section9_DeploymentSurfaces";

import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="relative overflow-x-hidden">
      <Navigation />
      <HeroSection />
      <ManifestoSection />
      <PlatformSection />
      <Section4SystemTransformation />
      <ProofSection />
      <DeploymentSection />
      <InterfaceSection />
      <SovereigntySection />
      <SignalIntegritySection />
      <Section9_DeploymentSurfaces />
      
      <Footer />
    </div>
  );
};

export default Index;
