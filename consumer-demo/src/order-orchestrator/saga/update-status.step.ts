import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { generateIdempotencyKey } from 'src/common/utils/idempotency-key.util';
import { SagaStep } from './orchestrator';
import { OrderOrchestratorContext } from '../types/order-oschestrator-ctx';

export class UpdateOrderStatusStep
  implements SagaStep<OrderOrchestratorContext> {
  constructor(private readonly http: HttpService) {}

  async execute(ctx: OrderOrchestratorContext): Promise<void> {
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
  }

  // async compensate(ctx: OrderOrchestratorContext): Promise<void> {
  //   const key = generateIdempotencyKey({
  //     orderId: ctx.orderId,
  //     newStatus: 'pending',
  //   });
  //   await firstValueFrom(
  //     this.http.patch(
  //       `http://localhost:3000/orders/${ctx.orderId}/status`,
  //       { status: 'pending' },
  //       { headers: { 'Idempotency-Key': key } },
  //     ),
  //   );
  // }
}
