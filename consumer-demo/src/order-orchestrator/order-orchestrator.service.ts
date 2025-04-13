import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { SagaOrchestrator } from './saga/orchestrator';
import { CreateOrderItemsStep } from './saga/create-items.step';
import { UpdateOrderStatusStep } from './saga/update-status.step';
import { CreateOrderItemType } from './types/create-order.type';
import { OrderOrchestratorContext } from './types/order-oschestrator-ctx';

@Injectable()
export class OrderOrchestratorService {
  private readonly logger = new Logger(OrderOrchestratorService.name);
  private readonly orchestrator: SagaOrchestrator<OrderOrchestratorContext>;

  constructor(private readonly http: HttpService) {
    this.orchestrator = new SagaOrchestrator([
      new CreateOrderItemsStep(this.http),
      new UpdateOrderStatusStep(this.http),
    ]);
  }

  async execute(orderId: string): Promise<void> {
    this.logger.log(`Starting OrderOrchestrator for order ${orderId}`);
    const externalItems: CreateOrderItemType[] = await this.fetchExternalItems(orderId);

    const ctx: OrderOrchestratorContext = {
      orderId,
      items: externalItems,
      createdIds: [],
      newStatus: 'shipped',
    };

    await this.orchestrator.execute(ctx);
    this.logger.log(`OrderOrchestrator completed for order ${orderId}`);
  }

  private async fetchExternalItems(orderId: string): Promise<CreateOrderItemType[]> {
    this.logger.log(`Fetching external items for order ${orderId}`);
    const resp = await new Promise<{ data: CreateOrderItemType[] }>((resolve) =>
      setTimeout(
        () =>
          resolve({
            data: [
              { product: 'Product 1', quantity: 2, price: 43.5 },
              { product: 'Product 2', quantity: 1, price: 99.35 },
              { product: 'Product 3', quantity: 3, price: 23.97 },
              { product: 'Product 4', quantity: 2, price: 12.4 },
              { product: 'Product 5', quantity: 1, price: 14.35 },
            ],
          }),
        2000,
      ),
    );
    this.logger.log(`Fetched ${resp.data.length} items for order ${orderId}`);
    return resp.data;
  }
}
