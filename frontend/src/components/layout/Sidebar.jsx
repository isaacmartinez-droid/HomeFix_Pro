import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/auth';
const Sidebar = () => {
  const { logout } = useAuth();
  const items = [
    ['/dashboard/cliente', 'home', 'Inicio'],
    ['/cliente/solicitar', 'add_circle', 'Solicitar servicio'],
    ['/cliente/solicitudes', 'build', 'Mis solicitudes'],
    ['/cliente/tecnicos', 'person_search', 'Técnicos'],
    ['/agenda', 'calendar_today', 'Mi agenda'],
    ['/ajustes', 'settings', 'Ajustes'],
  ];
  return <nav aria-label="Menú principal" className="hidden md:flex bg-surface-container-low h-screen w-64 fixed left-0 top-0 border-r border-outline-variant flex-col p-sm z-40">
    <h1 className="p-4 text-xl font-bold text-primary">HomeFix Pro</h1>
    <div className="flex-1 space-y-2">{items.map(([path, icon, label]) =>
      <NavLink end key={path} to={path} className={({ isActive }) => 'flex items-center p-3 rounded-lg ' + (isActive ? 'bg-primary-container text-on-primary-container' : 'hover:bg-surface-variant')}>
        <span className="material-symbols-outlined mr-3">{icon}</span>{label}
      </NavLink>)}</div>
    <button onClick={logout} className="p-3 text-left hover:bg-surface-variant rounded-lg">Cerrar sesión</button>
  </nav>;
};
export default Sidebar;
