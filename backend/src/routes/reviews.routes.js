const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Crea una nueva calificación para un servicio finalizado (CLIENTE)
 *     tags: [Reviews]
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
 *               - rating
 *             properties:
 *               requestId:
 *                 type: integer
 *               rating:
 *                 type: integer
 *                 description: Calificación del 1 al 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Calificación creada exitosamente
 *       400:
 *         description: Error de validación (ej. servicio no finalizado)
 */
// POST /api/reviews
router.post('/', auth, roleGuard('CLIENTE'), async (req, res) => {
  try {
    const { requestId, rating, comment } = req.body;
    if (!requestId || !rating) return res.status(400).json({ message: 'requestId y rating son requeridos' });

    const request = await prisma.serviceRequest.findUnique({ where: { id: parseInt(requestId) } });
    if (!request) return res.status(404).json({ message: 'Solicitud no encontrada' });
    if (request.status !== 'FINALIZADO') return res.status(400).json({ message: 'Solo puedes calificar servicios finalizados' });
    if (request.clientId !== req.user.id) return res.status(403).json({ message: 'No autorizado' });

    const review = await prisma.review.create({
      data: {
        requestId: parseInt(requestId),
        clientId: req.user.id,
        technicianId: request.technicianId,
        rating: parseInt(rating),
        comment,
      },
    });

    // Update tech average rating
    const allReviews = await prisma.review.findMany({ where: { technicianId: request.technicianId } });
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await prisma.techProfile.updateMany({
      where: { userId: request.technicianId },
      data: { avgRating: parseFloat(avg.toFixed(2)) },
    });

    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear calificación' });
  }
});

/**
 * @swagger
 * /api/reviews/technician/{id}:
 *   get:
 *     summary: Obtiene las calificaciones de un técnico específico
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de calificaciones obtenida exitosamente
 *       500:
 *         description: Error del servidor
 */
// GET /api/reviews/technician/:id
router.get('/technician/:id', async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { technicianId: parseInt(req.params.id) },
      include: {
        client: { select: { id: true, fullName: true, avatarUrl: true } },
        request: { include: { category: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener calificaciones' });
  }
});

module.exports = router;
