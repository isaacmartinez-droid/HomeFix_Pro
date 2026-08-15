const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  // Categories
  const catElec = await prisma.serviceCategory.create({
    data: { name: 'Electricidad', description: 'Reparaciones e instalaciones eléctricas.', icon: 'electrical_services' }
  });
  const catPlom = await prisma.serviceCategory.create({
    data: { name: 'Plomería', description: 'Reparación de tuberías, grifos y filtraciones.', icon: 'plumbing' }
  });
  const catAc = await prisma.serviceCategory.create({
    data: { name: 'Aire Acondicionado', description: 'Mantenimiento y reparación de A/C.', icon: 'ac_unit' }
  });
  const catMant = await prisma.serviceCategory.create({
    data: { name: 'Mantenimiento General', description: 'Reparaciones varias y pintura.', icon: 'handyman' }
  });

  const passwordHash = await bcrypt.hash('123456', 10);

  // Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@homefix.pro',
      passwordHash,
      fullName: 'Administrador del Sistema',
      role: 'ADMIN',
    }
  });

  // Clients
  const client1 = await prisma.user.create({
    data: {
      email: 'maria@ejemplo.com',
      passwordHash,
      fullName: 'María Pérez',
      phone: '8888-1111',
      role: 'CLIENTE',
      address: 'Altamira'
    }
  });

  const client2 = await prisma.user.create({
    data: {
      email: 'carlos@ejemplo.com',
      passwordHash,
      fullName: 'Carlos Mendoza',
      phone: '8888-2222',
      role: 'CLIENTE',
      address: 'Los Robles'
    }
  });

  // Technicians
  const tech1 = await prisma.user.create({
    data: {
      email: 'juan@tech.com',
      passwordHash,
      fullName: 'Juan Pérez',
      phone: '8888-3333',
      role: 'TECNICO',
      techProfile: {
        create: {
          specialty: 'PLOMERIA',
          verificationStatus: 'VERIFICADO',
          avgRating: 4.8,
          totalJobs: 24,
          totalEarnings: 850
        }
      }
    }
  });

  const tech2 = await prisma.user.create({
    data: {
      email: 'ana@tech.com',
      passwordHash,
      fullName: 'Ana Rojas',
      phone: '8888-4444',
      role: 'TECNICO',
      techProfile: {
        create: {
          specialty: 'ELECTRICIDAD',
          verificationStatus: 'VERIFICADO',
          avgRating: 4.9,
          totalJobs: 15,
          totalEarnings: 520
        }
      }
    }
  });

  // Service requests
  const req1 = await prisma.serviceRequest.create({
    data: {
      clientId: client1.id,
      categoryId: catPlom.id,
      title: 'Fuga de agua en lavabo',
      description: 'El lavabo del baño principal tiene una fuga constante.',
      address: 'Casa 45, Altamira',
      neighborhood: 'Altamira',
      urgency: 'ALTA',
      status: 'SOLICITADO'
    }
  });

  const req2 = await prisma.serviceRequest.create({
    data: {
      clientId: client2.id,
      categoryId: catElec.id,
      technicianId: tech2.id,
      title: 'Instalar lámparas',
      description: 'Necesito instalar 3 lámparas en la sala.',
      address: 'Condominio Los Robles, Apt 12',
      neighborhood: 'Los Robles',
      urgency: 'BAJA',
      status: 'ASIGNADO'
    }
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
