const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/schedule:
 *   post:
 *     summary: Agenda una cita para una solicitud
 *     tags: [Schedule]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - requestId
 *               - scheduledDate
 *             properties:
 *               requestId:
 *                 type: integer
 *               scheduledDate:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cita agendada
 *       500:
 *         description: Error al agendar cita
 */
// POST /api/schedule
router.post('/', auth, async (req, res) => {
  try {
    const { requestId, scheduledDate, notes } = req.body;
    const appointment = await prisma.appointment.create({
      data: { requestId: parseInt(requestId), scheduledDate: new Date(scheduledDate), notes },
    });
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: 'Error al agendar cita' });
  }
});

/**
 * @swagger
 * /api/schedule/mine:
 *   get:
 *     summary: Obtiene la agenda del usuario (Cliente o Técnico)
 *     tags: [Schedule]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de citas
 *       500:
 *         description: Error al obtener citas
 */
// GET /api/schedule/mine
router.get('/mine', auth, async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        request: req.user.role === 'CLIENTE'
          ? { clientId: req.user.id }
          : { technicianId: req.user.id },
      },
      include: {
        request: { include: { category: true, client: { select: { fullName: true, phone: true } }, technician: { select: { fullName: true, phone: true } } } }
      },
      orderBy: { scheduledDate: 'asc' },
    });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener citas' });
  }
});

/**
 * @swagger
 * /api/schedule/{id}:
 *   put:
 *     summary: Actualiza una cita agendada
 *     tags: [Schedule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               scheduledDate:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cita actualizada
 *       500:
 *         description: Error al actualizar cita
 */
// PUT /api/schedule/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { scheduledDate, notes } = req.body;
    const updated = await prisma.appointment.update({
      where: { id: parseInt(req.params.id) },
      data: { scheduledDate: new Date(scheduledDate), notes },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar cita' });
  }
});

/**
 * @swagger
 * /api/schedule/{id}:
 *   delete:
 *     summary: Cancela una cita
 *     tags: [Schedule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cita cancelada
 *       500:
 *         description: Error al cancelar cita
 */
// DELETE /api/schedule/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    await prisma.appointment.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Cita cancelada' });
  } catch (err) {
    res.status(500).json({ message: 'Error al cancelar cita' });
  }
});

module.exports = router;
