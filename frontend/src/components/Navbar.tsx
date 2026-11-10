import React, { useState } from 'react';
import { Shield, ExternalLink, User as UserIcon, LogOut, Menu, X, LayoutDashboard, Brain, TrendingUp, HelpCircle, FileText, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { user, logout, isSuperAdmin, creatorWebsite } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'intelligence', label: 'Intelligence', icon: LayoutDashboard },
    { id: 'banking', label: 'Banking Fraud', icon: AlertCircle },
    { id: 'upi', label: 'UPI Safety', icon: Shield },
    { id: 'timeline', label: 'History', icon: FileText },
    { id: 'case-studies', label: 'Case Studies', icon: FileText },
    { id: 'simulator', label: 'ML Simulator', icon: Brain },
    { id: 'forecast', label: 'Forecasting', icon: TrendingUp },
    { id: 'assistant', label: 'AI Assistant', icon: Sparkles },
    { id: 'report', label: 'Submit Report', icon: HelpCircle },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-cyber-darkest/90 backdrop-blur-md border-b border-cyber-cardBorder">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab('landing')}>
            <div className="relative p-2 rounded-lg bg-cyber-card border border-cyber-gold/40 shadow-gold-glow">
              <Shield className="w-6 h-6 text-cyber-gold" />
              <div className="absolute inset-0 rounded-lg border border-cyber-gold/20 animate-pulse pointer-events-none" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-wider gold-gradient-text uppercase">
                  CyberShield AI
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] uppercase font-mono font-bold bg-cyber-gold/15 text-cyber-gold rounded border border-cyber-gold/30">
                  v1.0 MVP
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono hidden md:block">
                Financial Prediction & Cybercrime Intelligence
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-cyber-gold/20 text-cyber-gold border border-cyber-gold/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Right Action Area: Creator Link (Audit3A) + Auth */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Audit3A Website External Link */}
            <a
              href={creatorWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-gradient-to-r from-amber-500/10 to-yellow-500/10 hover:from-amber-500/20 hover:to-yellow-500/20 border border-cyber-gold/40 text-cyber-gold hover:text-cyber-goldHover transition-all shadow-sm"
              title="Visit Audit3A Official Website"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyber-gold group-hover:rotate-12 transition-transform" />
              <span>Audit3A</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>

            {user ? (
              <div className="flex items-center gap-2">
                {isSuperAdmin && (
                  <button
                    onClick={() => setCurrentTab('admin')}
                    className={`px-2.5 py-1 text-xs font-bold font-mono rounded border transition-all ${
                      currentTab === 'admin'
                        ? 'bg-amber-500 text-black border-amber-400'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                    }`}
                  >
                    HOST ADMIN
                  </button>
                )}
                <button
                  onClick={() => setCurrentTab('user-portal')}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-slate-800 border border-slate-700 text-xs text-slate-200 hover:text-white"
                >
                  <UserIcon className="w-3.5 h-3.5 text-cyber-gold" />
                  <span className="max-w-[120px] truncate">{user.full_name}</span>
                </button>
                <button
                  onClick={logout}
                  className="p-1.5 text-slate-400 hover:text-cyber-danger transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentTab('login')}
                  className="px-3 py-1.5 rounded text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setCurrentTab('register')}
                  className="px-3 py-1.5 rounded text-xs font-bold bg-cyber-gold text-black hover:bg-cyber-goldHover transition-colors shadow-gold-glow"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <a
              href={creatorWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1 text-[11px] font-semibold text-cyber-gold border border-cyber-gold/40 rounded flex items-center gap-1"
            >
              <span>Audit3A</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-cyber-darkest border-b border-cyber-cardBorder px-4 pt-2 pb-4 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm ${
                  currentTab === item.id ? 'bg-cyber-gold/20 text-cyber-gold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            {user ? (
              <>
                {isSuperAdmin && (
                  <button
                    onClick={() => { setCurrentTab('admin'); setMobileMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-sm font-bold text-amber-300 bg-amber-500/10 rounded"
                  >
                    Host Admin Panel
                  </button>
                )}
                <button
                  onClick={() => { setCurrentTab('user-portal'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 text-sm text-slate-300"
                >
                  My Profile ({user.email})
                </button>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 text-sm text-cyber-danger"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => { setCurrentTab('login'); setMobileMenuOpen(false); }}
                  className="flex-1 py-2 text-center text-sm border border-slate-700 rounded text-slate-200"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setCurrentTab('register'); setMobileMenuOpen(false); }}
                  className="flex-1 py-2 text-center text-sm font-bold bg-cyber-gold text-black rounded"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
