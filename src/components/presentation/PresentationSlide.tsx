import {
  Activity,
  ArrowRight,
  BrainCircuit,
  Building2,
  Check,
  Database,
  FileCheck2,
  GitBranch,
  Landmark,
  Network,
  Route,
  ShieldCheck,
  Stethoscope,
  Workflow,
} from "lucide-react";
import logo from "@/assets/docg-logo-white.png";
import brain from "@/assets/hero-brain.png";

export interface SlideDefinition {
  id: string;
  number: string;
  section: string;
  title: string;
  subtitle: string;
  source?: string;
  tone: "dark" | "light";
}

export const slides: SlideDefinition[] = [
  { id: "thesis", number: "01", section: "Investment thesis", title: "Canada’s intelligence layer for coordinated healthcare.", subtitle: "Turn fragmented clinical signals into verified, coordinated action — without replacing the systems clinicians already use.", tone: "dark" },
  { id: "problem", number: "02", section: "The problem", title: "Canada has a capacity crisis — and a coordination problem.", subtitle: "Clinical work is trapped between disconnected systems, manual handoffs, and administrative load.", source: "Source context: CIHI 2024–2026 and CMA data, as compiled in the supplied market analysis. Verify individual figures before external use.", tone: "light" },
  { id: "timing", number: "03", section: "Market timing", title: "Pressure and readiness are converging.", subtitle: "Four structural shifts make an intelligence layer possible — and increasingly necessary.", source: "Policy references and adoption figures are drawn from the supplied analysis. Future-dated policy items require verification.", tone: "dark" },
  { id: "market", number: "04", section: "Market sizing", title: "A focused Canadian wedge supports a C$24M ARR SOM.", subtitle: "Start with independent and community-based physicians, then expand into network and system contracts.", source: "Company estimate based on ~99,555 physicians and a C$400/provider/month baseline. SAM shown as the supplied C$192M–C$240M range.", tone: "light" },
  { id: "solution", number: "05", section: "The solution", title: "An operating layer underneath clinical workflows.", subtitle: "DocG AI connects existing systems, assembles context, routes work, and verifies every action.", tone: "dark" },
  { id: "architecture", number: "06", section: "Technology", title: "Intelligence with guardrails.", subtitle: "Four modular layers coordinate care while preserving clinical authority and Canadian data controls.", tone: "light" },
  { id: "value", number: "07", section: "Business value", title: "Outcomes mapped to health-system constraints.", subtitle: "A common operating model for speed, coordination, workflow integrity, and governance.", source: "Illustrative platform targets from the supplied analysis; not presented as audited customer outcomes.", tone: "dark" },
  { id: "model", number: "08", section: "Business model", title: "Land with a workflow. Expand into the operating layer.", subtitle: "A commercial ladder from an individual clinic workflow to sovereign health-system infrastructure.", source: "Indicative pricing from the supplied analysis; subject to validation and commercial approval.", tone: "light" },
  { id: "moat", number: "09", section: "Competitive moat", title: "Categories usually sold separately — unified.", subtitle: "The defensibility is not AI alone. It is governed coordination embedded across fragmented clinical systems.", tone: "dark" },
  { id: "gtm", number: "10", section: "Go-to-market", title: "Prove one painful workflow, then expand across networks.", subtitle: "A measured path from design partners to regional health-system infrastructure.", tone: "light" },
];

const Header = ({ slide }: { slide: SlideDefinition }) => (
  <header className="slide-header">
    <img src={logo} alt="DocG AI" className="slide-logo" />
    <div className="slide-page">{slide.number} / 10</div>
  </header>
);

const Footer = ({ slide }: { slide: SlideDefinition }) => (
  <footer className="slide-footer">
    <span>{slide.source ?? "DocG AI · Canadian clinical infrastructure"}</span>
    <span>{slide.section}</span>
  </footer>
);

const Lead = ({ slide }: { slide: SlideDefinition }) => (
  <div className="slide-lead">
    <div className="slide-kicker">{slide.section}</div>
    <h1 className="slide-title">{slide.title}</h1>
    <p className="slide-subtitle">{slide.subtitle}</p>
  </div>
);

const Thesis = () => (
  <div className="thesis-layout">
    <div className="thesis-copy">
      <div className="slide-kicker">Business case · Canada 2026</div>
      <h1 className="slide-title-lg">Canada’s intelligence layer for coordinated healthcare.</h1>
      <p className="slide-body-lg">Turn fragmented clinical signals into verified, coordinated action — without replacing the systems clinicians already use.</p>
      <div className="thesis-pillars">
        <span>Canada-first</span><span>AI-native overlay</span><span>Sovereign by design</span>
      </div>
    </div>
    <div className="thesis-visual" aria-hidden="true">
      <div className="orbit orbit-a" />
      <div className="orbit orbit-b" />
      <img src={brain} alt="" />
      <div className="signal-node node-a" /><div className="signal-node node-b" /><div className="signal-node node-c" />
    </div>
  </div>
);

const Problem = () => {
  const metrics = [
    ["6.5M", "Canadians without a primary care provider"],
    ["27%", "Access same- or next-day care"],
    ["10.4 h", "Weekly admin time per physician"],
    ["78%", "Unable to exchange clinical summaries"],
  ];
  return <>
    <Lead slide={slides[1]} />
    <div className="metric-grid problem-metrics">
      {metrics.map(([value, label], index) => <div className="metric-card" key={label}><span className="metric-index">0{index + 1}</span><strong>{value}</strong><p>{label}</p></div>)}
    </div>
    <div className="problem-rail">
      <div><Database /><b>Signals arrive everywhere</b><span>EMRs, labs, referrals, and forms remain disconnected.</span></div>
      <ArrowRight />
      <div><Workflow /><b>Work falls between systems</b><span>Follow-ups and escalations depend on manual memory.</span></div>
      <ArrowRight />
      <div><Stethoscope /><b>Clinicians absorb the load</b><span>Scarce care time becomes the integration layer.</span></div>
    </div>
  </>;
};

const Timing = () => {
  const items = [
    ["01", "+49%", "Workforce pressure", "Increase in family physicians cited as required to meet current demand."],
    ["02", "46%", "AI adoption", "Canadian family doctors reported using AI in some capacity."],
    ["03", "FHIR", "Interoperability", "Anti-data-blocking direction is opening legacy clinical systems."],
    ["04", "Overlay", "Deployment reality", "Health systems need integration without rip-and-replace disruption."],
  ];
  return <>
    <Lead slide={slides[2]} />
    <div className="timing-axis">
      {items.map(([n, value, title, body]) => <div className="timing-item" key={n}><div className="timing-marker">{n}</div><strong>{value}</strong><h2>{title}</h2><p>{body}</p></div>)}
    </div>
  </>;
};

const Market = () => (
  <>
    <Lead slide={slides[3]} />
    <div className="market-layout">
      <div className="market-bars" aria-label="Market sizing comparison">
        <div className="market-row"><span>TAM</span><div className="market-track"><i style={{ width: "100%" }} /></div><strong>C$478M</strong></div>
        <div className="market-row"><span>SAM</span><div className="market-track"><i style={{ width: "45%" }} /></div><strong>C$192–240M</strong></div>
        <div className="market-row"><span>SOM</span><div className="market-track"><i style={{ width: "12%" }} /></div><strong>C$24M</strong></div>
      </div>
      <div className="market-assumptions">
        <div><span>99,555</span><p>Canadian physicians in the supplied baseline</p></div>
        <div><span>5,000</span><p>Physicians in the five-year obtainable market</p></div>
        <div className="market-route"><b>Launch sequence</b><p>Ontario <ArrowRight /> British Columbia <ArrowRight /> Alberta</p></div>
      </div>
    </div>
  </>
);

const Solution = () => {
  const inputs = [[FileCheck2, "EMR / EHR"], [Activity, "Labs & imaging"], [Stethoscope, "Patient access"], [Building2, "Clinical operations"]] as const;
  return <>
    <Lead slide={slides[4]} />
    <div className="solution-map">
      <div className="solution-inputs">{inputs.map(([Icon, label]) => <div key={label}><Icon /><span>{label}</span></div>)}</div>
      <div className="solution-core">
        <BrainCircuit />
        <div><small>DocG AI Cortex</small><strong>Reason · Route · Verify</strong></div>
      </div>
      <div className="solution-outputs"><span>Scheduling</span><span>Clinical ops</span><span>Care pathways</span><span>Governance</span></div>
    </div>
  </>;
};

const Architecture = () => {
  const layers = [
    ["04", "Workflow surfaces", "Clinic OS · Virtual care · Patient access", Network],
    ["03", "Orchestration", "Escalations · approvals · handoffs", GitBranch],
    ["02", "AI Cortex", "Context assembly · governed reasoning", BrainCircuit],
    ["01", "Sovereign data plane", "Audit trails · Canadian residency", ShieldCheck],
  ] as const;
  return <>
    <Lead slide={slides[5]} />
    <div className="architecture-layout">
      <div className="architecture-stack">{layers.map(([n, title, body, Icon]) => <div className="architecture-layer" key={n}><span>{n}</span><Icon /><div><strong>{title}</strong><p>{body}</p></div></div>)}</div>
      <div className="guardrails"><div className="guardrails-title">Non-negotiable guardrails</div>{["Integrate first", "Trace every action", "Human accountability", "Canada-first controls"].map(item => <div key={item}><Check />{item}</div>)}</div>
    </div>
  </>;
};

const Value = () => {
  const values = [["4.3×", "Faster latency", "Right signal, right role, context assembled."], ["+27%", "Coordination", "Higher pathway and referral completion."], ["−38%", "Workflow leakage", "Fewer lost handoffs and unmanaged queues."], ["100%", "Traceability", "Audit-ready provenance across every action."]];
  return <>
    <Lead slide={slides[6]} />
    <div className="value-field">{values.map(([value, label, body], index) => <div className={`value-stat value-stat-${index + 1}`} key={label}><strong>{value}</strong><h2>{label}</h2><p>{body}</p></div>)}<div className="value-core"><BrainCircuit /><span>Operational<br />capacity</span></div></div>
  </>;
};

const Model = () => {
  const tiers = [
    ["Clinic", "C$299–599", "per provider / month", "AI workflow · documentation · patient intake"],
    ["Group / Network", "C$50K–250K", "annual contract", "Shared pathways · analytics · governance"],
    ["Health System", "C$250K–1M+", "annual enterprise", "Sovereign data plane · integrations · SLAs"],
  ];
  return <>
    <Lead slide={slides[7]} />
    <div className="model-ladder">{tiers.map(([name, price, cadence, includes], index) => <div className={`model-tier tier-${index + 1}`} key={name}><span>0{index + 1}</span><h2>{name}</h2><strong>{price}</strong><small>{cadence}</small><p>{includes}</p></div>)}</div>
  </>;
};

const Moat = () => {
  const comparisons = [["Point scribes", "Beyond the note", "Reasoning and routing across the care pathway."], ["Legacy EMRs", "Across systems", "Coordination that is not confined to one record."], ["RPA tools", "Clinical context", "Policy-aware logic with human accountability."], ["Standalone governance", "Embedded proof", "Auditability created as work happens."]];
  return <>
    <Lead slide={slides[8]} />
    <div className="moat-layout">
      <div className="moat-core"><div><Landmark /><span>Governance</span></div><div><BrainCircuit /><span>Reasoning</span></div><div><Route /><span>Orchestration</span></div><div><ShieldCheck /><span>Sovereignty</span></div><strong>DocG AI</strong></div>
      <div className="moat-comparisons">{comparisons.map(([category, headline, body]) => <div key={category}><small>Vs. {category}</small><strong>{headline}</strong><p>{body}</p></div>)}</div>
    </div>
  </>;
};

const Gtm = () => {
  const steps = [["0–6 mo", "Prove", "2–3 design partners. Baseline one high-friction workflow."], ["6–12 mo", "Productize", "Standard FHIR connectors. Package security and privacy."], ["12–24 mo", "Scale", "Multi-site groups. Expand Ontario → BC → Alberta."], ["24+ mo", "Platform", "Regional contracts and sovereign data-plane deployment."]];
  return <>
    <Lead slide={slides[9]} />
    <div className="gtm-roadmap">{steps.map(([time, phase, body], index) => <div className="gtm-step" key={phase}><span>{time}</span><div className="gtm-dot">{index + 1}</div><h2>{phase}</h2><p>{body}</p></div>)}</div>
    <div className="gtm-close"><img src={logo} alt="DocG AI" /><span>Start anywhere. Coordinate everywhere.</span></div>
  </>;
};

const slideBodies = [Thesis, Problem, Timing, Market, Solution, Architecture, Value, Model, Moat, Gtm];

const PresentationSlide = ({ slide, index }: { slide: SlideDefinition; index: number }) => {
  const Body = slideBodies[index];
  if (!Body) return null;

  return (
    <article className={`slide-content slide-${slide.tone} slide-${slide.id}`}>
      <div className="slide-atmosphere" aria-hidden="true" />
      <Header slide={slide} />
      <main className="slide-main"><Body /></main>
      <Footer slide={slide} />
    </article>
  );
};

export default PresentationSlide;
