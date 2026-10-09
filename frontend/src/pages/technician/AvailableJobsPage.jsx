import React, { useEffect, useState } from 'react';
import { requestsApi } from '../../services/api';
import Card from '../../components/ui/Card';
import StatusChip from '../../components/ui/StatusChip';

export default function AvailableJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    requestsApi.available().then(setJobs).catch(err => setError(err.message)).finally(() => setLoading(false));
  }, []);

  const handleAccept = async (id) => {
    setAccepting(id);
    try {
      await requestsApi.accept(id);
      setJobs(prev => prev.filter(j => j.id !== id));
    } catch (err) { setError(err.message); }
    finally { setAccepting(null); }
  };

  return (
    <main className="w-full max-w-[1400px] mx-auto">
      <div className="p-4 sm:p-lg">
          <div className="w-full max-w-6xl mx-auto mb-6 sm:mb-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary/70">Radar de trabajo</p>
                <h2 className="font-headline-lg text-headline-lg text-on-background mt-1">Trabajos Disponibles</h2>
                <p className="text-sm text-on-surface-variant mt-2">Encuentra servicios cercanos y elige tu próximo trabajo.</p>
              </div>
              {jobs.length > 0 && <span className="self-start sm:self-auto rounded-full bg-primary-container px-3 py-1 text-xs font-bold text-on-primary-container">{jobs.length} disponibles</span>}
            </div>
          </div>
          {error && <p role="alert" className="text-red-700 mb-4">{error}</p>}
          {loading ? <div className="flex justify-center py-20"><span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span></div>
          : jobs.length === 0 ? (
            <Card className="w-full max-w-6xl mx-auto border-dashed border-outline-variant bg-surface-container-low p-6 sm:p-10 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-container text-primary">
                <span className="material-symbols-outlined text-4xl">search_off</span>
              </div>
              <h3 className="mt-5 text-lg font-bold text-on-surface">No hay trabajos disponibles</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-on-surface-variant">Cuando aparezca una solicitud disponible, la verás aquí para poder aceptarla.</p>
            </Card>
          ) : (
            <div className="w-full max-w-6xl mx-auto space-y-4">
              {jobs.map(job => (
                <Card key={job.id} className="group w-full border-outline-variant/70 p-4 sm:p-5 lg:p-6 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft transition-all">
                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between md:gap-8">
                    <div className="min-w-0 flex items-start gap-3 sm:gap-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 bg-primary-container rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{job.category?.icon}</span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wide text-primary/70">{job.category?.name || 'Servicio'}</span>
                          <span className="h-1 w-1 rounded-full bg-outline-variant" />
                          <span className="text-xs text-on-surface-variant">Solicitud nueva</span>
                        </div>
                        <h3 className="font-headline-sm text-headline-sm text-on-surface mt-1 break-words line-clamp-2">{job.title}</h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 break-words line-clamp-3">{job.description}</p>
                        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                          <span className="flex items-center gap-1.5 text-xs font-medium text-on-surface-variant">
                            <span className="material-symbols-outlined text-base text-primary">location_on</span>
                            <span className="break-words">{job.neighborhood || job.address}</span>
                          </span>
                          <span className="flex items-center gap-1.5 text-xs font-medium text-on-surface-variant">
                            <span className="material-symbols-outlined text-base text-primary">calendar_today</span>
                            {new Date(job.createdAt).toLocaleDateString('es-NI')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full md:w-auto md:min-w-[170px] flex flex-col items-stretch md:items-end gap-sm">
                      <StatusChip status={job.urgency} className="self-end" />
                      <button onClick={() => handleAccept(job.id)} disabled={accepting === job.id}
                        className="w-full md:w-auto whitespace-nowrap bg-primary text-on-primary px-5 py-2.5 rounded-xl font-label-md text-label-md hover:bg-primary-variant transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2">
                        {accepting === job.id && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                        {accepting === job.id ? 'Aceptando...' : 'Aceptar Trabajo'}
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
      </div>
    </main>
  );
}
