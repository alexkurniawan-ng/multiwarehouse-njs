import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateAddressRequestDto } from 'src/dtos/create-address.request.dto';
import { ForgotPasswordRequestDto } from 'src/dtos/forgot-password.request.dto';
import { RegisterRequestDto } from 'src/dtos/register.request.dto';
import { UserChangedPasswordEvent } from 'src/events/user-changed-password-event';
import { UserAddressCreatedEvent } from 'src/events/user-address-created-event';
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

  async createAddress(body: CreateAddressRequestDto) {
    return this.userClient.emit(
      'user_address_created_request',
      new UserAddressCreatedEvent(body),
    );
  }
}
