import { Request } from 'express';
import { UserPermsOutDto } from 'src/users/dto/user-perms-out.dto';

export class AuthorizedRequest extends Request {
  perms: UserPermsOutDto;
}
