import React, { useState, useEffect } from 'react';
import { User, Shield, Clock, FileText, CheckCircle2, AlertCircle, RefreshCw, PlusCircle, ExternalLink, KeyRound, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { supabaseGetLoginHistory } from '../services/supabase';
import { IncidentReport, LoginHistoryItem } from '../types';

interface UserPortalProps {
  setCurrentTab: (tab: string) => void;
}

export const UserPortal: React.FC<UserPortalProps> = ({ setCurrentTab }) => {
  const { user, creatorWebsite } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<'reports' | 'logins'>('reports');
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [loginHistory, setLoginHistory] = useState<LoginHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, activeSubTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeSubTab === 'reports') {
        const data = await apiService.getMyReports();
        setReports(data);
      } else {
        const history = await supabaseGetLoginHistory(user?.id);
        setLoginHistory(history);
      }
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
            <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-emerald-400">
              <Database className="w-3 h-3" />
              <span>Synced with Supabase Cloud: <strong className="text-slate-300">public.users</strong></span>
            </div>
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

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-cyber-card p-1.5 rounded-lg border border-slate-800 text-xs font-mono w-fit">
        <button
          onClick={() => setActiveSubTab('reports')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded font-bold transition-all ${
            activeSubTab === 'reports' ? 'bg-cyber-gold text-black shadow-gold-glow' : 'text-slate-300 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>My Incident Reports</span>
        </button>
        <button
          onClick={() => setActiveSubTab('logins')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded font-bold transition-all ${
            activeSubTab === 'logins' ? 'bg-cyber-gold text-black shadow-gold-glow' : 'text-slate-300 hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Supabase Login History</span>
        </button>
      </div>

      {/* Content Section */}
      <div className="p-6 rounded-xl bg-cyber-card border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white font-mono">
              {activeSubTab === 'reports' ? `My Submitted Incident Reports (${reports.length})` : `Login & Authentication History (${loginHistory.length})`}
            </h2>
            <p className="text-xs text-slate-400">
              {activeSubTab === 'reports' ? 'Isolated user submissions stored securely in Supabase.' : 'Live authentication events recorded in Supabase user_login_history.'}
            </p>
          </div>
          <button
            onClick={loadData}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500 flex items-center justify-center gap-2 font-mono text-xs">
            <RefreshCw className="w-4 h-4 animate-spin text-cyber-gold" />
            <span>Querying Supabase database...</span>
          </div>
        ) : activeSubTab === 'reports' ? (
          reports.length === 0 ? (
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
          )
        ) : (
          /* Login History Tab */
          loginHistory.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <Clock className="w-10 h-10 mx-auto text-slate-600" />
              <p className="text-sm">No login history events recorded yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-cyber-darkest text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3">Timestamp (UTC / Local)</th>
                    <th className="p-3">Account Email</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Client / User Agent</th>
                    <th className="p-3">Method</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {loginHistory.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td className="p-3 text-slate-400 whitespace-nowrap">
                        {new Date(item.login_timestamp).toLocaleString()}
                      </td>
                      <td className="p-3 font-semibold text-white">{item.email}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          item.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-red-500/20 text-red-400 border border-red-500/40'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400 max-w-[240px] truncate" title={item.user_agent}>
                        {item.user_agent ? item.user_agent.split(' ')[0] : 'Web Client'}
                      </td>
                      <td className="p-3 text-slate-400">{item.auth_method || 'password'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

    </div>
  );
};
