import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  Res,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { ApiCookieAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { SingInDto as LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { Public } from './public.decorator';
import { UserPermsOutDto } from 'src/users/dto/user-perms-out.dto';
import { Response } from 'express';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Public()
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.service.login(loginDto.email, loginDto.password);
    res.cookie('accessToken', token.access_token);
    return token;
  }

  @Public()
  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<RegisterResponseDto> {
    const token = await this.service.register(registerDto);
    res.cookie('accessToken', token.access_token);
    return token;
  }

  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Get('permissions')
  async getPermissions(@Request() req): Promise<UserPermsOutDto> {
    return req.permissions;
  }
}
