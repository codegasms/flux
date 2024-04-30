import { Injectable } from '@nestjs/common';
import pug from 'pug';

import nodemailer from 'nodemailer';
import { appConfig } from 'src/config';
import { SendMailDto } from './dto/send-mail.dto';
import { SendTemplateDto } from './dto/send-template.dto';
import path from 'path';

@Injectable()
export class MailerService {
  transporter: any;
  templatesDir: string;

  constructor() {
    console.log(appConfig);
    this.templatesDir = 'src/mailer/templates/';
    this.transporter = nodemailer.createTransport({
      host: appConfig.mailer.host,
      port: 587,
      secure: false,
      auth: {
        user: appConfig.mailer.senderEmail,
        pass: appConfig.mailer.passwd,
      },
    });
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
    const info = await this.transporter.sendMail({
      from: appConfig.mailer.senderEmail,
      to: sendMailDto.recipients,
      subject: sendMailDto.subject,
      text: sendMailDto.text,
      html: sendMailDto.html,
    });

    return info;
  }
}
