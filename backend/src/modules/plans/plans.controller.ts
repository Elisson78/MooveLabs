import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PlansService } from './plans.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('plans')
@Controller('plans')
export class PlansController {
  constructor(private plansService: PlansService) {}

  @Get()
  @ApiOperation({ summary: 'Lista planos disponíveis' })
  async findAll() {
    return this.plansService.findAllPublic();
  }

  @Get('subscription')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retorna assinatura do tenant com uso atual' })
  async getSubscription(@Req() req: any) {
    return this.plansService.getTenantSubscription(req.user.tenantId);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Busca plano por slug' })
  async findBySlug(@Param('slug') slug: string) {
    return this.plansService.findBySlug(slug);
  }
}

