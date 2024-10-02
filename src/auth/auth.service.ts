import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

import { Model } from 'mongoose';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/common/Models/user.entity';
import { BcryptAdapter } from 'src/common/config/bcrypt.adapter';
import { JwtPayload } from 'src/common/interfaces/jwt-payload';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');
  private readonly bcrypt = new BcryptAdapter();

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  private handleExceptions(error: any) {
    this.logger.error(error);

    if (error.code === 11000) {
      throw new BadRequestException(
        `User exist in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    if (error.status === 401) {
      throw new UnauthorizedException(error.message);
    }
    if (error.status === 409) {
      throw new ConflictException(error.message);
    }
    if (error.status === 400) {
      throw new BadRequestException(error.message);
    }
    if (error.code === 500) {
      throw new InternalServerErrorException(error.message);
    }
    throw new InternalServerErrorException(`Check server logs`);
  }

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

    this.findOneByEmail(email);

    createUserDto.name = name.toLowerCase();
    this.trimStrings(createUserDto);

    const passHashed = this.bcrypt.hash(password);

    try {
      const user = await this.userModel.create({
        name,
        email,
        password: passHashed,
      });

      delete user.password;

      const token = this.getJwtToken({ email });

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
      this.handleExceptions(error);
    }
  }

  async findOneByEmail(email: string) {
    const user = await this.userModel.findOne({ email });

    if (user) {
      throw new ConflictException({
        statusCode: 409,
        message: {
          message: 'El usuario ya existe',
          details: 'Prueba con otro correo electrónico.',
        },
        error: 'Conflict',
      });
    }
    return;
  }

  async login(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;
    const user = await this.userModel.findOne({ email });

    try {
      if (!user) {
        throw new BadRequestException(`User with email ${email} not found`);
      }

      const isPasswordValid = this.bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Email/Password not valid');
      }

      const token = this.getJwtToken({ email });

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
      this.handleExceptions(error);
    }
  }

  renew() {
    try {
      return {
        ok: true,
        msg: 'renew',
      };
    } catch (error) {
      console.log(error);
    }
  }
}
