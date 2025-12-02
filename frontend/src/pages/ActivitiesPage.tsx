import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useActivities } from '@/contexts/ActivitiesContext';
import { usePlots } from '@/contexts/PlotsContext';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import { Card } from 'primereact/card';
import { addLocale } from 'primereact/api';
import { generateModernPDF, generateDetailPDF } from '@/utils/pdfGenerator';
import { toast } from '@/components/ui/sonner';

addLocale('es', {
  firstDayOfWeek: 1,
  dayNames: ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'],
  dayNamesShort: ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab'],
  dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
  monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  today: 'Hoy',
  clear: 'Limpiar',
});

export default function ActivitiesPage() {
  const { profile, userId, loading: authLoading } = useAuth();
  const { activities, loading: activitiesLoading, createActivity, updateActivity, deleteActivity } = useActivities();
  const { plots } = usePlots();

  const [workers, setWorkers] = useState<any[]>([]);
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<any>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: '',
    id_parcela: '',
    id_trabajador: '',
    fecha_inicio: null as Date | null,
    fecha_fin: null as Date | null,
    estado: '',
    descripcion: '',
  });

  const canManage = profile?.rol === 'admin' || profile?.rol === 'gestor';

  useEffect(() => {
    if (!authLoading && !profile) {
      navigate('/auth');
    }
  }, [profile, authLoading, navigate]);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const base = import.meta.env.VITE_API_URL || '';
        const token = localStorage.getItem('auth_token');
        const res = await fetch(`${base}/api/workers`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setWorkers(data || []);
      } catch (err) {
        console.error('Error fetching workers', err);
      }
    };
    if (canManage) fetchWorkers();
  }, [profile, canManage]);

  const tipoOptions = [
    { label: 'Siembra', value: 'siembra' },
    { label: 'Cosecha', value: 'cosecha' },
    { label: 'Fertilizacion', value: 'fertilizacion' },
    { label: 'Riego', value: 'riego' },
    { label: 'Fumigacion', value: 'fumigacion' },
  ];

  const estadoOptions = [
    { label: 'Pendiente', value: 'pendiente' },
    { label: 'En Progreso', value: 'en progreso' },
    { label: 'Completada', value: 'completada' },
  ];

  const parcelaOptions = plots.map((p) => ({ label: p.nombre, value: p.id }));

  const trabajadorOptions = [
    { label: 'Sin asignar', value: '' },
    ...workers.map((w: any) => ({
      label: `${w.profiles?.nombre ?? 'Trabajador'} (${w.profiles?.correo ?? ''})`,
      value: w.id,
    })),
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const activityData = {
        nombre: formData.nombre,
        tipo: formData.tipo as any,
        id_parcela: formData.id_parcela,
        id_trabajador: formData.id_trabajador || undefined,
        fecha_inicio: formData.fecha_inicio?.toISOString().split('T')[0],
        fecha_fin: formData.fecha_fin?.toISOString().split('T')[0],
        estado: formData.estado as any,
        descripcion: formData.descripcion,
      };

      if (activityData.fecha_inicio && activityData.fecha_fin) {
        if (new Date(activityData.fecha_fin) < new Date(activityData.fecha_inicio)) {
          toast.error('La fecha de fin no puede ser anterior a la de inicio');
          return;
        }
      }

      if (editingActivity) {
        await updateActivity(editingActivity.id, activityData);
      } else {
        await createActivity(activityData);
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      tipo: '',
      id_parcela: '',
      id_trabajador: '',
      fecha_inicio: null,
      fecha_fin: null,
      estado: '',
      descripcion: '',
    });
    setEditingActivity(null);
  };

  const handleEdit = (activity: any) => {
    setEditingActivity(activity);
    setFormData({
      nombre: activity.nombre,
      tipo: activity.tipo,
      id_parcela: activity.id_parcela,
      id_trabajador: activity.id_trabajador || '',
      fecha_inicio: activity.fecha_inicio ? new Date(activity.fecha_inicio) : null,
      fecha_fin: activity.fecha_fin ? new Date(activity.fecha_fin) : null,
      estado: activity.estado,
      descripcion: activity.descripcion || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Estas seguro de eliminar esta actividad?')) {
      await deleteActivity(id);
    }
  };

  const handleStatusUpdate = async (activityId: string, newStatus: string) => {
    try {
      await updateActivity(activityId, { estado: newStatus as any });
    } catch (error) {
      console.error(error);
    }
  };

  const getWorkerName = (activity: any) => activity.profiles?.nombre || 'Sin asignar';

  const generatePDF = (activity: any) => {
    const detailData = [
      { label: 'Nombre', value: activity.nombre },
      { label: 'Tipo', value: activity.tipo },
      { label: 'Parcela', value: activity.plots?.nombre || 'N/A' },
      { label: 'Responsable', value: getWorkerName(activity) },
      { label: 'Fecha Inicio', value: activity.fecha_inicio ? new Date(activity.fecha_inicio).toLocaleDateString() : 'N/A' },
      { label: 'Fecha Fin', value: activity.fecha_fin ? new Date(activity.fecha_fin).toLocaleDateString() : 'N/A' },
      { label: 'Estado', value: activity.estado },
      { label: 'Descripción', value: activity.descripcion || 'Sin descripción' }
    ];

    generateDetailPDF(
      `Ficha de Actividad: ${activity.nombre}`,
      detailData,
      `actividad_${activity.nombre}`
    );
  };

  const filteredActivities = activities.filter((activity) => {
    if (profile?.rol === 'trabajador') {
      return activity.profiles?.id === userId;
    }
    return true;
  });

  if (authLoading || activitiesLoading) {
    return (
      <div className="flex align-items-center justify-content-center min-h-screen">
        <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
      </div>
    );
  }

  const dialogFooter = (
    <div className="flex justify-content-end gap-2">
      <Button label="Cancelar" onClick={() => setIsDialogOpen(false)} className="p-button-text" />
      <Button label={editingActivity ? 'Actualizar' : 'Crear'} onClick={handleSubmit} severity="success" />
    </div>
  );

  const generateListPDF = () => {
    const tableData = activities.map((a) => [
      a.nombre,
      a.tipo,
      a.plots?.nombre || 'N/A',
      getWorkerName(a),
      a.fecha_inicio ? new Date(a.fecha_inicio).toLocaleDateString() : 'N/A',
      a.estado,
    ]);

    generateModernPDF({
      title: 'Listado de Actividades',
      subtitle: 'Reporte de tareas planificadas y en curso',
      filename: 'actividades_agro_precision',
      columns: ['Nombre', 'Tipo', 'Parcela', 'Responsable', 'Inicio', 'Estado'],
      data: tableData,
      orientation: 'landscape'
    });
  };

  return (
    <div className="min-h-screen bg-agro-surface">
      <nav className="app-navbar">
        <div className="w-full max-w-7xl mx-auto px-4 py-3 flex justify-content-between align-items-center">
          <div className="flex align-items-center gap-3">
            <i className="pi pi-calendar text-agro-primary text-2xl"></i>
            <h1 className="text-2xl font-bold m-0">Actividades</h1>
          </div>
          <Button label="Volver al Dashboard" icon="pi pi-arrow-left" className="p-button-text" onClick={() => navigate('/')} />
        </div>
      </nav>

      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-content-between align-items-center mb-5">
          <h2 className="text-3xl font-bold text-900 m-0">Gestion de Actividades</h2>
          <div className="flex gap-2">
            <Button label="Exportar PDF" icon="pi pi-file-pdf" className="p-button-outlined" onClick={generateListPDF} />
            {canManage && (
              <Button label="Nueva Actividad" icon="pi pi-plus" onClick={() => setIsDialogOpen(true)} severity="success" />
            )}
          </div>
        </div>

        <Dialog
          visible={isDialogOpen}
          onHide={() => {
            setIsDialogOpen(false);
            resetForm();
          }}
          header={editingActivity ? 'Editar Actividad' : 'Nueva Actividad'}
          footer={dialogFooter}
          style={{ width: '550px', borderRadius: 'var(--agro-radius-lg)' }}
          modal
        >
          <form onSubmit={handleSubmit} className="flex flex-column gap-3 pt-2">
            <div className="flex flex-column gap-2">
              <label htmlFor="nombre" className="font-medium">Nombre</label>
              <InputText
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </div>

            <div className="grid">
              <div className="col-6">
                <div className="flex flex-column gap-2">
                  <label htmlFor="tipo" className="font-medium">Tipo</label>
                  <Dropdown
                    id="tipo"
                    value={formData.tipo}
                    options={tipoOptions}
                    onChange={(e) => setFormData({ ...formData, tipo: e.value })}
                    placeholder="Siembra"
                    required
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="flex flex-column gap-2">
                  <label htmlFor="parcela" className="font-medium">Parcela</label>
                  <Dropdown
                    id="parcela"
                    value={formData.id_parcela}
                    options={parcelaOptions}
                    onChange={(e) => setFormData({ ...formData, id_parcela: e.value })}
                    placeholder="Seleccionar parcela"
                    required
                  />
                </div>
              </div>
            </div>

            {canManage && (
              <div className="flex flex-column gap-2">
                <label htmlFor="trabajador" className="font-medium">Asignar Trabajador</label>
                <Dropdown
                  id="trabajador"
                  value={formData.id_trabajador}
                  options={trabajadorOptions}
                  onChange={(e) => setFormData({ ...formData, id_trabajador: e.value })}
                  placeholder="Sin asignar"
                />
              </div>
            )}

            <div className="grid">
              <div className="col-6">
                <div className="flex flex-column gap-2">
                  <label htmlFor="fechaInicio" className="font-medium">Fecha Inicio</label>
                  <Calendar
                    id="fechaInicio"
                    value={formData.fecha_inicio}
                    onChange={(e) => setFormData({ ...formData, fecha_inicio: e.value as Date })}
                    dateFormat="dd/mm/yy"
                    locale="es"
                    showIcon
                    required
                    pt={{
                      dropdownButton: {
                        root: { className: 'p-button-success' },
                        icon: { className: 'text-white' }
                      }
                    }}
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="flex flex-column gap-2">
                  <label htmlFor="fechaFin" className="font-medium">Fecha Fin</label>
                  <Calendar
                    id="fechaFin"
                    value={formData.fecha_fin}
                    onChange={(e) => setFormData({ ...formData, fecha_fin: e.value as Date })}
                    dateFormat="dd/mm/yy"
                    locale="es"
                    showIcon
                    required
                    pt={{
                      dropdownButton: {
                        root: { className: 'p-button-success' },
                        icon: { className: 'text-white' }
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-column gap-2">
              <label htmlFor="estado" className="font-medium">Estado</label>
              <Dropdown
                id="estado"
                value={formData.estado}
                options={estadoOptions}
                onChange={(e) => setFormData({ ...formData, estado: e.value })}
                placeholder="Pendiente"
                required
              />
            </div>

            <div className="flex flex-column gap-2">
              <label htmlFor="descripcion" className="font-medium">Descripcion</label>
              <InputTextarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                rows={4}
              />
            </div>
          </form>
        </Dialog>

        <div className="grid">
          {filteredActivities.length === 0 ? (
            <div className="col-12 text-center py-6">
              <i className="pi pi-inbox text-400" style={{ fontSize: '3rem' }}></i>
              <p className="text-600 mt-3">No hay actividades registradas</p>
            </div>
          ) : (
            filteredActivities.map((activity) => (
              <div key={activity.id} className="col-12 md:col-6 lg:col-4 p-3">
                <Card className="h-full card-hover">
                  <div className="flex justify-content-between align-items-start mb-3">
                    <div className="flex align-items-center gap-3">
                      <div className="icon-container">
                        <i
                          className={
                            activity.tipo === 'siembra'
                              ? 'pi pi-sun'
                              : activity.tipo === 'cosecha'
                                ? 'pi pi-shopping-bag'
                                : activity.tipo === 'fertilizacion'
                                  ? 'pi pi-bolt'
                                  : activity.tipo === 'riego'
                                    ? 'pi pi-cloud'
                                    : activity.tipo === 'fumigacion'
                                      ? 'pi pi-filter'
                                      : 'pi pi-calendar'
                          }
                        ></i>
                      </div>
                      <h3 className="m-0 text-xl font-bold">{activity.nombre}</h3>
                    </div>
                    <span
                      className={
                        activity.estado === 'completada'
                          ? 'status-chip completed'
                          : activity.estado === 'en progreso'
                            ? 'status-chip in-progress'
                            : 'status-chip pending'
                      }
                    >
                      {activity.estado}
                    </span>
                  </div>

                  <div className="flex flex-column gap-2 text-600 mb-3">
                    <p><strong>Tipo:</strong> {activity.tipo}</p>
                    <p><strong>Parcela:</strong> {activity.plots?.nombre || 'N/A'}</p>
                    <p><strong>Fecha:</strong> {activity.fecha_inicio} - {activity.fecha_fin}</p>
                    <p><strong>Asignado a:</strong> {getWorkerName(activity)}</p>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Button
                      label="Descargar Parte"
                      icon="pi pi-file-pdf"
                      className="p-button-sm p-button-outlined"
                      onClick={() => generatePDF(activity)}
                    />

                    {profile?.rol === 'trabajador' && activity.estado !== 'completada' && (
                      <Button
                        label="Marcar Completada"
                        icon="pi pi-check"
                        className="p-button-sm"
                        severity="success"
                        onClick={() => handleStatusUpdate(activity.id, 'completada')}
                      />
                    )}

                    {canManage && (
                      <>
                        <Button
                          icon="pi pi-pencil"
                          className="p-button-sm"
                          severity="secondary"
                          outlined
                          onClick={() => handleEdit(activity)}
                          tooltip="Editar"
                          tooltipOptions={{ position: 'top' }}
                        />
                        <Button
                          icon="pi pi-trash"
                          className="p-button-sm"
                          severity="success"
                          onClick={() => handleDelete(activity.id)}
                          tooltip="Eliminar"
                          tooltipOptions={{ position: 'top' }}
                        />
                      </>
                    )}
                  </div>
                </Card>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
