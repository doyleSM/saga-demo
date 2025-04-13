import { IsUUID } from 'class-validator';

export class IdempotencyKeyDto {
  @IsUUID('all', { message: 'Idempotency-Key deve ser um UUID válido' })
  idempotencyKey: string;
}
