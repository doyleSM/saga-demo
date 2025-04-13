import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Patch,
  Version,
} from '@nestjs/common';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse,
  ApiQuery,
  ApiParam,
  ApiExtraModels,
  getSchemaPath,
  ApiBody,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersResponseDto } from './dto/orders-response.dto';
import { Order } from 'src/shared/schemas/order.schema';
import { PaginationQueryDto } from 'src/shared/dto/pagination-query.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@ApiTags('orders')
@ApiExtraModels(Order, OrdersResponseDto)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Version('1')
  @ApiCreatedResponse({ type: Order, description: 'Pedido criado com sucesso' })
  @ApiBadRequestResponse({
    description: 'Dados inválidos para criação de pedido',
  })
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.ordersService.createOrder(createOrderDto);
  }

  @Get()
  @Version('1')
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiOkResponse({
    description: 'Lista paginada de pedidos',
    schema: { $ref: getSchemaPath(OrdersResponseDto) },
  })
  @ApiBadRequestResponse({ description: 'Parâmetros de paginação inválidos' })
  async getOrders(
    @Query() pagination: PaginationQueryDto,
  ): Promise<OrdersResponseDto> {
    return this.ordersService.getOrders(pagination);
  }

  @Get(':orderId')
  @Version('1')
  @ApiParam({ name: 'orderId', description: 'ID do pedido', type: String })
  @ApiOkResponse({ type: Order, description: 'Detalhes de um pedido' })
  @ApiBadRequestResponse({ description: 'orderId inválido' })
  @ApiNotFoundResponse({ description: 'Pedido não encontrado' })
  async getOrder(@Param('orderId') orderId: string): Promise<Order> {
    return this.ordersService.getOrderById(orderId);
  }

  @Delete(':orderId')
  @ApiParam({
    name: 'orderId',
    description: 'ID do pedido a ser removido',
    type: String,
  })
  @ApiNoContentResponse({ description: 'Pedido removido com sucesso' })
  @ApiBadRequestResponse({ description: 'orderId inválido' })
  @ApiNotFoundResponse({ description: 'Pedido não encontrado' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeOrder(@Param('orderId') orderId: string): Promise<void> {
    return this.ordersService.removeOrder(orderId);
  }

  @Patch(':orderId/status')
  @Version('1')
  @ApiParam({ name: 'orderId', description: 'ID do pedido', type: String })
  @ApiBody({ type: UpdateOrderStatusDto })
  @ApiOkResponse({
    type: Order,
    description: 'Pedido atualizado com novo status',
  })
  @ApiBadRequestResponse({
    description: 'orderId inválido ou payload incorreto',
  })
  @ApiNotFoundResponse({ description: 'Pedido não encontrado' })
  @HttpCode(HttpStatus.OK)
  async updateStatus(
    @Param('orderId') orderId: string,
    @Body() updateDto: UpdateOrderStatusDto,
  ): Promise<Order> {
    return this.ordersService.updateOrderStatus(orderId, updateDto);
  }
}
