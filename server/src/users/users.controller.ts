import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/public.decorator';
import { UserProfileOutDto } from './dto/user-profile-out.dto';
import { Roles } from 'src/auth/roles.decorator';
import { URoles } from 'src/users/users.schema';



@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post()
  @Roles(URoles.lead, URoles.colead)
  create(@Body() createUserDto: CreateUserDto) {
    return this.service.create(createUserDto);
  }

  @Get()
  @Roles(URoles.lead, URoles.colead, URoles.domain_lead)
  findAll() {
    return this.service.findAll();
  }

  @Public()
  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.service.findOneByUsername(username);
  }

  @Patch(':id')
  @Roles(URoles.lead, URoles.colead)
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserProfileDto,
  ): Promise<UserProfileOutDto> {
    return this.service.updateProfile(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(URoles.lead, URoles.colead)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
