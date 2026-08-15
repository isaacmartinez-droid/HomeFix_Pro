import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/TopBar';
import Card from '../../components/ui/Card';

export default function SearchProvidersPage() {
  const { user } = useAuth();
  const technicians = [
    { id: 1, name: 'Juan Pérez', specialty: 'Plomería', rating: 4.8, jobs: 24, zone: 'Altamira', icon: 'plumbing', verified: true },
    { id: 2, name: 'Ana Rojas', specialty: 'Electricidad', rating: 4.9, jobs: 15, zone: 'Los Robles', icon: 'electrical_services', verified: true },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar role="CLIENTE" />
      <div className="ml-64 flex-1 flex flex-col">
        <TopBar userName={user?.fullName} />
        <main className="flex-1 p-lg max-w-[1200px] w-full mx-auto">
          <h2 className="font-headline-lg text-headline-lg text-on-background mb-lg">Técnicos Disponibles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
            {technicians.map(tech => (
              <Card key={tech.id} className="p-lg hover:shadow-soft transition-shadow">
                <div className="flex items-center gap-md mb-md">
                  <div className="w-14 h-14 rounded-full bg-primary-container flex items-center justify-center text-primary font-bold font-headline-md text-headline-md">
                    {tech.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-headline-sm text-headline-sm text-on-surface">{tech.name}</p>
                      {tech.verified && <span className="material-symbols-outlined text-sm text-info" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>}
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{tech.specialty}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 text-warning font-bold">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    {tech.rating}
                  </span>
                  <span className="text-on-surface-variant">{tech.jobs} trabajos</span>
                  <span className="text-on-surface-variant">{tech.zone}</span>
                </div>
                <Link to="/cliente/solicitar" className="mt-md block w-full text-center bg-primary-container text-primary py-2 rounded-lg font-label-md text-label-md hover:bg-primary hover:text-on-primary transition-colors cursor-pointer">
                  Solicitar servicio
                </Link>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
