import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ForgotPasswordRequestDto } from 'src/dtos/forgot-password.request.dto';
import { RegisterRequestDto } from 'src/dtos/register.request.dto';
import { UserChangedPasswordEvent } from 'src/events/user-changed-password-event';
import { UserCreatedEvent } from 'src/events/user-created-event';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientKafka,
  ) {}

  async register(body: RegisterRequestDto) {
    return this.userClient.emit(
      'user_created_request',
      new UserCreatedEvent(body),
    );
  }

  async forgotPassword(body: ForgotPasswordRequestDto) {
    return this.userClient.emit(
      'user_forgot_password_request',
      new UserChangedPasswordEvent(body),
    );
  }
}
