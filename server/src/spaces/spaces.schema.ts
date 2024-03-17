import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

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

export type SpaceQuotasDocument = HydratedDocument<SpaceQuotas>;
export const SpaceQuotasSchema = SchemaFactory.createForClass(SpaceQuotas);
