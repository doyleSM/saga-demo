import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@Body() createOrderDto: any) {
    return this.ordersService.createOrder(createOrderDto);
  }

  @Post(':orderId/items')
  async addOrderItem(
    @Param('orderId') orderId: string,
    @Body() createOrderItemDto: any,
  ) {
    return this.ordersService.addOrderItem(orderId, createOrderItemDto);
  }

  @Get(':orderId')
  async getOrder(@Param('orderId') orderId: string) {
    return this.ordersService.getOrderById(orderId);
  }
}
