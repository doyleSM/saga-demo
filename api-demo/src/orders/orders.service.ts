import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  OrderItem,
  OrderItemDocument,
} from 'src/shared/schemas/order-item.schema';
import { Order, OrderDocument } from 'src/shared/schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaginationQueryDto } from 'src/shared/dto/pagination-query.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(OrderItem.name)
    private orderItemModel: Model<OrderItemDocument>,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const created = new this.orderModel(createOrderDto);
    return created.save();
  }

  async getOrders({ page = 1, limit = 20 }: PaginationQueryDto): Promise<{
    orders: Order[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      this.orderModel
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.orderModel.countDocuments(),
    ]);

    return {
      orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getOrderById(orderId: string): Promise<Order> {
    let oid: Types.ObjectId;
    try {
      oid = new Types.ObjectId(orderId);
    } catch {
      throw new BadRequestException('orderId inválido');
    }

    const order = await this.orderModel.findById(oid).lean().exec();
    if (!order) {
      throw new NotFoundException('Order não encontrado');
    }
    return order;
  }

  async removeOrder(orderId: string): Promise<void> {
    let oid: Types.ObjectId;
    try {
      oid = new Types.ObjectId(orderId);
    } catch {
      throw new BadRequestException('orderId inválido');
    }

    const order = await this.orderModel.findById(oid);
    if (!order) {
      throw new NotFoundException('Order não encontrado');
    }

    await this.orderItemModel.deleteMany({ order: oid }).exec();
    await this.orderModel.deleteOne({ _id: oid }).exec();
  }

  async updateOrderStatus(
    orderId: string,
    updateDto: UpdateOrderStatusDto,
  ): Promise<Order> {
    let oid: Types.ObjectId;
    try {
      oid = new Types.ObjectId(orderId);
    } catch {
      throw new BadRequestException('orderId inválido');
    }

    const order = await this.orderModel.findById(oid).exec();
    if (!order) {
      throw new NotFoundException('Order não encontrado');
    }

    order.status = updateDto.status;
    const saved = await order.save();
    return saved.toObject();
  }
}
