const jwt = require('jsonwebtoken');
const prisma = require('../prisma');
module.exports = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ message: 'Token de acceso requerido' });
  let decoded;
  try { decoded = jwt.verify(header.slice(7), process.env.JWT_SECRET, { algorithms: ['HS256'] }); }
  catch { return res.status(401).json({ message: 'Token inválido o expirado' }); }
  if (!Number.isSafeInteger(decoded.id)) return res.status(401).json({ message: 'Token inválido' });
  try {
    const user = await prisma.user.findUnique({ where: { id: decoded.id }, select: { id: true, email: true, role: true, fullName: true, isActive: true } });
    if (!user || !user.isActive) return res.status(401).json({ message: 'Cuenta no disponible' });
    req.user = user;
    next();
  } catch (error) { next(error); }
};
