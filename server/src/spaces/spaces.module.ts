import { Module } from '@nestjs/common';
import { SpacesService } from './spaces.service';
import { SpacesController } from './spaces.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  FileObject,
  FileObjectSchema,
  SpaceQuotas,
  SpaceQuotasSchema,
} from './spaces.schema';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: FileObject.name, schema: FileObjectSchema },
      { name: SpaceQuotas.name, schema: SpaceQuotasSchema },
    ]),
  ],
  controllers: [SpacesController],
  providers: [SpacesService],
})
export class SpacesModule {}
