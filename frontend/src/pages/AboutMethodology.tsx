import React from 'react';
import { Shield, Globe, ExternalLink, Mail, Award, BookOpen, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AboutMethodology: React.FC = () => {
  const { creatorWebsite } = useAuth();

  return (
    <div className="space-y-10 py-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="p-8 rounded-xl bg-cyber-card border border-cyber-gold/30 space-y-4">
        <div className="flex items-center gap-2 text-cyber-gold text-xs font-mono font-bold uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Academic Curriculum & Platform Ethics</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">
          About CyberShield AI & Methodology
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          CyberShield AI is an independent academic, research, and public-safety platform designed to advance 
          awareness of financial cybercrime mechanisms, evaluate machine learning anomaly detection architectures, 
          and provide emergency guidance under official Reserve Bank of India and Ministry of Home Affairs frameworks.
        </p>
      </div>

      {/* Creator Profile & Audit3A Section */}
      <div className="p-8 rounded-xl bg-gradient-to-r from-cyber-card via-slate-900 to-cyber-card border border-cyber-gold/40 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-cyber-gold/15 border-2 border-cyber-gold flex items-center justify-center text-cyber-gold font-bold text-2xl shadow-gold-glow">
              TJ
            </div>
            <div>
              <span className="text-xs font-mono text-cyber-gold uppercase font-bold">Project Owner & Super Admin</span>
              <h2 className="text-2xl font-bold text-white">Thallapaka Jagadiswar</h2>
              <p className="text-xs text-slate-400 font-mono">B.Tech Computer Science & Technology</p>
            </div>
          </div>

          <a
            href={creatorWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyber-gold text-black font-bold text-xs shadow-gold-glow hover:bg-cyber-goldHover transition-all self-start sm:self-center"
          >
            <Globe className="w-4 h-4" />
            <span>Visit www.audit3a.com</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            <strong>Thallapaka Jagadiswar</strong> conceived and engineered CyberShield AI as a major capstone project in Computer Science & Technology. 
            The initiative addresses the critical vulnerability gap in modern digital financial infrastructure where social engineering attacks (such as UPI collect fraud and remote screen-sharing tools) bypass traditional perimeter firewalls.
          </p>
          <div className="p-4 rounded-lg bg-cyber-darkest border border-slate-800 font-mono text-xs space-y-2">
            <div className="flex items-center gap-2 text-cyber-gold">
              <Mail className="w-4 h-4" />
              <span>Direct Contact: <strong>jagadishkrishna7@gmail.com</strong></span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Globe className="w-4 h-4 text-cyber-gold" />
              <span>Creator Portfolio & Initiatives: <a href={creatorWebsite} target="_blank" rel="noopener noreferrer" className="text-cyber-gold underline">{creatorWebsite}</a></span>
            </div>
          </div>
        </div>
      </div>

      {/* Methodology & Safety Guardrails */}
      <div className="p-8 rounded-xl bg-cyber-card border border-slate-800 space-y-6">
        <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
          <Shield className="w-5 h-5 text-cyber-gold" />
          Data Integrity & Safety Guardrails
        </h2>

        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <div className="p-4 rounded-lg bg-cyber-surface border border-slate-800 space-y-1.5">
            <h3 className="font-bold text-white font-mono text-xs uppercase text-cyber-gold">1. No Impersonation Policy</h3>
            <p className="text-slate-400">
              CyberShield AI never claims to be a law enforcement agency, banking regulator, or police division. 
              The portal is an independent academic tool and educational knowledge base.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-cyber-surface border border-slate-800 space-y-1.5">
            <h3 className="font-bold text-white font-mono text-xs uppercase text-cyber-gold">2. Sourced vs. Synthetic Data Segregation</h3>
            <p className="text-slate-400">
              All statistical metrics presented on dashboards cite primary source publications (RBI, NCRB, I4C) with reporting timeframes. 
              All ML simulators and time-series projections operate strictly on synthetic educational datasets.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-cyber-surface border border-slate-800 space-y-1.5">
            <h3 className="font-bold text-white font-mono text-xs uppercase text-cyber-gold">3. Zero PII & Zero Credential Collection</h3>
            <p className="text-slate-400">
              The platform never collects or stores passwords, CVVs, debit/credit card numbers, or OTPs. 
              Input fields enforce client and server sanitization to protect user confidentiality.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

