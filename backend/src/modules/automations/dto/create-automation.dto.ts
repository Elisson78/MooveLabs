import { IsString, IsOptional, MaxLength, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAutomationDto {
  @ApiProperty({ example: 'Captura de Leads WhatsApp' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: 'Automação para capturar leads via WhatsApp' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ example: 'clxxx123...' })
  @IsOptional()
  @IsString()
  templateId?: string;

  @ApiPropertyOptional({ example: { webhookUrl: 'https://...', apiKey: '...' } })
  @IsOptional()
  @IsObject()
  config?: object;
}

