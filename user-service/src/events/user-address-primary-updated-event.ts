import { SetPrimaryAddressRequestDto } from 'src/dtos/set-primary-address.request.dto';

export class UserAddressPrimaryUpdatedEvent {
  constructor(public readonly data: SetPrimaryAddressRequestDto) {}

  toString(): string {
    return JSON.stringify({
      addressId: this.data.addressId,
      userId: this.data.userId,
      isDefault: this.data.isDefault,
    });
  }
}
