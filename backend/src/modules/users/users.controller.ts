import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, ROLES_KEY } from '../auth/guards/roles.guard';
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { CurrentTenant, TenantContext } from '../../common/decorators';

// Decorator para definir roles permitidas
const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles('OWNER', 'ADMIN')
  @ApiOperation({ summary: 'Lista usuários do tenant' })
  async findAll(@CurrentTenant() tenantId: string) {
    return this.usersService.findAllByTenant(tenantId);
  }

  @Get('me')
  @ApiOperation({ summary: 'Retorna dados do usuário logado' })
  async getMe(@Req() req: any, @CurrentTenant() tenantId: string) {
    return this.usersService.findById(req.user.id, tenantId);
  }

  @Get(':id')
  @Roles('OWNER', 'ADMIN')
  @ApiOperation({ summary: 'Busca usuário por ID' })
  async findOne(@Param('id') id: string, @CurrentTenant() tenantId: string) {
    return this.usersService.findById(id, tenantId);
  }

  @Post()
  @Roles('OWNER', 'ADMIN')
  @ApiOperation({ summary: 'Cria novo usuário' })
  async create(
    @Body() dto: CreateUserDto, 
    @CurrentTenant() tenantId: string,
    @Req() req: any,
  ) {
    return this.usersService.create(tenantId, dto, req.user.role);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Atualiza dados do usuário logado' })
  async updateMe(
    @Body() dto: UpdateUserDto, 
    @CurrentTenant() tenantId: string,
    @Req() req: any,
  ) {
    return this.usersService.update(
      req.user.id,
      tenantId,
      dto,
      req.user.id,
      req.user.role,
    );
  }

  @Patch(':id')
  @Roles('OWNER', 'ADMIN')
  @ApiOperation({ summary: 'Atualiza usuário' })
  async update(
    @Param('id') id: string, 
    @Body() dto: UpdateUserDto, 
    @CurrentTenant() tenantId: string,
    @Req() req: any,
  ) {
    return this.usersService.update(id, tenantId, dto, req.user.id, req.user.role);
  }

  @Delete(':id')
  @Roles('OWNER', 'ADMIN')
  @ApiOperation({ summary: 'Remove usuário' })
  async remove(
    @Param('id') id: string, 
    @CurrentTenant() tenantId: string,
    @Req() req: any,
  ) {
    return this.usersService.remove(id, tenantId, req.user.id);
  }
}

