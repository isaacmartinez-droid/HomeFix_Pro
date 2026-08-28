const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Obtiene las últimas 20 notificaciones del usuario
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de notificaciones
 *       500:
 *         description: Error del servidor
 */
// GET /api/notifications
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener notificaciones' });
  }
});

/**
 * @swagger
 * /api/notifications/unread-count:
 *   get:
 *     summary: Obtiene la cantidad de notificaciones sin leer
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Conteo de notificaciones
 *       500:
 *         description: Error del servidor
 */
// GET /api/notifications/unread-count
router.get('/unread-count', auth, async (req, res) => {
  try {
    const count = await prisma.notification.count({
      where: { userId: req.user.id, isRead: false },
    });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener conteo' });
  }
});

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   put:
 *     summary: Marca una notificación como leída
 *     tags: [Notifications]
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
 *         description: Notificación marcada como leída
 *       500:
 *         description: Error al marcar notificación
 */
// PUT /api/notifications/:id/read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const updated = await prisma.notification.update({
      where: { id: parseInt(req.params.id) },
      data: { isRead: true },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error al marcar notificación' });
  }
});

module.exports = router;
