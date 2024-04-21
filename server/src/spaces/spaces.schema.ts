import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { FileVisibility } from './entities/file-visibility.enum';
import { dayInfinity } from './constants';

@Schema()
export class FileObject {
  _id: any;
  @Prop({
    required: true,
    index: true,
  })
  spaceParent: string;
  // full path to file/dir's parent directory in user's space
  // example: /Projects/Node

  @Prop({ required: true, index: true, default: '' })
  fileName: string;
  // name of the file/dir in user's space
  // example: hello.js

  @Prop({ required: true, default: false })
  isDir: boolean;
  // states whether this file represents a directory in user's space
  // if this file object is a directory, then we dont have any corresponding file in our server disk
  // for regular files, we have corresponding file in our server's disk with same name as the id of this file document in mongo db

  @Prop({
    required: true,
    index: true,
  })
  owner: string;

  @Prop({ required: true })
  created: Date;

  @Prop()
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

  @Prop({ required: true, default: [] })
  managers: string[];

  @Prop()
  mimeType: string;

  @Prop()
  size: number;

  @Prop({ required: true, default: false })
  inTrash: boolean;
  // when a user deletes a file, we perform a soft delete by setting inTrash=true, and we do not delete the file from our server's disk
  // the user can restore files from their trash or delete them permanently

  @Prop({ required: true, default: dayInfinity })
  trashedOn: Date;
}

@Schema()
export class SpaceQuotas {
  @Prop({ required: true, index: true, unique: true })
  quotaID: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  summary: string;

  @Prop({ required: true })
  spaceGBs: number;

  @Prop({ required: true })
  pricePerMo: number;
}

export type FileObjectDocument = HydratedDocument<FileObject>;
export const FileObjectSchema = SchemaFactory.createForClass(FileObject);

export type SpaceQuotasDocument = HydratedDocument<SpaceQuotas>;
export const SpaceQuotasSchema = SchemaFactory.createForClass(SpaceQuotas);
