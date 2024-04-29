import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';

@Module({
  controllers: [BillingController],
  providers: [BillingService],
})
export class BillingModule {}
