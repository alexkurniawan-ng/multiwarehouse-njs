import { BadRequestException } from '@nestjs/common';

export class AppBadRequestException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}
