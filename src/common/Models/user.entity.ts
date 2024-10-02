import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({
    unique: false,
    index: true,
  })
  name: string;

  @Prop({
    unique: true,
    index: true,
  })
  email: string;

  @Prop({
    unique: false,
    index: true,
  })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
