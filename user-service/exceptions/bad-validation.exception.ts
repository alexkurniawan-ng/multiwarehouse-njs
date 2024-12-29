import { BadRequestException, ValidationError } from '@nestjs/common';

export class BadValidationException extends BadRequestException {
  errors: string[];

  constructor(errors: ValidationError[]) {
    super(errors);
    this.errors = this.formatErrors(errors);
    this.message = this.errors.at(0);
  }

  private formatErrors(errors: ValidationError[]): string[] {
    return errors.flatMap((error) => this.extractErrorMessages(error));
  }

  private extractErrorMessages(error: ValidationError): string[] {
    if (error.children && error.children.length > 0)
      return error.children.flatMap((child) =>
        this.extractErrorMessages(child),
      );
    return Object.values(error.constraints || {});
  }
}
