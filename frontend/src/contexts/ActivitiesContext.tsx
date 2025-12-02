import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from '@/components/ui/sonner';
import { apiJson } from '../lib/api';
import { useAuth } from './AuthContext';

type ActivityType = 'siembra' | 'cosecha' | 'fertilizacion' | 'riego' | 'fumigacion';
type ActivityStatus = 'pendiente' | 'en progreso' | 'completada';

export interface Activity {
  id: string;
  nombre: string;
  tipo: ActivityType;
  id_parcela: string;
  id_trabajador?: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: ActivityStatus;
  descripcion?: string;
  created_at: string;
  updated_at: string;
  plots?: {
    nombre: string;
  };
  profiles?: {
    id?: string;
    nombre: string;
    correo: string;
  };
}

interface ActivitiesContextType {
  activities: Activity[];
  loading: boolean;
  fetchActivities: () => Promise<void>;
  createActivity: (activity: Omit<Activity, 'id' | 'created_at' | 'updated_at' | 'plots'>) => Promise<void>;
  updateActivity: (id: string, activity: Partial<Activity>) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;
}

const ActivitiesContext = createContext<ActivitiesContextType | undefined>(undefined);

export function ActivitiesProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useAuth();

  useEffect(() => {
    // Solo cargar actividades si el usuario está autenticado
    if (userId) {
      fetchActivities();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const data = await apiJson<Activity[]>('/api/activities');
      setActivities(data || []);
    } catch (error: any) {
      toast.error('Error al cargar actividades');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createActivity = async (activity: Omit<Activity, 'id' | 'created_at' | 'updated_at' | 'plots'>) => {
    try {
      await apiJson('/api/activities', { method: 'POST', body: JSON.stringify(activity) });
      toast.success('Actividad creada exitosamente');
      await fetchActivities();
    } catch (error: any) {
      toast.error(error.message || 'Error al crear actividad');
      throw error;
    }
  };

  const updateActivity = async (id: string, activity: Partial<Activity>) => {
    try {
      await apiJson(`/api/activities/${id}`, { method: 'PUT', body: JSON.stringify(activity) });
      toast.success('Actividad actualizada');
      await fetchActivities();
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar actividad');
      throw error;
    }
  };

  const deleteActivity = async (id: string) => {
    try {
      await apiJson(`/api/activities/${id}`, { method: 'DELETE' });
      toast.success('Actividad eliminada');
      await fetchActivities();
    } catch (error: any) {
      toast.error(error.message || 'Error al eliminar actividad');
      throw error;
    }
  };

  return (
    <ActivitiesContext.Provider value={{ activities, loading, fetchActivities, createActivity, updateActivity, deleteActivity }}>
      {children}
    </ActivitiesContext.Provider>
  );
}

export function useActivities() {
  const context = useContext(ActivitiesContext);
  if (context === undefined) {
    throw new Error('useActivities must be used within an ActivitiesProvider');
  }
  return context;
}
