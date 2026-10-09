import React, { useEffect, useState } from 'react';
import { requestsApi } from '../../services/api';
import Card from '../../components/ui/Card';
import StatusChip from '../../components/ui/StatusChip';

export default function MyAssignedJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = () => requestsApi.myRequests().then(setJobs).catch(console.error).finally(() => setLoading(false));
  useEffect(() => { refresh(); }, []);

  const handleStatusUpdate = async (id, status) => {
    await requestsApi.updateStatus(id, status);
    refresh();
  };

  const active = jobs.filter(j => ['ASIGNADO', 'EN_PROGRESO'].includes(j.status));
  const completed = jobs.filter(j => j.status === 'FINALIZADO');

  return (
    <main className="w-full max-w-[1400px] mx-auto p-4 sm:p-lg space-y-lg">
          <h2 className="font-headline-lg text-headline-lg text-on-background">Mis Trabajos Asignados</h2>

          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md">En Curso ({active.length})</h3>
            {active.length === 0 ? (
              <Card className="p-lg text-center text-on-surface-variant font-body-md text-body-md">No tienes trabajos activos</Card>
            ) : (
              <div className="space-y-sm">
                {active.map(job => (
                  <Card key={job.id} className="p-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-headline-sm text-headline-sm text-on-surface">{job.title}</h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">{job.address}</p>
                        <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">Cliente: {job.client?.fullName} · {job.client?.phone}</p>
                      </div>
                      <div className="flex items-center gap-sm">
                        <StatusChip status={job.status} />
                        <button onClick={() => handleStatusUpdate(job.id, job.status === 'ASIGNADO' ? 'EN_PROGRESO' : 'FINALIZADO')}
                          className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-primary-variant cursor-pointer transition-colors">
                          {job.status === 'ASIGNADO' ? '▶ Iniciar' : '✓ Finalizar'}
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md">Historial ({completed.length})</h3>
            <div className="space-y-sm">
              {completed.map(job => (
                <Card key={job.id} className="p-md flex items-center justify-between opacity-75">
                  <div>
                    <p className="font-label-md text-label-md text-on-surface">{job.title}</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">{new Date(job.updatedAt).toLocaleDateString('es-NI')}</p>
                  </div>
                  <StatusChip status={job.status} />
                </Card>
              ))}
            </div>
          </div>
    </main>
  );
}
