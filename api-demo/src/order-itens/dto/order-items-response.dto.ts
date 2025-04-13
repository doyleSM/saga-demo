import { ApiProperty } from '@nestjs/swagger';
import { OrderItem } from 'src/shared/schemas/order-item.schema';

export class OrderItemsResponseDto {
  @ApiProperty({ type: [OrderItem], description: 'Itens da página atual' })
  items: OrderItem[];

  @ApiProperty({ example: 0, description: 'Total de itens no pedido' })
  total: number;

  @ApiProperty({ example: 1, description: 'Página atual' })
  page: number;

  @ApiProperty({ example: 20, description: 'Itens por página' })
  limit: number;

  @ApiProperty({ example: 0, description: 'Total de páginas' })
  totalPages: number;
}
