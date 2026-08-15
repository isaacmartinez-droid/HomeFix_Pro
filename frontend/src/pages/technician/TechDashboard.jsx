import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { requestsApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/TopBar';
import Card from '../../components/ui/Card';
import StatusChip from '../../components/ui/StatusChip';
import StarRating from '../../components/ui/StarRating';

export default function TechDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [myJobs, setMyJobs] = useState([]);
  const [available, setAvailable] = useState([]);
  const [accepting, setAccepting] = useState(null);

  useEffect(() => {
    requestsApi.myRequests().then(setMyJobs).catch(console.error);
    requestsApi.available().then(setAvailable).catch(console.error);
  }, []);

  const handleAccept = async (id) => {
    setAccepting(id);
    try {
      await requestsApi.accept(id);
      setAvailable(prev => prev.filter(j => j.id !== id));
      const updated = await requestsApi.myRequests();
      setMyJobs(updated);
    } catch (err) {
      alert(err.message);
    } finally {
      setAccepting(null);
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };
  
  const techProfile = user?.techProfile;
  const completedJobs = myJobs.filter(j => j.status === 'FINALIZADO').length;
  const activeJobs = myJobs.filter(j => ['ASIGNADO', 'EN_PROGRESO'].includes(j.status)).length;

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar role="TECNICO" />
      <div className="ml-64 flex-1 flex flex-col">
        <TopBar userName={user?.fullName} />
        <main className="flex-1 p-lg space-y-lg max-w-[1200px] w-full mx-auto">
          {/* Greeting */}
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-background">
              Hola, {user?.fullName?.split(' ')[0]} 🔧
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Panel del Técnico · HomeFix Pro
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-md">
            {[
              { label: 'Trabajos Completados', value: completedJobs, icon: 'check_circle', color: 'text-success', bg: 'bg-success-container' },
              { label: 'Trabajos Activos', value: activeJobs, icon: 'build_circle', color: 'text-warning', bg: 'bg-warning-container' },
              { label: 'Calificación Promedio', value: techProfile?.avgRating?.toFixed(1) || '—', icon: 'star', color: 'text-warning', bg: 'bg-warning-container' },
              { label: 'Disponibles', value: available.length, icon: 'list_alt', color: 'text-info', bg: 'bg-info-container' },
            ].map(stat => (
              <Card key={stat.label} className="p-md flex items-center gap-md">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", color: 'inherit' }}>{stat.icon}</span>
                </div>
                <div>
                  <p className="font-display-lg text-2xl font-bold text-on-surface">{stat.value}</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">{stat.label}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Available Jobs */}
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md">
              Trabajos Disponibles
              {available.length > 0 && <span className="ml-2 bg-primary text-on-primary text-xs px-2 py-0.5 rounded-full">{available.length}</span>}
            </h3>
            {available.length === 0 ? (
              <Card className="p-lg text-center text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl block mb-2">search_off</span>
                <p className="font-body-md text-body-md">No hay trabajos disponibles en este momento</p>
              </Card>
            ) : (
              <div className="space-y-sm">
                {available.map(job => (
                  <Card key={job.id} className="p-md flex items-center justify-between hover:shadow-soft transition-shadow">
                    <div className="flex items-center gap-md">
                      <div className="w-12 h-12 bg-primary-container rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>{job.category?.icon || 'build'}</span>
                      </div>
                      <div>
                        <p className="font-label-md text-label-md text-on-surface">{job.title}</p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">{job.neighborhood || job.address}</p>
                        <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">{job.category?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-sm">
                      <StatusChip status={job.urgency} />
                      <button
                        onClick={() => handleAccept(job.id)}
                        disabled={accepting === job.id}
                        className="flex items-center gap-1 bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-primary-variant transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {accepting === job.id ? <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> : null}
                        {accepting === job.id ? 'Aceptando...' : 'Aceptar'}
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* My Active Jobs */}
          {myJobs.filter(j => !['FINALIZADO', 'CANCELADO'].includes(j.status)).length > 0 && (
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md">Mis Trabajos Activos</h3>
              <div className="space-y-sm">
                {myJobs.filter(j => !['FINALIZADO', 'CANCELADO'].includes(j.status)).map(job => (
                  <Card key={job.id} className="p-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-label-md text-label-md text-on-surface">{job.title}</p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">{job.neighborhood || job.address} · Cliente: {job.client?.fullName}</p>
                      </div>
                      <div className="flex items-center gap-sm">
                        <StatusChip status={job.status} />
                        <button
                          onClick={async () => {
                            const nextStatus = job.status === 'ASIGNADO' ? 'EN_PROGRESO' : 'FINALIZADO';
                            await requestsApi.updateStatus(job.id, nextStatus);
                            const updated = await requestsApi.myRequests();
                            setMyJobs(updated);
                          }}
                          className="text-primary border border-primary px-3 py-1.5 rounded-lg font-label-sm text-label-sm hover:bg-primary-container transition-colors cursor-pointer"
                        >
                          {job.status === 'ASIGNADO' ? 'Iniciar' : 'Finalizar'}
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
