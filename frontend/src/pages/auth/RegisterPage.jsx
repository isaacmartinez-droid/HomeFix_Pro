import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/api';

export default function RegisterPage() {
  const [form, setForm] = useState({ email: '', password: '', fullName: '', phone: '', role: 'CLIENTE', address: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authApi.register(form);
      login(data.user, data.token);
      const paths = { CLIENTE: '/dashboard/cliente', TECNICO: '/dashboard/tecnico', EMPRESA: '/dashboard/empresa' };
      navigate(paths[data.user.role] || '/dashboard/cliente');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: 'CLIENTE', label: 'Cliente', icon: 'person', desc: 'Busco servicios de mantenimiento' },
    { value: 'TECNICO', label: 'Técnico', icon: 'build', desc: 'Ofrezco mis servicios profesionales' },
    { value: 'EMPRESA', label: 'Empresa', icon: 'business', desc: 'Soy una empresa proveedora' },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-2 mb-8">
          <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>home_repair_service</span>
          <span className="font-headline-sm text-headline-sm text-primary font-black">HomeFix Pro</span>
        </div>

        <h2 className="font-headline-lg text-headline-lg text-on-background">Crear Cuenta</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">Únete a la comunidad HomeFix Pro en Managua</p>

        {error && (
          <div className="mt-4 px-4 py-3 bg-error-container text-error rounded-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">error</span>
            <span className="font-body-sm text-body-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Role Selector */}
          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-2">Tipo de cuenta</label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map(r => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setForm({ ...form, role: r.value })}
                  className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all cursor-pointer ${form.role === r.value ? 'border-primary bg-primary-container' : 'border-outline-variant hover:border-primary/50'}`}
                >
                  <span className="material-symbols-outlined text-primary">{r.icon}</span>
                  <span className="font-label-md text-label-md text-on-surface mt-1">{r.label}</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant text-center mt-0.5">{r.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-label-md text-label-md text-on-surface mb-1.5">Nombre Completo</label>
              <input type="text" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })}
                placeholder="María Pérez" required
                className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md" />
            </div>
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-1.5">Correo Electrónico</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="tu@correo.com" required
                className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md" />
            </div>
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-1.5">Teléfono</label>
              <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="8888-0000"
                className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md" />
            </div>
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-1.5">Contraseña</label>
              <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Mínimo 6 caracteres" required minLength={6}
                className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md" />
            </div>
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-1.5">Barrio / Zona</label>
              <input type="text" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                placeholder="Altamira, Los Robles..."
                className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md" />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-primary text-on-primary py-3 rounded-lg font-label-md text-label-md hover:bg-primary-variant transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> : null}
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <p className="mt-4 text-center font-body-sm text-body-sm text-on-surface-variant">
          ¿Ya tienes cuenta? <Link to="/login" className="text-primary font-bold hover:underline">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
