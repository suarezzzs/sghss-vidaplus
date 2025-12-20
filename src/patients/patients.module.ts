import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { PrismaService } from '../prisma.service';

/**
 * Módulo de pacientes
 */
@Module({
  controllers: [PatientsController],
  providers: [PatientsService, PrismaService],
  exports: [PatientsService],
})
export class PatientsModule {}
