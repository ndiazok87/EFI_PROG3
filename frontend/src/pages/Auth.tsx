import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
// PrimeReact components
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { TabView, TabPanel } from "primereact/tabview";
import { Message } from "primereact/message";
import { z } from "zod";

const signInSchema = z.object({
  email: z.string().trim().email({ message: "Email inválido" }).max(255),
  password: z.string().min(1, { message: "La contraseña es requerida" }).max(100),
});

const signUpSchema = z.object({
  nombre: z.string().trim().min(2, { message: "El nombre debe tener al menos 2 caracteres" }).max(100),
  email: z.string().trim().email({ message: "Email inválido" }).max(255),
  password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres" }).max(100)
    .refine((p) => /[A-Z]/.test(p), { message: 'Debe contener al menos una mayúscula' })
    .refine((p) => /[0-9]/.test(p), { message: 'Debe contener al menos un número' }),
  rol: z.enum(['admin', 'gestor', 'trabajador']),
});

const Auth = () => {
  const navigate = useNavigate();
  const { profile, signIn, signUp } = useAuth();
  const [loading, setLoading] = useState(false);

  const [signInData, setSignInData] = useState({ email: "", password: "" });
  const [signInError, setSignInError] = useState("");

  const [signUpData, setSignUpData] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "trabajador" as 'admin' | 'gestor' | 'trabajador'
  });
  const [signUpError, setSignUpError] = useState("");

  useEffect(() => {
    if (profile) {
      navigate("/");
    }
  }, [profile, navigate]);

  const rolOptions = [
    { label: 'Trabajador', value: 'trabajador' },
    { label: 'Gestor', value: 'gestor' },
    { label: 'Administrador', value: 'admin' }
  ];

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError("");
    setLoading(true);

    try {
      const validated = signInSchema.parse(signInData);
      await signIn(validated.email, validated.password);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setSignInError(err.errors[0].message);
      } else if (err instanceof Error) {
        setSignInError(err.message);
      } else {
        setSignInError("Error al iniciar sesión");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError("");
    setLoading(true);

    try {
      const validated = signUpSchema.parse(signUpData);
      await signUp(validated.email, validated.password, validated.nombre, validated.rol);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setSignUpError(err.errors[0].message);
      } else if (err instanceof Error) {
        setSignUpError(err.message);
      } else {
        setSignUpError("Error al crear la cuenta");
      }
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
        {/* Logo/Header */}
        <div className="text-center mb-6">
          <div className="inline-flex justify-content-center align-items-center gap-3 mb-3 p-3 border-round-2xl bg-white-alpha-10 backdrop-blur-sm border-1 border-white-alpha-20">
            <i className="pi pi-sun text-4xl text-agro-accent"></i>
            <h1 className="text-3xl font-bold m-0 text-white">Agro Precisión</h1>
          </div>
          <p className="text-white-alpha-90 text-lg m-0 font-medium">Sistema de Gestión Agrícola</p>
        </div>

        {/* Card con Tabs */}
        <Card className="shadow-8 border-round-2xl overflow-hidden">
          <TabView>
            {/* TAB LOGIN */}
            <TabPanel header="Iniciar Sesión">
              <form onSubmit={handleSignIn} className="flex flex-column gap-3 pt-2">

                {/* Email */}
                <div className="flex flex-column gap-2">
                  <label htmlFor="signin-email" className="font-medium">Email</label>
                  <InputText
                    id="signin-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={signInData.email}
                    onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>

                {/* Password */}
                <div className="flex flex-column gap-2">
                  <label htmlFor="signin-password" className="font-medium">Contraseña</label>
                  <Password
                    id="signin-password"
                    value={signInData.password}
                    onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                    placeholder="••••••••"
                    feedback={false}
                    toggleMask
                    required
                    disabled={loading}
                    className="w-full"
                    inputClassName="w-full"
                  />
                  <div className="text-right">
                    <button
                      type="button"
                      className="text-sm text-primary no-underline hover:underline cursor-pointer bg-transparent border-none p-0"
                      onClick={() => navigate('/forgot-password')}
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {signInError && (
                  <Message severity="error" text={signInError} />
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  label={loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                  icon={loading ? "pi pi-spin pi-spinner" : "pi pi-sign-in"}
                  className="w-full mt-4 border-round-3xl font-bold"
                  severity="success"
                  disabled={loading}
                />
              </form>
            </TabPanel>

            {/* TAB REGISTRO */}
            <TabPanel header="Registrarse">
              <form onSubmit={handleSignUp} className="flex flex-column gap-3 pt-2">

                {/* Nombre */}
                <div className="flex flex-column gap-2">
                  <label htmlFor="signup-nombre" className="font-medium">Nombre Completo</label>
                  <InputText
                    id="signup-nombre"
                    type="text"
                    placeholder="Juan Pérez"
                    value={signUpData.nombre}
                    onChange={(e) => setSignUpData({ ...signUpData, nombre: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>

                {/* Email */}
                <div className="flex flex-column gap-2">
                  <label htmlFor="signup-email" className="font-medium">Email</label>
                  <InputText
                    id="signup-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={signUpData.email}
                    onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>

                {/* Password */}
                <div className="flex flex-column gap-2">
                  <label htmlFor="signup-password" className="font-medium">Contraseña</label>
                  <Password
                    id="signup-password"
                    value={signUpData.password}
                    onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                    placeholder="••••••••"
                    toggleMask
                    required
                    disabled={loading}
                    className="w-full"
                    inputClassName="w-full"
                  />
                  <small className="text-600">Mínimo 8 caracteres, incluye mayúscula y número</small>
                </div>

                {/* Rol */}
                <div className="flex flex-column gap-2">
                  <label htmlFor="signup-rol" className="font-medium">Rol</label>
                  <Dropdown
                    id="signup-rol"
                    value={signUpData.rol}
                    options={rolOptions}
                    onChange={(e) => setSignUpData({ ...signUpData, rol: e.value })}
                    placeholder="Seleccione un rol"
                    disabled={loading}
                  />
                </div>

                {/* Error Message */}
                {signUpError && (
                  <Message severity="error" text={signUpError} />
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  label={loading ? "Creando cuenta..." : "Crear Cuenta"}
                  icon={loading ? "pi pi-spin pi-spinner" : "pi pi-user-plus"}
                  className="w-full mt-4 border-round-3xl font-bold"
                  severity="success"
                  disabled={loading}
                />
              </form>
            </TabPanel>
          </TabView>
        </Card>

        {/* Footer */}
        <div className="text-center mt-4">
          <small className="text-white">
            © 2025 Agro Precision - Gestión Agrícola Inteligente
          </small>
        </div>
      </div>
    </div>
  );
};

export default Auth;
