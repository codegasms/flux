import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

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
  virtualPath: string;
  // full path to file in user's drive
  // example: /Projects/Node/hello.js

  @Prop({ required: true, default: false })
  isDirectory: boolean;

  @Prop({
    required: true,
    index: true,
  })
  owner: string;

  @Prop({ required: true })
  created: Date;

  @Prop({ required: true })
  lastEdited: Date;

  @Prop({
    required: true,
    enum: FileVisibility,
    default: FileVisibility.private,
  })
  visibility: string;

  @Prop({ required: true, default: [] })
  viewers: string[];

  @Prop({ required: true, default: [] })
  editors: string[];

  @Prop({ required: true })
  mimeType: string;

  @Prop({ required: true })
  size: number;
}

export type FileObjectDocument = HydratedDocument<FileObject>;
export const FileObjectSchema = SchemaFactory.createForClass(FileObject);
