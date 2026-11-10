import React, { useState, useEffect } from 'react';
import { Shield, Filter, ExternalLink, Calendar, MapPin, Database, Info, RefreshCw } from 'lucide-react';
import { apiService } from '../services/api';
import { OfficialStatistic } from '../types';

export const CybercrimeIntelligence: React.FC = () => {
  const [stats, setStats] = useState<OfficialStatistic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadStats();
  }, [selectedCategory]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const cat = selectedCategory === 'all' ? undefined : selectedCategory;
      const data = await apiService.getStatistics(cat);
      setStats(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 py-6">
      
      {/* Header */}
      <div className="p-6 rounded-xl bg-cyber-card border border-cyber-gold/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyber-gold text-xs font-mono font-bold uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>Official Sourced Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Cybercrime Intelligence Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Verified statistics published by the National Crime Records Bureau (NCRB) and the Indian Cyber Crime Coordination Centre (I4C).
          </p>
        </div>

        {/* Filter categories */}
        <div className="flex items-center gap-2 bg-cyber-darkest p-1.5 rounded-lg border border-slate-800 text-xs">
          <Filter className="w-3.5 h-3.5 text-cyber-gold ml-1" />
          {['all', 'cybercrime', 'banking_fraud', 'digital_payments'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded capitalize font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-cyber-gold text-black font-bold shadow-gold-glow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Critical Guidance Alert on Conflating Measures */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2">
        <div className="flex items-center gap-2 text-cyber-gold font-bold font-mono">
          <Info className="w-4 h-4" />
          <span>STATISTICAL INTEGRITY NOTICE — NEVER CONFLATE MEASURES</span>
        </div>
        <p className="leading-relaxed text-slate-400">
          A <strong>cybercrime complaint</strong> received on the 1930 portal or online portal is an unverified citizen grievance. 
          A <strong>registered case (FIR)</strong> represents an investigation opened by state police under the Bharatiya Nyaya Sanhita / IPC / IT Act. 
          Similarly, <strong>amount involved</strong> indicates initial exposure at registration, not actual unrecovered permanent financial loss.
        </p>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 flex items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Loading verified data records...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats.map(stat => (
            <div
              key={stat.id}
              className="p-6 rounded-xl bg-cyber-card border border-cyber-cardBorder hover:border-cyber-gold/40 transition-all space-y-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-cyber-gold/15 text-cyber-gold border border-cyber-gold/30 uppercase">
                  {stat.metric_type.replace('_', ' ')}
                </span>
                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Published: {stat.publication_date}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white leading-snug">
                  {stat.indicator_name}
                </h3>
                <div className="text-3xl font-extrabold text-white mt-2 gold-gradient-text font-mono">
                  {stat.value.toLocaleString('en-IN')} <span className="text-sm text-slate-300 font-sans font-normal">{stat.unit}</span>
                </div>
              </div>

              {stat.methodology_notes && (
                <p className="text-xs text-slate-400 bg-cyber-darkest p-3 rounded-lg border border-slate-800/80 leading-relaxed">
                  {stat.methodology_notes}
                </p>
              )}

              {/* Provenance Metadata footer */}
              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-1.5 font-mono">
                <div className="flex items-center justify-between">
                  <span>Coverage / Scope:</span>
                  <span className="text-slate-200">{stat.population_coverage}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Reporting Period:</span>
                  <span className="text-slate-200">{stat.period_start} to {stat.period_end}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-cyber-gold font-semibold">{stat.source_org}</span>
                  <a
                    href={stat.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-cyber-gold hover:text-white underline"
                  >
                    Source Document
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
