import { Module } from '@nestjs/common';
import { ModsService } from './mods.service';
import { ModsController } from './mods.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ModTokenPlans,
  ModTokenPlansSchema,
  Mods,
  ModsSchema,
} from './mods.schema';

@Module({
  controllers: [ModsController],
  providers: [ModsService],
  imports: [
    MongooseModule.forFeature([
      { name: Mods.name, schema: ModsSchema },
      { name: ModTokenPlans.name, schema: ModTokenPlansSchema },
    ]),
  ],
})
export class ModsModule {}
