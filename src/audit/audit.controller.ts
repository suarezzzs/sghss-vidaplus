import { Controller, Get, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

/**
 * Controller de auditoria
 * Permite consultar logs de auditoria (apenas para usuários autenticados)
 */
@ApiTags('Auditoria')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  /**
   * Endpoint para listar logs de auditoria
   */
  @Get()
  @ApiOperation({ summary: 'Listar logs de auditoria' })
  @ApiQuery({ name: 'userId', required: false, type: Number })
  @ApiQuery({ name: 'action', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Logs recuperados com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  findAll(
    @Query('userId', new ParseIntPipe({ optional: true })) userId?: number,
    @Query('action') action?: string,
  ) {
    return this.auditService.findAll(userId, action);
  }
}
