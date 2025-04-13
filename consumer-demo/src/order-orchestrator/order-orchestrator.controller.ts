import { Controller, Post, Param } from '@nestjs/common';
import { ApiTags, ApiParam, ApiBadRequestResponse } from '@nestjs/swagger';
import { OrderOrchestratorService } from './order-orchestrator.service';

@ApiTags('order-orchestrator')
@Controller('order-orchestrator')
export class OrderOrchestratorController {
  constructor(
    private readonly orderOrchestratorService: OrderOrchestratorService,
  ) {}

  @Post(':orderId')
  @ApiParam({
    name: 'orderId',
    description: 'ID do pedido para o qual queremos gerar/atualizar items',
    type: String,
  })
  @ApiBadRequestResponse({
    description: 'orderId inválido ou erro ao chamar a API de orders',
  })
  simulate(@Param('orderId') orderId: string): void {
    void this.orderOrchestratorService.execute(orderId);
  }
}
