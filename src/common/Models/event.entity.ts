import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Event extends Document {
  @Prop({
    unique: true,
    index: true,
  })
  title: string;

  @Prop({
    unique: true,
    index: true,
  })
  description: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);
