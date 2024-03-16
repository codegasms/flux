import { SetMetadata, applyDecorators } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

const SetPublicRoute = SetMetadata(IS_PUBLIC_KEY, true);
const SetSwaggerNoLock = SetMetadata('swagger/apiSecurity', ['public']);

export const Public = () => applyDecorators(SetPublicRoute, SetSwaggerNoLock);

/*
Usage: use decorator @Public() on top of any route/controller to make that accessible without auth
*/
