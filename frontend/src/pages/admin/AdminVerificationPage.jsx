import { useEffect, useState } from 'react';
import { verificationApi, adminApi } from '../../services/api';
export default function AdminVerificationPage() {
  const [profiles, setProfiles] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    Promise.all([verificationApi.pending(), adminApi.companies()]).then(([p, c]) => { setProfiles(p); setCompanies(c); }).catch(err => setError(err.message)).finally(() => setLoading(false));
  }, []);
  const act = async (action, kind, id) => {
    setBusy(true); setError('');
    try { await action(); if (kind === 'profile') setProfiles(items => items.filter(item => item.id !== id)); else setCompanies(items => items.filter(item => item.id !== id)); }
    catch (err) { setError(err.message); } finally { setBusy(false); }
  };
  const download = async url => { try { await verificationApi.download(url); } catch (err) { setError(err.message); } };
  return <section className="space-y-5"><h1 className="text-2xl font-bold">Verificaciones pendientes</h1>
    {error && <p role="alert" className="text-red-700">{error}</p>}{loading && <p>Cargando…</p>}
    {!loading && !profiles.length && <p>No hay técnicos pendientes.</p>}
    {profiles.map(profile => <article className="bg-white border rounded-xl p-5 space-y-3" key={profile.id}>
      <h2 className="font-bold">{profile.user.fullName}</h2><p>{profile.user.email}</p>
      <div className="flex flex-wrap gap-4">{profile.cedulaDocUrl && <button onClick={() => download(profile.cedulaDocUrl)} className="underline">Descargar cédula</button>}{profile.policeRecordUrl && <button onClick={() => download(profile.policeRecordUrl)} className="underline">Descargar antecedentes</button>}</div>
      {!profile.cedulaDocUrl || !profile.policeRecordUrl ? <p>Faltan documentos</p> : null}
      <div className="flex gap-4"><button disabled={busy || !profile.cedulaDocUrl || !profile.policeRecordUrl} onClick={() => act(() => verificationApi.approve(profile.id), 'profile', profile.id)} className="text-green-700 disabled:opacity-40">Aprobar</button><button disabled={busy} onClick={() => act(() => verificationApi.reject(profile.id, 'Revisa los documentos y envíalos nuevamente'), 'profile', profile.id)} className="text-red-700">Rechazar</button></div>
    </article>)}
    <h2 className="text-xl font-bold">Empresas</h2>
    {!loading && !companies.length && <p>No hay empresas pendientes.</p>}
    {companies.map(company => <article key={company.id} className="bg-white border rounded-xl p-5 space-y-3"><h3 className="font-bold">{company.name}</h3><p>RUC: {company.ruc || 'Pendiente de proporcionar'}</p><p>{company.address}</p><p>{company.owner.fullName} · {company.owner.email}</p><div className="flex gap-4">
      <button disabled={busy || !company.ruc} onClick={() => act(() => adminApi.verifyCompany(company.id, 'VERIFICADO'), 'company', company.id)} className="text-green-700 disabled:opacity-40">Aprobar</button>
      <button disabled={busy} onClick={() => act(() => adminApi.verifyCompany(company.id, 'RECHAZADO'), 'company', company.id)} className="text-red-700">Rechazar</button>
    </div></article>)}
  </section>;
}
