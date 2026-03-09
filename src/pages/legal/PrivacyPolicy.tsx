import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const lastUpdated = "March 9, 2026";

const PrivacyPolicy = () => (
  <div className="relative overflow-x-hidden">
    <Navigation />

    {/* Hero */}
    <section
      className="relative pt-32 pb-16 md:pt-40 md:pb-20"
      style={{
        background:
          "linear-gradient(180deg, var(--mistTop) 0%, var(--mistMid) 60%, var(--mistBot) 100%)",
      }}
    >
      <div className="mx-auto" style={{ width: "min(820px, 90vw)" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p
            className="font-mono uppercase tracking-[0.2em] mb-4"
            style={{ fontSize: 12, color: "var(--coral-mid)" }}
          >
            Legal
          </p>
          <h1
            style={{
              fontSize: "clamp(32px, 4vw, 48px)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
            className="text-foreground"
          >
            Privacy Policy
          </h1>
          <p className="mt-4 text-muted-foreground" style={{ fontSize: 15 }}>
            Last updated: {lastUpdated}
          </p>
        </motion.div>
      </div>
    </section>

    {/* Body */}
    <section className="py-16 md:py-24 bg-background">
      <div
        className="mx-auto prose-container"
        style={{ width: "min(820px, 90vw)" }}
      >
        <div className="space-y-10 text-foreground/80" style={{ fontSize: 15, lineHeight: 1.85 }}>

          {/* 1 */}
          <div>
            <h2 className="text-foreground font-bold text-lg mb-3">1. Introduction</h2>
            <p>
              DocG AI Inc. ("<strong>DocG AI</strong>," "<strong>we</strong>," "<strong>us</strong>," or "<strong>our</strong>") is a Canadian corporation headquartered in Ontario. We develop clinical intelligence infrastructure for healthcare providers. This Privacy Policy explains how we collect, use, disclose, retain, and safeguard personal information and personal health information ("<strong>PHI</strong>") in accordance with the <em>Personal Information Protection and Electronic Documents Act</em> (PIPEDA, S.C. 2000, c. 5), Ontario's <em>Personal Health Information Protection Act, 2004</em> (PHIPA, S.O. 2004, c. 3, Sch. A), and Canada's <em>Anti-Spam Legislation</em> (CASL, S.C. 2010, c. 23).
            </p>
          </div>

          {/* 2 */}
          <div>
            <h2 className="text-foreground font-bold text-lg mb-3">2. Scope</h2>
            <p>
              This policy applies to information collected through our website (docg.ai), our platform and services, communications with us, and any interactions where we act as a service provider to Health Information Custodians ("<strong>HICs</strong>") under PHIPA. When we process PHI on behalf of an HIC, we act as an agent under PHIPA and are bound by the HIC's obligations.
            </p>
          </div>

          {/* 3 */}
          <div>
            <h2 className="text-foreground font-bold text-lg mb-3">3. Information We Collect</h2>
            <p className="mb-3">We may collect the following categories of information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Identity & Contact Information:</strong> Name, email address, phone number, professional credentials, and organizational affiliation.</li>
              <li><strong>Account & Usage Data:</strong> Login credentials, IP address, browser type, device identifiers, pages visited, features used, and session duration.</li>
              <li><strong>Personal Health Information (PHI):</strong> When processed through our platform on behalf of an HIC, this may include patient demographics, clinical notes, diagnostic data, treatment records, and scheduling information — strictly as defined under PHIPA s. 4(1).</li>
              <li><strong>Communications:</strong> Correspondence sent to us, support requests, and feedback.</li>
              <li><strong>Cookies & Analytics:</strong> We use strictly necessary and analytics cookies. See Section 11.</li>
            </ul>
          </div>

          {/* 4 */}
          <div>
            <h2 className="text-foreground font-bold text-lg mb-3">4. PIPEDA's 10 Fair Information Principles</h2>
            <p className="mb-3">
              We comply with all ten principles set out in Schedule 1 of PIPEDA:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li><strong>Accountability:</strong> Our Privacy Officer is responsible for compliance. Contact details are in Section 15.</li>
              <li><strong>Identifying Purposes:</strong> We identify the purpose for collection at or before the time of collection.</li>
              <li><strong>Consent:</strong> We obtain meaningful consent. For PHI processed as an agent under PHIPA, consent is managed by the HIC.</li>
              <li><strong>Limiting Collection:</strong> We collect only what is necessary for the identified purposes.</li>
              <li><strong>Limiting Use, Disclosure, and Retention:</strong> Information is used only for stated purposes and retained only as long as necessary.</li>
              <li><strong>Accuracy:</strong> We take reasonable steps to ensure information is accurate, complete, and up-to-date.</li>
              <li><strong>Safeguards:</strong> We protect information with security measures proportionate to sensitivity (see Section 8).</li>
              <li><strong>Openness:</strong> Our policies and practices are publicly available through this document.</li>
              <li><strong>Individual Access:</strong> You have the right to access and request correction of your information (see Section 10).</li>
              <li><strong>Challenging Compliance:</strong> You may challenge our compliance through our Privacy Officer or the Office of the Privacy Commissioner of Canada.</li>
            </ol>
          </div>

          {/* 5 */}
          <div>
            <h2 className="text-foreground font-bold text-lg mb-3">5. PHIPA Compliance — Personal Health Information</h2>
            <p className="mb-3">
              When DocG AI processes PHI on behalf of Health Information Custodians in Ontario:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>We act as an <strong>agent</strong> of the HIC and process PHI solely under their authority and instructions (PHIPA s. 17).</li>
              <li>We enter into written agreements with each HIC specifying permissible uses, security obligations, and breach notification procedures.</li>
              <li>We implement <strong>dual-layer de-identification</strong> (Presidio NLP + Regex) before any data reaches AI processing layers, ensuring <strong>zero PHI leakage to large language models</strong>.</li>
              <li>All PHI is processed and stored exclusively within <strong>Canadian data centres</strong> (AWS ca-central-1), satisfying PHIPA s. 10(3) data residency expectations.</li>
              <li>Our platform generates <strong>immutable audit trails</strong> for every access, use, and disclosure of PHI, supporting HICs' obligations under PHIPA ss. 10(1)–10(3).</li>
              <li>We notify the HIC and the Information and Privacy Commissioner of Ontario (IPC) of any privacy breach involving PHI at the first reasonable opportunity, as required by PHIPA s. 12(2).</li>
              <li>We support the <strong>IPC's 2025 AI Scribe Guidance</strong> requirements including transparency, human oversight, and privacy impact assessments for AI-assisted clinical tools.</li>
            </ul>
          </div>

          {/* 6 */}
          <div>
            <h2 className="text-foreground font-bold text-lg mb-3">6. How We Use Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide, operate, and improve our platform and services.</li>
              <li>To process PHI on behalf of HICs, strictly within the scope of our agent relationship.</li>
              <li>To communicate with you about your account, support requests, or service updates.</li>
              <li>To conduct analytics and improve platform performance (using aggregated, de-identified data only).</li>
              <li>To comply with legal obligations and enforce our agreements.</li>
              <li>To detect, prevent, and address security incidents or fraud.</li>
            </ul>
          </div>

          {/* 7 */}
          <div>
            <h2 className="text-foreground font-bold text-lg mb-3">7. Disclosure of Information</h2>
            <p className="mb-3">We do not sell, rent, or trade personal information. We may disclose information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Health Information Custodians:</strong> As required under our agent agreements.</li>
              <li><strong>Service Providers:</strong> Third-party processors bound by written confidentiality agreements and operating within Canada (e.g., AWS Canada).</li>
              <li><strong>Legal Authorities:</strong> When required by law, court order, or to protect the rights, safety, or property of DocG AI or others.</li>
              <li><strong>With Consent:</strong> When you have provided explicit consent for a specific disclosure.</li>
            </ul>
            <p className="mt-3">
              <strong>We do not transfer personal information or PHI outside Canada</strong> unless explicitly authorized by the individual or HIC and compliant with PIPEDA's cross-border transfer requirements.
            </p>
          </div>

          {/* 8 */}
          <div>
            <h2 className="text-foreground font-bold text-lg mb-3">8. Data Security & Safeguards</h2>
            <p className="mb-3">We employ administrative, technical, and physical safeguards including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Encryption at rest (AES-256) and in transit (TLS 1.2+).</li>
              <li>Dual-layer PHI de-identification (Presidio NLP + Regex pattern matching).</li>
              <li>AWS Bedrock Guardrails and S3 Object Lambda for on-the-fly redaction.</li>
              <li>Role-based access controls and multi-factor authentication.</li>
              <li>Regular penetration testing and vulnerability assessments.</li>
              <li>Immutable, timestamped audit logs for all data access events.</li>
              <li>All infrastructure hosted in AWS ca-central-1 (Canada) region.</li>
            </ul>
          </div>

          {/* 9 */}
          <div>
            <h2 className="text-foreground font-bold text-lg mb-3">9. Data Retention</h2>
            <p>
              We retain personal information only as long as necessary to fulfill the purposes for which it was collected, or as required by law. PHI processed on behalf of HICs is retained and disposed of in accordance with the HIC's retention schedule and PHIPA requirements. When information is no longer needed, it is securely destroyed or de-identified.
            </p>
          </div>

          {/* 10 */}
          <div>
            <h2 className="text-foreground font-bold text-lg mb-3">10. Your Rights</h2>
            <p className="mb-3">Under PIPEDA and, where applicable, PHIPA, you have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Access:</strong> Request access to your personal information or PHI held by us.</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information.</li>
              <li><strong>Withdraw Consent:</strong> Withdraw your consent to the collection, use, or disclosure of your information, subject to legal or contractual restrictions.</li>
              <li><strong>Complaint:</strong> File a complaint with our Privacy Officer or the Office of the Privacy Commissioner of Canada (OPC). For PHI matters in Ontario, you may also contact the Information and Privacy Commissioner of Ontario (IPC).</li>
            </ul>
            <p className="mt-3">
              We will respond to access and correction requests within <strong>30 calendar days</strong>, as required by PIPEDA. If an extension is necessary, we will notify you of the reason and expected timeline.
            </p>
          </div>

          {/* 11 */}
          <div>
            <h2 className="text-foreground font-bold text-lg mb-3">11. Cookies & Tracking Technologies</h2>
            <p>
              Our website uses strictly necessary cookies for site functionality and optional analytics cookies to understand usage patterns. Analytics data is aggregated and does not identify individuals. You may disable non-essential cookies through your browser settings. We do not use cookies to track users across third-party websites and we do not serve targeted advertising.
            </p>
          </div>

          {/* 12 */}
          <div>
            <h2 className="text-foreground font-bold text-lg mb-3">12. AI & Automated Decision-Making Transparency</h2>
            <p>
              DocG AI's platform uses artificial intelligence for clinical decision support, documentation assistance, and operational optimization. In accordance with emerging Canadian guidance on responsible AI in healthcare:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>AI outputs are provided as <strong>decision support only</strong> — final clinical decisions rest with qualified healthcare professionals.</li>
              <li>PHI is de-identified before reaching any AI model; <strong>no raw PHI is exposed to large language models</strong>.</li>
              <li>We conduct <strong>Privacy Impact Assessments (PIAs)</strong> and <strong>Threat Risk Assessments (TRAs)</strong> for AI features that process health data.</li>
              <li>We maintain human oversight mechanisms and provide transparency about when AI is used in clinical workflows.</li>
            </ul>
          </div>

          {/* 13 */}
          <div>
            <h2 className="text-foreground font-bold text-lg mb-3">13. CASL Compliance</h2>
            <p>
              We comply with Canada's Anti-Spam Legislation (CASL). We will only send commercial electronic messages with your express or implied consent. Every message includes a clear unsubscribe mechanism, our contact information, and identification of the sender. You may withdraw consent at any time by clicking "unsubscribe" or contacting us directly.
            </p>
          </div>

          {/* 14 */}
          <div>
            <h2 className="text-foreground font-bold text-lg mb-3">14. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Material changes will be communicated through our website or by email. The "Last updated" date at the top of this page reflects the most recent revision. Continued use of our services after changes constitutes acceptance of the revised policy.
            </p>
          </div>

          {/* 15 */}
          <div>
            <h2 className="text-foreground font-bold text-lg mb-3">15. Contact Us</h2>
            <p className="mb-3">
              For privacy inquiries, access requests, or complaints, contact our Privacy Officer:
            </p>
            <div
              className="rounded-xl p-6"
              style={{
                background: "rgba(120,150,210,0.08)",
                border: "1px solid rgba(120,150,210,0.15)",
              }}
            >
              <p className="font-semibold text-foreground">DocG AI Inc. — Privacy Officer</p>
              <p className="mt-1">Email: <a href="mailto:privacy@docg.ai" className="text-accent hover:underline">privacy@docg.ai</a></p>
              <p className="mt-1">General Inquiries: <a href="mailto:hello@docg.ai" className="text-accent hover:underline">hello@docg.ai</a></p>
              <p className="mt-4 text-sm text-muted-foreground">
                You may also file a complaint with the <a href="https://www.priv.gc.ca" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Office of the Privacy Commissioner of Canada</a> or the <a href="https://www.ipc.on.ca" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Information and Privacy Commissioner of Ontario</a>.
              </p>
            </div>
          </div>

          {/* Governing Law */}
          <div>
            <h2 className="text-foreground font-bold text-lg mb-3">16. Governing Law</h2>
            <p>
              This Privacy Policy is governed by and construed in accordance with the laws of the Province of Ontario and the federal laws of Canada applicable therein.
            </p>
          </div>

        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default PrivacyPolicy;
