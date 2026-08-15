const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, fullName, phone, role, address } = req.body;
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: 'Email, contraseña y nombre son requeridos' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ message: 'El correo ya está registrado' });

    const passwordHash = await bcrypt.hash(password, 10);
    const validRoles = ['CLIENTE', 'TECNICO', 'EMPRESA'];
    const userRole = validRoles.includes(role) ? role : 'CLIENTE';

    const user = await prisma.user.create({
      data: { email, passwordHash, fullName, phone, role: userRole, address },
    });

    // If technician, create empty profile
    if (userRole === 'TECNICO') {
      await prisma.techProfile.create({
        data: { userId: user.id },
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, fullName: user.fullName },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { passwordHash: _, ...safeUser } = user;
    res.status(201).json({ user: safeUser, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email y contraseña requeridos' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Credenciales incorrectas' });
    if (!user.isActive) return res.status(403).json({ message: 'Cuenta desactivada. Contacte al administrador.' });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ message: 'Credenciales incorrectas' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, fullName: user.fullName },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { passwordHash: _, ...safeUser } = user;
    res.json({ user: safeUser, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
});

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { techProfile: true },
    });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    const { passwordHash: _, ...safeUser } = user;
    res.json(safeUser);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener perfil' });
  }
});

// PUT /api/auth/me
router.put('/me', auth, async (req, res) => {
  try {
    const { fullName, phone, address, avatarUrl } = req.body;
    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: { fullName, phone, address, avatarUrl },
    });
    const { passwordHash: _, ...safeUser } = updated;
    res.json(safeUser);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar perfil' });
  }
});

module.exports = router;
