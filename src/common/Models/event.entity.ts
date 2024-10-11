import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { User } from './user.entity';

@Schema()
export class Events extends Document {
  @Prop({
    type: String,
    required: true,
  })
  title: string;

  @Prop({
    type: String,
  })
  notes: string;

  @Prop({
    type: Date,
    required: true,
  })
  start: Date;

  @Prop({
    type: Date,
    required: true,
  })
  end: Date;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: User.name,
    required: true,
  })
  user: string;
}

export const EventSchema = SchemaFactory.createForClass(Events);
