import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './shared/schemas/order.schema';
import { OrderItem, OrderItemSchema } from './shared/schemas/order-item.schema';
import { OrdersController } from './orders/orders.controller';
import { OrderItemsController } from './order-itens/order-itens.controller';
import { OrderItemsService } from './order-itens/order-items.service';
import { OrdersService } from './orders/orders.service';
import { CoreOrdersController } from './orders/core-orders.controller';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://root:rootpassword@localhost:27017/shop?authSource=admin',
      {},
    ),
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: OrderItem.name, schema: OrderItemSchema },
    ]),
  ],
  controllers: [OrdersController, OrderItemsController, CoreOrdersController],
  providers: [OrderItemsService, OrdersService],
})
export class AppModule {}
