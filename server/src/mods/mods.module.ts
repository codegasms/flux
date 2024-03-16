import { Module } from '@nestjs/common';
import { ModsService } from './mods.service';
import { ModsController } from './mods.controller';

@Module({
  controllers: [ModsController],
  providers: [ModsService],
})
export class ModsModule {}
