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
import { SpacesModule } from '../spaces/spaces.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [ModsController],
  providers: [ModsService],
  imports: [
    SpacesModule,
    UsersModule,
    MongooseModule.forFeature([
      { name: Mods.name, schema: ModsSchema },
      { name: ModTokenPlans.name, schema: ModTokenPlansSchema },
    ]),
  ],
})
export class ModsModule {}
