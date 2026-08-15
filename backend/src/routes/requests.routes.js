const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/requests — create service request (CLIENTE)
router.post('/', auth, roleGuard('CLIENTE'), async (req, res) => {
  try {
    const { categoryId, title, description, address, neighborhood, urgency } = req.body;
    if (!categoryId || !title || !description || !address) {
      return res.status(400).json({ message: 'Categoría, título, descripción y dirección son requeridos' });
    }
    const request = await prisma.serviceRequest.create({
      data: {
        clientId: req.user.id,
        categoryId: parseInt(categoryId),
        title, description, address, neighborhood,
        urgency: urgency || 'MEDIA',
      },
      include: { category: true, client: { select: { id: true, fullName: true, phone: true } } }
    });
    res.status(201).json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear solicitud' });
  }
});

// GET /api/requests/mine — client's own requests
router.get('/mine', auth, async (req, res) => {
  try {
    const where = req.user.role === 'CLIENTE'
      ? { clientId: req.user.id }
      : { technicianId: req.user.id };

    const requests = await prisma.serviceRequest.findMany({
      where,
      include: {
        category: true,
        technician: { select: { id: true, fullName: true, phone: true, avatarUrl: true, techProfile: true } },
        client: { select: { id: true, fullName: true, phone: true, address: true } },
        appointment: true,
        review: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener solicitudes' });
  }
});

// GET /api/requests/available — for technicians
router.get('/available', auth, roleGuard('TECNICO', 'EMPRESA'), async (req, res) => {
  try {
    const { category, neighborhood } = req.query;
    const where = { status: 'SOLICITADO', technicianId: null };
    if (category) where.categoryId = parseInt(category);
    if (neighborhood) where.neighborhood = { contains: neighborhood };

    const requests = await prisma.serviceRequest.findMany({
      where,
      include: {
        category: true,
        client: { select: { id: true, fullName: true, address: true } },
      },
      orderBy: [{ urgency: 'desc' }, { createdAt: 'asc' }],
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener solicitudes disponibles' });
  }
});

// GET /api/requests/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const request = await prisma.serviceRequest.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        category: true,
        client: { select: { id: true, fullName: true, phone: true, address: true, avatarUrl: true } },
        technician: { select: { id: true, fullName: true, phone: true, avatarUrl: true, techProfile: true } },
        appointment: true,
        review: true,
      },
    });
    if (!request) return res.status(404).json({ message: 'Solicitud no encontrada' });
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener solicitud' });
  }
});

// PUT /api/requests/:id/accept — technician accepts
router.put('/:id/accept', auth, roleGuard('TECNICO'), async (req, res) => {
  try {
    const request = await prisma.serviceRequest.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!request) return res.status(404).json({ message: 'Solicitud no encontrada' });
    if (request.status !== 'SOLICITADO') return res.status(400).json({ message: 'La solicitud ya fue aceptada o no está disponible' });

    const updated = await prisma.serviceRequest.update({
      where: { id: parseInt(req.params.id) },
      data: { technicianId: req.user.id, status: 'ASIGNADO' },
      include: { category: true, client: { select: { id: true, fullName: true, phone: true } } }
    });

    // Create notification for client
    await prisma.notification.create({
      data: {
        userId: request.clientId,
        title: 'Técnico Asignado',
        message: `Tu solicitud "${request.title}" ha sido aceptada por un técnico.`,
        type: 'INFO',
      }
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error al aceptar solicitud' });
  }
});

// PUT /api/requests/:id/status
router.put('/:id/status', auth, roleGuard('TECNICO', 'EMPRESA', 'ADMIN'), async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['EN_PROGRESO', 'FINALIZADO'];
    if (!validStatuses.includes(status)) return res.status(400).json({ message: 'Estado no válido' });

    const updated = await prisma.serviceRequest.update({
      where: { id: parseInt(req.params.id) },
      data: { status },
    });

    if (status === 'FINALIZADO' && updated.technicianId) {
      await prisma.techProfile.updateMany({
        where: { userId: updated.technicianId },
        data: { totalJobs: { increment: 1 } },
      });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar estado' });
  }
});

// PUT /api/requests/:id/cancel
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const updated = await prisma.serviceRequest.update({
      where: { id: parseInt(req.params.id) },
      data: { status: 'CANCELADO' },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error al cancelar solicitud' });
  }
});

module.exports = router;
