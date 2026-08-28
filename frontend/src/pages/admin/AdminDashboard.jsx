import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';

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
    { label: 'Total Usuarios', value: metrics.totalUsers, icon: 'group', color: 'text-blue-600', bg: 'bg-blue-100', trend: '+12%' },
    { label: 'Clientes Activos', value: metrics.totalClients, icon: 'person', color: 'text-indigo-600', bg: 'bg-indigo-100', trend: '+5%' },
    { label: 'Técnicos', value: metrics.totalTechnicians, icon: 'engineering', color: 'text-emerald-600', bg: 'bg-emerald-100', trend: '+2%' },
    { label: 'Verificaciones', value: metrics.pendingVerifications, icon: 'pending_actions', color: 'text-amber-600', bg: 'bg-amber-100', trend: '3 pend.' },
  ] : [];

  // Transform byCategory for Recharts
  const chartData = byCategory.map(c => ({
    name: c.name,
    Total: c.count
  }));

  // Mock data for MRR/Trend chart
  const trendData = [
    { name: 'Lun', solicitudes: 4 },
    { name: 'Mar', solicitudes: 7 },
    { name: 'Mie', solicitudes: 5 },
    { name: 'Jue', solicitudes: 10 },
    { name: 'Vie', solicitudes: 14 },
    { name: 'Sab', solicitudes: 8 },
    { name: 'Dom', solicitudes: 3 },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'FINALIZADO': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'EN_PROGRESO': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'CANCELADO': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200'; // SOLICITADO
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Vista General</h1>
          <p className="text-sm text-slate-500 mt-1">Métricas y rendimiento de HomeFix Pro</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">calendar_month</span> Últimos 30 días
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">download</span> Reporte
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                <span className={`material-symbols-outlined ${stat.color} text-2xl`}>{stat.icon}</span>
              </div>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full flex items-center gap-1">
                 <span className="material-symbols-outlined text-[10px]">trending_up</span>
                 {stat.trend}
              </span>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-slate-800 mb-1">{stat.value ?? '0'}</h3>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Tendencia de Solicitudes</h3>
            <button className="text-slate-400 hover:text-slate-600"><span className="material-symbols-outlined">more_horiz</span></button>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '3 3' }}
                />
                <Line type="monotone" dataKey="solicitudes" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Bar Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Por Categoría</h3>
            <button className="text-slate-400 hover:text-slate-600"><span className="material-symbols-outlined">more_horiz</span></button>
          </div>
          <div className="flex-1 min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="Total" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row - Data Table */}
      <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Estados de Solicitudes</h3>
          <button className="text-blue-600 text-sm font-semibold hover:text-blue-700">Ver todas</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 font-semibold">Cantidad Total</th>
                <th className="px-6 py-4 font-semibold">Tendencia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {byStatus.map((s, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(s.status)}`}>
                      {s.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-slate-700">{s.count}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(s.count * 10, 100)}%` }}></div>
                    </div>
                  </td>
                </tr>
              ))}
              {byStatus.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-sm text-slate-500">
                    No hay solicitudes registradas aún.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
