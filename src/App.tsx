import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CookieConsent from "./components/CookieConsent";

// Company
import Overview from "./pages/company/Overview";
import Leadership from "./pages/company/Leadership";
import Careers from "./pages/company/Careers";
import Contact from "./pages/company/Contact";

// Infrastructure
import Deployment from "./pages/infrastructure/Deployment";
import Governance from "./pages/infrastructure/Governance";
import AuditTrails from "./pages/infrastructure/AuditTrails";
import Interoperability from "./pages/infrastructure/Interoperability";

// Platform
import AICortex from "./pages/platform/AICortex";
import EMRLayer from "./pages/platform/EMRLayer";
import VirtualCare from "./pages/platform/VirtualCare";
import PatientAccess from "./pages/platform/PatientAccess";

// Legal
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import TermsOfService from "./pages/legal/TermsOfService";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />

          {/* Company */}
          <Route path="/company/overview" element={<Overview />} />
          <Route path="/company/leadership" element={<Leadership />} />
          <Route path="/company/careers" element={<Careers />} />
          <Route path="/company/contact" element={<Contact />} />

          {/* Infrastructure */}
          <Route path="/infrastructure/deployment" element={<Deployment />} />
          <Route path="/infrastructure/governance" element={<Governance />} />
          <Route path="/infrastructure/audit-trails" element={<AuditTrails />} />
          <Route path="/infrastructure/interoperability" element={<Interoperability />} />

          {/* Legal */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <CookieConsent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
