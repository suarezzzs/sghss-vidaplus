import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

/**
 * DTO para criação de paciente
 */
export class CreatePatientDto {
  @ApiProperty({
    example: 'Carlos Eduardo Oliveira',
    description: 'Nome completo do paciente',
  })
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  nome: string;

  @ApiProperty({
    example: '123.456.789-00',
    description: 'CPF do paciente (formato: XXX.XXX.XXX-XX)',
  })
  @IsString()
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
    message: 'CPF deve estar no formato XXX.XXX.XXX-XX',
  })
  @IsNotEmpty({ message: 'CPF é obrigatório' })
  cpf: string;

  @ApiProperty({
    example: '1985-03-15',
    description: 'Data de nascimento (formato: YYYY-MM-DD)',
  })
  @IsDateString({}, { message: 'Data de nascimento inválida' })
  @IsNotEmpty({ message: 'Data de nascimento é obrigatória' })
  dataNasc: string;

  @ApiProperty({
    example: '(11) 98765-4321',
    description: 'Telefone do paciente',
    required: false,
  })
  @IsString()
  @IsOptional()
  telefone?: string;

  @ApiProperty({
    example: 'carlos.oliveira@email.com',
    description: 'E-mail do paciente',
    required: false,
  })
  @IsEmail({}, { message: 'E-mail inválido' })
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: 'Rua das Flores, 123 - São Paulo/SP',
    description: 'Endereço completo do paciente',
    required: false,
  })
  @IsString()
  @IsOptional()
  endereco?: string;
}
