// src/orders/orders.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { OrderItem, OrderItemDocument } from './schemas/order-item.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(OrderItem.name)
    private orderItemModel: Model<OrderItemDocument>,
  ) {}

  // Cria um novo pedido
  async createOrder(createOrderDto: any): Promise<Order> {
    const createdOrder = new this.orderModel(createOrderDto);
    return createdOrder.save();
  }

  // Adiciona um item a um pedido existente
  async addOrderItem(
    orderId: string,
    createOrderItemDto: any,
  ): Promise<OrderItem> {
    const order = await this.orderModel.findById(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    const orderItem = new this.orderItemModel({
      ...createOrderItemDto,
      order: order._id,
    });
    const savedOrderItem = await orderItem.save();

    return savedOrderItem;
  }

  // Retorna um pedido com seus itens populados
  async getOrderById(orderId: string): Promise<Order> {
    const order = await this.orderModel.findById(orderId).populate('items');
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }
}
