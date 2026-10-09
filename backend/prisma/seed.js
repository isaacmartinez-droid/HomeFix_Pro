const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();
async function main() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || password.length < 6 || Buffer.byteLength(password) > 72) throw new Error('Configura ADMIN_PASSWORD con entre 6 y 72 bytes');
  const categories = [
    ['Electricidad', 'Reparaciones e instalaciones eléctricas', 'electrical_services'],
    ['Plomería', 'Reparación de tuberías, grifos y filtraciones', 'plumbing'],
    ['Aire Acondicionado', 'Mantenimiento y reparación de A/C', 'ac_unit'],
    ['Mantenimiento General', 'Reparaciones varias y pintura', 'handyman'],
  ];
  await prisma.$transaction(async tx => {
    for (const [name, description, icon] of categories) {
      if (!await tx.serviceCategory.findFirst({ where: { name } })) await tx.serviceCategory.create({ data: { name, description, icon } });
    }
  });
  const admin = await prisma.user.findUnique({ where: { email: 'admin@homefix.pro' } });
  if (admin && admin.role !== 'ADMIN') throw new Error('El correo del administrador pertenece a otra cuenta');
  // Running this command explicitly rotates the bootstrap administrator password.
  await prisma.user.upsert({
    where: { email: 'admin@homefix.pro' },
    create: { email: 'admin@homefix.pro', fullName: 'Administrador del Sistema', role: 'ADMIN', passwordHash: await bcrypt.hash(password, 12) },
    update: { passwordHash: await bcrypt.hash(password, 12) },
  });
  const owners = await prisma.user.findMany({ where: { role: 'EMPRESA', companyOwned: null } });
  for (const owner of owners) await prisma.company.create({ data: { ownerId: owner.id, name: owner.fullName, address: owner.address } });
  // Local demo accounts requested for the client and technician interfaces.
  const demoPasswordHash = await bcrypt.hash('123456', 12);
  for (const account of [
    { email: 'maria@ejemplo.com', fullName: 'María Pérez', role: 'CLIENTE' },
    { email: 'juan@tech.com', fullName: 'Juan Pérez', role: 'TECNICO' },
  ]) {
    const existing = await prisma.user.findUnique({ where: { email: account.email } });
    if (existing && existing.role !== account.role) throw new Error('El correo demo pertenece a otro rol: ' + account.email);
    const tech = account.role === 'TECNICO';
    await prisma.user.upsert({
      where: { email: account.email },
      create: { ...account, passwordHash: demoPasswordHash, isActive: true, ...(tech ? { techProfile: { create: { specialty: 'PLOMERIA' } } } : {}) },
      update: { passwordHash: demoPasswordHash, isActive: true, ...(tech ? { techProfile: { upsert: { create: { specialty: 'PLOMERIA' }, update: {} } } } : {}) },
    });
  }
  console.log('Categorías y administrador preparados. La contraseña está en ADMIN_PASSWORD.');
  console.log('Cliente: maria@ejemplo.com; técnico: juan@tech.com. Contraseña demo: 123456.');
}
main().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => prisma.$disconnect());
