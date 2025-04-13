import {
  Controller,
  Get,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Post,
  Version,
} from '@nestjs/common';
import {
  ApiTags,
  ApiParam,
  ApiQuery,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiExtraModels,
  getSchemaPath,
  ApiHeader,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { OrderItemsService } from './order-items.service';
import { OrderItemsResponseDto } from './dto/order-items-response.dto';
import { OrderItem } from 'src/shared/schemas/order-item.schema';
import { PaginationQueryDto } from 'src/shared/dto/pagination-query.dto';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { IdempotencyKey } from 'src/shared/decorator/idempotency.decorator';

@ApiTags('order-items')
@ApiExtraModels(OrderItem, OrderItemsResponseDto)
@Controller('orders/:orderId/items')
export class OrderItemsController {
  constructor(private readonly itemsService: OrderItemsService) {}

  @Post()
  @Version('1')
  @ApiHeader({
    name: 'Idempotency-Key',
    description: 'Chave única (UUID) para garantir idempotência',
    required: true,
    schema: { type: 'string', format: 'uuid' },
  })
  @ApiParam({ name: 'orderId', description: 'ID do pedido', type: String })
  @ApiCreatedResponse({
    type: OrderItem,
    description: 'Item criado ou já existente retornado',
  })
  @ApiBadRequestResponse({ description: 'Dados inválidos' })
  @ApiNotFoundResponse({ description: 'Pedido não encontrado' })
  async addItem(
    @Param('orderId') orderId: string,
    @Body() dto: CreateOrderItemDto,
    @IdempotencyKey() idempotencyKey: string,
  ): Promise<OrderItem> {
    return this.itemsService.addOrderItem(orderId, dto, idempotencyKey);
  }

  @Get()
  @Version('1')
  @ApiParam({ name: 'orderId', description: 'ID do pedido', type: String })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiOkResponse({
    description: 'Lista paginada de itens do pedido',

    schema: { $ref: getSchemaPath(OrderItemsResponseDto) },
  })
  @ApiBadRequestResponse({ description: 'Parâmetros de paginação inválidos' })
  @ApiNotFoundResponse({ description: 'Pedido não encontrado' })
  async listItems(
    @Param('orderId') orderId: string,
    @Query() pagination: PaginationQueryDto,
  ): Promise<OrderItemsResponseDto> {
    return this.itemsService.getOrderItems(orderId, pagination);
  }

  @Get(':itemId')
  @Version('1')
  @ApiParam({ name: 'orderId', description: 'ID do pedido', type: String })
  @ApiParam({ name: 'itemId', description: 'ID do item', type: String })
  @ApiOkResponse({
    type: OrderItem,
    description: 'Detalhes de um item específico',
  })
  @ApiBadRequestResponse({ description: 'IDs inválidos' })
  @ApiNotFoundResponse({ description: 'Pedido ou item não encontrado' })
  async getItem(
    @Param('orderId') orderId: string,
    @Param('itemId') itemId: string,
  ): Promise<OrderItem> {
    return this.itemsService.getOrderItemById(orderId, itemId);
  }

  @Delete(':itemId')
  @Version('1')
  @ApiParam({ name: 'orderId', description: 'ID do pedido', type: String })
  @ApiParam({
    name: 'itemId',
    description: 'ID do item a ser removido',
    type: String,
  })
  @ApiNoContentResponse({ description: 'Item removido com sucesso' })
  @ApiBadRequestResponse({ description: 'IDs inválidos' })
  @ApiNotFoundResponse({ description: 'Pedido ou item não encontrado' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeItem(
    @Param('orderId') orderId: string,
    @Param('itemId') itemId: string,
  ): Promise<void> {
    return this.itemsService.removeOrderItem(orderId, itemId);
  }

  @Delete()
  @Version('1')
  @ApiParam({ name: 'orderId', description: 'ID do pedido', type: String })
  @ApiNoContentResponse({ description: 'Todos os itens removidos com sucesso' })
  @ApiBadRequestResponse({ description: 'orderId inválido' })
  @ApiNotFoundResponse({ description: 'Pedido não encontrado' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAll(@Param('orderId') orderId: string): Promise<void> {
    return this.itemsService.removeAllOrderItems(orderId);
  }
}
