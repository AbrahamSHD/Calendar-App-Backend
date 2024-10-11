import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BearerTokenValidationPipe } from '../pipes/Bearer-token.pipe';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'];

    if (!token) {
      throw new UnauthorizedException('Authorization token is missing');
    }

    const validToken = new BearerTokenValidationPipe().transform(token);

    try {
      const decoded = this.jwtService.verify(validToken);
      request.user = decoded;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
