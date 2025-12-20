import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * DTO para registro de novo usuário
 */
export class RegisterDto {
  @ApiProperty({
    example: 'medico@vidaplus.com',
    description: 'E-mail único do usuário',
  })
  @IsEmail({}, { message: 'E-mail inválido' })
  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  email: string;

  @ApiProperty({
    example: 'Senha@123',
    description: 'Senha com no mínimo 8 caracteres',
  })
  @IsString()
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  password: string;

  @ApiProperty({
    example: 'Dr. João Silva',
    description: 'Nome completo do usuário',
  })
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  nome: string;

  @ApiProperty({
    example: 'DOCTOR',
    enum: ['USER', 'DOCTOR', 'ADMIN'],
    description: 'Papel do usuário no sistema',
  })
  @IsEnum(['USER', 'DOCTOR', 'ADMIN'], { message: 'Role inválido' })
  @IsNotEmpty({ message: 'Role é obrigatório' })
  role: 'USER' | 'DOCTOR' | 'ADMIN';
}
