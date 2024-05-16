import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import pug from 'pug';

import { appConfig } from 'src/config';
import { SendMailDto } from './dto/send-mail.dto';
import { SendTemplateDto } from './dto/send-template.dto';
import path from 'path';

@Injectable()
export class MailerService {
  transporter: any;
  templatesDir: string;

  constructor(@InjectQueue('mailer') private mailerQueue: Queue) {
    console.log(appConfig);
    this.templatesDir = 'src/mailer/templates/';
  }

  compileFile(file: string) {
    return pug.compileFile(path.join(this.templatesDir, file));
  }

  async sendTemplateMail(sendTemplateDto: SendTemplateDto) {
    const compileRegister = this.compileFile('register.pug');
    const compileLogin = this.compileFile('login.pug');

    switch (sendTemplateDto.templateType) {
      case 'register':
        sendTemplateDto.html = compileRegister({
          USERNAME: sendTemplateDto.username,
        });
        break;
      case 'login':
        sendTemplateDto.html = compileLogin({
          USERNAME: sendTemplateDto.username,
        });
        break;
      default:
        throw new Error('Invalid template type');
    }

    return await this.sendMail({
      recipients: sendTemplateDto.recipients,
      subject: sendTemplateDto.subject,
      text: sendTemplateDto.text,
      html: sendTemplateDto.html,
    });
  }

  async sendMail(sendMailDto: SendMailDto) {
    const job = await this.mailerQueue.add(
      `${Date.now()}-${sendMailDto.recipients}-${sendMailDto.subject}`,
      sendMailDto,
    );

    return job;
  }
}
