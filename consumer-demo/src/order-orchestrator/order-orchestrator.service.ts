import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { SagaOrchestrator } from './saga/orchestrator';
import { CreateOrderItemsStep } from './saga/create-items.step';
import { UpdateOrderStatusStep } from './saga/update-status.step';
import { OrderOrchestratorContext } from './types/order-oschestrator-ctx';
import { CreateOrderItemType } from './types/create-order.type';

@Injectable()
export class OrderOrchestratorService {
  private readonly orchestrator: SagaOrchestrator<OrderOrchestratorContext>;

  constructor(private readonly http: HttpService) {
    this.orchestrator = new SagaOrchestrator([
      new CreateOrderItemsStep(this.http),
      new UpdateOrderStatusStep(this.http),
    ]);
  }

  async execute(orderId: string): Promise<void> {
    let externalItems: CreateOrderItemType[];
    try {
      const resp = await new Promise<{ data: CreateOrderItemType[] }>((resolve) => {
        setTimeout(() => {
          resolve({
            data: [
              { price: 43.5, product: 'Product 1', quantity: 2 },
              { price: 99.35, product: 'Product 2', quantity: 1 },
              { price: 23.97, product: 'Product 3', quantity: 3 },
              { price: 12.40, product: 'Product 4', quantity: 2 },
              { price: 14.35, product: 'Product 5', quantity: 1 },
            ],
          });
        }, 2000);
      });


      externalItems = resp.data;
    } catch (err) {
      throw new BadRequestException(
        `Falha ao buscar itens externos para orderId=${orderId}`,
      );
    }

    const ctx: OrderOrchestratorContext = {
      orderId,
      items: externalItems,
      createdIds: [],
      newStatus: 'shipped',
    };

    await this.orchestrator.execute(ctx);
  }
}
