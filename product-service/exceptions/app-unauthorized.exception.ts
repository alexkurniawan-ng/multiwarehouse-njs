import { UnauthorizedException } from '@nestjs/common';

export class AppUnauthorizedException extends UnauthorizedException {
  constructor(message: string) {
    super(message);
  }
}
