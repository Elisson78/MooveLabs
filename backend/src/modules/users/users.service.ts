import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Lista usuários do tenant
   */
  async findAllByTenant(tenantId: string) {
    return this.prisma.user.findMany({
      where: { tenantId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        lastLoginAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Busca usuário por ID (validando tenant)
   */
  async findById(id: string, tenantId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, tenantId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        avatar: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  /**
   * Busca usuário por email
   */
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Cria novo usuário no tenant
   */
  async create(tenantId: string, dto: CreateUserDto, currentUserRole: string) {
    // Verifica permissão para criar usuário com esta role
    if (dto.role === 'OWNER') {
      throw new ForbiddenException('Não é possível criar outro OWNER');
    }

    if (dto.role === 'ADMIN' && currentUserRole !== 'OWNER') {
      throw new ForbiddenException('Apenas OWNER pode criar ADMIN');
    }

    // Verifica se email já existe
    const existingUser = await this.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    // Verifica limite de usuários do plano
    const subscription = await this.prisma.subscription.findUnique({
      where: { tenantId },
      include: { plan: true },
    });

    if (subscription) {
      const currentUsers = await this.prisma.user.count({ where: { tenantId } });
      if (currentUsers >= subscription.plan.maxUsers) {
        throw new ForbiddenException(
          `Limite de usuários atingido (${subscription.plan.maxUsers}). Faça upgrade do plano.`,
        );
      }
    }

    // Cria usuário
    const hashedPassword = await bcrypt.hash(dto.password, 12);

    return this.prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
        tenantId,
        status: 'ACTIVE', // Pode mudar para PENDING se quiser confirmação de email
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });
  }

  /**
   * Atualiza usuário
   */
  async update(id: string, tenantId: string, dto: UpdateUserDto, currentUserId: string, currentUserRole: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, tenantId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Não pode alterar OWNER (exceto ele mesmo)
    if (user.role === 'OWNER' && currentUserId !== id) {
      throw new ForbiddenException('Não é possível alterar o OWNER');
    }

    // Apenas OWNER pode mudar roles
    if (dto.role && currentUserRole !== 'OWNER') {
      throw new ForbiddenException('Apenas OWNER pode alterar roles');
    }

    // Não pode se tornar OWNER
    if (dto.role === 'OWNER') {
      throw new ForbiddenException('Não é possível se tornar OWNER');
    }

    const updateData: any = { ...dto };
    
    // Se estiver alterando senha
    if (dto.password) {
      updateData.password = await bcrypt.hash(dto.password, 12);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Remove usuário
   */
  async remove(id: string, tenantId: string, currentUserId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, tenantId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Não pode deletar a si mesmo
    if (id === currentUserId) {
      throw new ForbiddenException('Não é possível deletar sua própria conta');
    }

    // Não pode deletar OWNER
    if (user.role === 'OWNER') {
      throw new ForbiddenException('Não é possível deletar o OWNER');
    }

    await this.prisma.user.delete({ where: { id } });

    return { message: 'Usuário removido com sucesso' };
  }
}

