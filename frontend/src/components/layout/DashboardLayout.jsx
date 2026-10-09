import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/auth';
import NotificationsButton from '../NotificationsButton';
export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const items = user.role === 'ADMIN' ? [
    ['/dashboard/admin', 'dashboard', 'Vista general'], ['/dashboard/admin/usuarios', 'group', 'Usuarios'],
    ['/dashboard/admin/tecnicos', 'verified', 'Verificaciones'], ['/dashboard/admin/solicitudes', 'list_alt', 'Solicitudes'],
  ] : user.role === 'EMPRESA' ? [
    ['/dashboard/empresa', 'dashboard', 'Mi empresa'], ['/dashboard/empresa/despacho', 'local_shipping', 'Despacho'],
    ['/dashboard/empresa/empleados', 'badge', 'Empleados'],
  ] : [
    ['/dashboard/tecnico', 'dashboard', 'Inicio'], ['/dashboard/tecnico/disponibles', 'radar', 'Trabajos disponibles'],
    ['/dashboard/tecnico/asignados', 'assignment', 'Mis trabajos'], ['/dashboard/tecnico/resenas', 'star', 'Reseñas'],
    ['/dashboard/tecnico/verificacion', 'verified', 'Verificación'], ['/dashboard/tecnico/agenda', 'calendar_today', 'Agenda'],
  ];
  const links = [...items, ['/ajustes', 'settings', 'Ajustes']];
  const nav = links.map(([path, icon, label]) => <NavLink end key={path} to={path} className={({ isActive }) => 'flex items-center gap-2 px-3 py-2 rounded-lg text-sm ' + (isActive ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-100')}>
    <span className="material-symbols-outlined text-lg">{icon}</span>{label}
  </NavLink>);
  return <div className="min-h-screen bg-slate-50 text-slate-800">
    <aside className="hidden md:flex fixed inset-y-0 left-0 w-64 bg-white border-r flex-col p-3">
      <h1 className="p-3 text-xl font-bold text-blue-700">HomeFix Pro</h1><nav className="flex-1 space-y-1">{nav}</nav>
      <button onClick={logout} className="p-3 text-left text-red-600">Cerrar sesión</button>
    </aside>
    <div className="md:ml-64">
      <header className="bg-white border-b p-4 sticky top-0 z-30">
        <div className="flex justify-between items-center"><span className="font-semibold">{user.fullName}</span><div className="flex items-center gap-4"><NotificationsButton /><button onClick={logout} className="md:hidden">Salir</button></div></div>
        <nav className="md:hidden flex flex-wrap mt-2 gap-1">{nav}</nav>
      </header>
      <main className="p-4 sm:p-6 lg:p-8"><Outlet /></main>
    </div>
  </div>;
}
