import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { generateIdempotencyKey } from 'src/common/utils/idempotency-key.util';
import { SagaStep } from './orchestrator';
import { AxiosResponse } from 'axios';
import { OrderOrchestratorContext } from '../types/order-oschestrator-ctx';

interface OrderItemResponse {
  _id: string /* ... */;
}

export class CreateOrderItemsStep
  implements SagaStep<OrderOrchestratorContext> {
  constructor(private readonly http: HttpService) {}

  async execute(ctx: OrderOrchestratorContext): Promise<void> {
    for (const item of ctx.items) {
      if (item.product == 'Product 5') {
        throw new Error('Erro ao criar item');
      }
      const key = generateIdempotencyKey({ orderId: ctx.orderId, item });
      const resp: AxiosResponse<OrderItemResponse> = await firstValueFrom(
        this.http.post<OrderItemResponse>(
          `http://localhost:3000/orders/${ctx.orderId}/items`,
          item,
          { headers: { 'Idempotency-Key': key } },
        ),
      );
      ctx.createdIds.push(resp.data._id);
    }
  }

  async compensate(ctx: OrderOrchestratorContext): Promise<void> {
    for (const itemId of ctx.createdIds) {
      const delKey = generateIdempotencyKey({ orderId: ctx.orderId, itemId });
      await firstValueFrom(
        this.http.delete(
          `http://localhost:3000/orders/${ctx.orderId}/items/${itemId}`,
          { headers: { 'Idempotency-Key': delKey } },
        ),
      );
    }
  }
}
