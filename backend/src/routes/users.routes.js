const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtiene la lista de usuarios (Solo Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *       403:
 *         description: No autorizado
 */
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

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtiene los detalles de un usuario específico (Solo Admin)
 *     tags: [Users]
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
 *         description: Detalles del usuario
 *       404:
 *         description: Usuario no encontrado
 */
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

/**
 * @swagger
 * /api/users/{id}/toggle:
 *   put:
 *     summary: Activa o desactiva la cuenta de un usuario (Solo Admin)
 *     tags: [Users]
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
 *         description: Estado de la cuenta actualizado
 *       404:
 *         description: Usuario no encontrado
 */
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
