import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

import { Model } from 'mongoose';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../common/Models/user.entity';
import { BcryptAdapter } from '../common/config/bcrypt.adapter';
import { JwtPayload } from '../common/interfaces/jwt-payload';
import { LoginUserDto } from './dto/login-user.dto';
import { ExceptionHandler } from '../common/helpers/handle.exceptions';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');
  private readonly bcrypt = new BcryptAdapter();

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  private getJwtToken(payload: JwtPayload) {
    try {
      const token = this.jwtService.sign(payload);
      return token;
    } catch (error) {
      this.logger.error('Error generating JWT: ', error);
      throw new BadRequestException('Could not generate JWT');
    }
  }

  private trimStrings(obj: any) {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key].trim();
      }
    }
  }

  async create(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;

    createUserDto.name = name.toLowerCase();
    this.trimStrings(createUserDto);

    try {
      const findUser = await this.userModel.findOne({ email });

      if (findUser) {
        throw new ConflictException(
          `User with Email ${findUser.email} already exist`,
        );
      }

      const passHashed = this.bcrypt.hash(password);
      const user = await this.userModel.create({
        name,
        email,
        password: passHashed,
      });

      delete user.password;

      const token = this.getJwtToken({ name, email });

      return {
        ok: true,
        msg: 'new',
        token,
        user: {
          name,
          email,
        },
      };
    } catch (error) {
      ExceptionHandler.handle(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { name, email, password } = loginUserDto;
    const user = await this.userModel.findOne({ email });

    try {
      if (!user) {
        throw new BadRequestException(`User with email ${email} not found`);
      }

      const isPasswordValid = this.bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Email/Password not valid');
      }

      const token = this.getJwtToken({ name, email });

      const userData = {
        name,
        email,
        password,
      };

      delete userData.password;

      return {
        ok: true,
        msg: 'login',
        token,
        user: { ...userData },
      };
    } catch (error) {
      ExceptionHandler.handle(error);
    }
  }

  async validateToken(token: string) {
    try {
      const { name, email } = this.jwtService.verify(token);

      const getToken = this.getJwtToken({ name, email });

      return {
        ok: true,
        email: email,
        token: getToken,
      };
    } catch (error) {
      ExceptionHandler.handle(error);
    }
  }
}
