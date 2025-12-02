import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkers } from '@/contexts/WorkersContext';
import { Button as PrimeButton } from 'primereact/button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/sonner';
import { generateModernPDF } from '@/utils/pdfGenerator';

export default function WorkersPage() {
  const navigate = useNavigate();
  const { userId, profile, loading: authLoading } = useAuth();
  const { workers, loading, fetchWorkers, createWorker, updateWorker, deleteWorker } = useWorkers();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState<any | null>(null);
  const [formData, setFormData] = useState({ especialidad: '', id_usuario: '', activo: true });
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);

  useEffect(() => {
    if (!authLoading && !userId) {
      navigate('/auth');
    }
  }, [userId, authLoading, navigate]);

  useEffect(() => {
    fetchWorkers();
  }, []);

  // fetch profiles to populate user select (only for admins)
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const base = import.meta.env.VITE_API_URL || '';
        const token = localStorage.getItem('auth_token');
        const res = await fetch(`${base}/api/profiles`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setAvailableUsers((data || []).filter((p: any) => p.rol === 'trabajador'));
      } catch (err) {
        console.error('Error fetching profiles', err);
      }
    };

    if (profile?.rol === 'admin') fetchProfiles();
  }, [profile]);

  const canManage = profile?.rol === 'admin';
  const isWorker = profile?.rol === 'trabajador';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingWorker) {
        await updateWorker(editingWorker.id, formData as any);
      } else {
        await createWorker(formData as any);
      }
      setIsDialogOpen(false);
      resetForm();
      await fetchWorkers();
    } catch (error) {
      console.error(error);
      toast.error('Error al guardar trabajador');
    }
  };

  const resetForm = () => {
    setFormData({ especialidad: '', id_usuario: '', activo: true });
    setEditingWorker(null);
  };

  const handleEdit = (worker: any) => {
    setEditingWorker(worker);
    setFormData({ especialidad: worker.especialidad, id_usuario: worker.id_usuario, activo: worker.activo });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este trabajador?')) {
      try {
        await deleteWorker(id);
        await fetchWorkers();
      } catch (err) {
        console.error(err);
        toast.error('Error al eliminar trabajador');
      }
    }
  };

  const generatePDF = () => {
    const tableData = workers.map(w => [
      w.profiles?.nombre || 'N/A',
      w.profiles?.correo || 'N/A',
      w.especialidad,
      w.activo ? 'Activo' : 'Inactivo'
    ]);

    generateModernPDF({
      title: 'Listado de Trabajadores',
      subtitle: 'Reporte completo del personal registrado',
      filename: 'trabajadores_agro_precision',
      columns: ['Nombre', 'Correo', 'Especialidad', 'Estado'],
      data: tableData
    });
  };

  if (authLoading || loading) {
    return (
      <div className="flex align-items-center justify-content-center min-h-screen">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  if (!canManage && !isWorker) {
    return (
      <div className="min-h-screen surface-ground flex align-items-center justify-content-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-900">Acceso Denegado</h2>
          <p className="text-600 mb-4">No tienes permisos para acceder a esta página</p>
          <Button onClick={() => navigate('/')}>Volver al Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen surface-ground">
      {/* Modern White Navbar */}
      <nav className="app-navbar">
        <div className="w-full max-w-7xl mx-auto px-4 py-3 flex justify-content-between align-items-center">
          <div className="flex align-items-center gap-3">
            <i className="pi pi-users text-agro-primary text-2xl"></i>
            <h1 className="text-2xl font-bold m-0">Trabajadores</h1>
          </div>
          <PrimeButton
            label="Volver al Dashboard"
            icon="pi pi-arrow-left"
            className="p-button-text"
            onClick={() => navigate('/')}
          />
        </div>
      </nav>

      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-content-between align-items-center mb-6">
          <h2 className="text-3xl font-bold text-900 m-0">Gestión de Trabajadores</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={generatePDF}
              className="flex gap-2"
            >
              <i className="pi pi-file-pdf"></i>
              Exportar PDF
            </Button>
            {canManage && (
              <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (open) resetForm(); }}>
                <DialogTrigger asChild>
                  <PrimeButton
                    label="Nuevo Trabajador"
                    icon="pi pi-plus"
                    severity="success"
                    aria-label="Crear nuevo trabajador"
                  />
                </DialogTrigger>
                <DialogContent className="w-full max-w-30rem">
                  <DialogHeader>
                    <DialogTitle>{editingWorker ? 'Editar Trabajador' : 'Nuevo Trabajador'}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="flex flex-column gap-4">
                    <div className="flex flex-column gap-2">
                      <Label htmlFor="id_usuario">Usuario</Label>
                      <select
                        id="id_usuario"
                        value={formData.id_usuario}
                        onChange={(e) => setFormData({ ...formData, id_usuario: e.target.value })}
                        className="flex h-3rem w-full border-round border-1 border-300 surface-ground px-3 py-2 text-sm"
                        required
                        disabled={!!editingWorker}
                      >
                        <option value="">Seleccionar usuario</option>
                        {availableUsers.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.nombre} ({u.correo})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-column gap-2">
                      <Label htmlFor="especialidad">Especialidad</Label>
                      <Input
                        id="especialidad"
                        value={formData.especialidad}
                        onChange={(e) => setFormData({ ...formData, especialidad: e.target.value })}
                        placeholder="ej: Maquinista, Agricultor"
                        required
                      />
                    </div>
                    <div className="flex align-items-center gap-2">
                      <Switch
                        id="activo"
                        checked={formData.activo}
                        onCheckedChange={(checked) => setFormData({ ...formData, activo: checked })}
                      />
                      <Label htmlFor="activo">Activo</Label>
                    </div>
                    <div className="flex justify-content-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit">
                        {editingWorker ? 'Actualizar' : 'Crear'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        <div className="grid">
          {workers
            .filter(w => {
              if (isWorker) {
                return w.id_usuario === userId;
              }
              return true;
            })
            .map((worker) => (
              <div key={worker.id} className="col-12 md:col-6 lg:col-4 p-3">
                <Card className="h-full card-hover">
                  <CardHeader>
                    <CardTitle className="flex align-items-center justify-content-between">
                      <div className="flex align-items-center gap-3">
                        <div className="icon-container">
                          <i className="pi pi-user"></i>
                        </div>
                        {worker.profiles?.nombre}
                      </div>
                      <span className={worker.activo ? 'status-chip completed' : 'status-chip pending'}>
                        {worker.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-column gap-2 text-agro-secondary">
                      <p className="flex align-items-center gap-2 m-0">
                        <i className="pi pi-briefcase text-agro-primary"></i>
                        <strong>Especialidad:</strong> {worker.especialidad}
                      </p>
                      <p className="flex align-items-center gap-2 m-0">
                        <i className="pi pi-envelope text-agro-primary"></i>
                        <strong>Email:</strong> {worker.profiles?.correo}
                      </p>
                      <p className="flex align-items-center gap-2 m-0">
                        <i className="pi pi-id-card text-agro-primary"></i>
                        <strong>Rol:</strong> {worker.profiles?.rol}
                      </p>
                      <div className="flex gap-2 mt-3">
                        {canManage && (
                          <>
                            <PrimeButton
                              icon="pi pi-pencil"
                              className="p-button-sm"
                              severity="secondary"
                              outlined
                              onClick={() => handleEdit(worker)}
                              aria-label="Editar trabajador"
                              tooltip="Editar"
                              tooltipOptions={{ position: 'top' }}
                            />
                            <PrimeButton
                              icon="pi pi-trash"
                              className="p-button-sm"
                              severity="success"
                              onClick={() => handleDelete(worker.id)}
                              aria-label="Eliminar trabajador"
                              tooltip="Eliminar"
                              tooltipOptions={{ position: 'top' }}
                            />
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
        </div>

        {workers.length === 0 && (
          <div className="text-center py-6">
            <p className="text-600">No hay trabajadores registrados</p>
          </div>
        )}
      </div>
    </div>
  );
}
