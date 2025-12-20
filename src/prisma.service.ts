import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Serviço Prisma para gerenciar a conexão com o banco de dados
 * Implementa hooks de ciclo de vida do NestJS para conectar/desconectar
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  /**
   * Conecta ao banco de dados quando o módulo é inicializado
   */
  async onModuleInit() {
    await this.$connect();
    console.log('✅ Prisma conectado ao banco de dados');
  }

  /**
   * Desconecta do banco de dados quando o módulo é destruído
   */
  async onModuleDestroy() {
    await this.$disconnect();
    console.log('🔌 Prisma desconectado do banco de dados');
  }
}
