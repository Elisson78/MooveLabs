import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Registra um novo usuário e cria seu tenant (empresa)
   */
  async register(dto: RegisterDto) {
    // Verifica se email já existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    
    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }
    
    // Hash da senha
    const hashedPassword = await bcrypt.hash(dto.password, 12);
    
    // Gera slug do tenant a partir do nome da empresa
    const slug = this.generateSlug(dto.companyName);
    
    // Cria tenant + usuário (owner) + subscription trial em uma transação
    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Busca plano Start (trial)
      const trialPlan = await tx.plan.findFirst({
        where: { slug: 'start', isActive: true },
      });
      
      // 2. Cria o tenant
      const tenant = await tx.tenant.create({
        data: {
          name: dto.companyName,
          slug: await this.ensureUniqueSlug(slug),
          email: dto.email,
        },
      });
      
      // 3. Cria o usuário como OWNER
      const user = await tx.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          name: dto.name,
          role: 'OWNER',
          status: 'ACTIVE', // Depois podemos adicionar confirmação de email
          tenantId: tenant.id,
        },
      });
      
      // 4. Cria subscription (trial de 14 dias)
      if (trialPlan) {
        await tx.subscription.create({
          data: {
            tenantId: tenant.id,
            planId: trialPlan.id,
            status: 'TRIALING',
            currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // +14 dias
            trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          },
        });
      }
      
      return { user, tenant };
    });
    
    // Gera tokens
    const tokens = await this.generateTokens(result.user.id, result.tenant.id);
    
    // Atualiza refresh token no banco
    await this.prisma.user.update({
      where: { id: result.user.id },
      data: { refreshToken: await bcrypt.hash(tokens.refreshToken, 10) },
    });
    
    return {
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
      },
      tenant: {
        id: result.tenant.id,
        name: result.tenant.name,
        slug: result.tenant.slug,
      },
      ...tokens,
    };
  }

  /**
   * Login de usuário existente
   */
  async login(dto: LoginDto) {
    // Busca usuário com tenant
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { tenant: true },
    });
    
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    
    // Verifica senha
    const passwordValid = await bcrypt.compare(dto.password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    
    // Verifica se usuário está ativo
    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Conta inativa ou pendente de confirmação');
    }
    
    // Gera tokens
    const tokens = await this.generateTokens(user.id, user.tenantId);
    
    // Atualiza refresh token e último login
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
        lastLoginAt: new Date(),
      },
    });
    
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      tenant: {
        id: user.tenant.id,
        name: user.tenant.name,
        slug: user.tenant.slug,
      },
      ...tokens,
    };
  }

  /**
   * Refresh do access token
   */
  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { tenant: true },
    });
    
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Acesso negado');
    }
    
    const refreshTokenValid = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!refreshTokenValid) {
      throw new UnauthorizedException('Token inválido');
    }
    
    const tokens = await this.generateTokens(user.id, user.tenantId);
    
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: await bcrypt.hash(tokens.refreshToken, 10) },
    });
    
    return tokens;
  }

  /**
   * Logout - invalida refresh token
   */
  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  /**
   * Gera par de tokens (access + refresh)
   */
  private async generateTokens(userId: string, tenantId: string) {
    const payload = { sub: userId, tenantId };
    
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
      }),
    ]);
    
    return { accessToken, refreshToken };
  }

  /**
   * Gera slug a partir do nome
   */
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9]+/g, '-')     // Substitui caracteres especiais por -
      .replace(/^-+|-+$/g, '');        // Remove - do início e fim
  }

  /**
   * Garante que o slug é único
   */
  private async ensureUniqueSlug(baseSlug: string): Promise<string> {
    let slug = baseSlug;
    let counter = 1;
    
    while (await this.prisma.tenant.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    return slug;
  }
}

