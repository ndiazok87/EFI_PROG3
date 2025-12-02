import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo, useRef } from 'react';
import { toast } from '@/components/ui/sonner';
import { apiJson } from '../lib/api';
import { useAuth } from './AuthContext';

type ResourceType = 'maquinaria' | 'fertilizantes' | 'semillas' | 'herramientas';

export interface Resource {
  id: string;
  tipo: ResourceType;
  nombre: string;
  cantidad: number;
  id_parcela?: string;
  disponible: boolean;
  created_at: string;
  updated_at: string;
  // plots relation from Supabase: may be null or an array depending on how it's selected
  plots?: { nombre: string } | null;
}

interface ResourcesContextType {
  resources: Resource[];
  loading: boolean;
  fetchResources: () => Promise<void>;
  createResource: (resource: Omit<Resource, 'id' | 'created_at' | 'updated_at' | 'plots'>) => Promise<void>;
  updateResource: (id: string, resource: Partial<Resource>) => Promise<void>;
  deleteResource: (id: string) => Promise<void>;
}

const ResourcesContext = createContext<ResourcesContextType | undefined>(undefined);

export function ResourcesProvider({ children }: { children: ReactNode }) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);
  const { userId } = useAuth();

  useEffect(() => {
    // mark mounted
    mountedRef.current = true;
    // Solo cargar recursos si el usuario está autenticado
    if (userId) {
      fetchResources();
    } else {
      setLoading(false);
    }
    return () => {
      mountedRef.current = false;
    };
  }, [userId]);
  /**
   * Fetch resources from Supabase and store them in state.
   * Use useCallback so the function identity is stable for useEffect.
   */
  const fetchResources = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiJson<Resource[]>('/api/resources');
      if (mountedRef.current) setResources(data || []);
    } catch (err: any) {
      toast.error('Error al cargar recursos');
      console.error('fetchResources error:', err?.message ?? err);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  const createResource = useCallback(async (resource: Omit<Resource, 'id' | 'created_at' | 'updated_at' | 'plots'>) => {
    try {
      // basic validation
      if (resource.cantidad < 0) throw new Error('La cantidad no puede ser negativa');

      await apiJson('/api/resources', { method: 'POST', body: JSON.stringify(resource) });
      toast.success('Recurso creado exitosamente');
      await fetchResources();
      // return created resource (caller may want to use it)
      return;
    } catch (err: any) {
      toast.error(err?.message || 'Error al crear recurso');
      console.error('createResource error:', err?.message ?? err);
      throw err;
    }
  }, [fetchResources]);

  const updateResource = useCallback(async (id: string, resource: Partial<Resource>) => {
    try {
      if (resource.cantidad !== undefined && resource.cantidad < 0) throw new Error('La cantidad no puede ser negativa');

      await apiJson(`/api/resources/${id}`, { method: 'PUT', body: JSON.stringify(resource) });
      toast.success('Recurso actualizado');
      await fetchResources();
    } catch (err: any) {
      toast.error(err?.message || 'Error al actualizar recurso');
      console.error('updateResource error:', err?.message ?? err);
      throw err;
    }
  }, [fetchResources]);

  const deleteResource = useCallback(async (id: string) => {
    try {
      const res = await apiJson<void>(`/api/resources/${id}`, { method: 'DELETE' });
      toast.success('Recurso eliminado');
      await fetchResources();
    } catch (err: any) {
      toast.error(err?.message || 'Error al eliminar recurso');
      console.error('deleteResource error:', err?.message ?? err);
      throw err;
    }
  }, [fetchResources]);

  // memoize context value to avoid unnecessary re-renders
  const value = useMemo(
    () => ({ resources, loading, fetchResources, createResource, updateResource, deleteResource }),
    [resources, loading, fetchResources, createResource, updateResource, deleteResource]
  );

  return <ResourcesContext.Provider value={value}>{children}</ResourcesContext.Provider>;
}

export function useResources() {
  const context = useContext(ResourcesContext);
  if (context === undefined) {
    throw new Error('useResources must be used within a ResourcesProvider');
  }
  return context;
}
