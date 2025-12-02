/**
 * Pequeño helper para llamadas a la API del backend.
 * Adjunta Authorization Bearer token si existe en localStorage bajo 'auth_token'.
 */

export async function apiFetch(path: string, options: RequestInit = {}) {
  const base = import.meta.env.VITE_API_URL || '';
  const token = localStorage.getItem('auth_token');
  const headers: Record<string, string> = { ...(options.headers as Record<string, string> || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!headers['Content-Type'] && options.body) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${base}${path}`, { ...options, headers });
  // dispatch global events for 401/403 so the app can react (e.g., logout)
  if (res.status === 401) {
    try {
      window.dispatchEvent(new CustomEvent('api:unauthorized'));
    } catch (e) {
      // ignore
    }
  } else if (res.status === 403) {
    try {
      window.dispatchEvent(new CustomEvent('api:forbidden'));
    } catch (e) {
      // ignore
    }
  }
  return res;
}

export async function apiJson<T = any>(path: string, options: RequestInit = {}) {
  const res = await apiFetch(path, options);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = new Error(body.message || `HTTP ${res.status}`);
    throw err;
  }
  // Handle empty responses (e.g., 204 No Content)
  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return undefined as T;
  }
  return (await res.json()) as T;
}
