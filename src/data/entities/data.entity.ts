import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IotDataDocument = IotData & Document;

@Schema({ timestamps: true })
export class DataPoint {
  @Prop({ required: true })
  time: number;

  @Prop({ type: [Number], required: true })
  values: number[];
}

export const DataPointSchema = SchemaFactory.createForClass(DataPoint);

@Schema({ timestamps: true })
export class IotData {
  @Prop({ required: true })
  deviceId: string;

  @Prop({ type: [DataPointSchema], default: [] })
  data: DataPoint[];

  @Prop({ required: true })
  dataLength: number;

  @Prop({ required: true })
  dataVolume: number;

  @Prop({ required: true })
  time: number;
}

export const IotDataSchema = SchemaFactory.createForClass(IotData);
