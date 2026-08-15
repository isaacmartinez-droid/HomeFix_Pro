const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

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
