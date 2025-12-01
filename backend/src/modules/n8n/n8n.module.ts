import { Module } from '@nestjs/common';
import { N8nService } from './n8n.service';
import { N8nWebhookController } from './n8n-webhook.controller';
import { PlansModule } from '../plans/plans.module';

@Module({
  imports: [PlansModule],
  controllers: [N8nWebhookController],
  providers: [N8nService],
  exports: [N8nService],
})
export class N8nModule {}

