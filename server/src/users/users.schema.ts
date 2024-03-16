import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserProfile as UserProfileEntity } from './entities/user-profile.entity';

@Schema()
export class UserProfile extends UserProfileEntity {}

export enum URoles {
  superuser = 'superuser',
  admin = 'admin',
  premium = 'premium',
  free = 'free',
}

@Schema()
export class User {
  @Prop({ required: true, index: true, unique: true })
  email: string;

  @Prop({ required: true })
  hashedPassword: string;

  @Prop({
    required: true,
    enum: URoles,
    default: URoles.free,
  })
  role: string;

  @Prop()
  profile: UserProfile;

  @Prop()
  joined: Date;

  @Prop()
  lastLogin: Date;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
