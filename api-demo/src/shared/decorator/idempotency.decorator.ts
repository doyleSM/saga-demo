import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const IdempotencyKey = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    ctx.switchToHttp().getRequest().headers['idempotency-key'],
);
