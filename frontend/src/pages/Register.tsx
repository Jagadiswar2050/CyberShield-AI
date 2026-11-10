import React, { useState } from 'react';
import { UserPlus, Mail, Lock, User, ArrowRight, RefreshCw, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface RegisterProps {
  setCurrentTab: (tab: string) => void;
}

export const Register: React.FC<RegisterProps> = ({ setCurrentTab }) => {
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    setLoading(true);
    try {
      await register(email, fullName, password);
      setCurrentTab('landing');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="p-8 rounded-2xl bg-cyber-card border border-cyber-gold/30 shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-cyber-surface border border-cyber-gold/40 flex items-center justify-center text-cyber-gold mx-auto shadow-gold-glow">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Create Account</h1>
          <p className="text-xs text-slate-400">Join the CyberShield AI community portal</p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/50 text-red-200 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-cyber-darkest border border-slate-800 text-white text-xs focus:border-cyber-gold focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-cyber-darkest border border-slate-800 text-white text-xs focus:border-cyber-gold focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">Password (Min 8 chars)</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-cyber-darkest border border-slate-800 text-white text-xs focus:border-cyber-gold focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-cyber-gold hover:bg-cyber-goldHover text-black font-bold text-xs shadow-gold-glow transition-all flex items-center justify-center gap-2"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Register Account</span>}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          Already registered?{' '}
          <button
            onClick={() => setCurrentTab('login')}
            className="text-cyber-gold font-semibold hover:underline"
          >
            Sign in
          </button>
        </div>

      </div>
    </div>
  );
};
