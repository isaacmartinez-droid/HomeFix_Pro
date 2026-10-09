import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { requestsApi } from '../../services/api';
import { TechHero, TechIcon, TechEmpty } from './TechUI';

export default function MyAssignedJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(null);
  const [tab, setTab] = useState('active');
  const [search, setSearch] = useState('');
  useEffect(() => { requestsApi.myRequests().then(setJobs).catch(err => setError(err.message)).finally(() => setLoading(false)); }, []);
  const update = async (id, status) => {
    setBusy(id); setError('');
    try { await requestsApi.updateStatus(id, status); setJobs(await requestsApi.myRequests()); }
    catch (err) { setError(err.message); } finally { setBusy(null); }
  };
  const active = jobs.filter(job => ['ASIGNADO', 'EN_PROGRESO'].includes(job.status));
  const completed = jobs.filter(job => job.status === 'FINALIZADO');
  const history = jobs.filter(job => ['FINALIZADO', 'CANCELADO'].includes(job.status));
  const visible = (tab === 'active' ? active : history).filter(job => [job.title, job.address, job.client?.fullName].some(value => value?.toLocaleLowerCase('es').includes(search.toLocaleLowerCase('es'))));
  const labels = { ASIGNADO: 'Por iniciar', EN_PROGRESO: 'En progreso', FINALIZADO: 'Finalizado', CANCELADO: 'Cancelado' };
  return <section className="tech-workspace">
    <TechHero eyebrow="TUS SERVICIOS" title="Cada trabajo, bajo control" description="Consulta tus servicios asignados, contacta al cliente y actualiza el avance desde un solo lugar." icon="work" />
    <div className="tech-stats">{[[active.length, 'Trabajos activos', 'work'], [jobs.filter(job => job.status === 'EN_PROGRESO').length, 'En progreso', 'clock'], [completed.length, 'Finalizados', 'check']].map(([count, label, icon]) => <div className="tech-panel tech-stat" key={label}><div className="tech-stat-icon"><TechIcon name={icon} /></div><div><strong>{count}</strong><span>{label}</span></div></div>)}</div>
    {error && <p role="alert" className="tech-feedback error">{error}</p>}
    <div className="tech-toolbar"><div className="tech-tabs" role="tablist" aria-label="Filtrar trabajos">
      <button role="tab" aria-selected={tab === 'active'} onClick={() => setTab('active')}>Activos ({active.length})</button>
      <button role="tab" aria-selected={tab === 'history'} onClick={() => setTab('history')}>Historial ({history.length})</button>
    </div><input className="tech-search" type="search" aria-label="Buscar trabajos" placeholder="Buscar trabajo o cliente…" value={search} onChange={event => setSearch(event.target.value)} /></div>
    {loading ? <div className="tech-panel" role="status">Cargando tus trabajos…</div> : !visible.length ? <TechEmpty title={search ? 'Sin coincidencias' : tab === 'active' ? 'Listo para tu próximo trabajo' : 'Tu historial empieza aquí'} description={search ? 'Prueba con otro nombre, cliente o dirección.' : tab === 'active' ? 'Los servicios que aceptes aparecerán en este espacio.' : 'Aquí podrás consultar tus servicios finalizados y cancelados.'}>{tab === 'active' && !search && <Link className="tech-button" to="/dashboard/tecnico/disponibles">Explorar trabajos</Link>}</TechEmpty> :
    <div className="tech-job-list">{visible.map(job => <article className="tech-panel" key={job.id}>
      <div className="tech-job-top"><div><span className="tech-category">{(job.category?.name || 'Servicio técnico').replaceAll('_', ' ')}</span><h2 className="tech-job-title">{job.title}</h2></div><span className={'tech-badge ' + (job.status === 'FINALIZADO' ? 'green' : job.status === 'CANCELADO' ? 'red' : job.status === 'ASIGNADO' ? 'amber' : '')}>{labels[job.status]}</span></div>
      {job.description && <p className="tech-muted">{job.description}</p>}
      <div className="tech-job-details"><div className="tech-detail"><TechIcon name="pin" /><span>{job.address || 'Dirección no indicada'}</span></div><div className="tech-detail"><TechIcon name="person" /><span>{job.client?.fullName || 'Cliente'}{job.client?.phone && <><br /><a href={'tel:' + job.client.phone}>{job.client.phone}</a></>}</span></div></div>
      <div className="tech-job-footer"><p>{job.appointment?.scheduledDate ? 'Cita: ' + new Date(job.appointment.scheduledDate).toLocaleString('es-NI') : tab === 'history' ? 'Actualizado: ' + new Date(job.updatedAt).toLocaleDateString('es-NI') : 'Coordina los detalles con tu cliente antes de iniciar.'}</p>
        {['ASIGNADO', 'EN_PROGRESO'].includes(job.status) && <button className="tech-button" disabled={busy === job.id} onClick={() => update(job.id, job.status === 'ASIGNADO' ? 'EN_PROGRESO' : 'FINALIZADO')}><TechIcon name={job.status === 'ASIGNADO' ? 'work' : 'check'} />{busy === job.id ? 'Actualizando…' : job.status === 'ASIGNADO' ? 'Iniciar trabajo' : 'Finalizar trabajo'}</button>}
      </div>
    </article>)}</div>}
  </section>;
}
