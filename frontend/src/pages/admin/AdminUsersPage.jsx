import { useEffect, useState } from 'react';
import { adminApi } from '../../services/api';
import Modal from '../../components/ui/Modal';
export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({});
  useEffect(() => { adminApi.users().then(setUsers).catch(err => setError(err.message)).finally(() => setLoading(false)); }, []);
  const toggle = async id => { setBusy(true); setError(''); try { const updated = await adminApi.toggleUser(id); setUsers(items => items.map(item => item.id === id ? updated : item)); } catch (err) { setError(err.message); } finally { setBusy(false); } };
  const open = user => { setEditing(user || {}); setForm(user ? { fullName: user.fullName, phone: user.phone || '', address: user.address || '', password: '' } : { fullName: '', email: '', password: '', role: 'CLIENTE', phone: '' }); setError(''); };
  const save = async event => {
    event.preventDefault(); setBusy(true); setError('');
    try {
      const result = editing.id ? await adminApi.updateUser(editing.id, form) : await adminApi.createUser(form);
      setUsers(items => editing.id ? items.map(item => item.id === result.id ? result : item) : [result, ...items]); setEditing(null);
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  };
  const filtered = users.filter(user => (!role || role === user.role) && (user.fullName + ' ' + user.email).toLowerCase().includes(search.toLowerCase()));
  return <section className="space-y-4"><div className="flex justify-between"><h1 className="text-2xl font-bold">Usuarios</h1><button onClick={() => open(null)} className="bg-blue-700 text-white p-2 rounded-lg">Nuevo usuario</button></div>
    <div className="flex flex-wrap gap-3"><input aria-label="Buscar usuario" placeholder="Nombre o correo" value={search} onChange={event => setSearch(event.target.value)} className="border p-3 rounded-lg grow" /><select aria-label="Filtrar por rol" value={role} onChange={event => setRole(event.target.value)} className="border p-3 rounded-lg"><option value="">Todos los roles</option>{['CLIENTE', 'TECNICO', 'EMPRESA', 'ADMIN'].map(value => <option key={value}>{value}</option>)}</select></div>
    {error && <p role="alert" className="text-red-700">{error}</p>}{loading && <p>Cargando usuarios…</p>}
    <div className="overflow-auto bg-white rounded-xl border"><table className="w-full text-left"><thead><tr>{['Usuario', 'Rol', 'Estado', 'Acciones'].map(label => <th key={label} className="p-4">{label}</th>)}</tr></thead><tbody>{filtered.map(user => <tr key={user.id} className="border-t"><td className="p-4">{user.fullName}<span className="block text-sm">{user.email}</span></td><td className="p-4">{user.role}</td><td className="p-4">{user.isActive ? 'Activo' : 'Inactivo'}</td><td className="p-4"><div className="flex gap-4"><button disabled={busy} onClick={() => open(user)} className="text-blue-700">Editar</button><button disabled={busy} onClick={() => toggle(user.id)} className="text-red-700">{user.isActive ? 'Desactivar' : 'Activar'}</button></div></td></tr>)}</tbody></table></div>
    {!loading && !error && !filtered.length && <p>No hay usuarios que coincidan.</p>}
    <Modal isOpen={Boolean(editing)} title={editing?.id ? 'Editar usuario' : 'Nuevo usuario'} onClose={() => { if (!busy) { setEditing(null); setError(''); } }}>
      <form onSubmit={save} className="space-y-3">{Object.keys(form).map(key => <label className="block" key={key}>{({ fullName: 'Nombre', phone: 'Teléfono', address: 'Dirección', email: 'Correo', password: editing?.id ? 'Nueva contraseña (opcional)' : 'Contraseña', role: 'Rol' })[key]}
        {key === 'role' ? <select value={form.role} onChange={event => setForm({ ...form, role: event.target.value })} className="block p-2 border rounded w-full">{['CLIENTE', 'TECNICO', 'EMPRESA', 'ADMIN'].map(value => <option key={value}>{value}</option>)}</select>
          : <input required={key === 'fullName' || (!editing?.id && ['email', 'password'].includes(key))} minLength={key === 'password' ? 8 : undefined} type={key === 'password' ? 'password' : key === 'email' ? 'email' : 'text'} value={form[key]} onChange={event => setForm({ ...form, [key]: event.target.value })} className="block p-2 border rounded w-full" />}
      </label>)}{error && <p role="alert" className="text-red-700">{error}</p>}<button disabled={busy} className="bg-blue-700 text-white p-3 rounded-lg">Guardar</button></form>
    </Modal>
  </section>;
}
