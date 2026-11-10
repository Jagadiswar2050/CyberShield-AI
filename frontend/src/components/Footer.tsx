import React from 'react';
import { Shield, ExternalLink, Heart, Globe, PhoneCall } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Footer: React.FC = () => {
  const { creatorWebsite } = useAuth();

  return (
    <footer className="bg-cyber-darkest border-t border-cyber-cardBorder pt-12 pb-8 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          
          {/* Col 1: Platform & Owner Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyber-gold" />
              <span className="font-bold text-sm tracking-wide text-white uppercase">
                CyberShield AI
              </span>
            </div>
            <p className="leading-relaxed text-slate-400">
              An independent academic portal uniting machine learning transaction risk scoring, financial forecasting, and verified cyber safety intelligence.
            </p>
            <div className="pt-2">
              <p className="text-[11px] text-slate-500 font-mono">
                Project Founder & Super Admin:
              </p>
              <p className="text-slate-200 font-medium">Thallapaka Jagadiswar</p>
              <a
                href={creatorWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-1 text-cyber-gold hover:text-cyber-goldHover font-semibold transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Visit www.audit3a.com</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Col 2: Official Indian Cyber Help */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold uppercase tracking-wider text-xs font-mono">
              Emergency Cybercrime Support
            </h4>
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-cyber-card border border-amber-600/30">
                <div className="flex items-center gap-2 text-cyber-amberGlow font-bold">
                  <PhoneCall className="w-4 h-4" />
                  <span>National Helpline: 1930</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Citizen Financial Cyber Fraud Reporting Management System (24x7 toll-free).
                </p>
              </div>
              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
              >
                <span>National Portal (MHA)</span>
                <ExternalLink className="w-3.5 h-3.5 text-cyber-gold" />
              </a>
              <a
                href="https://www.rbi.org.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
              >
                <span>Reserve Bank of India (RBI)</span>
                <ExternalLink className="w-3.5 h-3.5 text-cyber-gold" />
              </a>
            </div>
          </div>

          {/* Col 3: Academic & Research Architecture */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold uppercase tracking-wider text-xs font-mono">
              Academic & Tech Core
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>• Major Project: B.Tech Computer Science & Technology</li>
              <li>• Models: Random Forest, Decision Trees & Gradient Boosting</li>
              <li>• Time-Series: Holt-Winters Exponential Smoothing</li>
              <li>• Knowledge Core: RAG Architecture over Official Directives</li>
              <li>• Security: Server-Enforced RBAC & Zero-Trust Token Auth</li>
            </ul>
          </div>

          {/* Col 4: Data Policy & Transparency */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold uppercase tracking-wider text-xs font-mono">
              Data & Evidence Rules
            </h4>
            <p className="leading-relaxed text-[11px] text-slate-400">
              Every statistic displayed references its originating agency (RBI, NCRB, I4C) and exact reporting duration. 
              All transaction simulation models utilize strictly <strong className="text-amber-300">synthetic educational benchmarks</strong>.
            </p>
            <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800 text-[10px] text-slate-400 font-mono">
              SYNTHETIC DEMO DATA — NO LIVE BANKING INTEGRATION
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] text-slate-500">
          <div>
            © 2026 CyberShield AI. Created by <strong className="text-slate-300">Thallapaka Jagadiswar</strong>. Powered by <a href={creatorWebsite} target="_blank" rel="noopener noreferrer" className="text-cyber-gold hover:underline">Audit3A</a>.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-500">Academic License: Research & Education</span>
            <span className="text-slate-600">|</span>
            <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-cyber-gold transition-colors">
              cybercrime.gov.in
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
