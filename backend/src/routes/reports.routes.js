const express = require('express');
const prisma = require('../prisma');
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');
const router = express.Router();
router.use(auth, roleGuard('ADMIN'));
router.get('/overview', async (req, res) => {
  const [totalUsers, totalClients, totalTechnicians, totalRequests, pendingVerifications, completedRequests] = await Promise.all([
    prisma.user.count(), prisma.user.count({ where: { role: 'CLIENTE', isActive: true } }),
    prisma.user.count({ where: { role: 'TECNICO', isActive: true } }), prisma.serviceRequest.count(),
    prisma.techProfile.count({ where: { verificationStatus: 'PENDIENTE', cedulaDocUrl: { not: null }, policeRecordUrl: { not: null } } }),
    prisma.serviceRequest.count({ where: { status: 'FINALIZADO' } }),
  ]);
  res.json({ totalUsers, totalClients, totalTechnicians, totalRequests, pendingVerifications, completedRequests });
});
router.get('/by-category', async (req, res) => {
  const categories = await prisma.serviceCategory.findMany({ include: { _count: { select: { requests: true } } } });
  res.json(categories.map(c => ({ name: c.name, icon: c.icon, count: c._count.requests })));
});
router.get('/by-status', async (req, res) => {
  res.json(await Promise.all(['SOLICITADO', 'ASIGNADO', 'EN_PROGRESO', 'FINALIZADO', 'CANCELADO'].map(async status => ({ status, count: await prisma.serviceRequest.count({ where: { status } }) }))));
});
router.get('/trend', async (req, res) => {
  // Calendar days are defined in Managua (UTC-6, no daylight saving).
  const offset = 6 * 60 * 60 * 1000;
  const local = new Date(Date.now() - offset);
  const start = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate()) + offset - 6 * 86400000;
  const requests = await prisma.serviceRequest.findMany({ where: { createdAt: { gte: new Date(start) } }, select: { createdAt: true } });
  const days = Array.from({ length: 7 }, (_, index) => {
    const timestamp = start + index * 86400000;
    return { date: new Date(timestamp - offset).toISOString().slice(0, 10), name: new Date(timestamp).toLocaleDateString('es-NI', { weekday: 'short', timeZone: 'America/Managua' }), solicitudes: 0 };
  });
  for (const request of requests) {
    const index = Math.floor((request.createdAt.getTime() - start) / 86400000);
    if (days[index]) days[index].solicitudes++;
  }
  res.json(days);
});
module.exports = router;
