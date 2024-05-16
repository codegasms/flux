import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { SendMailDto } from './dto/send-mail.dto';
import { appConfig } from 'src/config';
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Processor('mailer')
export class MailProcessor extends WorkerHost {
  async process(
    job: Job<SendMailDto, SMTPTransport.SentMessageInfo, string>,
  ): Promise<any> {
    console.log('executing ', job.name);
    const transporter = nodemailer.createTransport({
      host: appConfig.mailer.host,
      port: 587,
      secure: false,
      auth: {
        user: appConfig.mailer.senderEmail,
        pass: appConfig.mailer.passwd,
      },
    });
    return await transporter.sendMail({
      from: appConfig.mailer.senderEmail,
      to: job.data.recipients,
      subject: job.data.subject,
      text: job.data.text,
      html: job.data.html,
    });
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log('mail sent succesfully ', job.name, '\n', job.returnvalue);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job) {
    console.log('failed to send mail ', job.name, '\n', job.returnvalue);
  }
}
