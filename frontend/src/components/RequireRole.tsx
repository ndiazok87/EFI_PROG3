import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';

export default function RequireRole({ roles, children }: { roles: string[]; children: ReactNode }) {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && profile && !roles.includes(profile.rol)) {
      toast.error('No tienes permisos para acceder a esta página');
      navigate('/');
    }
    if (!loading && !profile) {
      navigate('/auth');
    }
  }, [profile, loading, navigate, roles]);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  if (!profile) return null;
  if (!roles.includes(profile.rol)) return null;
  return <>{children}</>;
}
