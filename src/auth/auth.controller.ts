import { Controller, Post, Body, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/new')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('/login')
  login(@Body() createUserDto: CreateUserDto) {
    return this.authService.login(createUserDto);
  }

  @Post('/renew')
  renew(@Headers('Authorization') authorization: string) {
    const token = authorization.replace('Bearer ', '');
    return this.authService.validateToken(token);
  }
}
