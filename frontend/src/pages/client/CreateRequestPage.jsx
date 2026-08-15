import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { requestsApi, categoriesApi } from '../../services/api';
import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/TopBar';
import Card from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';

const NEIGHBORHOODS = ['Altamira','Los Robles','Bolonia','Las Colinas','Planes de Altamira','El Dorado','Bello Horizonte','Linda Vista','Villa Fontana','Reparto San Juan'];

export default function CreateRequestPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    categoryId: params.get('categoria') || '',
    title: '',
    description: '',
    address: '',
    neighborhood: '',
    urgency: 'MEDIA',
  });

  useEffect(() => {
    categoriesApi.list().then(setCategories).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await requestsApi.create(form);
      setSuccess(true);
      setTimeout(() => navigate('/cliente/solicitudes'), 2000);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar role="CLIENTE" />
        <div className="ml-64 flex-1 flex items-center justify-center">
          <div className="text-center p-xl">
            <div className="w-20 h-20 bg-success-container rounded-full flex items-center justify-center mx-auto mb-lg">
              <span className="material-symbols-outlined text-5xl text-success" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            <h2 className="font-headline-md text-headline-md text-on-surface">¡Solicitud Enviada!</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">Los técnicos disponibles podrán ver tu solicitud pronto.</p>
            <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">Redirigiendo a tus solicitudes...</p>
          </div>
        </div>
      </div>
    );
  }

  const urgencyOptions = [
    { value: 'BAJA', label: 'Baja', color: 'border-success text-success', desc: 'Puede esperar varios días' },
    { value: 'MEDIA', label: 'Media', color: 'border-warning text-warning', desc: 'En los próximos 1-2 días' },
    { value: 'ALTA', label: 'Alta', color: 'border-error text-error', desc: 'Necesito atención urgente' },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar role="CLIENTE" />
      <div className="ml-64 flex-1 flex flex-col">
        <TopBar userName={user?.fullName} />
        <main className="flex-1 p-lg max-w-[900px] w-full mx-auto">
          <div className="flex items-center gap-sm mb-lg">
            <Link to="/dashboard/cliente" className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-background">Nueva Solicitud de Servicio</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Cuéntanos qué necesitas y te conectamos con el técnico ideal</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-lg">
            {/* Category */}
            <Card className="p-lg">
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md">1. Categoría del Servicio</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-sm">
                {categories.map(cat => (
                  <button key={cat.id} type="button" onClick={() => setForm({ ...form, categoryId: String(cat.id) })}
                    className={`flex flex-col items-center p-md rounded-xl border-2 transition-all cursor-pointer ${String(form.categoryId) === String(cat.id) ? 'border-primary bg-primary-container' : 'border-outline-variant hover:border-primary/50'}`}>
                    <span className="material-symbols-outlined text-3xl text-primary mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>{cat.icon}</span>
                    <span className="font-label-md text-label-md text-on-surface text-center">{cat.name}</span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Details */}
            <Card className="p-lg space-y-md">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">2. Descripción del Problema</h3>
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-1.5">Título del problema</label>
                <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="Ej: Fuga de agua en el lavabo del baño principal" required
                  className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md" />
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-1.5">Descripción detallada</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe el problema con más detalle para que el técnico llegue preparado..." required rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md resize-none" />
              </div>
            </Card>

            {/* Location */}
            <Card className="p-lg space-y-md">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">3. Ubicación del Servicio</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-1.5">Barrio / Zona</label>
                  <select value={form.neighborhood} onChange={e => setForm({ ...form, neighborhood: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:outline-none focus:border-primary text-on-surface font-body-md text-body-md">
                    <option value="">Selecciona un barrio</option>
                    {NEIGHBORHOODS.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-1.5">Dirección exacta</label>
                  <input type="text" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                    placeholder="Casa 45 frente al parque, Altamira" required
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:outline-none focus:border-primary text-on-surface font-body-md text-body-md" />
                </div>
              </div>
            </Card>

            {/* Urgency */}
            <Card className="p-lg">
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md">4. Nivel de Urgencia</h3>
              <div className="grid grid-cols-3 gap-sm">
                {urgencyOptions.map(opt => (
                  <button key={opt.value} type="button" onClick={() => setForm({ ...form, urgency: opt.value })}
                    className={`p-md rounded-xl border-2 text-center transition-all cursor-pointer ${form.urgency === opt.value ? `${opt.color} bg-surface-container` : 'border-outline-variant text-on-surface-variant hover:border-primary/40'}`}>
                    <span className="font-label-md text-label-md block">{opt.label}</span>
                    <span className="font-label-sm text-label-sm block mt-1 opacity-70">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </Card>

            <div className="flex justify-end gap-md">
              <Link to="/dashboard/cliente" className="px-6 py-3 rounded-lg border border-outline-variant text-on-surface font-label-md text-label-md hover:bg-surface-container transition-colors cursor-pointer">
                Cancelar
              </Link>
              <button type="submit" disabled={loading || !form.categoryId || !form.title || !form.address}
                className="px-8 py-3 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:bg-primary-variant transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2">
                {loading && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                {loading ? 'Enviando...' : 'Enviar Solicitud'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
