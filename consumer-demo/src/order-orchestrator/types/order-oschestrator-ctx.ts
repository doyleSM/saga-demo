import { CreateOrderItemType } from './create-order.type';

export interface OrderOrchestratorContext {
  orderId: string;
  items: CreateOrderItemType[];
  createdIds: string[];
  newStatus: string;
}
