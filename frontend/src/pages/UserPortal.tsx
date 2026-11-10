import React, { useState, useEffect } from 'react';
import { User, Shield, Clock, FileText, CheckCircle2, AlertCircle, RefreshCw, PlusCircle, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { IncidentReport } from '../types';

interface UserPortalProps {
  setCurrentTab: (tab: string) => void;
}

export const UserPortal: React.FC<UserPortalProps> = ({ setCurrentTab }) => {
  const { user, creatorWebsite } = useAuth();
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      loadReports();
    }
  }, [user]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await apiService.getMyReports();
      setReports(data);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-slate-400">Please sign in to access your user portal.</p>
        <button
          onClick={() => setCurrentTab('login')}
          className="px-6 py-2.5 rounded-lg bg-cyber-gold text-black font-bold text-sm"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6">
      
      {/* Profile Card */}
      <div className="p-6 rounded-xl bg-cyber-card border border-cyber-gold/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-cyber-surface border border-cyber-gold/40 flex items-center justify-center text-cyber-gold font-bold text-xl">
            {user.full_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">{user.full_name}</h1>
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wide ${
                user.role === 'super_admin'
                  ? 'bg-amber-500 text-black'
                  : (user.role === 'reviewer' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800 text-slate-300')
              }`}>
                {user.role.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentTab('report')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyber-gold text-black font-bold text-xs shadow-gold-glow hover:bg-cyber-goldHover transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Submit New Report</span>
          </button>
        </div>
      </div>

      {/* Reports Section */}
      <div className="p-6 rounded-xl bg-cyber-card border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white font-mono">
              My Submitted Incident Reports ({reports.length})
            </h2>
            <p className="text-xs text-slate-400">
              Isolated user submissions; strictly accessible only to your account and Super Admins.
            </p>
          </div>
          <button
            onClick={loadReports}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500 flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Loading submissions...</span>
          </div>
        ) : reports.length === 0 ? (
          <div className="py-12 text-center text-slate-500 space-y-3">
            <FileText className="w-10 h-10 mx-auto text-slate-600" />
            <p className="text-sm">You haven't submitted any incident reports yet.</p>
            <button
              onClick={() => setCurrentTab('report')}
              className="text-xs text-cyber-gold hover:underline"
            >
              Report a fraud modus operandi now
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map(r => (
              <div key={r.id} className="p-5 rounded-lg bg-cyber-darkest border border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-cyber-gold">{r.tracking_number}</span>
                    <span className="text-slate-400 text-xs">• {r.incident_type}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    r.status === 'verified_educational'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : (r.status === 'under_review' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-400')
                  }`}>
                    {r.status.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {r.description}
                </p>

                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 font-mono pt-2 border-t border-slate-800/80">
                  <span>Platform: {r.platform_used}</span>
                  <span>Amount: {r.approx_amount ? `₹${r.approx_amount.toLocaleString('en-IN')}` : 'Not Specified'}</span>
                  <span>Reported On: {r.incident_date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

