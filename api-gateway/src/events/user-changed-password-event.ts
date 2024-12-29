import { ForgotPasswordRequestDto } from 'src/dtos/forgot-password.request.dto';

export class UserChangedPasswordEvent {
  constructor(public readonly data: ForgotPasswordRequestDto) {}

  toString(): string {
    return JSON.stringify({
      email: this.data.email,
    });
  }
}
