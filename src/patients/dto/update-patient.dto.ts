import { PartialType } from '@nestjs/swagger';
import { CreatePatientDto } from './create-patient.dto';

/**
 * DTO para atualização de paciente
 * Todos os campos são opcionais (herda de CreatePatientDto)
 */
export class UpdatePatientDto extends PartialType(CreatePatientDto) {}
