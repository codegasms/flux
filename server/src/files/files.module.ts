import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { MulterModule } from '@nestjs/platform-express';
import { fileStorageRootDir } from './constants';
import { MongooseModule } from '@nestjs/mongoose';
import { FileObject, FileObjectSchema } from './files.schema';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [
    MongooseModule.forFeature([
      { name: FileObject.name, schema: FileObjectSchema },
    ]),
    MulterModule.register({
      dest: fileStorageRootDir,
    }),
  ],
})
export class FilesModule {}
