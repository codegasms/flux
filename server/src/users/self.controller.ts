import { Controller, Get, Body, Patch, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { UserProfileOutDto } from './dto/user-profile-out.dto';
import { UserAccountOutDto } from './dto/user-account-out.dto';
import { StorageSpaceDto } from './dto/storage-space.dto';
import { Roles } from 'src/auth/roles.decorator';
import { URoles } from './users.schema';

@ApiCookieAuth()
@ApiTags('self')
@Controller('self')
export class SelfController {
  constructor(private readonly service: UsersService) {}

  @Get('profile')
  async findProfile(@Request() req): Promise<UserProfileOutDto> {
    return await this.service.findProfile(req.permissions['id']);
  }

  @Get('storage')
  async findStorage(@Request() req): Promise<StorageSpaceDto> {
    return await this.service.findStorageSpace(req.permissions['id']);
  }

  @Roles(URoles.superuser, URoles.admin, URoles.premium)
  @Patch('profile')
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateUserProfileDto,
  ): Promise<UserProfileOutDto> {
    return await this.service.updateProfile(
      req.permissions['id'],
      updateProfileDto,
    );
  }

  @Get('account')
  async getAccount(@Request() req): Promise<UserAccountOutDto> {
    return await this.service.findAccount(req.permissions['id']);
  }
}
