import { NotFoundException } from '@nestjs/common';

export class AppNotFoundException extends NotFoundException {
  constructor(message: string) {
    super(message);
  }
}
