import React from 'react';
import { Shield, Brain, TrendingUp, Sparkles, AlertTriangle, ArrowRight, CheckCircle2, Lock, FileText, PhoneCall, Globe, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LandingPageProps {
  setCurrentTab: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ setCurrentTab }) => {
  const { creatorWebsite } = useAuth();

  return (
    <div className="space-y-16 py-8">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-cyber-card via-cyber-surface to-cyber-darkest border border-cyber-gold/25 p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-cyber-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 bg-cyber-amberGlow/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyber-gold/10 border border-cyber-gold/30 text-cyber-gold text-xs font-mono font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Academic B.Tech Capstone Project • Command Center</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            AI-Powered <span className="gold-gradient-text">Financial Prediction</span> & <span className="amber-gradient-text">Fraud Detection</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
            CyberShield AI is an independent cybersecurity intelligence portal engineered to combine 
            machine learning transaction anomaly detection, time-series digital payment forecasting, and 
            verified public fraud-prevention education.
          </p>

          {/* Key CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => setCurrentTab('simulator')}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-cyber-gold hover:bg-cyber-goldHover text-black font-bold text-sm shadow-gold-glow transition-all"
            >
              <Brain className="w-4 h-4" />
              <span>Launch Fraud Simulator</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentTab('intelligence')}
              className="flex items-center gap-2 px-5 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium text-sm transition-all"
            >
              <Shield className="w-4 h-4 text-cyber-gold" />
              <span>Explore Official Data</span>
            </button>

            <a
              href={creatorWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 rounded-lg bg-cyber-surface hover:bg-slate-800 border border-cyber-gold/30 text-cyber-gold text-sm font-semibold transition-all"
            >
              <Globe className="w-4 h-4" />
              <span>Founder: Audit3A</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Quick Notice */}
          <div className="pt-4 flex items-center gap-2 text-xs text-amber-300/90 font-mono">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>Strict Educational Environment: All transaction models utilize synthetic benchmark data.</span>
          </div>
        </div>
      </section>

      {/* 3 Pillar Tracks: Predict, Detect, Learn */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-wide uppercase font-mono">
            Core Architecture: Predict • Detect • Learn
          </h2>
          <p className="text-sm text-slate-400">
            Grounding academic machine learning techniques into practical defense workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Pillar 1: Predict */}
          <div 
            onClick={() => setCurrentTab('forecast')}
            className="p-6 rounded-xl bg-cyber-card border border-cyber-cardBorder hover:border-cyber-gold/50 cursor-pointer transition-all hover:shadow-gold-glow group"
          >
            <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-cyber-amberGlow mb-4 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyber-gold transition-colors">
              1. Financial Prediction
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Time-series forecasting models (Holt-Winters & ARIMA) predicting volume surges, seasonal shifts, and digital transaction flows with 95% confidence bounds.
            </p>
            <span className="text-xs font-semibold text-cyber-gold inline-flex items-center gap-1">
              View Forecast Models <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          {/* Pillar 2: Detect */}
          <div 
            onClick={() => setCurrentTab('simulator')}
            className="p-6 rounded-xl bg-cyber-card border border-cyber-cardBorder hover:border-cyber-gold/50 cursor-pointer transition-all hover:shadow-gold-glow group"
          >
            <div className="w-12 h-12 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-cyber-gold mb-4 group-hover:scale-105 transition-transform">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyber-gold transition-colors">
              2. Fraud Detection Simulator
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Multi-feature behavioral evaluation with calibrated Random Forest + heuristics, explainable reason codes, and the illustrative ₹78k Tirupati rapid-burst scenario.
            </p>
            <span className="text-xs font-semibold text-cyber-gold inline-flex items-center gap-1">
              Test Simulator <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          {/* Pillar 3: Learn */}
          <div 
            onClick={() => setCurrentTab('upi')}
            className="p-6 rounded-xl bg-cyber-card border border-cyber-cardBorder hover:border-cyber-gold/50 cursor-pointer transition-all hover:shadow-gold-glow group"
          >
            <div className="w-12 h-12 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyber-cyanGlow mb-4 group-hover:scale-105 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyber-cyanGlow transition-colors">
              3. Cybercrime Intelligence & UPI Safety
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Official data from RBI, NCRB, and I4C. In-depth education on QR scams, collect requests, remote APKs, and 1930 emergency reporting protocols.
            </p>
            <span className="text-xs font-semibold text-cyber-cyanGlow inline-flex items-center gap-1">
              Read Safety Modules <ArrowRight className="w-3 h-3" />
            </span>
          </div>

        </div>
      </section>

      {/* Official Sourced Metrics Snapshot */}
      <section className="p-8 rounded-xl bg-cyber-surface border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white font-mono">
              Official Indian Banking & Cybercrime Benchmarks
            </h3>
            <p className="text-xs text-slate-400">
              Source verified: Reserve Bank of India (RBI) & Ministry of Home Affairs (I4C).
            </p>
          </div>
          <button
            onClick={() => setCurrentTab('intelligence')}
            className="px-3 py-1.5 text-xs text-cyber-gold hover:text-white border border-cyber-gold/30 rounded flex items-center gap-1.5"
          >
            <span>Full Data Breakdown</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-4 rounded-lg bg-cyber-card border border-slate-800">
            <span className="text-xs font-mono text-slate-400 block mb-1">SCB Fraud Cases (FY24)</span>
            <div className="text-2xl font-extrabold text-white">36,075</div>
            <p className="text-[11px] text-amber-400/80 mt-1">Source: RBI Annual Report</p>
          </div>

          <div className="p-4 rounded-lg bg-cyber-card border border-slate-800">
            <span className="text-xs font-mono text-slate-400 block mb-1">Amount Involved (FY24)</span>
            <div className="text-2xl font-extrabold text-cyber-gold">₹21,469 Cr</div>
            <p className="text-[11px] text-slate-400 mt-1">Stated exposure (not net loss)</p>
          </div>

          <div className="p-4 rounded-lg bg-cyber-card border border-slate-800">
            <span className="text-xs font-mono text-slate-400 block mb-1">Card / Internet Frauds</span>
            <div className="text-2xl font-extrabold text-white">80.6%</div>
            <p className="text-[11px] text-slate-400 mt-1">Of total cases volume (RBI)</p>
          </div>

          <div className="p-4 rounded-lg bg-cyber-card border border-slate-800">
            <span className="text-xs font-mono text-slate-400 block mb-1">1930 Citizen Helpline</span>
            <div className="text-2xl font-extrabold text-cyber-cyanGlow">11.2 Lakh+</div>
            <p className="text-[11px] text-slate-400 mt-1">Complaints processed (I4C)</p>
          </div>

        </div>
      </section>

      {/* Project Ownership & Audit3A Attribution Section */}
      <section className="p-8 rounded-xl bg-gradient-to-r from-cyber-card via-slate-900 to-cyber-card border border-cyber-gold/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyber-gold uppercase">
            <Globe className="w-3.5 h-3.5" />
            <span>Project Owner & Founder</span>
          </div>
          <h3 className="text-xl font-bold text-white">
            Created by Thallapaka Jagadiswar
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Major Project developed under Computer Science & Technology curriculum. Designed as a high-security 
            cyber intelligence portal hosted in partnership with <strong>Audit3A</strong>.
          </p>
        </div>

        <div className="flex-shrink-0">
          <a
            href={creatorWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-lg bg-cyber-gold text-black font-bold text-sm shadow-gold-glow hover:bg-cyber-goldHover transition-all"
          >
            <span>Visit www.audit3a.com</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>

    </div>
  );
};

