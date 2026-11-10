import { OfficialStatistic, CaseStudy, SimulationResult, ForecastResponse, IncidentReport, User } from '../types';

const API_BASE = '/api/v1';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('cybershield_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const apiService = {
  // Statistics & Public Intelligence
  async getStatistics(category?: string, metricType?: string): Promise<OfficialStatistic[]> {
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (metricType) params.append('metric_type', metricType);
      const res = await fetch(`${API_BASE}/cybercrime/statistics?${params.toString()}`);
      if (!res.ok) throw new Error('API fetch failed');
      const json = await res.json();
      return json.data;
    } catch (err) {
      // Offline / fallback data with verified sources
      return [
        {
          id: 1,
          indicator_name: "Scheduled Commercial Banks - Total Fraud Cases Reported",
          category: "banking_fraud",
          value: 36075,
          unit: "Cases",
          geography: "India (All SCBs)",
          population_coverage: "Scheduled Commercial Banks",
          period_start: "2023-04-01",
          period_end: "2024-03-31",
          publication_date: "2024-05-30",
          source_org: "Reserve Bank of India (RBI)",
          source_url: "https://www.rbi.org.in/",
          metric_type: "bank_fraud_cases",
          methodology_notes: "Cases >= ₹1 lakh. Volume surge driven by card/internet frauds.",
          status: "official",
          is_published: true
        },
        {
          id: 2,
          indicator_name: "Scheduled Commercial Banks - Total Amount Involved",
          category: "banking_fraud",
          value: 21469,
          unit: "Crore INR",
          geography: "India (All SCBs)",
          population_coverage: "Scheduled Commercial Banks",
          period_start: "2023-04-01",
          period_end: "2024-03-31",
          publication_date: "2024-05-30",
          source_org: "Reserve Bank of India (RBI)",
          source_url: "https://www.rbi.org.in/",
          metric_type: "amount_involved",
          methodology_notes: "Amount involved is initial exposure, not net permanent loss. Loan advances constitute ~67%.",
          status: "official",
          is_published: true
        },
        {
          id: 3,
          indicator_name: "Digital Payment & Card Frauds Reported",
          category: "digital_payments",
          value: 29082,
          unit: "Cases",
          geography: "India (All SCBs)",
          population_coverage: "Card/Internet/Mobile transactions",
          period_start: "2023-04-01",
          period_end: "2024-03-31",
          publication_date: "2024-05-30",
          source_org: "Reserve Bank of India (RBI)",
          source_url: "https://www.rbi.org.in/",
          metric_type: "bank_fraud_cases",
          methodology_notes: "Accounts for 80.6% of bank fraud case volume, but only 6.7% of total amount involved.",
          status: "official",
          is_published: true
        },
        {
          id: 4,
          indicator_name: "Total Cybercrime Registered Cases (NCRB)",
          category: "cybercrime",
          value: 65893,
          unit: "Registered FIRs",
          geography: "All 28 States & 8 UTs",
          population_coverage: "Police Stations under Crime in India",
          period_start: "2022-01-01",
          period_end: "2022-12-31",
          publication_date: "2023-12-03",
          source_org: "National Crime Records Bureau (NCRB)",
          source_url: "https://ncrb.gov.in/",
          metric_type: "registered_cases",
          methodology_notes: "Formal police registered FIRs. 67.5% motive was financial fraud.",
          status: "official",
          is_published: true
        },
        {
          id: 5,
          indicator_name: "National 1930 Cyber Helpline Complaints Handled",
          category: "cybercrime",
          value: 1120000,
          unit: "Complaints",
          geography: "India (National)",
          population_coverage: "CFCFRMS / Citizen Financial Cyber Fraud System",
          period_start: "2023-01-01",
          period_end: "2023-12-31",
          publication_date: "2024-02-06",
          source_org: "Indian Cyber Crime Coordination Centre (I4C), MHA",
          source_url: "https://i4c.mha.gov.in/",
          metric_type: "complaints",
          methodology_notes: "Citizen complaints received. Over ₹1,200 Crore provisionally frozen.",
          status: "official",
          is_published: true
        }
      ];
    }
  },

  async getCaseStudies(): Promise<CaseStudy[]> {
    try {
      const res = await fetch(`${API_BASE}/cybercrime/case-studies`);
      if (!res.ok) throw new Error('API fetch failed');
      const json = await res.json();
      return json.data;
    } catch {
      return [
        {
          id: 1,
          title: "Yapı Kredi Real-Time Adaptive Fraud Scoring Implementation",
          organization: "Yapı Kredi Bank (Turkey)",
          vendor_partner: "FICO (Fair Isaac Corporation)",
          reported_metrics: "Vendor-reported 40% reduction in card fraud losses; 60% acceleration in investigation cycle.",
          summary: "Yapı Kredi integrated real-time machine learning fraud analytics into its core authorization engine to evaluate card-not-present (CNP) and mobile banking transactions. By analyzing streaming transaction telemetry, device fingerprints, and customer behavioral baselines, suspicious transactions triggered instant step-up authentication instead of outright declines, preserving legitimate customer experience.",
          vendor_caveat: "IMPORTANT METHODOLOGY CAVEAT: This case study is based on a FICO vendor press release dated 30 January 2025. It represents vendor-reported metrics and operational claims, NOT an independent double-blind causal academic evaluation. Results depend on bank-specific customer demographics, existing fraud controls, and rule tuning.",
          source_citation: "FICO Customer Success Announcement (30 Jan 2025) / Yapı Kredi Technology Brief."
        }
      ];
    }
  },

  // ML Simulator
  async evaluateTransaction(payload: Record<string, any>): Promise<SimulationResult> {
    try {
      const res = await fetch(`${API_BASE}/simulator/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Simulation failed');
      return await res.json();
    } catch {
      // Local fallback simulator logic
      const isOverseas = !!payload.is_overseas_ip;
      const velocity = Number(payload.attempts_last_10min || 1);
      const isNewDev = !!payload.is_new_device;
      let score = 0.05;
      if (isOverseas) score += 0.45;
      if (velocity >= 6) score += 0.35;
      if (isNewDev) score += 0.15;
      score = Math.min(score, 0.98);

      return {
        ml_risk_score: score,
        risk_band: score >= 0.75 ? 'HIGH' : (score >= 0.35 ? 'MEDIUM' : 'LOW'),
        recommendation: score >= 0.75 ? 'STEP_UP_CHALLENGE_OR_BLOCK' : (score >= 0.35 ? 'STEP_UP_AUTH' : 'APPROVE'),
        guidance: score >= 0.75 ? 'Require biometric challenge or temporary transaction block.' : 'Friction-free passage.',
        reason_codes: [
          { code: isOverseas ? 'GEO_IP_FOREIGN' : 'DOMESTIC_IP', impact: isOverseas ? '+45%' : '-15%', desc: isOverseas ? 'Overseas / VPN IP range' : 'Familiar domestic IP' },
          { code: velocity >= 5 ? 'VEL_SPIKE' : 'NORMAL_VELOCITY', impact: velocity >= 5 ? '+35%' : '-10%', desc: `${velocity} transactions in burst window` }
        ],
        rule_based_comparison: {
          rule_score: score >= 0.7 ? 0.8 : 0.2,
          rule_decision: score >= 0.7 ? 'DECLINE' : 'ALLOW',
          rule_reasons: ['Heuristic Rule evaluation complete.']
        },
        disclaimer: 'SYNTHETIC DEMO DATA — NOT LIVE BANK DATA.'
      };
    }
  },

  async getTirupatiPreset(): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/simulator/preset/tirupati-scenario`);
      if (!res.ok) throw new Error('Failed');
      return await res.json();
    } catch {
      return {
        title: "Fictional Tirupati / Chennai Rapid-Burst Fraud Scenario",
        scenario_description: "Customer account in Tirupati with habitual average ₹2,500 suddenly presents an overseas IP request for ₹78,000 on an unrecognized device with 8 rapid bursts in 2 minutes.",
        input_features: {
          amount: 78000,
          baseline_amount: 2500,
          attempts_last_10min: 8,
          is_new_device: true,
          is_unusual_location: true,
          is_unusual_time: true,
          is_overseas_ip: true,
          transaction_note: "Fictional Tirupati Teaching Scenario"
        }
      };
    }
  },

  // Forecast
  async getForecast(horizon: number = 6): Promise<ForecastResponse> {
    try {
      const res = await fetch(`${API_BASE}/forecast/generate?forecast_horizon=${horizon}`);
      if (!res.ok) throw new Error('Failed');
      return await res.json();
    } catch {
      return {
        historical_data: [
          { period: "Jan 2024", actual: 1250000, fitted: 1248000, is_forecast: false },
          { period: "Feb 2024", actual: 1290000, fitted: 1292000, is_forecast: false },
          { period: "Mar 2024", actual: 1345000, fitted: 1341000, is_forecast: false },
          { period: "Apr 2024", actual: 1390000, fitted: 1395000, is_forecast: false },
          { period: "May 2024", actual: 1450000, fitted: 1448000, is_forecast: false },
          { period: "Jun 2024", actual: 1510000, fitted: 1505000, is_forecast: false }
        ],
        forecast_data: [
          { period: "Jul 2024", forecast: 1565000, lower_bound_95: 1502400, upper_bound_95: 1627600, is_forecast: true },
          { period: "Aug 2024", forecast: 1620000, lower_bound_95: 1541000, upper_bound_95: 1699000, is_forecast: true },
          { period: "Sep 2024", forecast: 1680000, lower_bound_95: 1585000, upper_bound_95: 1775000, is_forecast: true }
        ],
        evaluation_metrics: {
          model_name: "Triple Exponential Smoothing (Holt-Winters Multiplicative Trend)",
          training_samples: 18,
          forecast_horizon_months: horizon,
          mae: 14250.8,
          rmse: 18910.4,
          mape_percent: 1.42,
          r_squared: 0.941,
          confidence_level: "95% Prediction Interval"
        },
        disclaimer: "SYNTHETIC DEMO FORECAST — Illustrative time-series projection."
      };
    }
  },

  // AI Assistant
  async sendChatMessage(message: string): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/assistant/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      if (!res.ok) throw new Error('Chat failed');
      return await res.json();
    } catch {
      return {
        query: message,
        response: "If you have suffered unauthorized transactions, immediately call **1930** (Citizen Financial Cyber Fraud Reporting System) or file a complaint on **https://cybercrime.gov.in/**. Never share your OTP, UPI PIN, or passwords.",
        citations: [
          { title: "National Cyber Crime Reporting Portal", source_org: "Ministry of Home Affairs", source_url: "https://cybercrime.gov.in/", last_verified: "2024-10-15" }
        ],
        creator_attribution: { owner: "Thallapaka Jagadiswar", website: "https://www.audit3a.com/" }
      };
    }
  },

  // Reports
  async submitReport(data: { incident_type: string; platform_used: string; approx_amount?: number; incident_date: string; description: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/reports/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Failed to submit report');
    }
    return await res.json();
  },

  async getMyReports(): Promise<IncidentReport[]> {
    const res = await fetch(`${API_BASE}/reports/my-reports`, {
      headers: getAuthHeader()
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data;
  },

  // Admin
  async getAdminHealth(): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/system-health`, {
      headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Admin access required');
    return await res.json();
  },

  async getAdminUsers(): Promise<User[]> {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Admin access required');
    return await res.json();
  },

  async getAdminAuditLogs(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/admin/audit-logs`, {
      headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Admin access required');
    return await res.json();
  }
};

