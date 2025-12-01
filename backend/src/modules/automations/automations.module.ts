import { Module } from '@nestjs/common';
import { AutomationsService } from './automations.service';
import { AutomationsController } from './automations.controller';
import { TemplatesController } from './templates.controller';
import { N8nModule } from '../n8n/n8n.module';

@Module({
  imports: [N8nModule],
  controllers: [AutomationsController, TemplatesController],
  providers: [AutomationsService],
  exports: [AutomationsService],
})
export class AutomationsModule {}

