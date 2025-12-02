import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useResources } from '@/contexts/ResourcesContext';
import { usePlots } from '@/contexts/PlotsContext';
import { useActivities } from '@/contexts/ActivitiesContext';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { Card } from 'primereact/card';
import { generateModernPDF } from '@/utils/pdfGenerator';

export default function ResourcesPage() {
  const { profile, userId, loading: authLoading } = useAuth();
  const { resources, loading, createResource, updateResource, deleteResource } = useResources();
  const { plots } = usePlots();
  const { activities } = useActivities();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<any>(null);
  const [formData, setFormData] = useState({
    tipo: 'maquinaria',
    nombre: '',
    cantidad: 0,
    id_parcela: '',
    disponible: true,
  });

  useEffect(() => {
    if (!authLoading && !profile) {
      navigate('/auth');
    }
  }, [profile, authLoading, navigate]);

  const canManage = profile?.rol === 'admin' || profile?.rol === 'gestor';

  const tipoOptions = [
    { label: 'Maquinaria', value: 'maquinaria' },
    { label: 'Fertilizantes', value: 'fertilizantes' },
    { label: 'Semillas', value: 'semillas' },
    { label: 'Herramientas', value: 'herramientas' },
  ];

  const parcelaOptions = [
    { label: 'Sin asignar', value: '' },
    ...plots.map((p) => ({ label: p.nombre, value: p.id })),
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resourceData = {
        tipo: formData.tipo,
        nombre: formData.nombre,
        cantidad: formData.cantidad,
        id_parcela: formData.id_parcela || undefined,
        disponible: formData.disponible,
      };

      if (editingResource) {
        await updateResource(editingResource.id, resourceData as any);
      } else {
        await createResource(resourceData as any);
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('ResourcesPage.handleSubmit error:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      tipo: 'maquinaria',
      nombre: '',
      cantidad: 0,
      id_parcela: '',
      disponible: true,
    });
    setEditingResource(null);
  };

  const handleEdit = (resource: any) => {
    setEditingResource(resource);
    setFormData({
      tipo: resource.tipo,
      nombre: resource.nombre,
      cantidad: resource.cantidad,
      id_parcela: resource.id_parcela || '',
      disponible: resource.disponible,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Estas seguro de eliminar este recurso?')) {
      await deleteResource(id);
    }
  };

  const getParcelaNombre = (resource: any) => {
    return resource.plots?.nombre || plots.find((p) => p.id === resource.id_parcela)?.nombre || 'Sin asignar';
  };

  const generatePDF = () => {
    const tableData = resources.map((r) => [
      r.nombre,
      r.tipo,
      `${r.cantidad}`,
      getParcelaNombre(r),
      r.disponible ? 'Disponible' : 'No disponible',
    ]);

    generateModernPDF({
      title: 'Listado de Recursos',
      subtitle: 'Inventario de maquinaria, herramientas e insumos',
      filename: 'recursos_agro_precision',
      columns: ['Nombre', 'Tipo', 'Cantidad', 'Ubicación', 'Estado'],
      data: tableData
    });
  };

  const filteredResources = resources.filter((r) => {
    if (profile?.rol === 'trabajador') {
      const workerPlots = activities
        .filter((a) => a.id_trabajador === userId && a.estado !== 'completada')
        .map((a) => a.id_parcela);
      return r.id_parcela && workerPlots.includes(r.id_parcela);
    }
    return true;
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
      <Button label="Cancelar" icon="pi pi-times" onClick={() => setIsDialogOpen(false)} className="p-button-text" />
      <Button label={editingResource ? 'Actualizar' : 'Crear'} icon="pi pi-check" onClick={handleSubmit} type="submit" />
    </div>
  );

  return (
    <div className="min-h-screen surface-ground">
      <nav className="app-navbar">
        <div className="w-full max-w-7xl mx-auto px-4 py-3 flex justify-content-between align-items-center">
          <div className="flex align-items-center gap-3">
            <i className="pi pi-box text-agro-primary text-2xl"></i>
            <h1 className="text-2xl font-bold m-0">Recursos</h1>
          </div>
          <Button label="Volver al Dashboard" icon="pi pi-arrow-left" className="p-button-text" onClick={() => navigate('/')} />
        </div>
      </nav>

      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-content-between align-items-center mb-5">
          <h2 className="text-3xl font-bold text-900 m-0">Gestion de Recursos</h2>
          <div className="flex gap-2">
            <Button
              label="Descargar Listado"
              icon="pi pi-file-pdf"
              className="p-button-outlined"
              onClick={generatePDF}
              aria-label="Descargar listado de recursos en PDF"
            />
            {canManage && (
              <Button label="Nuevo Recurso" icon="pi pi-plus" onClick={() => setIsDialogOpen(true)} severity="success" aria-label="Crear nuevo recurso" />
            )}
          </div>
        </div>

        <Dialog
          visible={isDialogOpen}
          onHide={() => {
            setIsDialogOpen(false);
            resetForm();
          }}
          header={
            <div className="flex align-items-center gap-2">
              <i className="pi pi-box text-primary"></i>
              <span>{editingResource ? 'Editar Recurso' : 'Nuevo Recurso'}</span>
            </div>
          }
          footer={dialogFooter}
          style={{ width: '450px' }}
          modal
          draggable={false}
        >
          <form onSubmit={handleSubmit} className="flex flex-column gap-4 pt-3">
            <div className="flex flex-column gap-2">
              <label htmlFor="tipo" className="font-semibold">
                Tipo <span className="text-red-500">*</span>
              </label>
              <Dropdown id="tipo" value={formData.tipo} options={tipoOptions} onChange={(e) => setFormData({ ...formData, tipo: e.value })} placeholder="Seleccione un tipo" className="w-full" />
            </div>

            <div className="flex flex-column gap-2">
              <label htmlFor="nombre" className="font-semibold">
                Nombre <span className="text-red-500">*</span>
              </label>
              <InputText
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Tractor John Deere 5075E"
                required
                className="w-full"
              />
              <small className="text-600">Identificacion del recurso</small>
            </div>

            <div className="flex flex-column gap-2">
              <label htmlFor="cantidad" className="font-semibold">
                Cantidad <span className="text-red-500">*</span>
              </label>
              <InputNumber
                id="cantidad"
                value={formData.cantidad}
                onValueChange={(e) => setFormData({ ...formData, cantidad: e.value || 0 })}
                min={0}
                placeholder="0"
                className="w-full"
                required
              />
              <small className="text-600">Unidades disponibles</small>
            </div>

            <div className="flex flex-column gap-2">
              <label htmlFor="id_parcela" className="font-semibold">
                Parcela (Opcional)
              </label>
              <Dropdown
                id="id_parcela"
                value={formData.id_parcela}
                options={parcelaOptions}
                onChange={(e) => setFormData({ ...formData, id_parcela: e.value })}
                placeholder="Sin asignar"
                className="w-full"
              />
              <small className="text-600">Asignar a una parcela especifica</small>
            </div>

            <div className="flex align-items-center gap-3 pt-2">
              <InputSwitch id="disponible" checked={formData.disponible} onChange={(e) => setFormData({ ...formData, disponible: e.value })} />
              <label htmlFor="disponible" className="font-semibold m-0">
                Recurso Disponible
              </label>
            </div>
            <small className="text-600 mt-n2">
              {formData.disponible ? 'Este recurso esta disponible para uso' : 'Este recurso no esta disponible'}
            </small>
          </form>
        </Dialog>

        <div className="grid">
          {filteredResources.length === 0 ? (
            <div className="col-12 text-center py-6">
              <i className="pi pi-inbox text-400" style={{ fontSize: '3rem' }}></i>
              <p className="text-600 mt-3">No hay recursos registrados</p>
            </div>
          ) : (
            filteredResources.map((resource) => (
              <div key={resource.id} className="col-12 md:col-6 lg:col-4 p-3">
                <Card className="h-full card-hover">
                  <div className="flex justify-content-between align-items-start mb-3">
                    <div className="flex align-items-center gap-3">
                      <div className="icon-container">
                        <i
                          className={
                            resource.tipo === 'maquinaria'
                              ? 'pi pi-cog'
                              : resource.tipo === 'fertilizantes'
                                ? 'pi pi-filter'
                                : resource.tipo === 'semillas'
                                  ? 'pi pi-circle-fill'
                                  : resource.tipo === 'herramientas'
                                    ? 'pi pi-wrench'
                                    : 'pi pi-box'
                          }
                        ></i>
                      </div>
                      <h3 className="m-0 text-xl font-bold text-900">{resource.nombre}</h3>
                    </div>
                    <span className={resource.disponible ? 'status-chip completed' : 'status-chip pending'}>
                      {resource.disponible ? 'Disponible' : 'No disponible'}
                    </span>
                  </div>

                  <div className="flex flex-column gap-2 text-600">
                    <div className="flex align-items-center gap-2">
                      <i className="pi pi-tag text-sm"></i>
                      <span>
                        <strong>Tipo:</strong> {resource.tipo}
                      </span>
                    </div>
                    <div className="flex align-items-center gap-2">
                      <i className="pi pi-hashtag text-sm"></i>
                      <span>
                        <strong>Cantidad:</strong> {resource.cantidad}
                      </span>
                    </div>
                    <div className="flex align-items-center gap-2">
                      <i className="pi pi-map-marker text-sm"></i>
                      <span>
                        <strong>Parcela:</strong> {getParcelaNombre(resource)}
                      </span>
                    </div>
                  </div>

                  {canManage && (
                    <div className="flex gap-2 mt-4 pt-3 border-top-1 surface-border">
                      <Button
                        icon="pi pi-pencil"
                        className="p-button-sm"
                        severity="secondary"
                        outlined
                        onClick={() => handleEdit(resource)}
                        aria-label="Editar recurso"
                        tooltip="Editar"
                        tooltipOptions={{ position: 'top' }}
                      />
                      <Button
                        icon="pi pi-trash"
                        className="p-button-sm"
                        severity="success"
                        onClick={() => handleDelete(resource.id)}
                        aria-label="Eliminar recurso"
                        tooltip="Eliminar"
                        tooltipOptions={{ position: 'top' }}
                      />
                    </div>
                  )}
                </Card>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
