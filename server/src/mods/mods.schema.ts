import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ModTypes } from './entities/mod-types.enum';

@Schema()
export class Mods {
  @Prop({
    required: true,
    index: true,
    unique: true,
    enum: ModTypes,
  })
  modID: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  tags: string[];

  @Prop()
  approxTokens: number;

  @Prop({ default: true })
  enabled: true;
}

@Schema()
export class ModTokenPlans {
  @Prop({ required: true, index: true, unique: true })
  planID: string;
  // a unique short slug/identifier for this plan

  @Prop()
  icon: string;
  // url for plan icon

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  tokenCountPerMo: number;
  // no of tokens you receive per month, when you are subscribed to this plan

  @Prop({ required: true })
  pricePerMo: number;
  // price per mo in INR
}

export type ModsDocument = HydratedDocument<Mods>;
export const ModsSchema = SchemaFactory.createForClass(Mods);

export type ModTokenPlansDocument = HydratedDocument<ModTokenPlans>;
export const ModTokenPlansSchema = SchemaFactory.createForClass(ModTokenPlans);
