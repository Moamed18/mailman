import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const GetStaff = createParamDecorator(
  (_data: any, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
