import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

/**
 * Serviço de gerenciamento de pacientes
 * Implementa CRUD completo com soft delete (LGPD)
 */
@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Cria um novo paciente
   * @param createPatientDto - Dados do paciente
   * @returns Paciente criado
   */
  async create(createPatientDto: CreatePatientDto) {
    // Verificar se CPF já existe
    const existingPatient = await this.prisma.patient.findUnique({
      where: { cpf: createPatientDto.cpf },
    });

    if (existingPatient && !existingPatient.deletedAt) {
      throw new ConflictException('CPF já cadastrado');
    }

    const patient = await this.prisma.patient.create({
      data: {
        ...createPatientDto,
        dataNasc: new Date(createPatientDto.dataNasc),
      },
    });

    return {
      success: true,
      data: patient,
      message: 'Paciente cadastrado com sucesso',
    };
  }

  /**
   * Lista todos os pacientes (exceto os deletados)
   * @returns Lista de pacientes ativos
   */
  async findAll() {
    const patients = await this.prisma.patient.findMany({
      where: {
        deletedAt: null, // Apenas pacientes não deletados
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      data: patients,
      message: 'Pacientes listados com sucesso',
    };
  }

  /**
   * Busca um paciente por ID
   * @param id - ID do paciente
   * @returns Paciente encontrado
   */
  async findOne(id: number) {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
    });

    if (!patient || patient.deletedAt) {
      throw new NotFoundException('Paciente não encontrado');
    }

    return {
      success: true,
      data: patient,
      message: 'Paciente encontrado',
    };
  }

  /**
   * Atualiza um paciente
   * @param id - ID do paciente
   * @param updatePatientDto - Dados a serem atualizados
   * @returns Paciente atualizado
   */
  async update(id: number, updatePatientDto: UpdatePatientDto) {
    // Verificar se paciente existe
    const existingPatient = await this.prisma.patient.findUnique({
      where: { id },
    });

    if (!existingPatient || existingPatient.deletedAt) {
      throw new NotFoundException('Paciente não encontrado');
    }

    // Se CPF foi alterado, verificar se já existe
    if (updatePatientDto.cpf && updatePatientDto.cpf !== existingPatient.cpf) {
      const cpfExists = await this.prisma.patient.findUnique({
        where: { cpf: updatePatientDto.cpf },
      });

      if (cpfExists && !cpfExists.deletedAt) {
        throw new ConflictException('CPF já cadastrado');
      }
    }

    const patient = await this.prisma.patient.update({
      where: { id },
      data: {
        ...updatePatientDto,
        dataNasc: updatePatientDto.dataNasc
          ? new Date(updatePatientDto.dataNasc)
          : undefined,
      },
    });

    return {
      success: true,
      data: patient,
      message: 'Paciente atualizado com sucesso',
    };
  }

  /**
   * Remove um paciente (soft delete)
   * LGPD Art. 16 - Direito à eliminação
   * @param id - ID do paciente
   * @returns Confirmação de exclusão
   */
  async remove(id: number) {
    // Verificar se paciente existe
    const existingPatient = await this.prisma.patient.findUnique({
      where: { id },
    });

    if (!existingPatient || existingPatient.deletedAt) {
      throw new NotFoundException('Paciente não encontrado');
    }

    // Soft delete: apenas marca como deletado
    await this.prisma.patient.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    return {
      success: true,
      message: 'Paciente removido com sucesso',
    };
  }
}
