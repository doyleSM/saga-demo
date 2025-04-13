import { ApiProperty } from '@nestjs/swagger';

export class SimulateItemResultDto {
  @ApiProperty({ description: 'ID do orderItem criado ou existente' })
  id: string;

  @ApiProperty({ description: 'Produto' })
  product: string;

  @ApiProperty({ description: 'Quantidade' })
  quantity: number;

  @ApiProperty({ description: 'Preço' })
  price: number;
}
