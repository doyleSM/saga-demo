import {
  Controller,
  Get,
  Param,
  Query,
  Version,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiParam,
  ApiQuery,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { Order } from 'src/shared/schemas/order.schema';
import { PaginationQueryDto } from 'src/shared/dto/pagination-query.dto';

@ApiTags('core-orders')
@Controller('core/orders')
export class CoreOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @Version('1')
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiOkResponse({
    type: [Order],
    description: 'Lista completa (core) de pedidos',
  })
  @ApiBadRequestResponse({ description: 'Parâmetros inválidos' })
  async getAll(@Query() { page, limit }: PaginationQueryDto): Promise<Order[]> {
    return this.ordersService.getAllCoreOrders({ page, limit });
  }

  @Get(':orderId')
  @ApiParam({ name: 'orderId', type: String })
  @ApiOkResponse({
    type: Order,
    description: 'Detalhes completos (core) de um pedido',
  })
  @ApiBadRequestResponse({ description: 'orderId inválido' })
  @ApiNotFoundResponse({ description: 'Pedido não encontrado' })
  async getOne(@Param('orderId') orderId: string): Promise<Order> {
    const order = await this.ordersService.getOrderByIdCore(orderId);
    if (!order) throw new NotFoundException();
    return order;
  }
}
