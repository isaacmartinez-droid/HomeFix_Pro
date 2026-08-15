import React, { useEffect, useState } from 'react';
import { requestsApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/TopBar';
import Card from '../../components/ui/Card';
import StatusChip from '../../components/ui/StatusChip';

export default function AvailableJobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(null);

  useEffect(() => {
    requestsApi.available().then(setJobs).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleAccept = async (id) => {
    setAccepting(id);
    try {
      await requestsApi.accept(id);
      setJobs(prev => prev.filter(j => j.id !== id));
    } catch (err) { alert(err.message); }
    finally { setAccepting(null); }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar role="TECNICO" />
      <div className="ml-64 flex-1 flex flex-col">
        <TopBar userName={user?.fullName} />
        <main className="flex-1 p-lg max-w-[1200px] mx-auto w-full">
          <h2 className="font-headline-lg text-headline-lg text-on-background mb-lg">Trabajos Disponibles</h2>
          {loading ? <div className="flex justify-center py-20"><span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span></div>
          : jobs.length === 0 ? (
            <Card className="p-xl text-center"><span className="material-symbols-outlined text-6xl text-on-surface-variant">search_off</span><p className="mt-4 font-body-md text-body-md text-on-surface-variant">No hay trabajos disponibles</p></Card>
          ) : (
            <div className="space-y-md">
              {jobs.map(job => (
                <Card key={job.id} className="p-lg hover:shadow-soft transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-md">
                      <div className="w-14 h-14 bg-primary-container rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-2xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>{job.category?.icon}</span>
                      </div>
                      <div>
                        <h3 className="font-headline-sm text-headline-sm text-on-surface">{job.title}</h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{job.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="material-symbols-outlined text-sm text-on-surface-variant">location_on</span>
                          <span className="font-label-sm text-label-sm text-on-surface-variant">{job.neighborhood || job.address}</span>
                          <span className="text-outline-variant">·</span>
                          <span className="font-label-sm text-label-sm text-on-surface-variant">{new Date(job.createdAt).toLocaleDateString('es-NI')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-sm">
                      <StatusChip status={job.urgency} />
                      <button onClick={() => handleAccept(job.id)} disabled={accepting === job.id}
                        className="bg-primary text-on-primary px-5 py-2.5 rounded-xl font-label-md text-label-md hover:bg-primary-variant transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2">
                        {accepting === job.id && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                        {accepting === job.id ? 'Aceptando...' : 'Aceptar Trabajo'}
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
