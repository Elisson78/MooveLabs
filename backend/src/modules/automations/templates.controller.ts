import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AutomationsService } from './automations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('templates')
@Controller('templates')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TemplatesController {
  constructor(private automationsService: AutomationsService) {}

  @Get()
  @ApiOperation({ summary: 'Lista templates disponíveis' })
  async findAll() {
    return this.automationsService.findAllTemplates();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca template por ID' })
  async findOne(@Param('id') id: string) {
    return this.automationsService.findTemplateById(id);
  }
}

