import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [byCategory, setByCategory] = useState([]);
  const [byStatus, setByStatus] = useState([]);

  useEffect(() => {
    adminApi.overview().then(setMetrics).catch(console.error);
    adminApi.byCategory().then(setByCategory).catch(console.error);
    adminApi.byStatus().then(setByStatus).catch(console.error);
  }, []);

  const statCards = metrics ? [
    { label: 'Total Usuarios', value: metrics.totalUsers, icon: 'group', color: 'text-primary', bg: 'bg-primary-container' },
    { label: 'Clientes', value: metrics.totalClients, icon: 'person', color: 'text-info', bg: 'bg-info-container' },
    { label: 'Técnicos', value: metrics.totalTechnicians, icon: 'build', color: 'text-success', bg: 'bg-success-container' },
    { label: 'Solicitudes Total', value: metrics.totalRequests, icon: 'list_alt', color: 'text-warning', bg: 'bg-warning-container' },
    { label: 'Servicios Completados', value: metrics.completedRequests, icon: 'check_circle', color: 'text-success', bg: 'bg-success-container' },
    { label: 'Verificaciones Pendientes', value: metrics.pendingVerifications, icon: 'pending', color: 'text-error', bg: 'bg-error-container' },
  ] : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Top Bar */}
      <header className="bg-primary text-on-primary px-lg py-sm flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home_repair_service</span>
          <span className="font-headline-sm text-headline-sm font-black">HomeFix Pro</span>
          <span className="text-on-primary/50 mx-2">|</span>
          <span className="font-label-md text-label-md text-on-primary/80">Panel Administrativo</span>
        </div>
        <button onClick={() => { logout(); window.location.href = '/login'; }}
          className="flex items-center gap-1 text-on-primary/70 hover:text-on-primary font-label-md text-label-md transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-sm">logout</span> Salir
        </button>
      </header>

      <main className="p-lg max-w-[1400px] mx-auto space-y-lg">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-background">Métricas Generales</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Resumen del sistema HomeFix Pro</p>
        </div>

        {/* Stat Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-md">
          {statCards.map(stat => (
            <Card key={stat.label} className="p-md flex items-center gap-md">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <span className={`material-symbols-outlined ${stat.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{stat.icon}</span>
              </div>
              <div>
                <p className="font-display-lg text-2xl font-bold text-on-surface">{stat.value ?? '...'}</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">{stat.label}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
          {/* By Category */}
          <Card className="p-lg">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md">Solicitudes por Categoría</h3>
            <div className="space-y-sm">
              {byCategory.map(c => (
                <div key={c.name} className="flex items-center gap-md">
                  <span className="material-symbols-outlined text-primary w-6" style={{ fontVariationSettings: "'FILL' 1" }}>{c.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between font-label-md text-label-md text-on-surface mb-1">
                      <span>{c.name}</span><span>{c.count}</span>
                    </div>
                    <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: byCategory.length > 0 ? `${(c.count / Math.max(...byCategory.map(x => x.count), 1)) * 100}%` : '0%' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* By Status */}
          <Card className="p-lg">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md">Solicitudes por Estado</h3>
            <div className="space-y-sm">
              {byStatus.map(s => (
                <div key={s.status} className="flex items-center justify-between px-md py-sm bg-surface-container rounded-lg">
                  <span className="font-label-md text-label-md text-on-surface">{s.status.replace('_', ' ')}</span>
                  <span className="font-headline-sm text-headline-sm text-primary font-bold">{s.count}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
