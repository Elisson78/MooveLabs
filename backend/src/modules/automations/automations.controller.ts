import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AutomationsService } from './automations.service';
import { CreateAutomationDto } from './dto/create-automation.dto';
import { UpdateAutomationDto } from './dto/update-automation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('automations')
@Controller('automations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AutomationsController {
  constructor(private automationsService: AutomationsService) {}

  @Get()
  @ApiOperation({ summary: 'Lista automações do tenant' })
  async findAll(@Req() req: any) {
    return this.automationsService.findAllByTenant(req.user.tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca automação por ID' })
  async findOne(@Param('id') id: string, @Req() req: any) {
    return this.automationsService.findById(id, req.user.tenantId);
  }

  @Post()
  @ApiOperation({ summary: 'Cria nova automação' })
  async create(@Body() dto: CreateAutomationDto, @Req() req: any) {
    return this.automationsService.create(req.user.tenantId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza automação' })
  async update(@Param('id') id: string, @Body() dto: UpdateAutomationDto, @Req() req: any) {
    return this.automationsService.update(id, req.user.tenantId, dto);
  }

  @Post(':id/activate')
  @ApiOperation({ summary: 'Ativa automação' })
  async activate(@Param('id') id: string, @Req() req: any) {
    return this.automationsService.activate(id, req.user.tenantId);
  }

  @Post(':id/deactivate')
  @ApiOperation({ summary: 'Desativa automação' })
  async deactivate(@Param('id') id: string, @Req() req: any) {
    return this.automationsService.deactivate(id, req.user.tenantId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove automação' })
  async remove(@Param('id') id: string, @Req() req: any) {
    return this.automationsService.remove(id, req.user.tenantId);
  }

  @Get(':id/executions')
  @ApiOperation({ summary: 'Lista execuções da automação' })
  async getExecutions(
    @Param('id') id: string,
    @Query('limit') limit: number,
    @Req() req: any,
  ) {
    return this.automationsService.getExecutions(id, req.user.tenantId, limit);
  }
}

