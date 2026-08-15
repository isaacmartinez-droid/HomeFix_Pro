const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

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
