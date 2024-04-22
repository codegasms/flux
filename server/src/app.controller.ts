import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/public.decorator';
import { GetStatusDto } from './dto/get-status.dto';
import { ApiCookieAuth } from '@nestjs/swagger';

@ApiCookieAuth()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getStatus(): GetStatusDto {
    return this.appService.getStatus();
  }
}
