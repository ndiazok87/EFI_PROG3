import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: "pi-globe",
    title: "Monitoreo Satelital",
    description: "Imágenes satelitales de alta resolución para análisis detallado de cultivos y detección temprana de problemas.",
  },
  {
    icon: "pi-send",
    title: "Drones Agrícolas",
    description: "Tecnología de drones para mapeo aéreo, fumigación de precisión y monitoreo visual de cultivos.",
  },
  {
    icon: "pi-wifi",
    title: "Sensores IoT",
    description: "Red de sensores a campo para medición en tiempo real de humedad, temperatura y nutrientes del suelo.",
  },
  {
    icon: "pi-chart-bar",
    title: "Análisis Predictivo",
    description: "Algoritmos de IA que predicen rendimientos, detectan enfermedades y optimizan el uso de recursos.",
  },
  {
    icon: "pi-users",
    title: "Gestión de Equipos",
    description: "Administra tu equipo de trabajo, asigna tareas y monitorea la actividad de empleados en el campo.",
  },
  {
    icon: "pi-cog",
    title: "Control de Roles",
    description: "Sistema de permisos para operadores, supervisores y administradores con acceso personalizado.",
  },
];

export const Features = () => {
  return (
    <section className="py-6 surface-50">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-900 mb-3">
            Tecnología de Vanguardia
          </h2>
          <p className="text-xl text-600 max-w-30rem mx-auto">
            Herramientas profesionales para maximizar tu productividad agrícola
          </p>
        </div>

        <div className="grid">
          {features.map((feature, index) => {
            return (
              <div key={index} className="col-12 md:col-6 lg:col-4 p-3">
                <Card
                  className="border-2 hover:border-primary transition-duration-300 hover:shadow-4 h-full"
                >
                  <CardHeader>
                    <div className="w-3rem h-3rem bg-primary-50 border-round flex align-items-center justify-content-center mb-3">
                      <i className={`pi ${feature.icon} text-xl text-primary`}></i>
                    </div>
                    <CardTitle className="text-900">{feature.title}</CardTitle>
                    <CardDescription className="text-600">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
