import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

/**
 * Função principal para inicializar a aplicação
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS
  app.enableCors({
    origin: '*', // Em produção, especificar domínios permitidos
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Configurar validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades não definidas nos DTOs
      forbidNonWhitelisted: true, // Retorna erro se houver propriedades extras
      transform: true, // Transforma payloads em instâncias de DTOs
    }),
  );

  // Configurar filtro de exceção global
  app.useGlobalFilters(new HttpExceptionFilter());

  // Configurar Swagger (OpenAPI)
  const config = new DocumentBuilder()
    .setTitle('SGHSS - VidaPlus API')
    .setDescription(
      'Sistema de Gestão Hospitalar e de Serviços de Saúde - API REST com NestJS, Prisma e PostgreSQL',
    )
    .setVersion('1.0')
    .addTag('Autenticação', 'Endpoints de registro e login')
    .addTag('Pacientes', 'Gerenciamento de pacientes')
    .addTag('Auditoria', 'Logs de auditoria do sistema')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Iniciar servidor
  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log('');
  console.log('🚀 SGHSS - VidaPlus API iniciada com sucesso!');
  console.log('');
  console.log(`📡 Servidor rodando em: http://localhost:${port}`);
  console.log(`📚 Documentação Swagger: http://localhost:${port}/api/docs`);
  console.log('');
}

bootstrap();
