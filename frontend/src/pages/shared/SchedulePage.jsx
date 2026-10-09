import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { scheduleApi } from '../../services/api';
import { useAuth } from '../../context/auth';
export default function SchedulePage() {
  const { user } = useAuth();
  return user.role === 'TECNICO' ? <Navigate to="/dashboard/tecnico/agenda" replace /> : <ClientSchedulePage />;
}
function ClientSchedulePage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);
  useEffect(() => { scheduleApi.mine().then(setAppointments).catch(err => setError(err.message)).finally(() => setLoading(false)); }, []);
  const cancel = async id => { setBusy(id); setError(''); try { await scheduleApi.delete(id); setAppointments(items => items.filter(item => item.id !== id)); } catch (err) { setError(err.message); } finally { setBusy(null); } };
  return <main className="max-w-4xl mx-auto p-6 space-y-4"><Link className="underline" to={user.role === 'CLIENTE' ? '/dashboard/cliente' : '/dashboard/tecnico'}>Volver al inicio</Link><h1 className="text-2xl font-bold">Mi agenda</h1>
    {error && <p role="alert" className="text-red-700">{error}</p>}{loading && <p>Cargando agenda…</p>}
    {!loading && !error && !appointments.length && <p>No tienes citas agendadas.</p>}
    {appointments.map(item => <article key={item.id} className="bg-white border rounded-xl p-5"><h2 className="font-bold">{item.request.title}</h2><p>{new Date(item.scheduledDate).toLocaleString('es-NI')}</p><p>{item.request.address}</p><p>{item.notes}</p>
      {!['FINALIZADO', 'CANCELADO'].includes(item.request.status) && <button disabled={busy === item.id} onClick={() => cancel(item.id)} className="mt-3 text-red-700 underline">Cancelar cita</button>}
    </article>)}
  </main>;
}
