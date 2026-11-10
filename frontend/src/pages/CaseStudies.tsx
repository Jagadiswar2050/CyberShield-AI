import React, { useState, useEffect } from 'react';
import { FileText, AlertTriangle, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { apiService } from '../services/api';
import { CaseStudy } from '../types';

export const CaseStudies: React.FC = () => {
  const [studies, setStudies] = useState<CaseStudy[]>([]);

  useEffect(() => {
    apiService.getCaseStudies().then(setStudies);
  }, []);

  return (
    <div className="space-y-8 py-6">
      
      {/* Header */}
      <div className="p-6 rounded-xl bg-cyber-card border border-cyber-gold/30">
        <div className="flex items-center gap-2 text-cyber-gold text-xs font-mono font-bold uppercase tracking-wider">
          <FileText className="w-4 h-4" />
          <span>Real-World Implementations & Empirical Caveats</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          Industrial Case Studies: AI Fraud Defense
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Analyzing real-world deployments of machine learning fraud detection systems with strict academic methodological objectivity.
        </p>
      </div>

      {/* Case Studies List */}
      <div className="space-y-6">
        {studies.map(study => (
          <div key={study.id} className="p-8 rounded-xl bg-cyber-card border border-slate-800 space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono text-cyber-gold uppercase font-bold">
                  {study.organization} • Partner: {study.vendor_partner || 'In-House'}
                </span>
                <h2 className="text-xl font-bold text-white mt-1">
                  {study.title}
                </h2>
              </div>
              <span className="px-3 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold self-start sm:self-center">
                Vendor-Reported Study
              </span>
            </div>

            <div className="p-4 rounded-lg bg-cyber-surface border border-slate-800">
              <span className="text-xs font-mono text-slate-400 block mb-1">Reported Operational Outcomes:</span>
              <p className="text-sm font-semibold text-cyber-gold">
                {study.reported_metrics}
              </p>
            </div>

            <div className="space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <h3 className="font-bold text-white font-mono text-xs uppercase tracking-wider">Implementation Overview:</h3>
              <p>{study.summary}</p>
            </div>

            {/* Mandatory Academic Caveat Alert */}
            <div className="p-4 rounded-lg bg-amber-950/40 border border-amber-600/40 text-xs text-amber-200/90 space-y-2">
              <div className="flex items-center gap-2 font-mono font-bold text-cyber-amberGlow">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>MANDATORY ACADEMIC & RESEARCH CAVEAT</span>
              </div>
              <p className="leading-relaxed">
                {study.vendor_caveat}
              </p>
            </div>

            <div className="pt-2 text-[11px] text-slate-500 font-mono flex items-center justify-between border-t border-slate-800">
              <span>Primary Source: {study.source_citation}</span>
              <span className="text-slate-400">Archived for B.Tech CST Project Reference</span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

