import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/api';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authApi.login(form);
      login(data.user, data.token);
      const paths = {
        CLIENTE: '/dashboard/cliente',
        TECNICO: '/dashboard/tecnico',
        EMPRESA: '/dashboard/empresa',
        ADMIN: '/dashboard/admin',
      };
      navigate(paths[data.user.role] || '/dashboard/cliente');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-primary p-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>home_repair_service</span>
          </div>
          <span className="text-white font-headline-sm text-headline-sm font-black">HomeFix Pro</span>
        </div>
        <div>
          <h1 className="font-display-lg text-display-lg text-white leading-tight">
            Mantenimiento<br />a tu alcance
          </h1>
          <p className="text-white/70 font-body-lg text-body-lg mt-4 max-w-md">
            Conectamos clientes con técnicos verificados en Managua. Electricidad, plomería, aire acondicionado y más.
          </p>
          <div className="flex gap-8 mt-10">
            {[{ n: '200+', l: 'Técnicos' }, { n: '1,500+', l: 'Servicios' }, { n: '4.8⭐', l: 'Calificación' }].map(s => (
              <div key={s.l}>
                <p className="text-white font-headline-md text-headline-md font-bold">{s.n}</p>
                <p className="text-white/60 font-label-sm text-label-sm">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-white/40 font-label-sm text-label-sm">&copy; 2026 HomeFix Pro. Managua, Nicaragua.</p>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>home_repair_service</span>
            <span className="font-headline-sm text-headline-sm text-primary font-black">HomeFix Pro</span>
          </div>

          <h2 className="font-headline-lg text-headline-lg text-on-background">Bienvenido de vuelta</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Ingresa tus credenciales para continuar</p>

          {error && (
            <div className="mt-4 px-4 py-3 bg-error-container text-error rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              <span className="font-body-sm text-body-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-1.5">Correo Electrónico</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="tu@correo.com"
                required
                className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-1.5">Contraseña</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-on-primary py-3 rounded-lg font-label-md text-label-md hover:bg-primary-variant transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> : null}
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <p className="mt-6 text-center font-body-sm text-body-sm text-on-surface-variant">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-primary font-bold hover:underline">Regístrate aquí</Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-8 p-4 bg-surface-container rounded-lg border border-outline-variant">
            <p className="font-label-sm text-label-sm text-on-surface-variant mb-2">Credenciales de demo:</p>
            <div className="space-y-1 text-body-sm font-body-sm">
              <p><span className="text-primary font-bold">Admin:</span> admin@homefix.pro</p>
              <p><span className="text-info font-bold">Cliente:</span> maria@ejemplo.com</p>
              <p><span className="text-success font-bold">Técnico:</span> juan@tech.com</p>
              <p className="text-on-surface-variant">Contraseña: <code className="bg-surface-container-high px-1 rounded">123456</code></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
