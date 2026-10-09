import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { scheduleApi } from '../../services/api';
import { TechHero, TechIcon, TechEmpty } from './TechUI';

const dateKey = date => {
  const value = new Date(date);
  return [value.getFullYear(), String(value.getMonth() + 1).padStart(2, '0'), String(value.getDate()).padStart(2, '0')].join('-');
};
export default function TechSchedulePage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [selected, setSelected] = useState(dateKey(new Date()));
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  useEffect(() => { scheduleApi.mine().then(setAppointments).catch(err => setError(err.message)).finally(() => setLoading(false)); }, []);
  const cancel = async id => {
    setBusy(id); setError('');
    try { await scheduleApi.delete(id); setAppointments(items => items.filter(item => item.id !== id)); setConfirm(null); }
    catch (err) { setError(err.message); } finally { setBusy(null); }
  };
  const ordered = [...appointments].sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));
  const upcoming = ordered.filter(item => new Date(item.scheduledDate) >= new Date() && !['FINALIZADO', 'CANCELADO'].includes(item.request.status));
  const daily = ordered.filter(item => dateKey(item.scheduledDate) === selected);
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const offset = (month.getDay() + 6) % 7;
  const selectedDate = new Date(selected + 'T12:00:00');
  const changeMonth = amount => setMonth(current => new Date(current.getFullYear(), current.getMonth() + amount, 1));
  const goToday = () => { const today = new Date(); setSelected(dateKey(today)); setMonth(new Date(today.getFullYear(), today.getMonth(), 1)); };
  const pickUpcoming = item => { const date = new Date(item.scheduledDate); setSelected(dateKey(date)); setMonth(new Date(date.getFullYear(), date.getMonth(), 1)); };
  return <section className="tech-workspace">
    <TechHero eyebrow="MI AGENDA" title="Organiza tu día con claridad" description="Ubica tus citas en el calendario y consulta los detalles de cada servicio antes de salir." icon="calendar" />
    {error && <p className="tech-feedback error" role="alert">{error}</p>}
    {loading && <p className="tech-feedback" role="status">Cargando tu agenda…</p>}
    <div className="tech-columns">
      <section className="tech-panel" aria-label="Calendario de citas"><div className="tech-calendar-top"><h2 aria-live="polite">{month.toLocaleDateString('es-NI', { month: 'long', year: 'numeric' })}</h2><div className="tech-calendar-controls">
        <button onClick={() => changeMonth(-1)} aria-label="Mes anterior">‹</button><button onClick={goToday}>Hoy</button><button onClick={() => changeMonth(1)} aria-label="Mes siguiente">›</button>
      </div></div>
      <div className="tech-calendar-grid">{['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => <span className="tech-weekday" key={day}>{day}</span>)}
        {Array.from({ length: offset }, (_, i) => <span key={'empty-' + i} />)}
        {Array.from({ length: days }, (_, i) => {
          const date = new Date(month.getFullYear(), month.getMonth(), i + 1);
          const key = dateKey(date);
          const count = appointments.filter(item => dateKey(item.scheduledDate) === key).length;
          return <button key={key} className={'tech-day' + (key === selected ? ' selected' : '') + (key === dateKey(new Date()) ? ' today' : '')} aria-pressed={key === selected} aria-label={date.toLocaleDateString('es-NI', { day: 'numeric', month: 'long', year: 'numeric' }) + (count ? ', ' + count + ' citas' : '')} onClick={() => { setSelected(key); setConfirm(null); }}><span>{i + 1}</span>{count > 0 && <i />}</button>;
        })}
      </div><div className="tech-calendar-legend"><i /> Día con servicios agendados</div>
      </section>
      <section className="tech-panel"><p className="tech-category">TU DÍA EN DETALLE</p><h2 className="tech-selected-date" style={{ marginTop: 8 }}>{selectedDate.toLocaleDateString('es-NI', { weekday: 'long', day: 'numeric', month: 'long' })}</h2><p className="tech-muted">{daily.length} {daily.length === 1 ? 'cita agendada' : 'citas agendadas'}</p>
        {!loading && !daily.length && <div className="tech-empty" style={{ padding: '26px 0 10px' }}><div className="tech-stat-icon"><TechIcon name="calendar" /></div><h2>Un día sin citas</h2><p className="tech-muted">Selecciona un día marcado para consultar tus servicios.</p><Link className="tech-button secondary" to="/dashboard/tecnico/asignados">Ver mis trabajos</Link></div>}
        {daily.map(item => <article className="tech-appointment" key={item.id}><span className="tech-badge green"><TechIcon name="clock" />{new Date(item.scheduledDate).toLocaleTimeString('es-NI', { hour: '2-digit', minute: '2-digit' })}</span><h3>{item.request.title}</h3>
          <p className="tech-detail"><TechIcon name="pin" /><span>{item.request.address}</span></p>
          {item.request.client?.fullName && <p className="tech-detail"><TechIcon name="person" /><span>{item.request.client.fullName}</span></p>}
          {item.notes && <div className="tech-note">{item.notes}</div>}
          {!['FINALIZADO', 'CANCELADO'].includes(item.request.status) && <div className="tech-appointment-actions">{confirm === item.id ? <><button className="tech-button danger" disabled={busy === item.id} onClick={() => cancel(item.id)}>{busy === item.id ? 'Cancelando…' : 'Confirmar cancelación'}</button><button className="tech-button secondary" disabled={busy === item.id} onClick={() => setConfirm(null)}>Conservar cita</button></> : <button className="tech-button secondary" onClick={() => setConfirm(item.id)}>Cancelar cita</button>}</div>}
        </article>)}
      </section>
    </div>
    {!loading && <section className="tech-panel tech-next"><div className="tech-toolbar" style={{ marginBottom: 0 }}><div><h2>Próximos servicios</h2><p className="tech-muted">Tus siguientes citas, ordenadas por fecha.</p></div><span className="tech-badge green">{upcoming.length} pendientes</span></div>
      {upcoming.length ? upcoming.slice(0, 5).map(item => <article className="tech-appointment" key={item.id}><div className="tech-job-footer"><div><strong>{item.request.title}</strong><p>{new Date(item.scheduledDate).toLocaleString('es-NI', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })} · {item.request.address}</p></div><button className="tech-button secondary" onClick={() => pickUpcoming(item)}>Ver en calendario</button></div></article>) : <TechEmpty title="Tu próxima cita aparecerá aquí" description="Cuando se programe una cita para tus trabajos, podrás consultarla en esta agenda." icon="calendar" />}
    </section>}
  </section>;
}
