import { Controller, Get, Body, Patch, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { ApiBearerAuth, ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { UserProfileOutDto } from './dto/user-profile-out.dto';
import { UserAccountOutDto } from './dto/user-account-out.dto';
import { StorageSpaceDto } from './dto/storage-space.dto';
import { Roles } from 'src/auth/roles.decorator';
import { URoles } from './users.schema';
import { AuthorizedRequest } from 'src/auth/entities/authorized-request.entity';

@ApiCookieAuth()
@ApiBearerAuth()
@ApiTags('self')
@Controller('self')
export class SelfController {
  constructor(private readonly service: UsersService) {}

  @Get('profile')
  async findProfile(@Req() req: AuthorizedRequest): Promise<UserProfileOutDto> {
    console.log('get profile');
    console.log(req.perms._id);
    return await this.service.findProfile(req.perms._id);
  }

  @Get('storage')
  async findStorage(@Req() req: AuthorizedRequest): Promise<StorageSpaceDto> {
    return await this.service.findStorageSpace(req.perms._id);
  }

  @Roles(URoles.superuser, URoles.admin, URoles.premium)
  @Patch('profile')
  async updateProfile(
    @Req() req: AuthorizedRequest,
    @Body() updateProfileDto: UpdateUserProfileDto,
  ): Promise<UserProfileOutDto> {
    return await this.service.updateProfile(req.perms['id'], updateProfileDto);
  }

  @Get('account')
  async getAccount(@Req() req: AuthorizedRequest): Promise<UserAccountOutDto> {
    return await this.service.findAccount(req.perms._id);
  }
}
