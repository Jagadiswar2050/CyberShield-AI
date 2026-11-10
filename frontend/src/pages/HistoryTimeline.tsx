import React from 'react';
import { Calendar, Cpu, GitCommit, ShieldCheck, Zap, Activity } from 'lucide-react';

export const HistoryTimeline: React.FC = () => {
  const eras = [
    {
      era: "1950s – 1980s",
      title: "Manual Review & Paper Ledgers",
      tag: "Foundational Era",
      icon: Calendar,
      overview: "The inception of payment cards (Diners Club, BankAmericard). In the absence of digital telecommunications, authorization relied on carbon-copy paper imprints, printed books of invalid card numbers, and manual telephone inquiries for large transactions.",
      tech: "Carbon-copy machines, manual batch reconciliation, printed counterfeit bullet lists.",
      limitations: "Days of latency before fraud was identified; high labor overhead; zero ability to stop immediate in-flight theft."
    },
    {
      era: "1980s – 1990s",
      title: "Electronic Terminal Feeds & Heuristic Rule Engines",
      tag: "Early Automation",
      icon: GitCommit,
      overview: "Introduction of magnetic stripes (Magstripe) and POS terminals enabling instantaneous authorization requests. Banks deployed simple Boolean rule engines (e.g. 'IF amount > ₹50,000 AND city != home_city THEN decline').",
      tech: "Mainframe transaction switches, IF-THEN static decision trees, batch ETL pipelines.",
      limitations: "Extremely high false decline rates (frustrating legitimate shoppers); inflexible rules that fraudsters easily mapped and circumvented."
    },
    {
      era: "1990s – 2000s",
      title: "EMV Chip Security & E-Commerce Proliferation",
      tag: "Hardware Cryptography",
      icon: ShieldCheck,
      overview: "The rollout of the EMV (Europay, Mastercard, Visa) chip standard mitigated physical card skimming through dynamic cryptographic tokens. Simultaneously, the explosion of online shopping shifted fraud into Card-Not-Present (CNP) digital domains.",
      tech: "Smart card microchips, 3-D Secure v1 protocol, CVV2 verification.",
      limitations: "Fraud shifted almost entirely to digital CNP transactions, phishing websites, and credential harvesting."
    },
    {
      era: "2010s",
      title: "Machine Learning at Scale (Random Forests & Gradient Boosting)",
      tag: "Statistical AI",
      icon: Cpu,
      overview: "Banks transitioned from human-authored rules to statistical machine learning models trained on millions of historical transactions. Algorithms like Random Forest and XGBoost captured subtle feature interactions and customer behavioral baselines.",
      tech: "Supervised ML, feature stores, scoring latency < 100ms, AUROC / PR-AUC metrics.",
      limitations: "Class imbalance vulnerability; concept drift as scammers changed tactics; black-box opacity hindering compliance."
    },
    {
      era: "2020s Onward",
      title: "Real-Time Graph Analytics, Biometrics & Behavioral AI",
      tag: "Modern Intelligent Defense",
      icon: Zap,
      overview: "Current state-of-the-art: combining millisecond graph neural networks (GNNs) for mule-account ring detection, continuous device telemetry, keystroke dynamics, and real-time step-up biometric challenges.",
      tech: "Graph databases, streaming ML inference, device fingerprinting, behavioral biometrics, federated learning.",
      limitations: "Sophisticated social engineering (where the authentic user is tricked into authorizing the transaction themselves) bypasses device and credential checks."
    }
  ];

  return (
    <div className="space-y-8 py-6">
      
      {/* Header */}
      <div className="p-6 rounded-xl bg-cyber-card border border-cyber-gold/30">
        <div className="flex items-center gap-2 text-cyber-gold text-xs font-mono font-bold uppercase tracking-wider">
          <Activity className="w-4 h-4" />
          <span>Evolutionary Defense Paradigm</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          Historical Evolution of Financial Fraud Detection
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          From manual carbon-paper ledgers in the 1950s to modern graph neural networks and behavioral AI signals.
        </p>
      </div>

      {/* Timeline Stream */}
      <div className="relative border-l-2 border-cyber-gold/40 ml-4 md:ml-8 space-y-10 pl-6 sm:pl-8">
        {eras.map((era, index) => {
          const Icon = era.icon;
          return (
            <div key={index} className="relative group">
              
              {/* Timeline marker icon */}
              <div className="absolute -left-[37px] sm:-left-[45px] top-1.5 w-8 h-8 rounded-full bg-cyber-darkest border-2 border-cyber-gold flex items-center justify-center text-cyber-gold shadow-gold-glow">
                <Icon className="w-4 h-4" />
              </div>

              {/* Card content */}
              <div className="p-6 rounded-xl bg-cyber-card border border-slate-800 hover:border-cyber-gold/40 transition-all space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-cyber-gold/15 text-cyber-gold border border-cyber-gold/30">
                    {era.era}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {era.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white">
                  {era.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {era.overview}
                </p>

                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-2.5 rounded bg-cyber-surface border border-slate-800">
                    <span className="text-cyber-gold block font-semibold mb-0.5">Core Technology:</span>
                    <span className="text-slate-300 font-sans text-[11px]">{era.tech}</span>
                  </div>
                  <div className="p-2.5 rounded bg-cyber-surface border border-slate-800">
                    <span className="text-amber-400 block font-semibold mb-0.5">Inherent Vulnerability:</span>
                    <span className="text-slate-300 font-sans text-[11px]">{era.limitations}</span>
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

