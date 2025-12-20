import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from './audit.service';

/**
 * Interceptor para registrar automaticamente ações no log de auditoria
 */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user, ip } = request;

    // Mapear método HTTP + URL para ação de auditoria
    const action = this.getActionName(method, url);

    // Apenas registrar se houver usuário autenticado e for uma ação relevante
    if (user && action) {
      return next.handle().pipe(
        tap(() => {
          // Registrar após a operação ser concluída com sucesso
          this.auditService.log(
            action,
            user.id,
            {
              method,
              url,
              body: this.sanitizeBody(request.body),
            },
            ip,
          );
        }),
      );
    }

    return next.handle();
  }

  /**
   * Mapeia método HTTP + URL para nome de ação
   */
  private getActionName(method: string, url: string): string | null {
    // Login
    if (url.includes('/auth/login')) {
      return 'LOGIN';
    }

    // Pacientes
    if (url.includes('/patients')) {
      if (method === 'POST') return 'CREATE_PATIENT';
      if (method === 'PATCH' || method === 'PUT') return 'UPDATE_PATIENT';
      if (method === 'DELETE') return 'DELETE_PATIENT';
    }

    return null;
  }

  /**
   * Remove dados sensíveis do body antes de logar
   */
  private sanitizeBody(body: any): any {
    if (!body) return {};

    const sanitized = { ...body };

    // Remover senha
    if (sanitized.password) {
      sanitized.password = '***';
    }

    return sanitized;
  }
}
