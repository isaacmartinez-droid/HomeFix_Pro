const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - fullName
 *             properties:
 *               email:
 *                 type: string
 *                 example: usuario@ejemplo.com
 *               password:
 *                 type: string
 *                 example: secreta123
 *               fullName:
 *                 type: string
 *                 example: Juan Pérez
 *               phone:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [CLIENTE, TECNICO, EMPRESA]
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Faltan campos requeridos
 *       409:
 *         description: El correo ya está registrado
 */
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

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Inicia sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: usuario@ejemplo.com
 *               password:
 *                 type: string
 *                 example: secreta123
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso, retorna el token JWT
 *       400:
 *         description: Email y contraseña requeridos
 *       401:
 *         description: Credenciales incorrectas
 *       403:
 *         description: Cuenta desactivada
 */
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
