import React, { useState } from 'react';
import { Brain, AlertCircle, ShieldAlert, CheckCircle, RefreshCw, Zap, ExternalLink, Info, Activity } from 'lucide-react';
import { apiService } from '../services/api';
import { SimulationResult } from '../types';

export const FraudSimulator: React.FC = () => {
  const [amount, setAmount] = useState<number>(78000);
  const [baselineAmount, setBaselineAmount] = useState<number>(2500);
  const [velocity, setVelocity] = useState<number>(8);
  const [isNewDevice, setIsNewDevice] = useState<boolean>(true);
  const [isUnusualLocation, setIsUnusualLocation] = useState<boolean>(true);
  const [isUnusualTime, setIsUnusualTime] = useState<boolean>(true);
  const [isOverseasIp, setIsOverseasIp] = useState<boolean>(true);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const res = await apiService.evaluateTransaction({
        amount,
        baseline_amount: baselineAmount,
        attempts_last_10min: velocity,
        is_new_device: isNewDevice,
        is_unusual_location: isUnusualLocation,
        is_unusual_time: isUnusualTime,
        is_overseas_ip: isOverseasIp
      });
      setResult(res);
    } finally {
      setLoading(false);
    }
  };

  const loadTirupatiPreset = async () => {
    setLoading(true);
    try {
      const preset = await apiService.getTirupatiPreset();
      const f = preset.input_features;
      setAmount(f.amount);
      setBaselineAmount(f.baseline_amount);
      setVelocity(f.attempts_last_10min);
      setIsNewDevice(f.is_new_device);
      setIsUnusualLocation(f.is_unusual_location);
      setIsUnusualTime(f.is_unusual_time);
      setIsOverseasIp(f.is_overseas_ip);
      
      const res = await apiService.evaluateTransaction(f);
      setResult(res);
    } finally {
      setLoading(false);
    }
  };

  const loadNormalPreset = () => {
    setAmount(1850);
    setBaselineAmount(2500);
    setVelocity(1);
    setIsNewDevice(false);
    setIsUnusualLocation(false);
    setIsUnusualTime(false);
    setIsOverseasIp(false);
    setResult(null);
  };

  return (
    <div className="space-y-8 py-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-xl bg-cyber-card border border-cyber-gold/30">
        <div>
          <div className="flex items-center gap-2 text-cyber-gold text-xs font-mono font-bold uppercase tracking-wider">
            <Brain className="w-4 h-4" />
            <span>AI Risk Scoring Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Transaction Fraud Detection Simulator
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Compare a trained <strong className="text-slate-200">Ensemble ML Model</strong> against a deterministic <strong className="text-slate-200">Rule-Based Engine</strong> with explainable SHAP-style reason codes.
          </p>
        </div>

        {/* Preset scenario triggers */}
        <div className="flex items-center gap-3">
          <button
            onClick={loadTirupatiPreset}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-200 font-mono text-xs font-bold transition-all shadow-amber-glow"
          >
            <Zap className="w-3.5 h-3.5 text-cyber-amberGlow" />
            <span>Load ₹78k Tirupati Scenario</span>
          </button>
          <button
            onClick={loadNormalPreset}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium transition-all"
          >
            Reset to Normal
          </button>
        </div>
      </div>

      {/* Model Benchmark Performance Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 rounded-lg bg-cyber-darkest border border-slate-800 text-center font-mono">
        <div className="p-2">
          <div className="text-[11px] text-slate-500">PRECISION</div>
          <div className="text-lg font-bold text-cyber-gold">89.2%</div>
        </div>
        <div className="p-2">
          <div className="text-[11px] text-slate-500">RECALL</div>
          <div className="text-lg font-bold text-cyber-gold">84.1%</div>
        </div>
        <div className="p-2">
          <div className="text-[11px] text-slate-500">F1-SCORE</div>
          <div className="text-lg font-bold text-cyber-gold">86.6%</div>
        </div>
        <div className="p-2">
          <div className="text-[11px] text-slate-500">PR-AUC</div>
          <div className="text-lg font-bold text-cyber-cyanGlow">0.884</div>
        </div>
        <div className="p-2 col-span-2 sm:col-span-1">
          <div className="text-[11px] text-slate-500">FALSE POSITIVE RATE</div>
          <div className="text-lg font-bold text-cyber-success">0.35%</div>
        </div>
      </div>

      {/* Interactive Controls & Scoring Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Controls (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-xl bg-cyber-card border border-slate-800 space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2 font-mono">
            <Activity className="w-4 h-4 text-cyber-gold" />
            Transaction Telemetry Input
          </h2>

          <div className="space-y-4">
            {/* Amount */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Transaction Amount (₹)</span>
                <span className="text-cyber-gold font-mono font-bold">₹{amount.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="100"
                max="150000"
                step="500"
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                className="w-full accent-cyber-gold"
              />
              <span className="text-[10px] text-slate-500">Habitual baseline: ₹{baselineAmount}</span>
            </div>

            {/* Velocity */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Attempts in Last 10 Minutes</span>
                <span className="text-cyber-gold font-mono font-bold">{velocity} attempts</span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                step="1"
                value={velocity}
                onChange={e => setVelocity(Number(e.target.value))}
                className="w-full accent-cyber-gold"
              />
            </div>

            {/* Boolean Indicators */}
            <div className="pt-2 space-y-3 border-t border-slate-800">
              
              <label className="flex items-center justify-between p-3 rounded-lg bg-cyber-surface hover:bg-slate-800/60 cursor-pointer border border-slate-800">
                <div>
                  <div className="text-xs font-semibold text-white">Overseas / VPN IP</div>
                  <div className="text-[11px] text-slate-400">Exit node or foreign ASN detected</div>
                </div>
                <input
                  type="checkbox"
                  checked={isOverseasIp}
                  onChange={e => setIsOverseasIp(e.target.checked)}
                  className="w-4 h-4 accent-cyber-gold rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg bg-cyber-surface hover:bg-slate-800/60 cursor-pointer border border-slate-800">
                <div>
                  <div className="text-xs font-semibold text-white">Unrecognized Hardware Device</div>
                  <div className="text-[11px] text-slate-400">New browser fingerprint or hardware UUID</div>
                </div>
                <input
                  type="checkbox"
                  checked={isNewDevice}
                  onChange={e => setIsNewDevice(e.target.checked)}
                  className="w-4 h-4 accent-cyber-gold rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg bg-cyber-surface hover:bg-slate-800/60 cursor-pointer border border-slate-800">
                <div>
                  <div className="text-xs font-semibold text-white">Unusual Location Discrepancy</div>
                  <div className="text-[11px] text-slate-400">Deviates from customer's habitual area</div>
                </div>
                <input
                  type="checkbox"
                  checked={isUnusualLocation}
                  onChange={e => setIsUnusualLocation(e.target.checked)}
                  className="w-4 h-4 accent-cyber-gold rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg bg-cyber-surface hover:bg-slate-800/60 cursor-pointer border border-slate-800">
                <div>
                  <div className="text-xs font-semibold text-white">Nocturnal Off-Hours Window</div>
                  <div className="text-[11px] text-slate-400">Activity between 01:00 AM and 05:00 AM</div>
                </div>
                <input
                  type="checkbox"
                  checked={isUnusualTime}
                  onChange={e => setIsUnusualTime(e.target.checked)}
                  className="w-4 h-4 accent-cyber-gold rounded"
                />
              </label>

            </div>

            <button
              onClick={handleSimulate}
              disabled={loading}
              className="w-full py-3 rounded-lg bg-cyber-gold hover:bg-cyber-goldHover text-black font-bold text-sm shadow-gold-glow transition-all flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
              <span>Compute ML Risk Score</span>
            </button>
          </div>
        </div>

        {/* Right Column: Scoring Results & Comparison (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <div className="p-6 rounded-xl bg-cyber-card border border-cyber-cardBorder space-y-6">
              
              {/* Score Display Card */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-xl bg-cyber-surface border border-slate-800">
                <div className="text-center sm:text-left">
                  <div className="text-xs font-mono text-slate-400 uppercase">
                    Calibrated ML Risk Probability
                  </div>
                  <div className="text-4xl sm:text-5xl font-extrabold mt-1 gold-gradient-text font-mono">
                    {(result.ml_risk_score * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-slate-400 mt-1 font-mono">
                    Score: {result.ml_risk_score} / 1.00
                  </div>
                </div>

                <div className="text-center sm:text-right space-y-2">
                  <div className="text-xs font-mono text-slate-400">RISK CLASSIFICATION</div>
                  <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold font-mono tracking-wider ${
                    result.risk_band === 'HIGH'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/50 shadow-danger-glow'
                      : (result.risk_band === 'MEDIUM' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50')
                  }`}>
                    {result.risk_band} RISK
                  </span>
                  <div className="text-xs font-mono text-slate-300">
                    Decision: <strong>{result.recommendation}</strong>
                  </div>
                </div>
              </div>

              {/* Explainability Reason Codes */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <Info className="w-4 h-4 text-cyber-gold" />
                  SHAP Explainability Reason Codes
                </h3>
                <div className="space-y-2">
                  {result.reason_codes.map((rc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-cyber-darkest border border-slate-800 text-xs">
                      <div className="space-y-0.5">
                        <span className="font-mono font-bold text-cyber-gold">{rc.code}</span>
                        <p className="text-slate-400">{rc.desc}</p>
                      </div>
                      <span className="font-mono font-bold text-amber-400 px-2 py-1 bg-amber-500/10 rounded">
                        {rc.impact}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Baseline Comparison */}
              <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-400">Deterministic Rule-Engine Output:</span>
                  <span className="font-mono font-bold text-slate-200">
                    Score: {result.rule_based_comparison.rule_score} ({result.rule_based_comparison.rule_decision})
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 space-y-1">
                  {result.rule_based_comparison.rule_reasons.map((r, i) => (
                    <div key={i}>• {r}</div>
                  ))}
                </div>
              </div>

              {/* Human in the loop Guidance */}
              <div className="p-4 rounded-lg bg-amber-950/30 border border-amber-600/30 text-xs text-amber-200/90 space-y-1">
                <strong>Human-in-the-Loop Operational Guidance:</strong>
                <p>{result.guidance}</p>
              </div>

            </div>
          ) : (
            <div className="p-12 rounded-xl bg-cyber-card border border-slate-800 text-center space-y-4">
              <Brain className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-slate-300">
                Ready to Evaluate
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Adjust telemetry controls on the left or tap <strong>Load ₹78k Tirupati Scenario</strong> to inspect how the ML ensemble computes non-linear risk interactions.
              </p>
            </div>
          )}

          {/* Educational Caveat */}
          <div className="p-4 rounded-lg bg-cyber-darkest border border-slate-800 text-[11px] text-slate-500 font-mono">
            SYNTHETIC DEMO DATA — NOT LIVE BANK DATA. A machine learning risk score represents a statistical anomaly estimate, not definitive legal proof of fraud.
          </div>
        </div>

      </div>

    </div>
  );
};
