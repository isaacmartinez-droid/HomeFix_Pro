import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/auth';
import { providersApi } from '../../services/api';
import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/TopBar';
import Card from '../../components/ui/Card';
export default function SearchProvidersPage() {
  const { user } = useAuth();
  const [technicians, setTechnicians] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  useEffect(() => { providersApi.list().then(setTechnicians).catch(err => setError(err.message)).finally(() => setLoading(false)); }, []);
  const filtered = technicians.filter(tech => (tech.fullName + ' ' + tech.techProfile.specialty).toLowerCase().includes(search.toLowerCase()));
  return <div className="min-h-screen bg-background"><Sidebar /><div className="md:ml-64"><TopBar userName={user.fullName} /><main className="p-lg max-w-6xl mx-auto">
    <h2 className="text-2xl font-bold mb-4">Técnicos verificados</h2>
    <input aria-label="Buscar técnicos" placeholder="Nombre o especialidad" className="border rounded-lg p-3 mb-4 w-full" value={search} onChange={e => setSearch(e.target.value)} />
    {error && <p role="alert" className="text-red-700">{error}</p>}{loading && <p>Cargando técnicos…</p>}
    {!loading && !error && !filtered.length && <p>No hay técnicos que coincidan con la búsqueda.</p>}
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-md">{filtered.map(tech => <Card key={tech.id} className="p-lg">
      <h3 className="font-bold">{tech.fullName} <span className="text-blue-700">✓</span></h3>
      <p>{tech.techProfile.specialty.replaceAll('_', ' ')}</p>
      <p className="my-3">★ {tech.techProfile.avgRating.toFixed(1)} · {tech.techProfile.totalJobs} trabajos</p>
      <p className="text-sm text-slate-500">{tech.techProfile.bio}</p>
      <Link to="/cliente/solicitar" className="block mt-4 text-blue-700 underline">Crear una solicitud de servicio</Link>
    </Card>)}</div>
  </main></div></div>;
}
