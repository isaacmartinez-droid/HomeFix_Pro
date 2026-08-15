const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');
const upload = require('../middleware/upload');

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/verification/upload
router.post('/upload', auth, roleGuard('TECNICO', 'EMPRESA'), upload.fields([
  { name: 'cedula', maxCount: 1 },
  { name: 'policeRecord', maxCount: 1 },
]), async (req, res) => {
  try {
    const updates = {};
    if (req.files.cedula) updates.cedulaDocUrl = `/uploads/${req.files.cedula[0].filename}`;
    if (req.files.policeRecord) updates.policeRecordUrl = `/uploads/${req.files.policeRecord[0].filename}`;
    updates.verificationStatus = 'PENDIENTE';

    await prisma.techProfile.updateMany({
      where: { userId: req.user.id },
      data: updates,
    });
    res.json({ message: 'Documentos subidos. Pendiente de revisión por el administrador.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al subir documentos' });
  }
});

// GET /api/verification/pending (Admin)
router.get('/pending', auth, roleGuard('ADMIN'), async (req, res) => {
  try {
    const pending = await prisma.techProfile.findMany({
      where: { verificationStatus: 'PENDIENTE' },
      include: { user: { select: { id: true, fullName: true, email: true, phone: true } } },
    });
    res.json(pending);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener pendientes' });
  }
});

// PUT /api/verification/:id/approve (Admin)
router.put('/:id/approve', auth, roleGuard('ADMIN'), async (req, res) => {
  try {
    const profile = await prisma.techProfile.update({
      where: { id: parseInt(req.params.id) },
      data: { verificationStatus: 'VERIFICADO' },
      include: { user: true },
    });
    await prisma.notification.create({
      data: {
        userId: profile.userId,
        title: 'Verificación Aprobada ✅',
        message: 'Tu perfil ha sido verificado. Ya puedes aceptar trabajos en HomeFix Pro.',
        type: 'INFO',
      }
    });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Error al aprobar verificación' });
  }
});

// PUT /api/verification/:id/reject (Admin)
router.put('/:id/reject', auth, roleGuard('ADMIN'), async (req, res) => {
  try {
    const { reason } = req.body;
    const profile = await prisma.techProfile.update({
      where: { id: parseInt(req.params.id) },
      data: { verificationStatus: 'RECHAZADO' },
      include: { user: true },
    });
    await prisma.notification.create({
      data: {
        userId: profile.userId,
        title: 'Verificación Rechazada ❌',
        message: reason || 'Tu verificación fue rechazada. Por favor contacta al soporte.',
        type: 'ALERTA',
      }
    });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Error al rechazar verificación' });
  }
});

module.exports = router;
