const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/reports/overview
router.get('/overview', auth, roleGuard('ADMIN'), async (req, res) => {
  try {
    const [totalUsers, totalClients, totalTechnicians, totalRequests, pendingVerifications, completedRequests] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'CLIENTE' } }),
      prisma.user.count({ where: { role: 'TECNICO' } }),
      prisma.serviceRequest.count(),
      prisma.techProfile.count({ where: { verificationStatus: 'PENDIENTE' } }),
      prisma.serviceRequest.count({ where: { status: 'FINALIZADO' } }),
    ]);
    res.json({ totalUsers, totalClients, totalTechnicians, totalRequests, pendingVerifications, completedRequests });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener métricas' });
  }
});

// GET /api/reports/by-category
router.get('/by-category', auth, roleGuard('ADMIN'), async (req, res) => {
  try {
    const categories = await prisma.serviceCategory.findMany({
      include: { _count: { select: { requests: true } } }
    });
    res.json(categories.map(c => ({ name: c.name, icon: c.icon, count: c._count.requests })));
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener reporte por categoría' });
  }
});

// GET /api/reports/by-status
router.get('/by-status', auth, roleGuard('ADMIN'), async (req, res) => {
  try {
    const statuses = ['SOLICITADO', 'ASIGNADO', 'EN_PROGRESO', 'FINALIZADO', 'CANCELADO'];
    const counts = await Promise.all(
      statuses.map(async (s) => ({
        status: s,
        count: await prisma.serviceRequest.count({ where: { status: s } }),
      }))
    );
    res.json(counts);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener reporte por estado' });
  }
});

module.exports = router;
