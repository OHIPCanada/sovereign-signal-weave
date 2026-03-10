import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { motion } from "framer-motion";

const lastUpdated = "March 9, 2026";

const TermsOfService = () => (
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
            Terms of Service
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
            <h2 className="text-foreground font-bold text-lg mb-3">1. Agreement to Terms</h2>
            <p>
              These Terms of Service ("<strong>Terms</strong>") constitute a legally binding agreement between you ("<strong>User</strong>," "<strong>you</strong>," or "<strong>your</strong>") and DocG AI Inc. ("<strong>DocG AI</strong>," "<strong>we</strong>," "<strong>us</strong>," or "<strong>our</strong>"), a corporation incorporated under the laws of Ontario, Canada. By accessing or using our website, platform, or services (collectively, the "<strong>Services</strong>"), you agree to be bound by these Terms, our <a href="/privacy" className="text-accent hover:underline">Privacy Policy</a>, and any additional terms referenced herein.
            </p>
            <p className="mt-3">
              If you do not agree with these Terms, you must discontinue use of the Services immediately. If you are using the Services on behalf of an organization, you represent that you have authority to bind that organization to these Terms.
            </p>
          </div>

          {/* 2 */}
          <div>
            <h2 className="text-foreground font-bold text-lg mb-3">2. Eligibility</h2>
            <p>
              You must be at least 18 years of age and have the legal capacity to enter into binding contracts under the laws of the Province of Ontario. If you are accessing the Services as a healthcare professional, you represent that you hold valid credentials and are authorized to practice in your jurisdiction.
            </p>
          </div>

          {/* 3 */}
          <div>
            <h2 className="text-foreground font-bold text-lg mb-3">3. Description of Services</h2>
            <p>
              DocG AI provides clinical intelligence infrastructure, including AI-powered decision support, electronic medical record (EMR) integration, care coordination, scheduling, and related healthcare technology services. Our platform is designed as <strong>Canada-first infrastructure</strong>, with all data processing and storage occurring within Canadian data centres.
            </p>
            <p className="mt-3">
              <strong>Important:</strong> DocG AI's Services are provided as clinical decision <em>support</em> tools. They do not replace professional medical judgment. All clinical decisions must be made by qualified healthcare professionals.
            </p>
          </div>

          {/* 4 */}
          <div>
            <h2 className="text-foreground font-bold text-lg mb-3">4. Account Registration & Security</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You agree to provide accurate, current, and complete registration information.</li>
              <li>You must immediately notify us of any unauthorized use of your account.</li>
              <li>We reserve the right to suspend or terminate accounts that violate these Terms or pose security risks.</li>
            </ul>
          </div>

          {/* 5 */}
          <div>
            <h2 className="text-foreground font-bold text-lg mb-3">5. Acceptable Use</h2>
            <p className="mb-3">You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the Services for any unlawful purpose or in violation of any applicable Canadian federal, provincial, or municipal law.</li>
              <li>Attempt to gain unauthorized access to our systems, networks, or data.</li>
              <li>Introduce malicious code, viruses, or other harmful technology.</li>
              <li>Use the Services to process personal health information except as authorized under a valid agreement with us and in compliance with PHIPA and PIPEDA.</li>
              <li>Reverse engineer, decompile, or disassemble any part of the Services.</li>
              <li>Use the Services in any manner that could damage, disable, or impair the platform.</li>
              <li>Resell, sublicense, or redistribute access to the Services without our written consent.</li>
            </ul>
          </div>

          {/* 6 */}
          <div>
            <h2 className="text-foreground font-bold text-lg mb-3">6. Personal Health Information & PHIPA/PIPEDA</h2>
            <p>
              If you are a Health Information Custodian ("<strong>HIC</strong>") or authorized agent using our Services to process personal health information ("<strong>PHI</strong>"):
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>You acknowledge that you bear primary responsibility for compliance with the <em>Personal Health Information Protection Act, 2004</em> (PHIPA) and PIPEDA.</li>
              <li>We will enter into a written service agreement that defines our role as agent under PHIPA s. 17, permissible uses, security obligations, and breach notification procedures.</li>
              <li>You represent that you have obtained all necessary consents and authorities to provide PHI to us for processing.</li>
              <li>All PHI will be processed and stored exclusively within Canadian data centres (AWS ca-central-1).</li>
              <li>Our platform applies dual-layer de-identification before AI processing — no raw PHI is exposed to large language models.</li>
            </ul>
          </div>

          {/* 7 */}
          <div>
            <h2 className="text-foreground font-bold text-lg mb-3">7. Intellectual Property</h2>
            <p>
              All content, features, functionality, software, designs, trademarks, and other intellectual property associated with the Services are owned by DocG AI Inc. or its licensors and are protected by Canadian and international intellectual property laws, including the <em>Copyright Act</em> (R.S.C. 1985, c. C-42) and the <em>Trademarks Act</em> (R.S.C. 1985, c. T-13).
            </p>
            <p className="mt-3">
              You are granted a limited, non-exclusive, non-transferable, revocable licence to access and use the Services for their intended purpose, subject to these Terms. This licence does not grant you ownership of any intellectual property.
            </p>
          </div>

          {/* 8 */}
          <div>
            <h2 className="text-foreground font-bold text-lg mb-3">8. Your Content & Data</h2>
            <p>
              You retain ownership of any content or data you submit through the Services ("<strong>User Content</strong>"). By submitting User Content, you grant DocG AI a limited licence to process, store, and display such content solely to provide the Services. We will not use your User Content for any purpose outside the scope of service delivery without your consent.
            </p>
            <p className="mt-3">
              We may use aggregated, de-identified, and anonymized data derived from usage of the Services for analytics, research, and platform improvement, provided such data cannot reasonably be used to identify any individual.
            </p>
          </div>

          {/* 9 */}
          <div>
            <h2 className="text-foreground font-bold text-lg mb-3">9. Fees & Payment</h2>
            <p>
              Certain features of the Services may be subject to fees. All fees are quoted in Canadian dollars (CAD) unless otherwise specified. Applicable taxes (including HST under the <em>Excise Tax Act</em>) will be added. Payment terms will be set out in your service agreement or at the time of purchase. We reserve the right to modify pricing with 30 days' written notice.
            </p>
          </div>

          {/* 10 */}
          <div>
            <h2 className="text-foreground font-bold text-lg mb-3">10. Disclaimer of Warranties</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE SERVICES ARE PROVIDED "<strong>AS IS</strong>" AND "<strong>AS AVAILABLE</strong>" WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
            <p className="mt-3">
              DocG AI does not warrant that the Services will be uninterrupted, error-free, secure, or free of harmful components. We do not provide medical advice, and our AI outputs do not constitute clinical diagnoses, treatment recommendations, or professional medical opinions.
            </p>
          </div>

          {/* 11 */}
          <div>
            <h2 className="text-foreground font-bold text-lg mb-3">11. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED UNDER THE LAWS OF ONTARIO AND CANADA, IN NO EVENT SHALL DOCG AI, ITS DIRECTORS, OFFICERS, EMPLOYEES, AGENTS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, GOODWILL, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF OR INABILITY TO USE THE SERVICES.
            </p>
            <p className="mt-3">
              OUR TOTAL AGGREGATE LIABILITY FOR ALL CLAIMS ARISING UNDER OR IN CONNECTION WITH THESE TERMS SHALL NOT EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR (B) ONE HUNDRED CANADIAN DOLLARS (CAD $100.00).
            </p>
            <p className="mt-3">
              Nothing in these Terms excludes or limits liability that cannot be excluded or limited under applicable law, including liability for fraud, gross negligence, or wilful misconduct.
            </p>
          </div>

          {/* 12 */}
          <div>
            <h2 className="text-foreground font-bold text-lg mb-3">12. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless DocG AI and its directors, officers, employees, and agents from any claims, liabilities, damages, losses, or expenses (including reasonable legal fees) arising out of or related to: (a) your use of the Services; (b) your violation of these Terms; (c) your violation of any third-party rights; or (d) any PHI processing that occurs in breach of your obligations under PHIPA, PIPEDA, or your agreement with us.
            </p>
          </div>

          {/* 13 */}
          <div>
            <h2 className="text-foreground font-bold text-lg mb-3">13. Term & Termination</h2>
            <p>
              These Terms remain in effect until terminated. You may terminate your account at any time by contacting us. We may suspend or terminate your access at any time, with or without cause, upon reasonable notice. Upon termination:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Your right to access the Services ceases immediately.</li>
              <li>We will provide you with an opportunity to export your User Content for a reasonable period following termination.</li>
              <li>PHI will be handled in accordance with your service agreement and PHIPA requirements, including secure return or destruction.</li>
              <li>Provisions that by their nature should survive termination will survive, including Sections 7, 10, 11, 12, and 15.</li>
            </ul>
          </div>

          {/* 14 */}
          <div>
            <h2 className="text-foreground font-bold text-lg mb-3">14. Modifications to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Material changes will be communicated through the Services or by email at least 30 days before taking effect. Continued use after the effective date constitutes acceptance. If you disagree with modifications, you must stop using the Services and contact us to terminate your account.
            </p>
          </div>

          {/* 15 */}
          <div>
            <h2 className="text-foreground font-bold text-lg mb-3">15. Governing Law & Dispute Resolution</h2>
            <p>
              These Terms are governed by and construed in accordance with the laws of the <strong>Province of Ontario</strong> and the federal laws of Canada applicable therein, without regard to conflict of law principles.
            </p>
            <p className="mt-3">
              Any dispute arising out of or in connection with these Terms shall first be submitted to good-faith mediation. If mediation is unsuccessful within 60 days, the dispute shall be resolved by the courts of competent jurisdiction in the Province of Ontario, and you irrevocably submit to the exclusive jurisdiction of such courts.
            </p>
          </div>

          {/* 16 */}
          <div>
            <h2 className="text-foreground font-bold text-lg mb-3">16. General Provisions</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Severability:</strong> If any provision is found unenforceable, the remaining provisions remain in full force and effect.</li>
              <li><strong>Waiver:</strong> Failure to enforce any right does not constitute a waiver of that right.</li>
              <li><strong>Entire Agreement:</strong> These Terms, together with the Privacy Policy and any service agreements, constitute the entire agreement between you and DocG AI.</li>
              <li><strong>Assignment:</strong> You may not assign these Terms without our written consent. We may assign our rights and obligations without restriction.</li>
              <li><strong>Force Majeure:</strong> DocG AI is not liable for delays or failures caused by circumstances beyond our reasonable control, including natural disasters, pandemics, government actions, or infrastructure failures.</li>
              <li><strong>Language:</strong> The parties have requested that these Terms be drafted in English. <em>Les parties ont demandé que les présentes conditions soient rédigées en anglais.</em></li>
            </ul>
          </div>

          {/* 17 */}
          <div>
            <h2 className="text-foreground font-bold text-lg mb-3">17. Contact</h2>
            <div
              className="rounded-xl p-6"
              style={{
                background: "rgba(255,255,255,0.18)",
                border: "1px solid rgba(255,255,255,0.25)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.4)",
              }}
            >
              <p className="font-semibold text-foreground">DocG AI Inc.</p>
              <p className="mt-1">Email: <a href="mailto:legal@docg.ai" className="text-accent hover:underline">legal@docg.ai</a></p>
              <p className="mt-1">General Inquiries: <a href="mailto:hello@docg.ai" className="text-accent hover:underline">hello@docg.ai</a></p>
              <p className="mt-3 text-sm text-muted-foreground">Ontario, Canada</p>
            </div>
          </div>

        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default TermsOfService;
