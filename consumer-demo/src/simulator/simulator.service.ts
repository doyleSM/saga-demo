import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { generateIdempotencyKey } from 'src/common/utils/idempotency-key.util';

type CreateOrderItemType = {
  product: string;
  quantity: number;
  price: number;
};

@Injectable()
export class SimulatorService {
  constructor(private readonly http: HttpService) {}

  async simulate(orderId: string): Promise<void> {
    const externalItems: CreateOrderItemType[] = [
      { product: 'Widget A', quantity: 2, price: 9.99 },
      { product: 'Gadget B', quantity: 1, price: 19.95 },
      { product: 'Doodad C', quantity: 5, price: 1.5 },
    ];

    for (const item of externalItems) {
      const idempotencyKey = generateIdempotencyKey(item);
      const url = `http://localhost:3000/orders/${orderId}/items`;
      const response$ = this.http.post(url, item, {
        headers: { 'Idempotency-Key': idempotencyKey },
      });

      await firstValueFrom(response$);
    }

    const newStatus = 'shipped';
    const statusKey = generateIdempotencyKey({ orderId, newStatus });
    await firstValueFrom(
      this.http.patch(
        `http://localhost:3000/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { 'Idempotency-Key': statusKey } },
      ),
    );
  }
}
