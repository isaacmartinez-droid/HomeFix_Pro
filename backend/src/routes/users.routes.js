const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/users (Admin)
router.get('/', auth, roleGuard('ADMIN'), async (req, res) => {
  try {
    const { role, search } = req.query;
    const where = {};
    if (role) where.role = role;
    if (search) where.OR = [
      { fullName: { contains: search } },
      { email: { contains: search } },
    ];
    const users = await prisma.user.findMany({
      where,
      select: { id: true, email: true, fullName: true, phone: true, role: true, isActive: true, createdAt: true, address: true, techProfile: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

// GET /api/users/:id (Admin)
router.get('/:id', auth, roleGuard('ADMIN'), async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { techProfile: true },
    });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    const { passwordHash: _, ...safe } = user;
    res.json(safe);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
});

// PUT /api/users/:id/toggle (Admin)
router.put('/:id/toggle', auth, roleGuard('ADMIN'), async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    const updated = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: { isActive: !user.isActive },
    });
    const { passwordHash: _, ...safe } = updated;
    res.json(safe);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
});

module.exports = router;
