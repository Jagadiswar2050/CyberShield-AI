export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'super_admin' | 'reviewer' | 'user' | 'guest';
  is_active: boolean;
  created_at?: string;
  last_login?: string;
}

export interface OfficialStatistic {
  id: number;
  indicator_name: string;
  category: 'cybercrime' | 'banking_fraud' | 'digital_payments' | 'upi';
  value: number;
  unit: string;
  geography: string;
  population_coverage: string;
  period_start: string;
  period_end: string;
  publication_date: string;
  source_org: string;
  source_url: string;
  metric_type: string;
  methodology_notes?: string;
  status: string;
  is_published: boolean;
}

export interface CaseStudy {
  id: number;
  title: string;
  organization: string;
  vendor_partner?: string;
  reported_metrics: string;
  summary: string;
  vendor_caveat: string;
  source_citation: string;
}

export interface IncidentReport {
  id: number;
  tracking_number: string;
  incident_type: string;
  platform_used: string;
  approx_amount?: number;
  incident_date: string;
  description: string;
  status: string;
  admin_notes?: string;
  created_at: string;
}

export interface ReasonCode {
  code: string;
  impact: string;
  desc: string;
}

export interface SimulationResult {
  ml_risk_score: number;
  risk_band: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendation: string;
  guidance: string;
  reason_codes: ReasonCode[];
  rule_based_comparison: {
    rule_score: number;
    rule_decision: string;
    rule_reasons: string[];
  };
  disclaimer: string;
  input_payload?: Record<string, any>;
}

export interface ForecastPoint {
  period: string;
  actual?: number;
  fitted?: number;
  forecast?: number;
  lower_bound_95?: number;
  upper_bound_95?: number;
  is_forecast: boolean;
}

export interface ForecastResponse {
  historical_data: ForecastPoint[];
  forecast_data: ForecastPoint[];
  evaluation_metrics: {
    model_name: string;
    training_samples: number;
    forecast_horizon_months: number;
    mae: number;
    rmse: number;
    mape_percent: number;
    r_squared: number;
    confidence_level: string;
  };
  disclaimer: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  citations?: Array<{
    title: string;
    source_org: string;
    source_url: string;
    last_verified: string;
  }>;
}

