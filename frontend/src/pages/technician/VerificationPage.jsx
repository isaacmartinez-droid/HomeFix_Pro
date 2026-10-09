import { useState } from 'react';
import { useAuth } from '../../context/auth';
import { verificationApi } from '../../services/api';
import { TechHero, TechIcon } from './TechUI';

export default function VerificationPage() {
  const { user, refreshUser } = useAuth();
  const [files, setFiles] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const profile = user.techProfile || {};
  const status = profile.verificationStatus || 'PENDIENTE';
  const approved = status === 'VERIFICADO';
  const rejected = status === 'RECHAZADO';
  const uploaded = Boolean(profile.cedulaDocUrl && profile.policeRecordUrl);
  const selectFile = (name, file) => {
    setError(''); setMessage('');
    if (file && (file.size > 5 * 1024 * 1024 || !/\.(jpe?g|png|pdf)$/i.test(file.name))) {
      setError('Selecciona un archivo JPG, PNG o PDF de hasta 5 MB.'); setFiles(items => ({ ...items, [name]: null })); return;
    }
    setFiles(items => ({ ...items, [name]: file }));
  };
  const submit = async event => {
    event.preventDefault();
    if (!files.cedula || !files.policeRecord) { setError('Selecciona ambos documentos antes de enviarlos.'); return; }
    setBusy(true); setError(''); setMessage('');
    const form = event.currentTarget;
    const data = new FormData();
    data.append('cedula', files.cedula); data.append('policeRecord', files.policeRecord);
    try { const result = await verificationApi.upload(data); await refreshUser(); setMessage(result.message || 'Documentos enviados para revisión.'); setFiles({}); form.reset(); }
    catch (err) { setError(err.message); } finally { setBusy(false); }
  };
  return <section className="tech-workspace">
    <TechHero eyebrow="TU PERFIL PROFESIONAL" title="Genera confianza desde el inicio" description="Verifica tu identidad para que los clientes puedan contratar tus servicios con tranquilidad." icon="shield" />
    {error && <p className="tech-feedback error" role="alert">{error}</p>}
    {message && <p className="tech-feedback" role="status">{message}</p>}
    <div className="tech-columns">
      <section className="tech-panel"><h2>Documentos de verificación</h2><p className="tech-muted">Fotos claras, documentos completos y datos legibles. Cada archivo puede pesar hasta 5 MB.</p>
        {approved ? <div className="tech-status-box"><span className="tech-badge green"><TechIcon name="check" /> Identidad verificada</span><p className="tech-muted">Tus documentos fueron aprobados. Tu perfil está listo para aceptar trabajos.</p></div> :
        <form onSubmit={submit}>
          <div className="tech-document-grid">{[
            ['cedula', 'Cédula de identidad', 'Una imagen o PDF de tu cédula.', profile.cedulaDocUrl],
            ['policeRecord', 'Antecedentes policiales', 'Tu documento de antecedentes.', profile.policeRecordUrl],
          ].map(([name, label, hint, stored]) => <label key={name} className={'tech-upload' + (files[name] ? ' selected' : '')}>
            <TechIcon name={files[name] ? 'check' : 'upload'} /><strong>{label}</strong><p>{files[name]?.name || hint}</p>
            <p style={{ marginTop: 12, color: '#245b4e', fontWeight: 650 }}>{files[name] ? 'Cambiar archivo' : 'Seleccionar archivo'} · JPG, PNG o PDF</p>
            {stored && !files[name] && <p style={{ marginTop: 8 }}>Ya tienes un documento enviado.</p>}
            <input aria-label={label} type="file" name={name} disabled={busy} accept=".jpg,.jpeg,.png,.pdf" onChange={e => selectFile(name, e.target.files[0])} />
          </label>)}</div>
          <button className="tech-button" disabled={busy || !files.cedula || !files.policeRecord}><TechIcon name="shield" />{busy ? 'Enviando documentos…' : uploaded ? 'Enviar nuevos documentos' : 'Enviar a revisión'}</button>
          {uploaded && <p className="tech-muted">Un nuevo envío reemplaza ambos documentos y vuelve a revisión.</p>}
        </form>}
      </section>
      <aside className="tech-panel"><h2>Tu estado de verificación</h2><div className="tech-status-box">
        <span className={'tech-badge ' + (approved ? 'green' : rejected ? 'red' : 'amber')}>{approved ? 'Verificado' : rejected ? 'Requiere corrección' : uploaded ? 'En revisión' : 'Documentos pendientes'}</span>
        <p className="tech-muted">{approved ? 'Tu identidad ya fue confirmada por el equipo.' : rejected ? 'Revisa la calidad y vigencia de tus documentos y envíalos nuevamente.' : uploaded ? 'El equipo revisará tus documentos. El estado se actualizará aquí.' : 'Sube tus dos documentos para comenzar la revisión.'}</p>
      </div>
        {[['Prepara tus documentos', 'Evita reflejos, recortes o imágenes borrosas.'], ['Envía los dos archivos', 'Carga tu cédula y tus antecedentes policiales.'], ['Consulta el resultado', 'Revisa aquí el estado antes de aceptar trabajos.']].map(([title, description], i) => <div className="tech-step" key={title}><span className="tech-step-number">{i + 1}</span><div><strong>{title}</strong><p>{description}</p></div></div>)}
      </aside>
    </div>
  </section>;
}
