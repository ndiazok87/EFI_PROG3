import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import * as authService from '@/services/auth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error('Introduce tu email');
    try {
      setLoading(true);
      await authService.forgotPassword(email);
      toast.success('Si el email existe, se ha enviado un enlace para restablecer la contraseña');
      navigate('/auth');
    } catch (err: any) {
      console.error('forgotPassword error', err);
      toast.error(err.message || 'Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex align-items-center justify-content-center p-4 bg-cover bg-center relative overflow-hidden">
      {/* Background Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-agro-primary" style={{ opacity: 0.9, background: 'linear-gradient(135deg, var(--agro-primary) 0%, #1b5e20 100%)' }}></div>

      {/* Decorative Circles */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute border-circle bg-white-alpha-10" style={{ width: '600px', height: '600px', top: '-200px', left: '-200px' }}></div>
        <div className="absolute border-circle bg-white-alpha-05" style={{ width: '400px', height: '400px', bottom: '-100px', right: '-100px' }}></div>
      </div>

      <div className="w-full max-w-30rem relative z-2">
        <Card className="shadow-8 border-round-2xl overflow-hidden">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-content-center mb-3">
              <div className="p-3 border-circle bg-primary-50 text-primary">
                <i className="pi pi-lock text-3xl text-agro-primary"></i>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-900">Recuperar Contraseña</CardTitle>
            <CardDescription className="text-center px-4">
              Ingresa tu correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-column gap-4">
              <div className="flex flex-column gap-2">
                <Label htmlFor="forgot-email" className="font-medium">Correo Electrónico</Label>
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-3rem"
                />
              </div>
              <div className="flex justify-content-center mt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 border-round-3xl font-bold bg-agro-primary hover:bg-green-700 text-white transition-colors"
                  style={{ minWidth: '200px' }}
                >
                  {loading ? (
                    <>
                      <i className="pi pi-spin pi-spinner mr-2"></i>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <i className="pi pi-send mr-2"></i>
                      Enviar Enlace
                    </>
                  )}
                </Button>
              </div>
              <div className="text-center mt-2">
                <button
                  type="button"
                  onClick={() => navigate('/auth')}
                  className="text-sm text-600 hover:text-agro-primary font-medium bg-transparent border-none cursor-pointer transition-colors flex align-items-center justify-content-center gap-2 mx-auto"
                >
                  <i className="pi pi-arrow-left text-xs"></i>
                  Volver al inicio de sesión
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
