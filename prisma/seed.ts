import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes
  await prisma.auditLog.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.user.deleteMany();

  // Criar usuários de exemplo
  const hashedPassword = await bcrypt.hash('senha123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@vidaplus.com',
      password: hashedPassword,
      nome: 'Administrador Sistema',
      role: 'ADMIN',
    },
  });

  const doctor = await prisma.user.create({
    data: {
      email: 'medico@vidaplus.com',
      password: hashedPassword,
      nome: 'Dr. João Silva',
      role: 'DOCTOR',
    },
  });

  const user = await prisma.user.create({
    data: {
      email: 'usuario@vidaplus.com',
      password: hashedPassword,
      nome: 'Maria Santos',
      role: 'USER',
    },
  });

  console.log('✅ Usuários criados:', { admin, doctor, user });

  // Criar pacientes de exemplo
  const patient1 = await prisma.patient.create({
    data: {
      nome: 'Carlos Eduardo Oliveira',
      cpf: '123.456.789-00',
      dataNasc: new Date('1985-03-15'),
      telefone: '(11) 98765-4321',
      email: 'carlos.oliveira@email.com',
      endereco: 'Rua das Flores, 123 - São Paulo/SP',
    },
  });

  const patient2 = await prisma.patient.create({
    data: {
      nome: 'Ana Paula Costa',
      cpf: '987.654.321-00',
      dataNasc: new Date('1992-07-22'),
      telefone: '(21) 91234-5678',
      email: 'ana.costa@email.com',
      endereco: 'Av. Atlântica, 456 - Rio de Janeiro/RJ',
    },
  });

  const patient3 = await prisma.patient.create({
    data: {
      nome: 'Roberto Almeida',
      cpf: '456.789.123-00',
      dataNasc: new Date('1978-11-30'),
      telefone: '(31) 99876-5432',
      email: 'roberto.almeida@email.com',
      endereco: 'Rua Minas Gerais, 789 - Belo Horizonte/MG',
    },
  });

  console.log('✅ Pacientes criados:', { patient1, patient2, patient3 });

  // Criar logs de auditoria de exemplo
  await prisma.auditLog.create({
    data: {
      action: 'SEED_DATABASE',
      userId: admin.id,
      details: {
        message: 'Banco de dados populado com dados iniciais',
        usersCreated: 3,
        patientsCreated: 3,
      },
      ipAddress: '127.0.0.1',
    },
  });

  console.log('✅ Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
