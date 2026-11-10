import React, { useState } from 'react';
import { Sparkles, Send, ShieldAlert, PhoneCall, ExternalLink, Bot, User, RefreshCw, AlertTriangle } from 'lucide-react';
import { apiService } from '../services/api';
import { ChatMessage } from '../types';
import { useAuth } from '../context/AuthContext';

export const AiAssistant: React.FC = () => {
  const { creatorWebsite } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: (
        "Welcome to the **CyberShield AI Safety Advisor**.\n\n" +
        "I provide source-verified guidance on UPI scams, phishing patterns, card fraud defense, and emergency reporting protocols under RBI/MHA guidelines.\n\n" +
        "⚠️ **CRITICAL PRIVACY DIRECTIVE**: Never type your real ATM PIN, UPI PIN, CVV, passwords, or full 16-digit debit/credit card numbers here."
      ),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      citations: [
        {
          title: "National Cyber Crime Reporting Portal",
          source_org: "Ministry of Home Affairs",
          source_url: "https://cybercrime.gov.in/",
          last_verified: "2024-10-15"
        }
      ]
    }
  ]);

  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const res = await apiService.sendChatMessage(currentInput);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: res.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: res.citations
      };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      const errMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: "For urgent financial cyber assistance in India, immediately dial 1930 or file a complaint on https://cybercrime.gov.in/.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    "Someone sent a QR code to send me money for an OLX sofa. Is this legit?",
    "I received a call asking me to install AnyDesk for an electricity bill update.",
    "What should I do immediately in the golden hour if I lost money in a cyber fraud?",
    "What are RBI's rules for customer liability in unauthorized electronic transactions?"
  ];

  return (
    <div className="space-y-6 py-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="p-6 rounded-xl bg-cyber-card border border-cyber-gold/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyber-gold text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>RAG Verified Knowledge Core</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">
            Cyber Safety & UPI Fraud Advisor
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Grounded in official RBI, NPCI, and Ministry of Home Affairs safety documentation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="tel:1930"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-300 text-xs font-mono font-bold transition-all"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>1930 Helpline</span>
          </a>
        </div>
      </div>

      {/* Chat Messages Box */}
      <div className="p-4 sm:p-6 rounded-xl bg-cyber-card border border-slate-800 space-y-4 min-h-[420px] max-h-[580px] overflow-y-auto">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${
              msg.sender === 'user'
                ? 'bg-cyber-gold text-black font-bold'
                : 'bg-cyber-surface border border-cyber-gold/40 text-cyber-gold'
            }`}>
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`p-4 rounded-xl max-w-2xl text-xs sm:text-sm leading-relaxed space-y-3 ${
              msg.sender === 'user'
                ? 'bg-cyber-surface border border-slate-700 text-white'
                : 'bg-cyber-darkest border border-slate-800 text-slate-200'
            }`}>
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {/* Citations block */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
                  <span className="text-cyber-gold block font-semibold">Verified Source Citations:</span>
                  {msg.citations.map((c, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span>• {c.title} ({c.source_org})</span>
                      <a
                        href={c.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyber-gold hover:underline inline-flex items-center gap-0.5"
                      >
                        Source <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  ))}
                </div>
              )}

              <div className="text-[10px] text-slate-500 font-mono text-right">
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs font-mono p-3">
            <RefreshCw className="w-4 h-4 animate-spin text-cyber-gold" />
            <span>Consulting verified cyber knowledge base...</span>
          </div>
        )}
      </div>

      {/* Sample Quick Questions */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-mono text-slate-400">Frequently Asked Inquiries:</span>
        <div className="flex flex-wrap gap-2">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => { setInput(q); }}
              className="px-3 py-1.5 rounded-lg bg-cyber-card hover:bg-slate-800 border border-slate-800 hover:border-cyber-gold/40 text-xs text-slate-300 transition-all text-left"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="relative">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask a question about UPI fraud, phishing, AnyDesk scams, or RBI rules..."
          className="w-full pl-4 pr-12 py-3.5 rounded-xl bg-cyber-card border border-slate-800 focus:border-cyber-gold focus:outline-none text-white text-sm placeholder:text-slate-500 font-sans shadow-lg"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="absolute right-2 top-2 p-2 rounded-lg bg-cyber-gold text-black hover:bg-cyber-goldHover disabled:opacity-50 transition-all shadow-gold-glow"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Disclaimer */}
      <div className="text-center text-[11px] text-slate-500 font-mono">
        Educational AI assistant created by <strong>Thallapaka Jagadiswar</strong> (<a href={creatorWebsite} target="_blank" rel="noopener noreferrer" className="text-cyber-gold hover:underline">Audit3A</a>). 
        Not an emergency police desk. In active emergencies, dial 1930 immediately.
      </div>

    </div>
  );
};
