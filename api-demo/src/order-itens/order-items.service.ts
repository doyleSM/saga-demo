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
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { PaginationQueryDto } from 'src/shared/dto/pagination-query.dto';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(OrderItem.name)
    private orderItemModel: Model<OrderItemDocument>,
  ) {}

  async addOrderItems(
    orderId: string,
    itemsDto: CreateOrderItemDto[],
  ): Promise<OrderItem[]> {
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

    const docs = itemsDto.map((dto) => ({ ...dto, order: oid }));
    const createdItems = await this.orderItemModel.insertMany(docs);

    const itemIds = createdItems.map((i) => i._id as Types.ObjectId);
    order.items.push(...itemIds);
    await order.save();

    return createdItems.map((i) => i.toObject());
  }

  async getOrderItems(
    orderId: string,
    { page = 1, limit = 20 }: PaginationQueryDto,
  ): Promise<{
    items: OrderItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    let oid: Types.ObjectId;
    try {
      oid = new Types.ObjectId(orderId);
    } catch {
      throw new BadRequestException('orderId inválido');
    }

    const exists = await this.orderModel.exists({ _id: oid });
    if (!exists) {
      throw new NotFoundException('Order não encontrado');
    }

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.orderItemModel
        .find({ order: oid })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.orderItemModel.countDocuments({ order: oid }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getOrderItemById(orderId: string, itemId: string): Promise<OrderItem> {
    let oid: Types.ObjectId;
    let iid: Types.ObjectId;
    try {
      oid = new Types.ObjectId(orderId);
    } catch {
      throw new BadRequestException('orderId inválido');
    }
    try {
      iid = new Types.ObjectId(itemId);
    } catch {
      throw new BadRequestException('itemId inválido');
    }

    const orderExists = await this.orderModel.exists({ _id: oid });
    if (!orderExists) {
      throw new NotFoundException('Order não encontrado');
    }

    const item = await this.orderItemModel
      .findOne({ _id: iid, order: oid })
      .lean()
      .exec();
    if (!item) {
      throw new NotFoundException('OrderItem não encontrado');
    }
    return item;
  }

  async removeOrderItem(orderId: string, itemId: string): Promise<void> {
    let oid: Types.ObjectId;
    let iid: Types.ObjectId;
    try {
      oid = new Types.ObjectId(orderId);
    } catch {
      throw new BadRequestException('orderId inválido');
    }
    try {
      iid = new Types.ObjectId(itemId);
    } catch {
      throw new BadRequestException('itemId inválido');
    }

    const order = await this.orderModel.findById(oid);
    if (!order) {
      throw new NotFoundException('Order não encontrado');
    }

    const item = await this.orderItemModel.findOne({ _id: iid, order: oid });
    if (!item) {
      throw new NotFoundException('OrderItem não encontrado para este pedido');
    }

    await this.orderItemModel.deleteOne({ _id: iid }).exec();

    order.items = order.items.filter((id) => !id.equals(iid));
    await order.save();
  }

  async removeAllOrderItems(orderId: string): Promise<void> {
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
    order.items = [];
    await order.save();
  }
}
