import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
// import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  create(createAuthDto: CreateAuthDto) {
    try {
      return {
        ok: true,
        msg: 'new',
        ...createAuthDto,
      };
    } catch (error) {
      console.log(error);
    }
  }

  login(createAuthDto: CreateAuthDto) {
    try {
      return {
        ok: true,
        msg: 'login',
        ...createAuthDto,
      };
    } catch (error) {
      console.log(error);
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
