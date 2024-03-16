import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SingInDto } from './dto/sign-in.dto';
import { RegisterDto } from './dto/register.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { Public } from './public.decorator';
import { UserPermsOutDto } from 'src/users/dto/user-perms-out.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() signInDto: SingInDto) {
    return this.service.login(signInDto.username, signInDto.password);
  }

  @Public()
  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<RegisterResponseDto> {
    return await this.service.register(registerDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('permissions')
  async getPermissions(@Request() req): Promise<UserPermsOutDto> {
    return req.permissions;
  }
}
