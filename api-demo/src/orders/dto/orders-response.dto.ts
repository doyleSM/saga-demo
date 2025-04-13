import { ApiProperty } from '@nestjs/swagger';
import { Order } from 'src/shared/schemas/order.schema';

export class OrdersResponseDto {
  @ApiProperty({
    type: [Order],
    description: 'Lista de pedidos na página atual',
  })
  orders: Order[];

  @ApiProperty({ example: 0, description: 'Total de pedidos cadastrados' })
  total: number;

  @ApiProperty({ example: 1, description: 'Página atual' })
  page: number;

  @ApiProperty({ example: 20, description: 'Quantidade de pedidos por página' })
  limit: number;

  @ApiProperty({ example: 0, description: 'Total de páginas disponíveis' })
  totalPages: number;
}
