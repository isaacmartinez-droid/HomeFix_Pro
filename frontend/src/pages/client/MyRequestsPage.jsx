import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { requestsApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/TopBar';
import Card from '../../components/ui/Card';
import StatusChip from '../../components/ui/StatusChip';
import Timeline from '../../components/ui/Timeline';

export default function MyRequestsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    requestsApi.myRequests().then(setRequests).catch(console.error).finally(() => setLoading(false));
  }, []);

  const statusFilters = ['ALL', 'SOLICITADO', 'ASIGNADO', 'EN_PROGRESO', 'FINALIZADO', 'CANCELADO'];
  const filtered = filter === 'ALL' ? requests : requests.filter(r => r.status === filter);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar role="CLIENTE" />
      <div className="ml-64 flex-1 flex flex-col">
        <TopBar userName={user?.fullName} />
        <main className="flex-1 p-lg max-w-[1200px] w-full mx-auto">
          <div className="flex items-center justify-between mb-lg">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-background">Mis Solicitudes</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{requests.length} solicitudes en total</p>
            </div>
            <Link to="/cliente/solicitar" className="flex items-center gap-2 bg-primary text-on-primary px-5 py-3 rounded-xl font-label-md text-label-md hover:bg-primary-variant transition-all cursor-pointer">
              <span className="material-symbols-outlined text-sm">add</span>
              Nueva Solicitud
            </Link>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 flex-wrap mb-lg">
            {statusFilters.map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-full text-sm font-bold border transition-colors cursor-pointer ${filter === s ? 'bg-primary text-on-primary border-primary' : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'}`}>
                {s === 'ALL' ? 'Todas' : s.replace('_', ' ')}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-6xl text-on-surface-variant">inbox</span>
              <p className="mt-4 font-body-md text-body-md text-on-surface-variant">No hay solicitudes con este filtro</p>
              <Link to="/cliente/solicitar" className="mt-4 inline-block text-primary font-label-md hover:underline">Crear una nueva solicitud</Link>
            </div>
          ) : (
            <div className="space-y-md">
              {filtered.map(req => (
                <Card key={req.id} className="p-lg">
                  <div className="flex items-start justify-between mb-md">
                    <div className="flex items-center gap-md">
                      <div className="w-12 h-12 bg-primary-container rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>{req.category?.icon || 'build'}</span>
                      </div>
                      <div>
                        <h3 className="font-headline-sm text-headline-sm text-on-surface">{req.title}</h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">{req.category?.name} • {req.neighborhood || req.address}</p>
                        <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">{new Date(req.createdAt).toLocaleDateString('es-NI', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-sm">
                      <StatusChip status={req.urgency} />
                      <StatusChip status={req.status} />
                    </div>
                  </div>

                  {!['FINALIZADO', 'CANCELADO'].includes(req.status) && (
                    <div className="mt-md pt-md border-t border-outline-variant">
                      <Timeline currentStatus={req.status} />
                    </div>
                  )}

                  {req.technician && (
                    <div className="mt-md pt-md border-t border-outline-variant flex items-center gap-sm">
                      <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-primary font-bold font-label-md">
                        {req.technician.fullName?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-label-md text-label-md text-on-surface">Técnico: {req.technician.fullName}</p>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">{req.technician.phone}</p>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
