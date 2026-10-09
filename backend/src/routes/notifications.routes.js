const express = require('express');
const prisma = require('../prisma');
const auth = require('../middleware/auth');
const { id, fail } = require('../lib/policy');
const router = express.Router();
router.use(auth);
router.get('/', async (req, res) => res.json(await prisma.notification.findMany({ where: { userId: req.user.id }, orderBy: { createdAt: 'desc' }, take: 20 })));
router.get('/unread-count', async (req, res) => res.json({ count: await prisma.notification.count({ where: { userId: req.user.id, isRead: false } }) }));
router.put('/read-all', async (req, res) => {
  await prisma.notification.updateMany({ where: { userId: req.user.id, isRead: false }, data: { isRead: true } });
  res.json({ message: 'Notificaciones leídas' });
});
router.put('/:id/read', async (req, res) => {
  const notificationId = id(req.params.id);
  const notification = await prisma.notification.findFirst({ where: { id: notificationId, userId: req.user.id } });
  if (!notification) fail(404, 'Notificación no encontrada');
  res.json(await prisma.notification.update({ where: { id: notificationId }, data: { isRead: true } }));
});
module.exports = router;
