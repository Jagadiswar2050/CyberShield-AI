import React, { useState, useEffect } from 'react';
import { TrendingUp, Activity, RefreshCw, BarChart2, Info, ArrowUpRight } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { apiService } from '../services/api';
import { ForecastResponse } from '../types';

export const FinancialForecast: React.FC = () => {
  const [horizon, setHorizon] = useState<number>(6);
  const [data, setData] = useState<ForecastResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchForecast(horizon);
  }, [horizon]);

  const fetchForecast = async (h: number) => {
    setLoading(true);
    try {
      const res = await apiService.getForecast(h);
      setData(res);
    } finally {
      setLoading(false);
    }
  };

  // Combine historical and forecast arrays for unified Recharts time-series visualization
  const combinedSeries = data ? [
    ...data.historical_data.map(d => ({
      period: d.period,
      historical: d.actual,
      fitted: d.fitted,
      forecast: null,
      lower_bound: null,
      upper_bound: null
    })),
    // Link historical end with forecast
    ...data.forecast_data.map(d => ({
      period: d.period,
      historical: null,
      fitted: null,
      forecast: d.forecast,
      lower_bound: d.lower_bound_95,
      upper_bound: d.upper_bound_95
    }))
  ] : [];

  return (
    <div className="space-y-8 py-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-xl bg-cyber-card border border-cyber-gold/30">
        <div>
          <div className="flex items-center gap-2 text-cyber-gold text-xs font-mono font-bold uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            <span>Time-Series Analytics Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Financial Transaction Forecasting Workspace
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Simulates digital payment throughput trends, seasonal surge patterns, and 95% statistical confidence cones.
          </p>
        </div>

        {/* Horizon selector */}
        <div className="flex items-center gap-2 bg-cyber-darkest p-1.5 rounded-lg border border-slate-800 text-xs font-mono">
          <span className="text-slate-400 px-2">Forecast Horizon:</span>
          {[3, 6, 9, 12].map(h => (
            <button
              key={h}
              onClick={() => setHorizon(h)}
              className={`px-3 py-1.5 rounded font-bold transition-all ${
                horizon === h
                  ? 'bg-cyber-gold text-black shadow-gold-glow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              +{h} Mo
            </button>
          ))}
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="p-6 rounded-xl bg-cyber-card border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-white font-mono">
              Digital Payment Volume Projection (Thousands of Transactions)
            </h2>
            <p className="text-xs text-slate-400">
              Historical baseline (Jan 2024 - Jun 2025) and extrapolated 95% confidence intervals.
            </p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300">
            Triple Exponential Smoothing (Holt-Winters)
          </span>
        </div>

        {loading ? (
          <div className="h-80 flex items-center justify-center text-slate-500">
            <RefreshCw className="w-6 h-6 animate-spin mr-2" />
            Loading forecasting simulation...
          </div>
        ) : (
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={combinedSeries} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHist" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorBounds" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="period" stroke="#64748B" tick={{ fontSize: 11 }} />
                <YAxis 
                  stroke="#64748B" 
                  tick={{ fontSize: 11 }} 
                  domain={['dataMin - 100000', 'dataMax + 100000']}
                  tickFormatter={val => `${(val / 1000).toFixed(0)}k`} 
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0C1322', borderColor: '#D4AF37', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val: any) => [`${Number(val).toLocaleString('en-IN')}`, '']}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />
                
                {/* 95% Confidence Bounds */}
                <Area type="monotone" dataKey="upper_bound" name="Upper 95% Bound" stroke="#F59E0B" strokeDasharray="3 3" fillOpacity={1} fill="url(#colorBounds)" />
                <Area type="monotone" dataKey="lower_bound" name="Lower 95% Bound" stroke="#F59E0B" strokeDasharray="3 3" fillOpacity={0} fill="none" />
                
                {/* Projected Forecast */}
                <Area type="monotone" dataKey="forecast" name="Forecast Model" stroke="#D4AF37" strokeWidth={3} fillOpacity={1} fill="url(#colorForecast)" />

                {/* Historical Actual */}
                <Area type="monotone" dataKey="historical" name="Historical Actual" stroke="#38BDF8" strokeWidth={2} fillOpacity={1} fill="url(#colorHist)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Evaluation Metrics Cards */}
        {data && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800 font-mono">
            <div className="p-3 rounded-lg bg-cyber-darkest border border-slate-800">
              <span className="text-[11px] text-slate-500 block">MEAN ABS. ERROR (MAE)</span>
              <span className="text-base font-bold text-cyber-gold">{data.evaluation_metrics.mae.toLocaleString()}</span>
            </div>
            <div className="p-3 rounded-lg bg-cyber-darkest border border-slate-800">
              <span className="text-[11px] text-slate-500 block">ROOT MEAN SQ. (RMSE)</span>
              <span className="text-base font-bold text-cyber-gold">{data.evaluation_metrics.rmse.toLocaleString()}</span>
            </div>
            <div className="p-3 rounded-lg bg-cyber-darkest border border-slate-800">
              <span className="text-[11px] text-slate-500 block">MAPE PERCENTAGE</span>
              <span className="text-base font-bold text-cyber-success">{data.evaluation_metrics.mape_percent}%</span>
            </div>
            <div className="p-3 rounded-lg bg-cyber-darkest border border-slate-800">
              <span className="text-[11px] text-slate-500 block">GOODNESS-OF-FIT (R²)</span>
              <span className="text-base font-bold text-cyber-cyanGlow">{data.evaluation_metrics.r_squared}</span>
            </div>
          </div>
        )}
      </div>

      {/* Methodology Description */}
      <div className="p-6 rounded-xl bg-cyber-surface border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
          <Info className="w-4 h-4 text-cyber-gold" />
          Time-Series Model Formulation & Limitations
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          The forecast incorporates multiplicative seasonal components with an exponential smoothing dampener to prevent over-optimistic linear growth traps. 
          The expanding confidence intervals reflect compounding uncertainty in longer forward horizons (heteroscedastic error dispersion).
        </p>
        <div className="text-[11px] text-amber-300/80 font-mono">
          SYNTHETIC DEMO FORECAST — Illustrative time-series projection for educational demonstration.
        </div>
      </div>

    </div>
  );
};
