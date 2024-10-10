import {
  BadRequestException,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

const logger = new Logger('HandleExceptions');

export class ExceptionHandler {
  static handle(error: any) {
    logger.error(error);

    if (error.name === 'TokenExpiredError') {
      throw new UnauthorizedException('Token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new UnauthorizedException('Invalid token');
    }

    // Manejo de errores específicos de eventos
    if (error instanceof NotFoundException) {
      throw new NotFoundException(error.message);
    }

    // Manejo de excepciones de base de datos
    if (error.code === 11000) {
      throw new BadRequestException(
        `User exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }

    // Manejo de otros códigos de estado HTTP
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

    // Manejo de errores generales
    throw new InternalServerErrorException('Check server logs');
  }
}
