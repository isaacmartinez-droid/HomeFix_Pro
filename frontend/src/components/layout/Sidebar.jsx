import React from 'react';

const Sidebar = ({ role = 'CLIENTE', activeTab = 'dashboard' }) => {
  const getNavItems = () => {
    switch (role) {
      case 'CLIENTE':
        return [
          { id: 'dashboard', icon: 'home', label: 'Inicio', active: true },
          { id: 'requests', icon: 'build', label: 'Mis Solicitudes' },
          { id: 'providers', icon: 'person_search', label: 'Técnicos' },
        ];
      case 'TECNICO':
        return [
          { id: 'dashboard', icon: 'dashboard', label: 'Panel de Control', active: true },
          { id: 'jobs', icon: 'build', label: 'Trabajos Asignados' },
          { id: 'history', icon: 'history', label: 'Historial' },
          { id: 'cert', icon: 'verified', label: 'Certificaciones' },
          { id: 'agenda', icon: 'calendar_today', label: 'Mi Agenda' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="bg-surface-container-low text-primary h-screen w-64 fixed left-0 top-0 border-r border-outline-variant flex flex-col p-sm space-y-xs z-50">
      <div className="mb-lg px-2 pt-2 flex items-center gap-2">
        <div className="p-2 bg-primary-container rounded-lg text-primary">
          <span className="material-symbols-outlined">home_repair_service</span>
        </div>
        <div>
          <h1 className="font-headline-sm text-headline-sm font-black text-primary">HomeFix Pro</h1>
          <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">Portal {role === 'CLIENTE' ? 'Cliente' : 'Técnico'}</p>
        </div>
      </div>
      
      <div className="flex-1 space-y-2">
        {navItems.map(item => (
          <a key={item.id} href="#" className={`flex items-center px-4 py-3 rounded-lg transition-colors font-label-md text-label-md ${item.active ? 'bg-primary-container text-on-primary font-bold' : 'text-on-surface hover:bg-surface-variant'}`}>
            <span className="material-symbols-outlined mr-3">{item.icon}</span>
            {item.label}
          </a>
        ))}
      </div>

      <div className="mt-auto space-y-2 pt-lg border-t border-outline-variant">
        <a href="#" className="flex items-center text-on-surface-variant hover:bg-surface-variant hover:text-on-surface px-4 py-3 rounded-lg transition-colors font-label-md text-label-md">
          <span className="material-symbols-outlined mr-3">help_outline</span>
          Soporte
        </a>
        <a href="#" className="flex items-center text-on-surface-variant hover:bg-surface-variant hover:text-on-surface px-4 py-3 rounded-lg transition-colors font-label-md text-label-md">
          <span className="material-symbols-outlined mr-3">logout</span>
          Cerrar Sesión
        </a>
      </div>
    </nav>
  );
};

export default Sidebar;
