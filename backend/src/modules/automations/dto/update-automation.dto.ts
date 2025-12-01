import { IsString, IsOptional, MaxLength, IsObject, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { AutomationStatus } from '@prisma/client';

export class UpdateAutomationDto {
  @ApiPropertyOptional({ example: 'Captura de Leads WhatsApp v2' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ example: 'Automação atualizada' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ enum: AutomationStatus })
  @IsOptional()
  @IsEnum(AutomationStatus)
  status?: AutomationStatus;

  @ApiPropertyOptional({ example: { webhookUrl: 'https://...', apiKey: '...' } })
  @IsOptional()
  @IsObject()
  config?: object;
}

