import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';

import { Strategy } from 'passport-jwt';
import { Model } from 'mongoose';

import { User } from '../Models/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {
    super();
  }

  async validate(payload: JwtPayload) {
    const { email } = payload;

    const user = await this.userModel.findOne({ email }).lean();

    if (!user) {
      throw new UnauthorizedException('Token not valid');
    }

    delete user.password;

    return { ...user };
  }
}
