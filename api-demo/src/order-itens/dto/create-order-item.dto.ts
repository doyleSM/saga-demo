import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({ example: 'Awesome Widget' })
  @IsString()
  product: string;

  @ApiProperty({ example: 3 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 19.99 })
  @IsNumber()
  @Min(0)
  price: number;
}
