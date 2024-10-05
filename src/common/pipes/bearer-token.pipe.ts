import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class BearerTokenValidationPipe implements PipeTransform {
  transform(value: string) {
    if (typeof value !== 'string' || !value.startsWith('Bearer ')) {
      throw new BadRequestException(
        'Invalid token format. Token must start with "Bearer ".',
      );
    }

    return value.replace('Bearer ', '');
  }
}
