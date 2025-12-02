import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Dashboard = () => {
  return (
    <section id="dashboard" className="py-6 surface-0">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-900 mb-3">
            Panel de Control en Tiempo Real
          </h2>
          <p className="text-xl text-600 max-w-30rem mx-auto">
            Monitorea todos tus campos desde un solo lugar
          </p>
        </div>

        {/* Main Metrics Grid */}
        {/* Main Metrics Grid */}
        <div className="grid mb-4">
          <div className="col-12 md:col-6 lg:col-3 p-3">
            <Card className="border-2 hover:border-primary transition-colors h-full">
              <CardHeader className="flex flex-row align-items-center justify-content-between pb-2">
                <CardTitle className="text-sm font-medium text-600">
                  Humedad del Suelo
                </CardTitle>
                <i className="pi pi-tint text-xl text-primary"></i>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-900">67%</div>
                <p className="text-xs text-600 mt-2">
                  <span className="text-primary">↑ 5%</span> desde ayer
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="col-12 md:col-6 lg:col-3 p-3">
            <Card className="border-2 hover:border-primary transition-colors h-full">
              <CardHeader className="flex flex-row align-items-center justify-content-between pb-2">
                <CardTitle className="text-sm font-medium text-600">
                  Temperatura
                </CardTitle>
                <i className="pi pi-sun text-xl text-primary"></i>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-900">24°C</div>
                <p className="text-xs text-600 mt-2">
                  Rango óptimo: 18-28°C
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="col-12 md:col-6 lg:col-3 p-3">
            <Card className="border-2 hover:border-primary transition-colors h-full">
              <CardHeader className="flex flex-row align-items-center justify-content-between pb-2">
                <CardTitle className="text-sm font-medium text-600">
                  Velocidad del Viento
                </CardTitle>
                <i className="pi pi-compass text-xl text-primary"></i>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-900">12 km/h</div>
                <p className="text-xs text-600 mt-2">
                  Dirección: Noreste
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="col-12 md:col-6 lg:col-3 p-3">
            <Card className="border-2 hover:border-primary transition-colors h-full">
              <CardHeader className="flex flex-row align-items-center justify-content-between pb-2">
                <CardTitle className="text-sm font-medium text-600">
                  Radiación Solar
                </CardTitle>
                <i className="pi pi-sun text-xl text-primary"></i>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-900">850 W/m²</div>
                <p className="text-xs text-600 mt-2">
                  Condiciones ideales
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Field Status Cards */}
        {/* Field Status Cards */}
        <div className="grid">
          <div className="col-12 lg:col-6 p-3">
            <Card className="border-2 h-full">
              <CardHeader>
                <CardTitle className="flex align-items-center gap-2">
                  <i className="pi pi-map-marker text-primary"></i>
                  Campo Norte - Maíz
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-column gap-3">
                  <div className="flex justify-content-between align-items-center">
                    <span className="text-600">Etapa de Crecimiento</span>
                    <span className="font-semibold text-900">Floración</span>
                  </div>
                  <div className="flex justify-content-between align-items-center">
                    <span className="text-600">Área</span>
                    <span className="font-semibold text-900">15.5 hectáreas</span>
                  </div>
                  <div className="flex justify-content-between align-items-center">
                    <span className="text-600">Rendimiento Estimado</span>
                    <span className="font-semibold text-primary flex align-items-center gap-1">
                      <i className="pi pi-arrow-up"></i>
                      8.2 ton/ha
                    </span>
                  </div>
                  <div className="w-full surface-200 border-round-2xl h-1rem">
                    <div className="bg-primary h-1rem border-round-2xl" style={{ width: '75%' }}></div>
                  </div>
                  <p className="text-sm text-600 m-0">Estado: Excelente (75%)</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="col-12 lg:col-6 p-3">
            <Card className="border-2 h-full">
              <CardHeader>
                <CardTitle className="flex align-items-center gap-2">
                  <i className="pi pi-map-marker text-primary"></i>
                  Campo Sur - Trigo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-column gap-3">
                  <div className="flex justify-content-between align-items-center">
                    <span className="text-600">Etapa de Crecimiento</span>
                    <span className="font-semibold text-900">Maduración</span>
                  </div>
                  <div className="flex justify-content-between align-items-center">
                    <span className="text-600">Área</span>
                    <span className="font-semibold text-900">22.3 hectáreas</span>
                  </div>
                  <div className="flex justify-content-between align-items-center">
                    <span className="text-600">Rendimiento Estimado</span>
                    <span className="font-semibold text-primary flex align-items-center gap-1">
                      <i className="pi pi-arrow-up"></i>
                      6.8 ton/ha
                    </span>
                  </div>
                  <div className="w-full surface-200 border-round-2xl h-1rem">
                    <div className="bg-primary h-1rem border-round-2xl" style={{ width: '88%' }}></div>
                  </div>
                  <p className="text-sm text-600 m-0">Estado: Muy Bueno (88%)</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
