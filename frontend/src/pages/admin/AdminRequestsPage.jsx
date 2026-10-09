import { useEffect, useState } from 'react';
import { requestsApi } from '../../services/api';
import StatusChip from '../../components/ui/StatusChip';
export default function AdminRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);
  useEffect(() => { requestsApi.all().then(setRequests).catch(err => setError(err.message)).finally(() => setLoading(false)); }, []);
  const cancel = async id => { setBusy(id); setError(''); try { const updated = await requestsApi.cancel(id); setRequests(items => items.map(item => item.id === id ? updated : item)); } catch (err) { setError(err.message); } finally { setBusy(null); } };
  return <section className="space-y-4"><h1 className="text-2xl font-bold">Solicitudes de servicio</h1>{error && <p role="alert" className="text-red-700">{error}</p>}{loading && <p>Cargando…</p>}{!loading && !error && !requests.length && <p>No hay solicitudes.</p>}
    {requests.map(item => <article key={item.id} className="border rounded-xl bg-white p-5 space-y-2"><div className="flex justify-between gap-3"><h2 className="font-bold">{item.title}</h2><StatusChip status={item.status} /></div><p>{item.client.fullName} · {item.address}</p><p>Técnico: {item.technician?.fullName || 'Sin asignar'}</p>
      {['SOLICITADO', 'ASIGNADO'].includes(item.status) && <button disabled={busy === item.id} onClick={() => cancel(item.id)} className="text-red-700 underline">Cancelar solicitud</button>}
    </article>)}
  </section>;
}
