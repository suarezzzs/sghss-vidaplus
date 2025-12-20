import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO para login de usuário
 */
export class LoginDto {
  @ApiProperty({
    example: 'medico@vidaplus.com',
    description: 'E-mail do usuário',
  })
  @IsEmail({}, { message: 'E-mail inválido' })
  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  email: string;

  @ApiProperty({
    example: 'senha123',
    description: 'Senha do usuário',
  })
  @IsString()
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  password: string;
}
