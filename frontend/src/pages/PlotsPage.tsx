import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePlots } from '@/contexts/PlotsContext';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Card } from 'primereact/card';
import { generateModernPDF } from '@/utils/pdfGenerator';

export default function PlotsPage() {
  const { profile, loading: authLoading } = useAuth();
  const { plots, loading, createPlot, updatePlot, deletePlot } = usePlots();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlot, setEditingPlot] = useState<any>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    superficie: 0,
    tipo_cultivo: '',
    estado: '',
  });

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCultivo, setFilterCultivo] = useState('todos');
  const [filterEstado, setFilterEstado] = useState('todos');

  useEffect(() => {
    if (!authLoading && !profile) {
      navigate('/auth');
    }
  }, [profile, authLoading, navigate]);

  const canCreate = profile?.rol === 'admin';
  const canEdit = profile?.rol === 'admin' || profile?.rol === 'gestor';
  const canDelete = profile?.rol === 'admin';

  const cultivoOptions = [
    { label: 'Todos los cultivos', value: 'todos' },
    { label: 'Maiz', value: 'maiz' },
    { label: 'Trigo', value: 'trigo' },
    { label: 'Soja', value: 'soja' },
    { label: 'Girasol', value: 'girasol' },
    { label: 'Otro', value: 'otro' },
  ];

  const estadoOptions = [
    { label: 'Todos los estados', value: 'todos' },
    { label: 'En Preparacion', value: 'en preparacion' },
    { label: 'Sembrado', value: 'sembrado' },
    { label: 'Cosechado', value: 'cosechado' },
  ];

  const cultivoFormOptions = cultivoOptions.filter((o) => o.value !== 'todos');
  const estadoFormOptions = estadoOptions.filter((o) => o.value !== 'todos');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPlot) {
        await updatePlot(editingPlot.id, {
          nombre: formData.nombre,
          superficie: formData.superficie,
          tipo_cultivo: formData.tipo_cultivo as any,
          estado: formData.estado as any,
        });
      } else {
        await createPlot({
          nombre: formData.nombre,
          superficie: formData.superficie,
          tipo_cultivo: formData.tipo_cultivo as any,
          estado: formData.estado as any,
        });
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
      superficie: 0,
      tipo_cultivo: '',
      estado: '',
    });
    setEditingPlot(null);
  };

  const handleEdit = (plot: any) => {
    setEditingPlot(plot);
    setFormData({
      nombre: plot.nombre,
      superficie: plot.superficie,
      tipo_cultivo: plot.tipo_cultivo,
      estado: plot.estado,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Estas seguro de eliminar esta parcela?')) {
      await deletePlot(id);
    }
  };

  const filteredPlots = plots.filter((plot) => {
    const matchesSearch = plot.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCultivo = filterCultivo === 'todos' || plot.tipo_cultivo === filterCultivo;
    const matchesEstado = filterEstado === 'todos' || plot.estado === filterEstado;
    return matchesSearch && matchesCultivo && matchesEstado;
  });

  if (authLoading || loading) {
    return (
      <div className="flex align-items-center justify-content-center min-h-screen">
        <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
      </div>
    );
  }

  const dialogFooter = (
    <div className="flex justify-content-end gap-2">
      <Button label="Cancelar" onClick={() => setIsDialogOpen(false)} className="p-button-text" />
      <Button label={editingPlot ? 'Actualizar' : 'Crear'} onClick={handleSubmit} severity="success" />
    </div>
  );

  const generatePDF = () => {
    const tableData = plots.map((p) => [p.nombre, `${p.superficie} ha`, p.tipo_cultivo, p.estado]);

    generateModernPDF({
      title: 'Listado de Parcelas',
      subtitle: 'Reporte de estado de tierras y cultivos',
      filename: 'parcelas_agro_precision',
      columns: ['Nombre', 'Superficie', 'Cultivo', 'Estado'],
      data: tableData
    });
  };

  return (
    <div className="min-h-screen bg-agro-surface">
      <nav className="app-navbar">
        <div className="w-full max-w-7xl mx-auto px-4 py-3 flex justify-content-between align-items-center">
          <div className="flex align-items-center gap-3">
            <i className="pi pi-map-marker text-agro-primary text-2xl"></i>
            <h1 className="text-2xl font-bold m-0">Parcelas</h1>
          </div>
          <Button label="Volver al Dashboard" icon="pi pi-arrow-left" className="p-button-text" onClick={() => navigate('/')} />
        </div>
      </nav>

      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-column gap-3 mb-5">
          <h2 className="text-3xl font-bold m-0">Gestion de Parcelas</h2>

          <div className="flex flex-column md:flex-row flex-wrap gap-2 align-items-center">
            <span className="p-input-icon-left" style={{ minWidth: '240px' }}>
              <i className="pi pi-search" />
              <InputText
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
                style={{ paddingLeft: '2.5rem' }}
              />
            </span>

            <Dropdown
              value={filterCultivo}
              options={cultivoOptions}
              onChange={(e) => setFilterCultivo(e.value)}
              placeholder="Todos los cultivos"
              className="w-full md:w-14rem"
            />

            <Dropdown
              value={filterEstado}
              options={estadoOptions}
              onChange={(e) => setFilterEstado(e.value)}
              placeholder="Todos los estados"
              className="w-full md:w-14rem"
            />

            <div className="flex flex-row flex-wrap gap-2 md:ml-auto">
              <Button
                label="Exportar PDF"
                icon="pi pi-file-pdf"
                className="p-button-outlined w-full md:w-auto"
                onClick={generatePDF}
              />
              {canCreate && (
                <Button
                  label="Nueva Parcela"
                  icon="pi pi-plus"
                  onClick={() => setIsDialogOpen(true)}
                  severity="success"
                  className="w-full md:w-auto"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog
        visible={isDialogOpen}
        onHide={() => {
          setIsDialogOpen(false);
          resetForm();
        }}
        header={editingPlot ? 'Editar Parcela' : 'Nueva Parcela'}
        footer={dialogFooter}
        style={{ width: '450px', borderRadius: 'var(--agro-radius-lg)' }}
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

          <div className="flex flex-column gap-2">
            <label htmlFor="superficie" className="font-medium">Superficie (ha)</label>
            <InputNumber
              id="superficie"
              value={formData.superficie}
              onValueChange={(e) => setFormData({ ...formData, superficie: e.value || 0 })}
              mode="decimal"
              minFractionDigits={2}
              maxFractionDigits={2}
              min={0}
              suffix=" ha"
              required
            />
          </div>

          <div className="flex flex-column gap-2">
            <label htmlFor="tipo_cultivo" className="font-medium">Tipo de Cultivo</label>
            <Dropdown
              id="tipo_cultivo"
              value={formData.tipo_cultivo}
              options={cultivoFormOptions}
              onChange={(e) => setFormData({ ...formData, tipo_cultivo: e.value })}
              placeholder="Maiz"
              required
            />
          </div>

          <div className="flex flex-column gap-2">
            <label htmlFor="estado" className="font-medium">Estado</label>
            <Dropdown
              id="estado"
              value={formData.estado}
              options={estadoFormOptions}
              onChange={(e) => setFormData({ ...formData, estado: e.value })}
              placeholder="En Preparacion"
              required
            />
          </div>
        </form>
      </Dialog>

      <div className="grid">
        {filteredPlots.length === 0 ? (
          <div className="col-12 text-center py-6">
            <i className="pi pi-inbox text-400" style={{ fontSize: '3rem' }}></i>
            <p className="text-600 mt-3">No se encontraron parcelas</p>
          </div>
        ) : (
          filteredPlots.map((plot) => (
            <div key={plot.id} className="col-12 md:col-6 lg:col-4 p-3">
              <Card className="h-full card-hover">
                <div className="flex justify-content-between align-items-start mb-3">
                  <div className="flex align-items-center gap-3">
                    <div className="icon-container">
                      <i className="pi pi-map-marker"></i>
                    </div>
                    <h3 className="m-0 text-xl font-bold">{plot.nombre}</h3>
                  </div>
                  <span
                    className={
                      plot.estado === 'sembrado'
                        ? 'status-chip completed'
                        : plot.estado === 'cosechado'
                          ? 'status-chip in-progress'
                          : 'status-chip pending'
                    }
                  >
                    {plot.estado}
                  </span>
                </div>

                <div className="flex flex-column gap-2 text-agro-secondary mb-3">
                  <p className="flex align-items-center gap-2 m-0">
                    <i className="pi pi-chart-bar text-agro-primary"></i>
                    <strong>Superficie:</strong> {plot.superficie} ha
                  </p>
                  <p className="flex align-items-center gap-2 m-0">
                    <i className="pi pi-sun text-agro-primary"></i>
                    <strong>Cultivo:</strong> {plot.tipo_cultivo}
                  </p>
                </div>

                {(canEdit || canDelete) && (
                  <div className="flex gap-2">
                    {canEdit && (
                      <Button
                        icon="pi pi-pencil"
                        className="p-button-sm"
                        severity="secondary"
                        outlined
                        onClick={() => handleEdit(plot)}
                        tooltip="Editar"
                        tooltipOptions={{ position: 'top' }}
                      />
                    )}
                    {canDelete && (
                      <Button
                        icon="pi pi-trash"
                        className="p-button-sm"
                        severity="success"
                        onClick={() => handleDelete(plot.id)}
                        tooltip="Eliminar"
                        tooltipOptions={{ position: 'top' }}
                      />
                    )}
                  </div>
                )}
              </Card>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
