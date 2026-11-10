import React from 'react';
import { AlertCircle, ExternalLink, BarChart3, PieChart as PieIcon, ShieldAlert } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

export const BankingFraudAnalytics: React.FC = () => {
  // Official RBI data breakdown from Report on Trend and Progress of Banking in India 2023-24
  const volumeBreakdown = [
    { name: 'Card & Internet Banking', value: 80.6, count: '29,082 cases', fill: '#38BDF8' },
    { name: 'Advances (Loans)', value: 9.8, count: '3,535 cases', fill: '#D4AF37' },
    { name: 'Deposits', value: 5.4, count: '1,948 cases', fill: '#F59E0B' },
    { name: 'Off-Balance Sheet & Other', value: 4.2, count: '1,510 cases', fill: '#64748B' }
  ];

  const valueBreakdown = [
    { name: 'Advances (Loan Frauds)', value: 67.2, amount: '₹14,427 Cr', fill: '#D4AF37' },
    { name: 'Off-Balance Sheet', value: 18.5, amount: '₹3,971 Cr', fill: '#F59E0B' },
    { name: 'Card & Internet Banking', value: 6.7, amount: '₹1,438 Cr', fill: '#38BDF8' },
    { name: 'Deposits & Foreign Exchange', value: 7.6, amount: '₹1,633 Cr', fill: '#64748B' }
  ];

  const historicalTrends = [
    { year: 'FY 2020-21', cases: 7359, amountCr: 138422 },
    { year: 'FY 2021-22', cases: 9103, amountCr: 60414 },
    { year: 'FY 2022-23', cases: 13564, amountCr: 30252 },
    { year: 'FY 2023-24', cases: 36075, amountCr: 21469 }
  ];

  return (
    <div className="space-y-8 py-6">
      
      {/* Header */}
      <div className="p-6 rounded-xl bg-cyber-card border border-cyber-gold/30">
        <div className="flex items-center gap-2 text-cyber-gold text-xs font-mono font-bold uppercase tracking-wider">
          <AlertCircle className="w-4 h-4" />
          <span>RBI Published Banking Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          Banking Fraud Analytics & Scope Definitions
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Detailed breakdown of fraud cases and amounts involved reported by Scheduled Commercial Banks to the Reserve Bank of India (RBI).
        </p>
      </div>

      {/* Critical Scope Explanation Banner */}
      <div className="p-5 rounded-xl bg-cyber-surface border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-cyber-gold font-mono uppercase tracking-wide">
          Crucial Understanding: The "Volume vs. Value" Paradox
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          In FY 2023-24, total bank fraud cases rose sharply to <strong>36,075</strong>, while the total amount involved dropped to <strong>₹21,469 Crore</strong> (from over ₹1.38 lakh Crore in FY 2020-21). 
          This paradox is explained by the surge in retail digital payments: <strong>Card & Internet frauds comprise 80.6% of all incidents by count</strong>, yet represent only <strong>6.7% of total monetary value</strong>, whereas large corporate loan defaults constitute two-thirds of monetary losses despite rare occurrence.
        </p>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart 1: Volume Breakdown */}
        <div className="p-6 rounded-xl bg-cyber-card border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white font-mono">
                Fraud Cases by Category (Volume Share %)
              </h3>
              <p className="text-xs text-slate-400">Total: 36,075 Cases in FY 2023-24</p>
            </div>
            <PieIcon className="w-4 h-4 text-cyber-gold" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={volumeBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                >
                  {volumeBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0C1322', borderColor: '#D4AF37', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val: any, name: any, item: any) => [`${val}% (${item.payload.count})`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-800">
            {volumeBreakdown.map((b, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: b.fill }} />
                <span className="text-slate-300 truncate">{b.name}:</span>
                <span className="text-white font-bold">{b.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Value Breakdown */}
        <div className="p-6 rounded-xl bg-cyber-card border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white font-mono">
                Amount Involved by Category (Monetary Share %)
              </h3>
              <p className="text-xs text-slate-400">Total: ₹21,469 Crore in FY 2023-24</p>
            </div>
            <BarChart3 className="w-4 h-4 text-cyber-gold" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={valueBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                >
                  {valueBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0C1322', borderColor: '#D4AF37', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val: any, name: any, item: any) => [`${val}% (${item.payload.amount})`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-800">
            {valueBreakdown.map((b, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: b.fill }} />
                <span className="text-slate-300 truncate">{b.name}:</span>
                <span className="text-white font-bold">{b.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Historical Trend Bar Chart */}
      <div className="p-6 rounded-xl bg-cyber-card border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white font-mono">
          4-Year Evolution of Bank Frauds in India (RBI Reported)
        </h3>
        <p className="text-xs text-slate-400">
          Comparing Case Count Surge against Total Amount Involved (₹ Crore).
        </p>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={historicalTrends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="year" stroke="#64748B" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748B" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0C1322', borderColor: '#D4AF37', borderRadius: '8px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="cases" name="Fraud Cases (Count)" fill="#38BDF8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="amountCr" name="Amount Involved (₹ Crore)" fill="#D4AF37" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="pt-2 text-[11px] text-slate-500 font-mono flex items-center justify-between">
          <span>Source: Reserve Bank of India (RBI) Annual Report on Trend & Progress of Banking</span>
          <a
            href="https://www.rbi.org.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyber-gold hover:underline inline-flex items-center gap-1"
          >
            rbi.org.in <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

    </div>
  );
};
