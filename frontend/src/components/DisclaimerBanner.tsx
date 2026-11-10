import React from 'react';
import { AlertTriangle, PhoneCall, ExternalLink } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <div className="bg-amber-950/70 border-b border-amber-600/40 text-amber-200 px-4 py-2.5 text-xs sm:text-sm font-medium">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-cyber-amberGlow flex-shrink-0 animate-pulse" />
          <span>
            <strong className="text-amber-100 font-semibold">Independent Academic Research Portal:</strong> CyberShield AI is not a government agency, police department, or commercial bank.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="tel:1930"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-cyber-amberGlow/20 hover:bg-cyber-amberGlow/30 border border-cyber-amberGlow/50 rounded text-amber-200 hover:text-white transition-all font-mono"
          >
            <PhoneCall className="w-3.5 h-3.5 text-cyber-amberGlow" />
            <span>Emergency 24x7: <strong>1930</strong></span>
          </a>
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-cyber-gold hover:text-cyber-goldHover underline"
          >
            cybercrime.gov.in
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

