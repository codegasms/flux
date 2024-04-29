import { Controller, Post, Body } from '@nestjs/common';
import { MailerService } from './mailer.service';

import { Roles } from 'src/auth/roles.decorator';
import { SendMailDto } from './dto/send-mail.dto';
import { URoles } from 'src/users/users.schema';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

@ApiCookieAuth()
@ApiTags('mailer')
@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Roles(URoles.superuser, URoles.admin)
  @Post('send')
  sendMail(@Body() sendMailDto: SendMailDto) {
    return this.mailerService.sendMail(sendMailDto);
  }
}
