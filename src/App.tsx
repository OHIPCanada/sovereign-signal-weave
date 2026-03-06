import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Company
import Overview from "./pages/company/Overview";
import Leadership from "./pages/company/Leadership";
import Careers from "./pages/company/Careers";

// Platform
import AICortex from "./pages/platform/AICortex";
import EMRLayer from "./pages/platform/EMRLayer";
import VirtualCare from "./pages/platform/VirtualCare";
import PatientAccess from "./pages/platform/PatientAccess";

// Infrastructure
import Deployment from "./pages/infrastructure/Deployment";
import Governance from "./pages/infrastructure/Governance";
import AuditTrails from "./pages/infrastructure/AuditTrails";
import Interoperability from "./pages/infrastructure/Interoperability";

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

          {/* Platform */}
          <Route path="/platform/ai-cortex" element={<AICortex />} />
          <Route path="/platform/emr-layer" element={<EMRLayer />} />
          <Route path="/platform/virtual-care" element={<VirtualCare />} />
          <Route path="/platform/patient-access" element={<PatientAccess />} />

          {/* Infrastructure */}
          <Route path="/infrastructure/deployment" element={<Deployment />} />
          <Route path="/infrastructure/governance" element={<Governance />} />
          <Route path="/infrastructure/audit-trails" element={<AuditTrails />} />
          <Route path="/infrastructure/interoperability" element={<Interoperability />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
