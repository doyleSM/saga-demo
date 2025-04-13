import { Controller, Post, Param } from '@nestjs/common';
import { ApiTags, ApiParam, ApiBadRequestResponse } from '@nestjs/swagger';
import { SimulatorService } from './simulator.service';

@ApiTags('simulate')
@Controller('simulate')
export class SimulatorController {
  constructor(private readonly simulatorService: SimulatorService) {}

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
    void this.simulatorService.simulate(orderId);
  }
}
