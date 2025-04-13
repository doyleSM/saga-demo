import { Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { generateIdempotencyKey } from 'src/common/utils/idempotency-key.util';
import { SagaStep } from './orchestrator';
import { OrderOrchestratorContext } from '../types/order-oschestrator-ctx';

export class UpdateOrderStatusStep
  implements SagaStep<OrderOrchestratorContext> {
  name = 'UpdateOrderStatus';
  private readonly logger = new Logger(UpdateOrderStatusStep.name);

  constructor(private readonly http: HttpService) {}

  async execute(ctx: OrderOrchestratorContext): Promise<void> {
    this.logger.log(`Updating order ${ctx.orderId} status to "${ctx.newStatus}"`);
    const key = generateIdempotencyKey({
      orderId: ctx.orderId,
      newStatus: ctx.newStatus,
    });
    await firstValueFrom(
      this.http.patch(
        `http://localhost:3000/orders/${ctx.orderId}/status`,
        { status: ctx.newStatus },
        { headers: { 'Idempotency-Key': key } },
      ),
    );
    this.logger.log(`Order ${ctx.orderId} status updated to "${ctx.newStatus}"`);
  }
}
