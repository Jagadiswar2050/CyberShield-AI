/**
 * Supabase Client Configuration for CyberShield AI
 * Project: CyberShield-AI Public (kjmomccmwyqndspkfloq)
 */

export const SUPABASE_CONFIG = {
  url: "https://kjmomccmwyqndspkfloq.supabase.co",
  publishableKey: "sb_publishable_kfJtXE81i6228mzrxwOJIg_fmC7pWSO",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqbW9tY2Ntd3lxbmRzcGtmbG9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUyNDMyMzgsImV4cCI6MjExMDgxOTIzOH0.zEI1eJ0pPgrqq0UEbJlxN3kb5aXC6ladkjR-dfpgPfI"
};

/**
 * Direct REST helper to query Supabase tables
 */
export async function querySupabaseTable<T = any>(table: string, queryParams: string = ''): Promise<T[]> {
  const url = `${SUPABASE_CONFIG.url}/rest/v1/${table}${queryParams ? `?${queryParams}` : ''}`;
  const response = await fetch(url, {
    headers: {
      'apikey': SUPABASE_CONFIG.publishableKey || SUPABASE_CONFIG.anonKey,
      'Authorization': `Bearer ${SUPABASE_CONFIG.publishableKey || SUPABASE_CONFIG.anonKey}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Supabase query failed: ${response.statusText}`);
  }

  return response.json();
}
