import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Staff } from 'src/staff/entities/entity.staff';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Staff => {
    const request = ctx.switchToHttp().getRequest<{ user: Staff }>();
    return request.user;
  },
);
