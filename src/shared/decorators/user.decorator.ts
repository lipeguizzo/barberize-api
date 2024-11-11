import { createParamDecorator } from '@nestjs/common';
import { UserRequest } from '../types/user-request';

export const User = createParamDecorator((_data, context) => {
  const request = context.switchToHttp().getRequest();
  const user: UserRequest = request.user;
  return user;
});
