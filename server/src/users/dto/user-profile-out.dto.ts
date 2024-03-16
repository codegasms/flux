import { PartialType } from '@nestjs/swagger';
import { UpdateUserProfileDto } from './update-user-profile.dto';

export class UserProfileOutDto extends PartialType(UpdateUserProfileDto) {}
