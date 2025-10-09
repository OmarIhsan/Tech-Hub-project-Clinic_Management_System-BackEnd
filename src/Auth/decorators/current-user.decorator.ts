/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Staff } from 'src/staff/entities/entity.staff';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Staff => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
