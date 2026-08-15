const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/services/categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.serviceCategory.findMany();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener categorías' });
  }
});

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
