const express = require('express');
const prisma = require('../prisma');
const auth = require('../middleware/auth');
const { fail, id, optionalText, participant, person } = require('../lib/policy');
const router = express.Router();
router.use(auth);
const dateValue = (value) => {
  if (typeof value !== 'string' || !value.trim()) fail(400, 'Fecha requerida');
  const date = new Date(value);
  if (!Number.isFinite(date.getTime()) || date <= new Date()) fail(400, 'La cita debe tener una fecha futura válida');
  return date;
};
const checkRequest = async (tx, user, requestId) => {
  const request = await tx.serviceRequest.findUnique({ where: { id: requestId } });
  if (!request) fail(404, 'Solicitud no encontrada');
  if (!participant(user, request)) fail(403, 'No autorizado');
  if (request.status !== 'ASIGNADO') fail(409, 'Solo se pueden agendar servicios asignados');
  return request;
};
router.post('/', async (req, res) => {
  const requestId = id(req.body?.requestId);
  const scheduledDate = dateValue(req.body?.scheduledDate);
  const notes = optionalText(req.body?.notes, 'Notas');
  const appointment = await prisma.$transaction(async (tx) => {
    await checkRequest(tx, req.user, requestId);
    return tx.appointment.create({ data: { requestId, scheduledDate, notes } });
  });
  res.status(201).json(appointment);
});
router.get('/mine', async (req, res) => {
  res.json(await prisma.appointment.findMany({
    where: { request: req.user.role === 'CLIENTE' ? { clientId: req.user.id } : { technicianId: req.user.id } },
    include: { request: { include: { category: true, client: { select: person }, technician: { select: person } } } },
    orderBy: { scheduledDate: 'asc' },
  }));
});
router.put('/:id', async (req, res) => {
  const appointmentId = id(req.params.id);
  const data = {};
  if (req.body?.scheduledDate !== undefined) data.scheduledDate = dateValue(req.body.scheduledDate);
  if (req.body?.notes !== undefined) data.notes = optionalText(req.body.notes, 'Notas') || null;
  if (!Object.keys(data).length) fail(400, 'No hay cambios');
  res.json(await prisma.$transaction(async (tx) => {
    const appointment = await tx.appointment.findUnique({ where: { id: appointmentId } });
    if (!appointment) fail(404, 'Cita no encontrada');
    await checkRequest(tx, req.user, appointment.requestId);
    return tx.appointment.update({ where: { id: appointmentId }, data });
  }));
});
router.delete('/:id', async (req, res) => {
  const appointmentId = id(req.params.id);
  await prisma.$transaction(async (tx) => {
    const appointment = await tx.appointment.findUnique({ where: { id: appointmentId }, include: { request: true } });
    if (!appointment) fail(404, 'Cita no encontrada');
    if (!participant(req.user, appointment.request)) fail(403, 'No autorizado');
    if (['FINALIZADO', 'CANCELADO'].includes(appointment.request.status)) fail(409, 'Servicio cerrado');
    await tx.appointment.delete({ where: { id: appointmentId } });
  });
  res.json({ message: 'Cita cancelada' });
});
module.exports = router;
