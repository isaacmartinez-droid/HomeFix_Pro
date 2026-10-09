import { useState } from 'react';
import { requestsApi, reviewsApi, scheduleApi } from '../services/api';
import Modal from './ui/Modal';
import StarRating from './ui/StarRating';
export default function RequestActions({ request, onRefresh }) {
  const [mode, setMode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [date, setDate] = useState('');
  const perform = async action => {
    setBusy(true); setError('');
    try { await action(); setMode(''); await onRefresh(); } catch (err) { setError(err.message); } finally { setBusy(false); }
  };
  return <div className="mt-4 space-y-3">
    <div className="flex flex-wrap gap-3">
      {['SOLICITADO', 'ASIGNADO'].includes(request.status) && <button disabled={busy} onClick={() => setMode('cancel')} className="text-red-700 underline">Cancelar servicio</button>}
      {request.status === 'ASIGNADO' && <button disabled={busy} onClick={() => setMode('schedule')} className="text-blue-700 underline">{request.appointment ? 'Cambiar cita' : 'Agendar cita'}</button>}
      {request.status === 'FINALIZADO' && !request.review && <button disabled={busy} onClick={() => setMode('review')} className="text-blue-700 underline">Calificar servicio</button>}
    </div>
    {request.appointment && <p className="text-sm">Cita: {new Date(request.appointment.scheduledDate).toLocaleString('es-NI')}</p>}
    {request.review && <p className="text-sm">Tu calificación: {request.review.rating}/5</p>}
    {error && <p role="alert" className="text-red-700">{error}</p>}
    <Modal isOpen={Boolean(mode)} onClose={() => { if (!busy) { setMode(''); setError(''); } }} title={mode === 'review' ? 'Calificar servicio' : mode === 'schedule' ? 'Agendar servicio' : 'Cancelar servicio'}>
      {mode === 'cancel' && <><p>¿Quieres cancelar esta solicitud?</p><button disabled={busy} onClick={() => perform(() => requestsApi.cancel(request.id))} className="bg-red-700 text-white p-3 rounded-lg mt-4">Confirmar cancelación</button></>}
      {mode === 'review' && <form onSubmit={e => { e.preventDefault(); perform(() => reviewsApi.create({ requestId: request.id, rating, comment })); }} className="space-y-4">
        <StarRating value={rating} onChange={setRating} /><textarea aria-label="Comentario" maxLength={2000} value={comment} onChange={e => setComment(e.target.value)} className="w-full border rounded-lg p-3" />
        <button disabled={busy} className="bg-blue-700 text-white p-3 rounded-lg">Enviar calificación</button>
      </form>}
      {mode === 'schedule' && <form onSubmit={e => { e.preventDefault(); perform(() => {
        const data = { requestId: request.id, scheduledDate: new Date(date).toISOString() };
        return request.appointment ? scheduleApi.update(request.appointment.id, data) : scheduleApi.create(data);
      }); }} className="space-y-4"><label>Fecha y hora<input required type="datetime-local" value={date} onChange={e => setDate(e.target.value)} className="block border p-3 w-full rounded-lg" /></label><button disabled={busy} className="bg-blue-700 text-white p-3 rounded-lg">Guardar cita</button></form>}
      {error && <p role="alert" className="text-red-700 mt-3">{error}</p>}
    </Modal>
  </div>;
}
