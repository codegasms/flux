import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { ApiBearerAuth, ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { UserProfileOutDto } from './dto/user-profile-out.dto';
import { URoles } from './users.schema';
import { Roles } from 'src/auth/roles.decorator';
import { UserAccountOutDto } from './dto/user-account-out.dto';
import { UpdateUserAccountDto } from './dto/update-user-account.dto';

@ApiCookieAuth()
@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Roles(URoles.superuser, URoles.admin)
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<UserAccountOutDto> {
    return this.service.create(createUserDto);
  }

  @Roles(URoles.superuser, URoles.admin)
  @Get()
  findAll(): Promise<UserAccountOutDto[]> {
    return this.service.findAll();
  }

  @Roles(URoles.superuser, URoles.admin, URoles.premium)
  @Get(':email')
  findOne(@Param('email') email: string): Promise<UserAccountOutDto> {
    return this.service.findOneByEmail(email);
  }

  @Roles(URoles.superuser, URoles.admin)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserAccountDto,
  ): Promise<UserProfileOutDto> {
    return this.service.updateProfile(id, updateUserDto);
  }

  @Roles(URoles.superuser, URoles.admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
