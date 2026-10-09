const express = require('express');
const prisma = require('../prisma');
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');
const upload = require('../middleware/upload');
const { id, fail, optionalText } = require('../lib/policy');
const router = express.Router();
const include = { user: { select: { id: true, fullName: true, email: true, phone: true, isActive: true } } };
router.post('/upload', auth, roleGuard('TECNICO'), upload.fields([{ name: 'cedula', maxCount: 1 }, { name: 'policeRecord', maxCount: 1 }]), async (req, res) => {
  const files = Object.values(req.files || {}).flat();
  try {
    const profile = await prisma.techProfile.findUnique({ where: { userId: req.user.id } });
    if (!profile) fail(404, 'Perfil no encontrado');
    if (!req.files?.cedula?.[0] || !req.files?.policeRecord?.[0]) fail(400, 'Debes enviar cédula y antecedentes');
    await upload.validateFiles(files);
    await prisma.techProfile.update({ where: { userId: req.user.id }, data: {
      cedulaDocUrl: '/uploads/' + req.files.cedula[0].filename,
      policeRecordUrl: '/uploads/' + req.files.policeRecord[0].filename,
      verificationStatus: 'PENDIENTE',
    } });
    res.json({ message: 'Documentos enviados para revisión' });
  } catch (error) { await upload.cleanup(files); throw error; }
});
router.get('/pending', auth, roleGuard('ADMIN'), async (req, res) => {
  res.json(await prisma.techProfile.findMany({ where: { verificationStatus: 'PENDIENTE' }, include }));
});
for (const [action, status] of [['approve', 'VERIFICADO'], ['reject', 'RECHAZADO']]) {
  router.put('/:id/' + action, auth, roleGuard('ADMIN'), async (req, res) => {
    const profileId = id(req.params.id);
    const reason = optionalText(req.body?.reason, 'Motivo');
    const result = await prisma.$transaction(async (tx) => {
      const profile = await tx.techProfile.findUnique({ where: { id: profileId } });
      if (!profile) fail(404, 'Perfil no encontrado');
      if (action === 'approve' && (!profile.cedulaDocUrl || !profile.policeRecordUrl)) fail(409, 'Faltan documentos de verificación');
      if (profile.verificationStatus !== 'PENDIENTE') fail(409, 'El perfil ya fue revisado');
      const changed = await tx.techProfile.updateMany({ where: { id: profileId, verificationStatus: 'PENDIENTE' }, data: { verificationStatus: status } });
      if (!changed.count) fail(409, 'El perfil ya fue revisado');
      await tx.notification.create({ data: { userId: profile.userId, title: 'Verificación ' + status.toLowerCase(), message: reason || (action === 'approve' ? 'Ya puedes aceptar trabajos' : 'Revisa y vuelve a enviar tus documentos'), type: action === 'approve' ? 'INFO' : 'ALERTA' } });
      return tx.techProfile.findUniqueOrThrow({ where: { id: profileId }, include });
    });
    res.json(result);
  });
}
module.exports = router;
