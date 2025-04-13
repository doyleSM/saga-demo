import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OrderOrchestratorModule } from './order-orchestrator/order-orchestrator.module';

@Module({
  imports: [HttpModule, OrderOrchestratorModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
