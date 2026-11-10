import React, { useState } from 'react';
import { HelpCircle, AlertTriangle, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface ReportFraudProps {
  setCurrentTab: (tab: string) => void;
}

export const ReportFraud: React.FC<ReportFraudProps> = ({ setCurrentTab }) => {
  const { user } = useAuth();
  const [incidentType, setIncidentType] = useState<string>('UPI Collect Scam');
  const [platform, setPlatform] = useState<string>('WhatsApp');
  const [approxAmount, setApproxAmount] = useState<string>('');
  const [incidentDate, setIncidentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState<string>('');
  
  const [loading, setLoading] = useState<boolean>(false);
  const [successResult, setSuccessResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-cyber-card border border-cyber-gold/40 flex items-center justify-center text-cyber-gold mx-auto">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">
          Sign In to Submit an Awareness Report
        </h2>
        <p className="text-sm text-slate-400">
          Submitting community cyber-fraud reports requires an authenticated account to track your report's status and prevent automated spam.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setCurrentTab('login')}
            className="px-6 py-2.5 rounded-lg bg-cyber-gold text-black font-bold text-sm shadow-gold-glow hover:bg-cyber-goldHover transition-all"
          >
            Sign In
          </button>
          <button
            onClick={() => setCurrentTab('register')}
            className="px-6 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-sm hover:text-white"
          >
            Create Free Account
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    // Validate no card numbers
    if (/\b\d{4}[ -]?\d{4}[ -]?\d{4}[ -]?\d{4}\b/.test(description)) {
      setErrorMessage("SECURITY VIOLATION: Never include 16-digit card numbers in report descriptions.");
      setLoading(false);
      return;
    }

    try {
      const res = await apiService.submitReport({
        incident_type: incidentType,
        platform_used: platform,
        approx_amount: approxAmount ? parseFloat(approxAmount) : undefined,
        incident_date: incidentDate,
        description
      });
      setSuccessResult(res);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-8">
      
      {/* Header */}
      <div className="p-6 rounded-xl bg-cyber-card border border-cyber-gold/30">
        <div className="flex items-center gap-2 text-cyber-gold text-xs font-mono font-bold uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>Academic & Community Reporting Portal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          Submit Cyber-Fraud Modus Operandi Report
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Logged-in User: <strong className="text-slate-200">{user.email}</strong>. Submissions are reviewed for academic research and pattern classification.
        </p>
      </div>

      {/* Critical Security Warning */}
      <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-600/40 text-xs text-amber-200 space-y-1">
        <div className="flex items-center gap-2 font-bold font-mono text-cyber-amberGlow">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>DATA PRIVACY DIRECTIVE — DO NOT SHARE SENSITIVE CREDENTIALS</span>
        </div>
        <p className="leading-relaxed">
          Never enter your passwords, PINs, OTPs, or debit/credit card numbers in this form. 
          This is an independent academic portal, NOT the police. To file an official criminal FIR, visit <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="underline text-cyber-gold">cybercrime.gov.in</a> or dial <strong>1930</strong>.
        </p>
      </div>

      {successResult ? (
        <div className="p-8 rounded-xl bg-cyber-card border border-emerald-500/40 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">
            Report Submitted Successfully
          </h2>
          <div className="p-4 rounded-lg bg-cyber-darkest border border-slate-800 max-w-sm mx-auto font-mono text-xs">
            <span className="text-slate-400 block mb-1">Your Tracking Number:</span>
            <span className="text-lg font-bold text-cyber-gold">{successResult.tracking_number}</span>
          </div>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            {successResult.advisory}
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <button
              onClick={() => { setSuccessResult(null); setDescription(''); }}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200"
            >
              Submit Another Report
            </button>
            <button
              onClick={() => setCurrentTab('user-portal')}
              className="px-4 py-2 rounded-lg bg-cyber-gold hover:bg-cyber-goldHover text-xs text-black font-bold"
            >
              View In My Portal
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-8 rounded-xl bg-cyber-card border border-slate-800 space-y-6">
          
          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/50 text-red-200 text-xs">
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-2">
                Fraud Modality / Classification
              </label>
              <select
                value={incidentType}
                onChange={e => setIncidentType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-cyber-darkest border border-slate-800 text-white text-xs focus:border-cyber-gold focus:outline-none"
              >
                <option value="UPI Collect Scam">UPI Collect Request Scam</option>
                <option value="QR Code Scam">QR Code Receive Scam</option>
                <option value="Remote Access APK (AnyDesk/TeamViewer)">Remote Access APK (AnyDesk/TeamViewer)</option>
                <option value="Fake Customer Care Number">Fake Customer Care Number</option>
                <option value="Phishing SMS / Link">Phishing SMS / Link</option>
                <option value="SIM Swap Fraud">SIM Swap Fraud</option>
                <option value="Investment / Trading Task Scam">Investment / Telegram Task Scam</option>
                <option value="Other">Other Cybercrime Scenario</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-2">
                Platform / Medium Used
              </label>
              <select
                value={platform}
                onChange={e => setPlatform(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-cyber-darkest border border-slate-800 text-white text-xs focus:border-cyber-gold focus:outline-none"
              >
                <option value="WhatsApp">WhatsApp</option>
                <option value="Telegram">Telegram</option>
                <option value="Phone Call (Voice)">Phone Call (Voice)</option>
                <option value="SMS">SMS</option>
                <option value="Google Search Result">Google Search Result</option>
                <option value="Instagram / Facebook">Instagram / Facebook</option>
                <option value="Fake Mobile Application">Fake Mobile Application</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-2">
                Approximate Amount Involved (₹ optional)
              </label>
              <input
                type="number"
                value={approxAmount}
                onChange={e => setApproxAmount(e.target.value)}
                placeholder="e.g. 15000"
                className="w-full px-3.5 py-2.5 rounded-lg bg-cyber-darkest border border-slate-800 text-white text-xs focus:border-cyber-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-2">
                Incident Date
              </label>
              <input
                type="date"
                value={incidentDate}
                onChange={e => setIncidentDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-cyber-darkest border border-slate-800 text-white text-xs focus:border-cyber-gold focus:outline-none"
              />
            </div>

          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-2">
              Modus Operandi Description (Min 15 chars)
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe how the fraudster approached you, what story they gave, and how the scam played out. (DO NOT include personal passwords, OTPs, or card numbers)..."
              className="w-full p-3.5 rounded-lg bg-cyber-darkest border border-slate-800 text-white text-xs focus:border-cyber-gold focus:outline-none leading-relaxed"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-cyber-gold hover:bg-cyber-goldHover text-black font-bold text-sm shadow-gold-glow transition-all flex items-center justify-center gap-2"
          >
            <span>Submit Academic Report</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}

    </div>
  );
};
