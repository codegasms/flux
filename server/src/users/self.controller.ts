import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserProfileOutDto } from './dto/user-profile-out.dto';
import { UserAccountOutDto } from './dto/user-account-out.dto';

@ApiBearerAuth()
@ApiTags('self')
@Controller('self')
export class SelfController {
  constructor(private readonly service: UsersService) {}

  @Get('profile')
  async findProfile(@Request() req): Promise<UserProfileOutDto> {
    return await this.service.findProfile(req.permissions['id']);
  }

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

  @Put('email')
  async updateEmail(@Request() req) {
    //   TODO: verify email, and update
  }

  @Put('username')
  async updateUsername(@Request() req) {
    // TODO: update self username
  }
}
