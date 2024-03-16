import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { FileMeta as FileMetaEntity } from './entities/file-meta.entity';

@Schema()
export class FileMeta extends FileMetaEntity {}

enum FileVisibility {
  public = 'public',
  shared = 'shared',
  private = 'private',
}

@Schema()
export class FileObject {
  @Prop({
    required: true,
    index: true,
    unique: true,
  })
  fileName: string;
  // full path to file in user's drive
  // example: /Projects/Node/hello.js

  @Prop()
  purpose: string;

  @Prop({
    required: true,
    index: true,
  })
  owner: string;

  @Prop({ required: true })
  created: Date;

  @Prop({ required: true })
  lastEdited: Date;

  @Prop({ required: true, default: false, enum: FileVisibility })
  visibility: string;

  @Prop({ required: true, default: [] })
  viewers: string[];

  @Prop({ required: true, default: [] })
  editors: string[];

  @Prop({ required: true })
  meta: FileMeta;
}

export type FileObjectDocument = HydratedDocument<FileObject>;
export const FileObjectSchema = SchemaFactory.createForClass(FileObject);
