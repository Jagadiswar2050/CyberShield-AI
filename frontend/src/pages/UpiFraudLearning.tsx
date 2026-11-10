import React from 'react';
import { Shield, AlertTriangle, CheckCircle2, XCircle, QrCode, Smartphone, PhoneCall, Lock, ExternalLink, HelpCircle } from 'lucide-react';

export const UpiFraudLearning: React.FC = () => {
  const scams = [
    {
      title: "1. The QR Code 'Receive Money' Scam",
      icon: QrCode,
      color: "text-amber-400",
      modality: "Online marketplaces (OLX, Quikr, Facebook Marketplace), rental postings",
      howItWorks: "Fraudster pretends to buy an item you listed. They send you a QR code via WhatsApp saying: 'Scan this QR code to receive the advance payment of ₹15,000 directly into your bank account'.",
      whyVictimsFallForIt: "Victims confuse the act of scanning a QR code with receiving money.",
      goldenRule: "SCANNING A QR CODE OR ENTERING A UPI PIN ALWAYS SENDS MONEY AWAY. You NEVER scan a QR code or enter a PIN to receive funds.",
      actionIfTargeted: "Never scan unknown QR codes. Report the seller profile and phone number on 1930."
    },
    {
      title: "2. The UPI Collect-Request Deception",
      icon: Smartphone,
      color: "text-red-400",
      modality: "Direct collect requests sent via PhonePe, Google Pay, or Paytm",
      howItWorks: "Attacker issues a collect request from an arbitrary UPI ID with a misleading transaction note like 'Government Tax Refund Approved ₹4,999' or 'Lottery Winner Credited'. Clicking 'Pay' prompts for your UPI PIN, which debits your account.",
      whyVictimsFallForIt: "Victims assume the green/prominent notification represents incoming credit.",
      goldenRule: "A UPI Collect Request is an invoice requesting you to PAY money, not receive it.",
      actionIfTargeted: "Decline the collect request immediately and block the VPA (Virtual Payment Address) in your app."
    },
    {
      title: "3. Fake Customer Care & Search Engine Poisoning",
      icon: PhoneCall,
      color: "text-cyan-400",
      modality: "Google Maps edits, sponsored search ads, fake Twitter handles",
      howItWorks: "Victim searches for airline, courier, or bank customer care on Google. Fraudsters buy ads or edit business listings with their own personal mobile numbers. When called, the fake executive instructs the victim to pay a ₹2 'refund verification fee' via an external link.",
      whyVictimsFallForIt: "High trust in top Google search results.",
      goldenRule: "Only use customer support phone numbers printed directly on your bank card or inside the official verified banking application.",
      actionIfTargeted: "Never dial unverified customer support numbers found on random search engine snippets."
    },
    {
      title: "4. Remote Screen-Sharing Tools (AnyDesk, QuickSupport, RustDesk)",
      icon: Lock,
      color: "text-yellow-400",
      modality: "Impersonation of electricity boards, KYC compliance officers, courier delivery",
      howItWorks: "Caller warns: 'Your electricity/SIM card will be disconnected tonight due to pending KYC'. They instruct the victim to download AnyDesk or TeamViewer QuickSupport and ask for the 9-digit session code. Once shared, they view incoming OTPs in real-time and drain accounts.",
      whyVictimsFallForIt: "Panic and manufactured urgency regarding essential services.",
      goldenRule: "Legitimate organizations NEVER ask you to download screen-sharing tools to verify KYC.",
      actionIfTargeted: "If already installed, immediately disconnect Wi-Fi and mobile data, turn off the phone, and factory reset."
    }
  ];

  return (
    <div className="space-y-8 py-6">
      
      {/* Header */}
      <div className="p-6 rounded-xl bg-cyber-card border border-cyber-gold/30">
        <div className="flex items-center gap-2 text-cyber-gold text-xs font-mono font-bold uppercase tracking-wider">
          <Shield className="w-4 h-4" />
          <span>Public Safety & Prevention Academy</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          UPI Fraud Learning Centre & Modus Operandi
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Deconstructing the most pervasive financial social engineering attack vectors across digital payment ecosystems in India.
        </p>
      </div>

      {/* The Core UPI Rule Banner */}
      <div className="p-6 rounded-xl bg-gradient-to-r from-red-950/60 via-cyber-card to-amber-950/60 border border-red-500/40 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-mono font-bold uppercase">
          <AlertTriangle className="w-4 h-4" />
          <span>Fundamental Digital Banking Principle</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white">
          "UPI PIN IS ONLY FOR SENDING MONEY, NEVER FOR RECEIVING"
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          If someone asks you to enter your PIN, scan a QR code, or approve a request to receive funds or cashbacks, 
          it is an <strong className="text-red-400">attempted cyber theft</strong>.
        </p>
      </div>

      {/* Scams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {scams.map((scam, idx) => {
          const Icon = scam.icon;
          return (
            <div key={idx} className="p-6 rounded-xl bg-cyber-card border border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-cyber-surface border border-slate-700">
                  <Icon className={`w-5 h-5 ${scam.color}`} />
                </div>
                <h3 className="text-base font-bold text-white">
                  {scam.title}
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-mono text-slate-400 block mb-0.5">Common Channels:</span>
                  <p className="text-slate-200">{scam.modality}</p>
                </div>

                <div>
                  <span className="font-mono text-slate-400 block mb-0.5">Modus Operandi:</span>
                  <p className="text-slate-300 leading-relaxed">{scam.howItWorks}</p>
                </div>

                <div className="p-3 rounded-lg bg-red-950/30 border border-red-500/30 text-red-200">
                  <strong className="block font-mono text-[11px] mb-1">Defense Rule:</strong>
                  {scam.goldenRule}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* RBI Limited Liability Matrix */}
      <div className="p-6 rounded-xl bg-cyber-surface border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white font-mono">
              RBI Customer Liability Matrix (Circular DBR.No.Leg.BC.78/09.07.005/2017-18)
            </h3>
            <p className="text-xs text-slate-400">
              Understanding your statutory rights in unauthorized electronic transactions.
            </p>
          </div>
          <a
            href="https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=11040"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-cyber-gold hover:underline inline-flex items-center gap-1 font-mono"
          >
            Official RBI Circular <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-cyber-darkest text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">Scenario / Reporting Window</th>
                <th className="p-3">Customer Liability</th>
                <th className="p-3">Prerequisites</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              <tr>
                <td className="p-3 font-semibold text-white">Bank Deficiency or Third-Party Breach within 3 working days</td>
                <td className="p-3 text-cyber-success font-bold">ZERO LIABILITY (Full Bank Reimbursement)</td>
                <td className="p-3 text-slate-400">Reported to the bank within 3 working days of SMS communication.</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">Third-Party Breach reported within 4 to 7 working days</td>
                <td className="p-3 text-cyber-gold font-bold">MAX ₹5,000 to ₹25,000 (Based on account tier)</td>
                <td className="p-3 text-slate-400">Balance amount is borne by the financial institution.</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">Customer Shared Credentials / Negligence</td>
                <td className="p-3 text-cyber-danger font-bold">100% CUSTOMER LIABILITY</td>
                <td className="p-3 text-slate-400">Customer willingly disclosed OTP, PIN, or password to attacker until reported.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
