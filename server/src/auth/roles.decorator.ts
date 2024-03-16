import { SetMetadata } from '@nestjs/common';
import { URoles } from 'src/users/users.schema';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: URoles[]) => SetMetadata(ROLES_KEY, roles);
