import { User, OfficialStatistic, CaseStudy, IncidentReport, LoginHistoryItem } from '../types';

/**
 * Supabase Client Configuration for CyberShield AI
 * Project: CyberShield-AI Public (kjmomccmwyqndspkfloq)
 * User API Key / Token: 1f37d8ca-9c95-42b6-a41f-86a3ebdcaace
 */

export const SUPABASE_CONFIG = {
  url: "https://kjmomccmwyqndspkfloq.supabase.co",
  publishableKey: "sb_publishable_kfJtXE81i6228mzrxwOJIg_fmC7pWSO",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqbW9tY2Ntd3lxbmRzcGtmbG9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUyNDMyMzgsImV4cCI6MjExMDgxOTIzOH0.zEI1eJ0pPgrqq0UEbJlxN3kb5aXC6ladkjR-dfpgPfI",
  userApiKey: "1f37d8ca-9c95-42b6-a41f-86a3ebdcaace"
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
  
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'cs_hash_' + Math.abs(hash).toString(16);
}

/**
 * Record a user login event into Supabase public.user_login_history
 */
export async function recordLoginHistory(
  email: string,
  userId: string | null = null,
  status: 'SUCCESS' | 'FAILED' | 'BLOCKED' = 'SUCCESS',
  authMethod: string = 'password'
): Promise<void> {
  try {
    const url = `${SUPABASE_CONFIG.url}/rest/v1/user_login_history`;
    await fetch(url, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        user_id: userId || null,
        status: status,
        ip_address: 'Web Browser Client',
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'CyberShield Web Client',
        auth_method: authMethod,
        login_timestamp: new Date().toISOString()
      })
    });
  } catch (err) {
    console.warn('Could not record login history to Supabase:', err);
  }
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
 * Registers the user in Supabase Auth AND Supabase Database public.users
 */
export async function supabaseRegister(email: string, fullName: string, password: string): Promise<User> {
  const cleanEmail = email.toLowerCase().trim();
  const cleanName = fullName.trim();

  // 1. Check if user already exists in public.users
  try {
    const existing = await querySupabaseTable<any>('users', `email=eq.${encodeURIComponent(cleanEmail)}&select=id,email`);
    if (existing && existing.length > 0) {
      throw new Error('An account with this email already exists. Please sign in instead.');
    }
  } catch (err: any) {
    if (err.message && err.message.includes('already exists')) throw err;
  }

  // 2. Hash password securely for table storage
  const hashedPassword = await hashPassword(password);

  // 3. Register in Supabase Auth service (so user appears in Authentication > Users)
  let authUserId: string | null = null;
  try {
    const authUrl = `${SUPABASE_CONFIG.url}/auth/v1/signup`;
    const authRes = await fetch(authUrl, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        email: cleanEmail,
        password: password,
        data: {
          full_name: cleanName
        }
      })
    });
    if (authRes.ok) {
      const authData = await authRes.json();
      if (authData && authData.id) {
        authUserId = authData.id;
      }
    }
  } catch (authErr) {
    console.warn('Supabase Auth signup notice:', authErr);
  }

  // 4. Store user details in Supabase Database public.users table
  const url = `${SUPABASE_CONFIG.url}/rest/v1/users`;
  const insertPayload: any = {
    email: cleanEmail,
    full_name: cleanName,
    hashed_password: hashedPassword,
    role: 'user',
    is_active: true
  };
  if (authUserId) {
    insertPayload.id = authUserId;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      ...getHeaders(),
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(insertPayload)
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

  // 5. Record first registration/login event in user_login_history
  await recordLoginHistory(cleanEmail, newUser.id, 'SUCCESS', 'registration');

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
 * Validates credentials against Supabase public.users and logs history
 */
export async function supabaseLogin(email: string, password: string): Promise<User> {
  const cleanEmail = email.toLowerCase().trim();
  const hashedInput = await hashPassword(password);

  // 1. Fetch user from Supabase public.users
  const users = await querySupabaseTable<any>('users', `email=eq.${encodeURIComponent(cleanEmail)}&select=id,email,full_name,hashed_password,role,is_active,created_at`);
  if (!users || users.length === 0) {
    // Record failed login attempt
    await recordLoginHistory(cleanEmail, null, 'FAILED', 'password_unknown_email');
    throw new Error('No account found with this email. Please check your spelling or register.');
  }

  const u = users[0];
  if (!u.is_active) {
    await recordLoginHistory(cleanEmail, u.id, 'BLOCKED', 'account_deactivated');
    throw new Error('This account has been deactivated. Please contact the Super Admin.');
  }

  // 2. Validate password (SHA-256 match, master super admin password, or legacy plain fallback)
  const isMatch = (u.hashed_password === hashedInput) ||
                  (cleanEmail === 'jagadishkrishna7@gmail.com' && password === 'Admin@CyberShield2026!') ||
                  (u.hashed_password === password);

  if (!isMatch) {
    // Record failed login attempt in Supabase
    await recordLoginHistory(cleanEmail, u.id, 'FAILED', 'incorrect_password');
    throw new Error('Incorrect password. Please verify your credentials.');
  }

  // 3. Record successful login event in Supabase user_login_history
  await recordLoginHistory(cleanEmail, u.id, 'SUCCESS', 'password');

  // 4. Update last_login timestamp in public.users
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
 * Fetch Login History for a User or All Users (Admin)
 */
export async function supabaseGetLoginHistory(userId?: string | number): Promise<LoginHistoryItem[]> {
  try {
    let query = 'order=login_timestamp.desc&limit=50';
    if (userId) {
      query = `user_id=eq.${encodeURIComponent(String(userId))}&${query}`;
    }
    return await querySupabaseTable<LoginHistoryItem>('user_login_history', query);
  } catch (err) {
    console.warn('Error fetching login history:', err);
    return [];
  }
}

/**
 * Supabase Submit Incident Report
 */
export async function supabaseSubmitReport(
  data: { incident_type: string; platform_used: string; approx_amount?: number; incident_date: string; description: string },
  userId: string | number
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
      user_id: String(userId),
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
export async function supabaseGetMyReports(userId: string | number): Promise<IncidentReport[]> {
  try {
    return await querySupabaseTable<IncidentReport>(
      'incident_reports',
      `user_id=eq.${encodeURIComponent(String(userId))}&order=created_at.desc`
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
 * Supabase Update User Role (Admin)
 */
export async function supabaseUpdateUserRole(userId: string | number, newRole: string): Promise<boolean> {
  try {
    const url = `${SUPABASE_CONFIG.url}/rest/v1/users?id=eq.${encodeURIComponent(String(userId))}`;
    const res = await fetch(url, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ role: newRole })
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Supabase Toggle User Active Status (Admin)
 */
export async function supabaseToggleUserStatus(userId: string | number, currentStatus: boolean): Promise<boolean> {
  try {
    const url = `${SUPABASE_CONFIG.url}/rest/v1/users?id=eq.${encodeURIComponent(String(userId))}`;
    const res = await fetch(url, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ is_active: !currentStatus })
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Supabase Get Case Studies
 */
export async function supabaseGetCaseStudies(): Promise<CaseStudy[]> {
  return await querySupabaseTable<CaseStudy>('case_studies', 'is_published=eq.true&order=id.asc');
}
