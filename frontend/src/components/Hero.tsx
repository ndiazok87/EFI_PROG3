import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-farm.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex align-items-center justify-content-center overflow-hidden">
      {/* Background Image with Improved Overlay */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute top-0 left-0 w-full h-full overlay-gradient-dark" />
      </div>

      {/* Content */}
      <div className="relative z-2 w-full max-w-7xl mx-auto px-4 py-8 text-center">
        <div className="flex justify-content-center mb-6">
          <div className="glass-effect p-4 border-radius-xl">
            <i className="pi pi-sun text-6xl text-white"></i>
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          Agricultura de Precisión
        </h1>

        <p className="text-xl md:text-2xl text-white-alpha-90 mb-8 max-w-30rem mx-auto">
          Optimiza tu producción agrícola con tecnología de punta.
          Monitoreo en tiempo real, análisis de datos y decisiones inteligentes.
        </p>

        <div className="flex flex-column sm:flex-row gap-4 justify-content-center align-items-center">
          <Button
            size="lg"
            className="bg-white text-primary border-none hover:bg-white-alpha-90"
            style={{ borderRadius: 'var(--agro-radius-pill)', fontWeight: 500 }}
            onClick={() => document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Ver Panel de Control
            <i className="pi pi-arrow-right ml-2"></i>
          </Button>
        </div>

        {/* Enhanced Stats with Better Glassmorphism */}
        <div className="grid mt-8 max-w-4xl mx-auto">
          <div className="col-12 md:col-4 p-3">
            <div className="glass-effect p-6 border-radius-xl card-hover">
              <div className="text-4xl font-bold text-white mb-2">+30%</div>
              <div className="text-white-alpha-80">Incremento en Rendimiento</div>
            </div>
          </div>
          <div className="col-12 md:col-4 p-3">
            <div className="glass-effect p-6 border-radius-xl card-hover">
              <div className="text-4xl font-bold text-white mb-2">-25%</div>
              <div className="text-white-alpha-80">Reducción de Costos</div>
            </div>
          </div>
          <div className="col-12 md:col-4 p-3">
            <div className="glass-effect p-6 border-radius-xl card-hover">
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-white-alpha-80">Monitoreo Continuo</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
