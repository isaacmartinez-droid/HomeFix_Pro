import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavItems = (role) => {
    switch (role) {
      case 'ADMIN':
        return [
          { path: '/dashboard/admin', icon: 'dashboard', label: 'Dashboard' },
          { path: '/dashboard/admin/usuarios', icon: 'group', label: 'Usuarios' },
          { path: '/dashboard/admin/tecnicos', icon: 'engineering', label: 'Técnicos' },
          { path: '/dashboard/admin/solicitudes', icon: 'list_alt', label: 'Solicitudes' },
        ];
      case 'TECNICO':
        return [
          { path: '/dashboard/tecnico', icon: 'dashboard', label: 'Dashboard' },
          { path: '/dashboard/tecnico/disponibles', icon: 'radar', label: 'Radar de Trabajo' },
          { path: '/dashboard/tecnico/asignados', icon: 'assignment', label: 'Mis Trabajos' },
          { path: '/dashboard/tecnico/resenas', icon: 'star', label: 'Mis Reseñas' },
        ];
      case 'CLIENTE':
        return [
          { path: '/dashboard/cliente', icon: 'dashboard', label: 'Dashboard' },
          { path: '/dashboard/cliente/solicitar', icon: 'add_circle', label: 'Solicitar Servicio' },
          { path: '/dashboard/cliente/historial', icon: 'history', label: 'Historial' },
          { path: '/dashboard/cliente/directorio', icon: 'contact_page', label: 'Directorio' },
        ];
      case 'EMPRESA':
        return [
          { path: '/dashboard/empresa', icon: 'dashboard', label: 'Dashboard' },
          { path: '/dashboard/empresa/despacho', icon: 'local_shipping', label: 'Despacho' },
          { path: '/dashboard/empresa/empleados', icon: 'badge', label: 'Mis Empleados' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems(user?.role);
  
  // Custom role display strings
  const roleDisplay = {
    'ADMIN': 'Administrador',
    'TECNICO': 'Técnico Especialista',
    'CLIENTE': 'Cliente',
    'EMPRESA': 'Cuenta Empresarial'
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-slate-800">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col fixed h-full z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <span className="material-symbols-outlined text-blue-600 text-2xl mr-2">home_repair_service</span>
          <span className="font-bold text-lg tracking-wide text-slate-900">HomeFix <span className="text-blue-600">Pro</span></span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-4">Principal</p>
          
          {navItems.map(item => {
            const isActive = location.pathname === item.path || (item.path.split('/').length > 3 && location.pathname.startsWith(item.path));
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-lg">{item.icon}</span> {item.label}
              </Link>
            );
          })}
          
          <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-8">Configuración</p>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg font-medium transition-colors">
            <span className="material-symbols-outlined text-lg">settings</span> Ajustes
          </button>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 w-full text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg font-medium transition-colors">
            <span className="material-symbols-outlined text-lg">logout</span> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen overflow-hidden">
        
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 sticky top-0">
          <div className="flex items-center flex-1">
            <div className="relative w-full max-w-md hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
              <input 
                type="text" 
                placeholder="Buscar..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm uppercase">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-slate-700 leading-tight">{user?.fullName || 'Usuario'}</p>
                <p className="text-xs text-slate-500">{roleDisplay[user?.role] || 'Usuario'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f8fafc] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
