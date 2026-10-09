import { Link } from 'react-router-dom';
import { useAuth } from '../../context/auth';
import NotificationsButton from '../NotificationsButton';
export default function TopBar({ userName = 'Usuario' }) {
  const { logout } = useAuth();
  return <header className="bg-white border-b border-outline-variant sticky top-0 z-40 p-4">
    <div className="flex items-center justify-between gap-3"><span className="font-semibold">{userName}</span><div className="flex items-center gap-3"><NotificationsButton /><Link to="/ajustes">Ajustes</Link><button onClick={logout}>Salir</button></div></div>
    <nav aria-label="Menú móvil" className="md:hidden flex flex-wrap gap-3 text-sm mt-3">
      <Link to="/dashboard/cliente">Inicio</Link><Link to="/cliente/solicitar">Solicitar</Link><Link to="/cliente/solicitudes">Solicitudes</Link><Link to="/cliente/tecnicos">Técnicos</Link><Link to="/agenda">Agenda</Link>
    </nav>
  </header>;
}
