import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, Activity, FileText, Database, Lock, RefreshCw, AlertTriangle, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { User } from '../types';

export const AdminDashboard: React.FC = () => {
  const { user, isSuperAdmin, creatorWebsite } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'audit' | 'sources'>('overview');
  const [health, setHealth] = useState<any>(null);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadAdminData();
  }, [activeTab]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'overview') {
        const h = await apiService.getAdminHealth();
        setHealth(h);
      } else if (activeTab === 'users') {
        const u = await apiService.getAdminUsers();
        setUsersList(u);
      } else if (activeTab === 'audit') {
        const a = await apiService.getAdminAuditLogs();
        setAuditLogs(a);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUser = async (userId: number) => {
    try {
      const res = await fetch(`/api/v1/admin/users/${userId}/toggle-status`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('cybershield_token')}` }
      });
      if (res.ok) {
        loadAdminData();
      }
    } catch (err) {
      alert("Failed to toggle status");
    }
  };

  const handleChangeRole = async (userId: number, newRole: string) => {
    try {
      const res = await fetch('/api/v1/auth/update-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('cybershield_token')}`
        },
        body: JSON.stringify({ user_id: userId, new_role: newRole })
      });
      if (res.ok) {
        loadAdminData();
      } else {
        const err = await res.json();
        alert(err.detail || "Error updating role");
      }
    } catch {
      alert("Error updating role");
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="py-20 text-center space-y-4">
        <Lock className="w-12 h-12 text-cyber-danger mx-auto" />
        <h2 className="text-xl font-bold text-white">Super Admin Access Required</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          This command center is restricted to the Host Super Admin: <strong>Thallapaka Jagadiswar</strong> (jagadishkrishna7@gmail.com).
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6">
      
      {/* Header */}
      <div className="p-6 rounded-xl bg-gradient-to-r from-amber-950/40 via-cyber-card to-cyber-card border border-amber-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Host Super Admin Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            System Administration & Platform Governance
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Owner: <strong>Thallapaka Jagadiswar</strong> • <a href={creatorWebsite} target="_blank" rel="noopener noreferrer" className="text-cyber-gold hover:underline">Audit3A</a>
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 bg-cyber-darkest p-1.5 rounded-lg border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded font-bold transition-all ${
              activeTab === 'overview' ? 'bg-amber-500 text-black shadow-amber-glow' : 'text-slate-300 hover:text-white'
            }`}
          >
            Telemetry
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded font-bold transition-all ${
              activeTab === 'users' ? 'bg-amber-500 text-black shadow-amber-glow' : 'text-slate-300 hover:text-white'
            }`}
          >
            User RBAC
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded font-bold transition-all ${
              activeTab === 'audit' ? 'bg-amber-500 text-black shadow-amber-glow' : 'text-slate-300 hover:text-white'
            }`}
          >
            Audit Trail
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-500 flex items-center justify-center gap-2 font-mono">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Synchronizing administrative telemetry...</span>
        </div>
      ) : activeTab === 'overview' && health ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-cyber-card border border-slate-800">
              <span className="text-xs font-mono text-slate-400 block mb-1">TOTAL USERS</span>
              <span className="text-3xl font-extrabold text-white font-mono">{health.telemetry.total_users}</span>
              <span className="text-[11px] text-cyber-gold block mt-1 font-mono">Active Accounts</span>
            </div>
            <div className="p-5 rounded-xl bg-cyber-card border border-slate-800">
              <span className="text-xs font-mono text-slate-400 block mb-1">INCIDENT REPORTS</span>
              <span className="text-3xl font-extrabold text-cyber-cyanGlow font-mono">{health.telemetry.total_reports}</span>
              <span className="text-[11px] text-slate-400 block mt-1 font-mono">User Submissions</span>
            </div>
            <div className="p-5 rounded-xl bg-cyber-card border border-slate-800">
              <span className="text-xs font-mono text-slate-400 block mb-1">OFFICIAL STATISTICS</span>
              <span className="text-3xl font-extrabold text-cyber-gold font-mono">{health.telemetry.official_statistics_published}</span>
              <span className="text-[11px] text-slate-400 block mt-1 font-mono">Published Indicators</span>
            </div>
            <div className="p-5 rounded-xl bg-cyber-card border border-slate-800">
              <span className="text-xs font-mono text-slate-400 block mb-1">AUDIT TRAIL LOGS</span>
              <span className="text-3xl font-extrabold text-emerald-400 font-mono">{health.telemetry.audit_trail_events}</span>
              <span className="text-[11px] text-slate-400 block mt-1 font-mono">Recorded Actions</span>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-cyber-surface border border-slate-800 space-y-3 font-mono text-xs">
            <h3 className="text-sm font-bold text-white uppercase text-amber-400">Security & Operational Posture</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
              <div>• Status: <strong className="text-emerald-400">{health.status}</strong></div>
              <div>• Core Engine: <strong>{health.database}</strong></div>
              <div>• RBAC Enforcement: <strong className="text-cyber-gold">Server-Side Strict</strong></div>
              <div>• Host Website: <a href={health.owner_website} target="_blank" rel="noopener noreferrer" className="text-cyber-gold hover:underline">{health.owner_website}</a></div>
            </div>
          </div>
        </div>
      ) : activeTab === 'users' ? (
        <div className="p-6 rounded-xl bg-cyber-card border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white font-mono">
            User Administration & Role-Based Permissions
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-cyber-darkest text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Current Role</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {usersList.map(u => (
                  <tr key={u.id}>
                    <td className="p-3 font-semibold text-white">{u.full_name}</td>
                    <td className="p-3 text-slate-400">{u.email}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.role === 'super_admin' ? 'bg-amber-500 text-black' : (u.role === 'reviewer' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800')
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={u.is_active ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                        {u.is_active ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      {u.role !== 'super_admin' && (
                        <>
                          <button
                            onClick={() => handleChangeRole(u.id, u.role === 'reviewer' ? 'user' : 'reviewer')}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200"
                          >
                            Set {u.role === 'reviewer' ? 'User' : 'Reviewer'}
                          </button>
                          <button
                            onClick={() => handleToggleUser(u.id)}
                            className="px-2.5 py-1 rounded bg-red-950/40 hover:bg-red-950/60 text-red-300 border border-red-500/30"
                          >
                            {u.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-xl bg-cyber-card border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white font-mono">
            Immutable Audit Trail (Last 50 System Actions)
          </h2>
          <div className="space-y-2">
            {auditLogs.map(log => (
              <div key={log.id} className="p-3.5 rounded bg-cyber-darkest border border-slate-800/80 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-cyber-gold font-bold">{log.action}</span>
                    <span className="text-slate-500">• Actor: {log.actor_email}</span>
                  </div>
                  <p className="text-slate-300 font-sans text-xs">{log.details}</p>
                </div>
                <span className="text-[10px] text-slate-500 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

