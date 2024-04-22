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
  fullName: string;

  // @Prop({ required: false })
  // connectedOAuthProviders: OAuthProviders;

  @Prop()
  googleId: string;

  @Prop()
  githubId: string;

  @Prop({ required: false })
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

  @Prop({ required: true, default: true })
  isActive: boolean;
  // if a user deletes their account we will perform  a soft delete by setting isActive=false
  // after 30 days, all inactive accounts will automatically be deleted
  // during these 30 day of safety-net period a user will be able to recover their account by contacting a system admin
  @Prop({ required: false })
  emailConfirmedAt: Date;

  @Prop({ required: true, default: 0 })
  storageUsed: number;

  @Prop({ required: true, default: 0 })
  spacesQuota: string;
  // quota id(mongo db id) of the quota currently subscribed;
  @Prop({ required: true, default: 0 })
  modTokensRemaining: number;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
