import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    // console.log('request is: ', request.session.userId);
    // return 'hi there!';
    return request.currentUser;
  },
);
