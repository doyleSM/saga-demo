import { Module } from '@nestjs/common';

import { HttpModule } from '@nestjs/axios';
import { OrderOrchestratorController } from './order-orchestrator.controller';
import { OrderOrchestratorService } from './order-orchestrator.service';

@Module({
  imports: [HttpModule],
  controllers: [OrderOrchestratorController],
  providers: [OrderOrchestratorService],
})
export class OrderOrchestratorModule {}
