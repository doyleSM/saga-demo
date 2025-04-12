import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://root:rootpassword@localhost:27017/shop?authSource=admin',
      {},
    ),
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
