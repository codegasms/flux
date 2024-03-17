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

@Module({
  controllers: [SpacesController],
  providers: [SpacesService],
  imports: [
    MongooseModule.forFeature([
      { name: FileObject.name, schema: FileObjectSchema },
      { name: SpaceQuotas.name, schema: SpaceQuotasSchema },
    ]),
  ],
})
export class SpacesModule {}
