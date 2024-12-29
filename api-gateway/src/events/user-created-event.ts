import { RegisterRequestDto } from 'src/dtos/register.request.dto';

export class UserCreatedEvent {
  constructor(public readonly data: RegisterRequestDto) {}

  toString(): string {
    return JSON.stringify({
      email: this.data.email,
      fullName: this.data.fullName,
    });
  }
}
