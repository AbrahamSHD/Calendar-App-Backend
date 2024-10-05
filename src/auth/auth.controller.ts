import { Controller, Post, Body, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { BearerTokenValidationPipe } from 'src/common/pipes/Bearer-token.pipe';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/new')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('/login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('/renew')
  renew(
    @Headers('authorization') token: string, // Extraemos el token del header
  ) {
    // Aplicamos manualmente el BearerTokenValidationPipe
    const validToken = new BearerTokenValidationPipe().transform(token);

    return this.authService.validateToken(validToken);
  }
}
