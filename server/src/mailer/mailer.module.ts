import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerController } from './mailer.controller';
import { BullModule } from '@nestjs/bullmq';
import { MailProcessor } from './mail.processor';
import { appConfig } from 'src/config';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: appConfig.redis.host,
        port: appConfig.redis.port,
      },
    }),
    BullModule.registerQueue({
      name: 'mailer',
    }),
  ],
  controllers: [MailerController],
  providers: [MailProcessor, MailerService],
  exports: [MailerService],
})
export class MailerModule {}
