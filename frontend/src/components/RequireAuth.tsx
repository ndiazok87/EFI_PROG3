import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !profile) {
      navigate('/auth');
    }
  }, [profile, loading, navigate]);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  if (!profile) return null;
  return <>{children}</>;
}
