import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { apiJson } from '@/lib/api';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const tokenFromQuery = searchParams.get('token') || '';
  const [token, setToken] = useState(tokenFromQuery);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (tokenFromQuery) setToken(tokenFromQuery);
  }, [tokenFromQuery]);

  const validate = () => {
    if (!token) return 'Token requerido';
    if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
    if (!/[A-Z]/.test(password)) return 'La contraseña debe contener al menos una letra mayúscula';
    if (!/[0-9]/.test(password)) return 'La contraseña debe contener al menos un número';
    if (password !== confirm) return 'Las contraseñas no coinciden';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) return toast.error(err);
    try {
      setLoading(true);
      await apiJson('/api/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, password }) });
      toast.success('Contraseña restablecida correctamente. Inicia sesión.');
      navigate('/auth');
    } catch (e: any) {
      toast.error(e.message || 'Error al restablecer contraseña');
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
                <i className="pi pi-key text-3xl text-agro-primary"></i>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-900">Restablecer Contraseña</CardTitle>
            <CardDescription className="text-center px-4">
              Ingresa el token recibido y crea una nueva contraseña segura para tu cuenta.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-column gap-4">
              <div className="flex flex-column gap-2">
                <Label htmlFor="token" className="font-medium">Código de Verificación (Token)</Label>
                <Input
                  id="token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Pega aquí el código recibido"
                  required
                  className="h-3rem"
                />
              </div>
              <div className="flex flex-column gap-2">
                <Label htmlFor="password">Nueva Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="h-3rem"
                />
                <small className="text-500">Mínimo 8 caracteres, una mayúscula y un número.</small>
              </div>
              <div className="flex flex-column gap-2">
                <Label htmlFor="confirm">Confirmar Contraseña</Label>
                <Input
                  id="confirm"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
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
                      Procesando...
                    </>
                  ) : (
                    <>
                      <i className="pi pi-check-circle mr-2"></i>
                      Restablecer Contraseña
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
