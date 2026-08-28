const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/services/categories:
 *   get:
 *     summary: Obtiene la lista de categorías de servicios
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: Lista de categorías devuelta exitosamente
 *       500:
 *         description: Error al obtener categorías
 */
// GET /api/services/categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.serviceCategory.findMany();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener categorías' });
  }
});

/**
 * @swagger
 * /api/services/categories:
 *   post:
 *     summary: Crea una nueva categoría de servicio (Solo Admin)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - icon
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               icon:
 *                 type: string
 *     responses:
 *       201:
 *         description: Categoría creada
 *       403:
 *         description: Acceso denegado
 */
// POST /api/services/categories (Admin)
router.post('/categories', auth, roleGuard('ADMIN'), async (req, res) => {
  try {
    const { name, description, icon } = req.body;
    const category = await prisma.serviceCategory.create({ data: { name, description, icon } });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear categoría' });
  }
});

/**
 * @swagger
 * /api/services/categories/{id}:
 *   put:
 *     summary: Actualiza una categoría de servicio existente (Solo Admin)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               icon:
 *                 type: string
 *     responses:
 *       200:
 *         description: Categoría actualizada
 *       403:
 *         description: Acceso denegado
 */
// PUT /api/services/categories/:id (Admin)
router.put('/categories/:id', auth, roleGuard('ADMIN'), async (req, res) => {
  try {
    const { name, description, icon } = req.body;
    const updated = await prisma.serviceCategory.update({
      where: { id: parseInt(req.params.id) },
      data: { name, description, icon },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar categoría' });
  }
});

module.exports = router;
