import { apiFetch, apiJson } from '@/lib/api';

export async function signUp(email: string, password: string, nombre: string, rol = 'trabajador') {
  return apiJson('/api/auth/signup', { method: 'POST', body: JSON.stringify({ email, password, nombre, rol }) });
}

export async function signIn(email: string, password: string) {
  // apiFetch returns Response so callers can handle headers/body as needed
  return apiFetch('/api/auth/signin', { method: 'POST', body: JSON.stringify({ email, password }) });
}

export async function forgotPassword(email: string) {
  return apiJson('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
}

export async function resetPassword(token: string, password: string) {
  return apiJson('/api/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, password }) });
}
