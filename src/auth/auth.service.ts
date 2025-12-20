import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

/**
 * Serviço de autenticação
 * Gerencia registro, login e geração de tokens JWT
 */
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * Registra um novo usuário no sistema
   * @param registerDto - Dados do usuário a ser registrado
   * @returns Usuário criado (sem senha)
   */
  async register(registerDto: RegisterDto) {
    // Verificar se o e-mail já existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('E-mail já cadastrado');
    }

    // Criptografar senha com bcrypt (salt rounds = 10)
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Criar usuário
    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        nome: registerDto.nome,
        role: registerDto.role,
      },
      select: {
        id: true,
        email: true,
        nome: true,
        role: true,
        createdAt: true,
      },
    });

    return {
      success: true,
      data: user,
      message: 'Usuário cadastrado com sucesso',
    };
  }

  /**
   * Autentica um usuário e gera token JWT
   * @param loginDto - Credenciais do usuário
   * @returns Token JWT e dados do usuário
   */
  async login(loginDto: LoginDto) {
    // Buscar usuário por e-mail
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Gerar token JWT
    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload);

    return {
      success: true,
      data: {
        access_token,
        user: {
          id: user.id,
          email: user.email,
          nome: user.nome,
          role: user.role,
        },
      },
      message: 'Login realizado com sucesso',
    };
  }
}
