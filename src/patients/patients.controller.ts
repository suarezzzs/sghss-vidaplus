import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

/**
 * Controller de pacientes
 * Todas as rotas requerem autenticação JWT
 */
@ApiTags('Pacientes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  /**
   * Endpoint para criar novo paciente
   */
  @Post()
  @ApiOperation({ summary: 'Cadastrar novo paciente' })
  @ApiResponse({ status: 201, description: 'Paciente cadastrado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 409, description: 'CPF já cadastrado' })
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.create(createPatientDto);
  }

  /**
   * Endpoint para listar todos os pacientes
   */
  @Get()
  @ApiOperation({ summary: 'Listar todos os pacientes' })
  @ApiResponse({ status: 200, description: 'Pacientes listados com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  findAll() {
    return this.patientsService.findAll();
  }

  /**
   * Endpoint para buscar paciente por ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Buscar paciente por ID' })
  @ApiResponse({ status: 200, description: 'Paciente encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 404, description: 'Paciente não encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.patientsService.findOne(id);
  }

  /**
   * Endpoint para atualizar paciente
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar paciente' })
  @ApiResponse({ status: 200, description: 'Paciente atualizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 404, description: 'Paciente não encontrado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePatientDto: UpdatePatientDto,
  ) {
    return this.patientsService.update(id, updatePatientDto);
  }

  /**
   * Endpoint para remover paciente (soft delete)
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Remover paciente (soft delete)' })
  @ApiResponse({ status: 200, description: 'Paciente removido com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 404, description: 'Paciente não encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.patientsService.remove(id);
  }
}
