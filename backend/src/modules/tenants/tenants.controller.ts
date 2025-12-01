import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TenantsService } from './tenants.service';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('tenants')
@Controller('tenants')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TenantsController {
  constructor(private tenantsService: TenantsService) {}

  @Get('me')
  @ApiOperation({ summary: 'Retorna dados do tenant atual' })
  async getCurrentTenant(@Req() req: any) {
    return this.tenantsService.findById(req.user.tenantId);
  }

  @Get('me/stats')
  @ApiOperation({ summary: 'Retorna estatísticas do tenant' })
  async getStats(@Req() req: any) {
    return this.tenantsService.getStats(req.user.tenantId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Atualiza dados do tenant' })
  async updateCurrentTenant(@Req() req: any, @Body() dto: UpdateTenantDto) {
    return this.tenantsService.update(req.user.tenantId, dto);
  }
}

