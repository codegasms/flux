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
import { ApiBearerAuth, ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { SingInDto as LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { Public } from './public.decorator';
import { UserPermsOutDto } from 'src/users/dto/user-perms-out.dto';
import { Response } from 'express';
import { AuthorizedRequest } from './entities/authorized-request.entity';
import { Throttle } from '@nestjs/throttler';
import { appConfig } from 'src/config';

@Throttle({ default: { limit: 2, ttl: 60000 } })
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
    res.cookie('accessToken', token.access_token, {
      sameSite: 'none',
      domain: appConfig.frontendDomain,
    });
    return token;
  }

  @Public()
  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<RegisterResponseDto> {
    const token = await this.service.register(registerDto);
    res.cookie('accessToken', token.access_token, {
      sameSite: 'none',
      domain: appConfig.frontendDomain,
    });
    return token;
  }

  @ApiCookieAuth()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('perms')
  async getPerms(@Request() req: AuthorizedRequest): Promise<UserPermsOutDto> {
    return req.perms;
  }
}
