import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateAddressRequestDto } from 'src/dtos/create-address.request.dto';
import { ForgotPasswordRequestDto } from 'src/dtos/forgot-password.request.dto';
import { RegisterRequestDto } from 'src/dtos/register.request.dto';
import { UserChangedPasswordEvent } from 'src/events/user-changed-password-event';
import { UserAddressCreatedEvent } from 'src/events/user-address-created-event';
import { UserCreatedEvent } from 'src/events/user-created-event';
import { UserGetAddressEvent } from 'src/events/user-get-address-event';
import { GetAddressRequestDto } from 'src/dtos/get-address.request.dto';
import { ChangeAddressRequestDto } from 'src/dtos/change-address.request.dto';
import { UserAddressChangedEvent } from 'src/events/user-address-changed-event';
import { DeleteAddressRequestDto } from 'src/dtos/delete-address.request.dto';
import { UserAddressDeletedEvent } from 'src/events/user-address-deleted-event';
import { SetPrimaryAddressRequestDto } from 'src/dtos/set-primary-address.request.dto';
import { UserPrimaryAddressEvent } from 'src/events/user-primary-address-event';

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

  async getAddress(body: GetAddressRequestDto) {
    return this.userClient.emit(
      'get_user_address_request',
      new UserGetAddressEvent(body),
    );
  }

  async createAddress(body: CreateAddressRequestDto) {
    return this.userClient.emit(
      'user_address_created_request',
      new UserAddressCreatedEvent(body),
    );
  }

  async changeAddress(body: ChangeAddressRequestDto) {
    return this.userClient.emit(
      'user_address_changed_request',
      new UserAddressChangedEvent(body),
    );
  }

  async deleteAddress(body: DeleteAddressRequestDto) {
    return this.userClient.emit(
      'user_address_deleted_request',
      new UserAddressDeletedEvent(body),
    );
  }

  async setPrimaryAddress(body: SetPrimaryAddressRequestDto) {
    return this.userClient.emit(
      'user_address_primary_request',
      new UserPrimaryAddressEvent(body),
    );
  }
}
