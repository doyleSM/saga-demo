import { Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { generateIdempotencyKey } from 'src/common/utils/idempotency-key.util';
import { SagaStep } from './orchestrator';
import { AxiosResponse } from 'axios';
import { OrderOrchestratorContext } from '../types/order-oschestrator-ctx';

interface OrderItemResponse { _id: string; }

export class CreateOrderItemsStep
  implements SagaStep<OrderOrchestratorContext> {
  name = 'CreateOrderItems';
  private readonly logger = new Logger(CreateOrderItemsStep.name);

  constructor(private readonly http: HttpService) {}

  async execute(ctx: OrderOrchestratorContext): Promise<void> {
    this.logger.log(`Creating ${ctx.items.length} items for order ${ctx.orderId}`);
    for (const item of ctx.items) {
      this.logger.log(`→ Creating item ${item.product} x${item.quantity}`);
      if (item.product === 'Product 5') {
        throw new Error('Erro ao criar item "Product 5"');
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
      this.logger.log(`→ Created item ID=${resp.data._id}`);
    }
  }

  async compensate(ctx: OrderOrchestratorContext): Promise<void> {
    this.logger.log(`Compensating creation of ${ctx.createdIds.length} items`);
    for (const itemId of ctx.createdIds) {
      this.logger.log(`→ Deleting item ID=${itemId}`);
      const delKey = generateIdempotencyKey({ orderId: ctx.orderId, itemId });
      await firstValueFrom(
        this.http.delete(
          `http://localhost:3000/orders/${ctx.orderId}/items/${itemId}`,
          { headers: { 'Idempotency-Key': delKey } },
        ),
      );
      this.logger.log(`→ Deleted item ID=${itemId}`);
    }
  }
}
