import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

/**
 * Serviço de auditoria
 * Registra todas as operações críticas do sistema (LGPD Art. 37)
 */
@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  /**
   * Registra uma ação no log de auditoria
   * @param action - Tipo de ação (LOGIN, CREATE_PATIENT, etc.)
   * @param userId - ID do usuário que executou a ação
   * @param details - Detalhes adicionais da operação
   * @param ipAddress - Endereço IP de origem
   */
  async log(
    action: string,
    userId: number,
    details?: any,
    ipAddress?: string,
  ) {
    try {
      await this.prisma.auditLog.create({
        data: {
          action,
          userId,
          details: details || {},
          ipAddress: ipAddress || 'unknown',
        },
      });

      console.log(`[AUDIT] ${action} - User: ${userId} - IP: ${ipAddress}`);
    } catch (error) {
      console.error('[AUDIT ERROR]', error);
    }
  }

  /**
   * Busca logs de auditoria com filtros
   * @param userId - Filtrar por usuário (opcional)
   * @param action - Filtrar por tipo de ação (opcional)
   * @returns Lista de logs
   */
  async findAll(userId?: number, action?: string) {
    const logs = await this.prisma.auditLog.findMany({
      where: {
        ...(userId && { userId }),
        ...(action && { action }),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            nome: true,
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: 100, // Limitar a 100 registros mais recentes
    });

    return {
      success: true,
      data: logs,
      message: 'Logs de auditoria recuperados com sucesso',
    };
  }
}
