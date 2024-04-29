import { Injectable } from '@nestjs/common';

import nodemailer from 'nodemailer';
import { appConfig } from 'src/config';
import { SendMailDto } from './dto/send-mail.dto';

@Injectable()
export class MailerService {
  transporter: any;
  constructor() {
    console.log(appConfig);
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
