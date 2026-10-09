import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth';
import { requestsApi } from '../../services/api';
import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/TopBar';
import Card from '../../components/ui/Card';
import StatusChip from '../../components/ui/StatusChip';
import Timeline from '../../components/ui/Timeline';
import ServiceCategoryGrid from '../../components/ServiceCategoryGrid';

export default function ClientDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    requestsApi.myRequests().then(setRequests).catch(err => setError(err.message)).finally(() => setLoading(false));
  }, []);

  const activeRequest = requests.find(r => !['FINALIZADO', 'CANCELADO'].includes(r.status));
  const completedCount = requests.filter(r => r.status === 'FINALIZADO').length;



  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar role="CLIENTE" />
      <div className="md:ml-64 flex-1 flex flex-col">
        <TopBar userName={user?.fullName} />
        <main className="flex-1 p-lg space-y-lg max-w-[1200px] w-full mx-auto">
          {loading && <p>Cargando solicitudes…</p>}
          {error && <p role="alert" className="text-red-700">{error}</p>}
          {/* Greeting */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-background">
                Hola, {user?.fullName?.split(' ')[0]} 👋
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                ¿Qué servicio de mantenimiento necesitas hoy?
              </p>
            </div>
            <Link to="/cliente/solicitar"
              className="flex items-center gap-2 bg-primary text-on-primary px-5 py-3 rounded-xl font-label-md text-label-md hover:bg-primary-variant transition-all hover:shadow-soft cursor-pointer">
              <span className="material-symbols-outlined text-sm">add</span>
              Nueva Solicitud
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
            {[
              { label: 'Total Solicitudes', value: requests.length, icon: 'list_alt', color: 'text-primary', bg: 'bg-primary-container' },
              { label: 'Completadas', value: completedCount, icon: 'check_circle', color: 'text-success', bg: 'bg-success-container' },
              { label: 'En Proceso', value: requests.filter(r => ['SOLICITADO','ASIGNADO','EN_PROGRESO'].includes(r.status)).length, icon: 'build_circle', color: 'text-warning', bg: 'bg-warning-container' },
            ].map(stat => (
              <Card key={stat.label} className="p-md flex items-center gap-md">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", color: 'inherit' }}>{stat.icon}</span>
                </div>
                <div>
                  <p className="font-display-lg text-2xl font-bold text-on-surface">{stat.value}</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">{stat.label}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Active Request Timeline */}
          {activeRequest && (
            <Card className="p-lg">
              <div className="flex items-center justify-between mb-md">
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Servicio Activo</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{activeRequest.title}</p>
                </div>
                <StatusChip status={activeRequest.status} />
              </div>
              <Timeline currentStatus={activeRequest.status} />
              {activeRequest.technician && (
                <div className="mt-md pt-md border-t border-outline-variant flex items-center gap-sm">
                  <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-primary font-bold">
                    {activeRequest.technician.fullName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-on-surface">{activeRequest.technician.fullName}</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">{activeRequest.technician.phone}</p>
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Category Grid */}
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md">¿Qué necesitas reparar?</h3>
            <ServiceCategoryGrid onSelect={(cat) => navigate(`/cliente/solicitar?categoria=${cat.id}`)} />
          </div>

          {/* Recent Requests */}
          {requests.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-md">
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Solicitudes Recientes</h3>
                <Link to="/cliente/solicitudes" className="text-primary font-label-md text-label-md hover:underline">Ver todas</Link>
              </div>
              <div className="space-y-sm">
                {requests.slice(0, 3).map(req => (
                  <Card key={req.id} className="p-md flex items-center justify-between hover:shadow-soft transition-shadow">
                    <div className="flex items-center gap-md">
                      <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                          {req.category?.icon || 'build'}
                        </span>
                      </div>
                      <div>
                        <p className="font-label-md text-label-md text-on-surface">{req.title}</p>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">{req.neighborhood || req.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-sm">
                      <StatusChip status={req.status} />
                      <StatusChip status={req.urgency} />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
