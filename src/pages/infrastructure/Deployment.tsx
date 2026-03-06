import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Deployment = () => (
  <div className="relative overflow-x-hidden">
    <Navigation />
    <section className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-[min(1200px,92vw)] mx-auto">
        <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-accent mb-4">Infrastructure</p>
        <h1 className="text-[clamp(36px,5vw,64px)] font-bold leading-[1.1] tracking-tight text-foreground mb-6">
          Deployment
        </h1>
        <p className="text-muted-foreground text-lg max-w-[46ch] leading-relaxed">
          Flexible deployment options designed for Canadian healthcare — on-premise, hybrid cloud, and sovereign infrastructure configurations.
        </p>
      </div>
    </section>
    <Footer />
  </div>
);

export default Deployment;
