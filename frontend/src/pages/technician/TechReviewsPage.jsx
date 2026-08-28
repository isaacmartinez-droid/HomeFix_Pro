import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function TechReviewsPage() {
  const { user } = useAuth();
  const techProfile = user?.techProfile;

  // Mock data for reviews since backend doesn't have it yet
  const [reviews] = useState([
    { id: 1, clientName: 'María González', rating: 5, date: '2023-10-25', comment: 'Excelente servicio, muy puntual y resolvió el problema eléctrico súper rápido. Recomendado al 100%.', jobTitle: 'Reparación de cortocircuito en cocina' },
    { id: 2, clientName: 'Carlos Ruiz', rating: 4, date: '2023-10-20', comment: 'Buen trabajo, llegó un poco tarde pero solucionó la fuga de agua.', jobTitle: 'Fuga de agua en baño principal' },
    { id: 3, clientName: 'Ana López', rating: 5, date: '2023-10-15', comment: 'Muy profesional. Me explicó todo lo que estaba haciendo y dejó todo limpio.', jobTitle: 'Instalación de ventilador de techo' },
  ]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, idx) => (
      <span key={idx} className={`material-symbols-outlined text-[18px] ${idx < rating ? 'text-amber-400' : 'text-slate-200'}`} style={{ fontVariationSettings: "'FILL' 1" }}>
        star
      </span>
    ));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mis Reseñas</h1>
          <p className="text-sm text-slate-500 mt-1">Lo que los clientes opinan de tu trabajo</p>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 flex flex-col md:flex-row items-center gap-8">
        <div className="text-center md:text-left flex flex-col items-center md:items-start border-b md:border-b-0 md:border-r border-slate-200 pb-6 md:pb-0 md:pr-8">
          <p className="text-5xl font-black text-slate-800">{techProfile?.avgRating?.toFixed(1) || '4.7'}</p>
          <div className="flex items-center gap-1 my-2">
            {renderStars(5)}
          </div>
          <p className="text-sm text-slate-500 font-medium">{reviews.length} reseñas en total</p>
        </div>
        
        <div className="flex-1 w-full space-y-2">
          {[5, 4, 3, 2, 1].map(star => {
            const count = reviews.filter(r => Math.floor(r.rating) === star).length;
            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12 text-sm text-slate-600 font-medium">
                  {star} <span className="material-symbols-outlined text-[14px] text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${percentage}%` }}></div>
                </div>
                <div className="w-8 text-right text-xs text-slate-500 font-medium">{count}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map(review => (
          <div key={review.id} className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm uppercase">
                  {review.clientName.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{review.clientName}</p>
                  <p className="text-xs text-slate-500">{new Date(review.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                {renderStars(review.rating)}
              </div>
            </div>
            
            <div className="pl-13 mt-2">
              <p className="text-xs font-semibold text-blue-600 mb-1 bg-blue-50 inline-block px-2 py-0.5 rounded">
                Trabajo: {review.jobTitle}
              </p>
              <p className="text-slate-700 text-sm leading-relaxed">
                "{review.comment}"
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
