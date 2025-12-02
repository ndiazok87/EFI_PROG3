import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import { apiFetch, apiJson } from '../lib/api';
import * as authService from '@/services/auth';

type UserRole = 'admin' | 'gestor' | 'trabajador';

interface Profile {
  id: string;
  nombre: string;
  correo: string;
  rol: UserRole;
  is_active: boolean;
}

interface AuthContextType {
  userId: string | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, nombre: string, rol?: UserRole) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // On mount, check for stored token and fetch profile
    const token = localStorage.getItem('auth_token');
    if (token) {
      fetchProfileWithToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Listen for global API unauthorized events (dispatched by lib/api)
    const onUnauth = () => {
      // sign out silently
      try {
        localStorage.removeItem('auth_token');
        setProfile(null);
        setUserId(null);
        toast.error('Sesión expirada. Por favor inicia sesión de nuevo.');
        navigate('/auth');
      } catch (e) {
        console.error('onUnauth error', e);
      }
    };
    window.addEventListener('api:unauthorized', onUnauth as EventListener);
    return () => window.removeEventListener('api:unauthorized', onUnauth as EventListener);
  }, [navigate]);

  const fetchProfileWithToken = async (token: string) => {
    try {
      setLoading(true);
      const res = await apiFetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('No autorizado');
      const data = await res.json();
      setProfile(data);
      setUserId(data.id);
    } catch (err) {
      console.error('Error fetching profile:', err);
      localStorage.removeItem('auth_token');
      setProfile(null);
      setUserId(null);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, nombre: string, rol: UserRole = 'trabajador') => {
    try {
      await authService.signUp(email, password, nombre, rol);
      toast.success('Registro exitoso. Por favor inicia sesión.');
      navigate('/auth');
    } catch (error: any) {
      toast.error(error.message || 'Error en el registro');
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const res = await authService.signIn(email, password);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `HTTP ${res.status}`);
      }
      const body = await res.json();
      const token = body.access_token;
      if (!token) throw new Error('Token no recibido');
      localStorage.setItem('auth_token', token);
      await fetchProfileWithToken(token);
      toast.success('Sesión iniciada correctamente');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Error al iniciar sesión');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem('auth_token');
      setProfile(null);
      setUserId(null);
      toast.success('Sesión cerrada');
      navigate('/auth');
    } catch (error: any) {
      toast.error(error.message || 'Error al cerrar sesión');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ userId, profile, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
