import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
export default function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [trend, setTrend] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([adminApi.overview(), adminApi.byCategory(), adminApi.byStatus(), adminApi.trend()]).then(([m, c, s, t]) => { setMetrics(m); setCategories(c); setStatuses(s); setTrend(t); }).catch(err => setError(err.message)).finally(() => setLoading(false));
  }, []);
  const download = () => {
    const csv = 'Estado,Cantidad\n' + statuses.map(item => item.status + ',' + item.count).join('\n');
    const url = URL.createObjectURL(new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'homefix-solicitudes.csv'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return <section className="max-w-7xl mx-auto space-y-6"><div className="flex justify-between gap-4"><div><h1 className="text-2xl font-bold">Vista general</h1><p>Métricas actuales de HomeFix Pro</p></div><button disabled={!metrics} onClick={download} className="bg-blue-700 text-white rounded-lg p-3">Descargar reporte</button></div>
    {error && <p role="alert" className="text-red-700">{error}</p>}{loading && <p>Cargando métricas…</p>}
    {metrics && <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{[['Usuarios', metrics.totalUsers], ['Clientes activos', metrics.totalClients], ['Técnicos activos', metrics.totalTechnicians], ['Verificaciones con documentos', metrics.pendingVerifications]].map(([label, value]) => <div key={label} className="bg-white p-6 border rounded-xl"><p className="text-3xl font-bold">{value}</p><p>{label}</p></div>)}</div>}
    <div className="grid lg:grid-cols-2 gap-6">
      <article className="bg-white border rounded-xl p-5"><h2 className="font-bold mb-4">Solicitudes de los últimos 7 días</h2><div className="h-72"><ResponsiveContainer width="100%" height="100%"><LineChart data={trend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip /><Line dataKey="solicitudes" stroke="#2563eb" /></LineChart></ResponsiveContainer></div></article>
      <article className="bg-white border rounded-xl p-5"><h2 className="font-bold mb-4">Solicitudes por categoría</h2><div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={categories}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="count" fill="#2563eb" /></BarChart></ResponsiveContainer></div></article>
    </div>
    <article className="bg-white border rounded-xl p-5"><div className="flex justify-between"><h2 className="font-bold">Estados de solicitudes</h2><Link to="/dashboard/admin/solicitudes" className="text-blue-700 underline">Ver solicitudes</Link></div>{statuses.map(item => <p key={item.status} className="flex justify-between border-t py-3 mt-2"><span>{item.status.replaceAll('_', ' ')}</span><strong>{item.count}</strong></p>)}</article>
  </section>;
}
