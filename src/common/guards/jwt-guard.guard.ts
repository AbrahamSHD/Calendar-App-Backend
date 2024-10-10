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

    // Aplicar el pipe para validar y extraer el token limpio
    const validToken = new BearerTokenValidationPipe().transform(token);

    try {
      // Verificar el token usando JwtService
      const decoded = this.jwtService.verify(validToken);
      request.user = decoded; // Almacena los datos del token (como user ID) en la request
      return true; // Permite el acceso si el token es válido
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
