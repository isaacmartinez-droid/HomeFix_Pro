import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { requestsApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatusChip from '../../components/ui/StatusChip';
import StarRating from '../../components/ui/StarRating';

export default function TechDashboard() {
  const { user } = useAuth();
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

  const techProfile = user?.techProfile;
  const completedJobs = myJobs.filter(j => j.status === 'FINALIZADO').length;
  const activeJobs = myJobs.filter(j => ['ASIGNADO', 'EN_PROGRESO'].includes(j.status)).length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hola, {user?.fullName?.split(' ')[0]} 🔧</h1>
          <p className="text-sm text-slate-500 mt-1">Panel del Técnico · HomeFix Pro</p>
        </div>
        <div className="flex gap-2">
          <Link to="/dashboard/tecnico/disponibles" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">search</span> Buscar Trabajos
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Trabajos Completados', value: completedJobs, icon: 'check_circle', color: 'text-emerald-600', bg: 'bg-emerald-100' },
          { label: 'Trabajos Activos', value: activeJobs, icon: 'build_circle', color: 'text-amber-600', bg: 'bg-amber-100' },
          { label: 'Calificación Promedio', value: techProfile?.avgRating?.toFixed(1) || '—', icon: 'star', color: 'text-purple-600', bg: 'bg-purple-100' },
          { label: 'Disponibles en mi área', value: available.length, icon: 'radar', color: 'text-blue-600', bg: 'bg-blue-100' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                <span className={`material-symbols-outlined ${stat.color} text-2xl`}>{stat.icon}</span>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</h3>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Grid Layout for Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Available Jobs */}
        <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              Trabajos Disponibles
              {available.length > 0 && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-bold">{available.length}</span>}
            </h3>
            <Link to="/dashboard/tecnico/disponibles" className="text-blue-600 text-sm font-semibold hover:text-blue-700">Ver todos</Link>
          </div>
          
          <div className="p-6 flex-1">
            {available.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 py-8">
                <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
                <p className="text-sm text-center">No hay trabajos disponibles en tu categoría.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {available.slice(0, 3).map(job => (
                  <div key={job.id} className="p-4 border border-slate-100 rounded-xl hover:border-blue-200 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                          <span className="material-symbols-outlined">{job.category?.icon || 'build'}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{job.title}</p>
                          <p className="text-xs text-slate-500">{job.category?.name}</p>
                        </div>
                      </div>
                      <StatusChip status={job.urgency} />
                    </div>
                    <div className="flex justify-between items-end mt-4">
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                        {job.neighborhood || job.address}
                      </p>
                      <button
                        onClick={() => handleAccept(job.id)}
                        disabled={accepting === job.id}
                        className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                      >
                        {accepting === job.id ? <span className="material-symbols-outlined animate-spin text-[14px]">progress_activity</span> : null}
                        {accepting === job.id ? 'Aceptando...' : 'Aceptar Trabajo'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* My Active Jobs */}
        <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Mis Trabajos Activos</h3>
            <Link to="/dashboard/tecnico/asignados" className="text-blue-600 text-sm font-semibold hover:text-blue-700">Ir a detalle</Link>
          </div>
          
          <div className="p-6 flex-1">
            {myJobs.filter(j => !['FINALIZADO', 'CANCELADO'].includes(j.status)).length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 py-8">
                <span className="material-symbols-outlined text-4xl mb-2">task</span>
                <p className="text-sm text-center">No tienes trabajos activos en este momento.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myJobs.filter(j => !['FINALIZADO', 'CANCELADO'].includes(j.status)).map(job => (
                  <div key={job.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{job.title}</p>
                        <p className="text-xs text-slate-500 mt-1">Cliente: <span className="font-medium">{job.client?.fullName}</span></p>
                      </div>
                      <StatusChip status={job.status} />
                    </div>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-200/60">
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                        {job.neighborhood || job.address}
                      </p>
                      <button
                        onClick={async () => {
                          const nextStatus = job.status === 'ASIGNADO' ? 'EN_PROGRESO' : 'FINALIZADO';
                          await requestsApi.updateStatus(job.id, nextStatus);
                          const updated = await requestsApi.myRequests();
                          setMyJobs(updated);
                        }}
                        className="text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                      >
                        {job.status === 'ASIGNADO' ? 'Marcar En Progreso' : 'Finalizar Trabajo'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
