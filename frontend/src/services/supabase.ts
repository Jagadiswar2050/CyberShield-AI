import { User, OfficialStatistic, CaseStudy, IncidentReport } from '../types';

/**
 * Supabase Client Configuration for CyberShield AI
 * Project: CyberShield-AI Public (kjmomccmwyqndspkfloq)
 */

export const SUPABASE_CONFIG = {
  url: "https://kjmomccmwyqndspkfloq.supabase.co",
  publishableKey: "sb_publishable_kfJtXE81i6228mzrxwOJIg_fmC7pWSO",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqbW9tY2Ntd3lxbmRzcGtmbG9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUyNDMyMzgsImV4cCI6MjExMDgxOTIzOH0.zEI1eJ0pPgrqq0UEbJlxN3kb5aXC6ladkjR-dfpgPfI"
};

function getHeaders(): Record<string, string> {
  const key = SUPABASE_CONFIG.publishableKey || SUPABASE_CONFIG.anonKey;
  return {
    'apikey': key,
    'Authorization': `Bearer ${key}`,
    'Content-Type': 'application/json'
  };
}

/**
 * Native SHA-256 password hasher with universal browser fallback
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    if (window.crypto && window.crypto.subtle) {
      const enc = new TextEncoder();
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', enc.encode(password));
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch {}
  
  // Deterministic fallback hash for environments without crypto.subtle
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'cs_hash_' + Math.abs(hash).toString(16);
}

/**
 * Direct REST helper to query Supabase tables
 */
export async function querySupabaseTable<T = any>(table: string, queryParams: string = ''): Promise<T[]> {
  const url = `${SUPABASE_CONFIG.url}/rest/v1/${table}${queryParams ? `?${queryParams}` : ''}`;
  const response = await fetch(url, { headers: getHeaders() });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Supabase query failed: ${errText || response.statusText}`);
  }

  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('Supabase response is not JSON.');
  }

  return response.json();
}

/**
 * Supabase User Registration
 * Validates and stores user details directly into Supabase public.users
 */
export async function supabaseRegister(email: string, fullName: string, password: string): Promise<User> {
  const cleanEmail = email.toLowerCase().trim();
  const cleanName = fullName.trim();

  // 1. Verify if user already exists
  try {
    const existing = await querySupabaseTable<any>('users', `email=eq.${encodeURIComponent(cleanEmail)}&select=id,email`);
    if (existing && existing.length > 0) {
      throw new Error('An account with this email already exists. Please sign in instead.');
    }
  } catch (err: any) {
    if (err.message && err.message.includes('already exists')) throw err;
  }

  // 2. Hash password securely
  const hashedPassword = await hashPassword(password);

  // 3. Insert user record into Supabase public.users
  const url = `${SUPABASE_CONFIG.url}/rest/v1/users`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      ...getHeaders(),
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({
      email: cleanEmail,
      full_name: cleanName,
      hashed_password: hashedPassword,
      role: 'user',
      is_active: true
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    let msg = 'Failed to create user in Supabase.';
    try {
      const errObj = JSON.parse(errText);
      msg = errObj.message || errObj.hint || msg;
    } catch {}
    throw new Error(msg);
  }

  const created: any[] = await response.json();
  const newUser = created[0];
  return {
    id: newUser.id,
    email: newUser.email,
    full_name: newUser.full_name,
    role: newUser.role,
    is_active: newUser.is_active,
    created_at: newUser.created_at
  };
}

/**
 * Supabase User Login
 * Validates credentials against Supabase public.users
 */
export async function supabaseLogin(email: string, password: string): Promise<User> {
  const cleanEmail = email.toLowerCase().trim();
  const hashedInput = await hashPassword(password);

  // 1. Fetch user from Supabase
  const users = await querySupabaseTable<any>('users', `email=eq.${encodeURIComponent(cleanEmail)}&select=id,email,full_name,hashed_password,role,is_active,created_at`);
  if (!users || users.length === 0) {
    throw new Error('No account found with this email. Please check your spelling or register.');
  }

  const u = users[0];
  if (!u.is_active) {
    throw new Error('This account has been deactivated. Please contact the Super Admin.');
  }

  // 2. Validate password (SHA-256 match, master super admin password, or legacy plain fallback)
  const isMatch = (u.hashed_password === hashedInput) ||
                  (cleanEmail === 'jagadishkrishna7@gmail.com' && password === 'Admin@CyberShield2026!') ||
                  (u.hashed_password === password);

  if (!isMatch) {
    throw new Error('Incorrect password. Please verify your credentials.');
  }

  // 3. Asynchronously record last_login
  fetch(`${SUPABASE_CONFIG.url}/rest/v1/users?email=eq.${encodeURIComponent(cleanEmail)}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ last_login: new Date().toISOString() })
  }).catch(() => {});

  return {
    id: u.id,
    email: u.email,
    full_name: u.full_name,
    role: u.role,
    is_active: u.is_active,
    created_at: u.created_at
  };
}

/**
 * Supabase Submit Incident Report
 */
export async function supabaseSubmitReport(
  data: { incident_type: string; platform_used: string; approx_amount?: number; incident_date: string; description: string },
  userId: string
): Promise<any> {
  const trackingNumber = `CS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const url = `${SUPABASE_CONFIG.url}/rest/v1/incident_reports`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      ...getHeaders(),
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({
      tracking_number: trackingNumber,
      user_id: userId,
      incident_type: data.incident_type,
      platform_used: data.platform_used,
      approx_amount: data.approx_amount || null,
      incident_date: data.incident_date,
      description: data.description,
      status: 'submitted'
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Report submission failed: ${errText}`);
  }

  const inserted = await response.json();
  const rep = inserted[0];

  return {
    message: "Incident report logged successfully in Supabase.",
    tracking_number: rep.tracking_number,
    status: rep.status,
    advisory: "Remember: This is an academic intelligence portal. For actual recovery or police investigation, register immediately on cybercrime.gov.in or dial 1930."
  };
}

/**
 * Supabase Get My Reports
 */
export async function supabaseGetMyReports(userId: string): Promise<IncidentReport[]> {
  try {
    return await querySupabaseTable<IncidentReport>(
      'incident_reports',
      `user_id=eq.${encodeURIComponent(userId)}&order=created_at.desc`
    );
  } catch {
    return [];
  }
}

/**
 * Supabase Get Official Statistics
 */
export async function supabaseGetStatistics(category?: string, metricType?: string): Promise<OfficialStatistic[]> {
  const params: string[] = ['is_published=eq.true', 'order=id.asc'];
  if (category && category !== 'all') params.push(`category=eq.${encodeURIComponent(category)}`);
  if (metricType) params.push(`metric_type=eq.${encodeURIComponent(metricType)}`);
  return await querySupabaseTable<OfficialStatistic>('official_statistics', params.join('&'));
}

/**
 * Supabase Get Case Studies
 */
export async function supabaseGetCaseStudies(): Promise<CaseStudy[]> {
  return await querySupabaseTable<CaseStudy>('case_studies', 'is_published=eq.true&order=id.asc');
}
