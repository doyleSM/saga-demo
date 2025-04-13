import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateOrderStatusDto {
  @ApiProperty({ example: 'shipped', description: 'Novo status do pedido' })
  @IsString()
  @IsNotEmpty()
  status: string;
}
