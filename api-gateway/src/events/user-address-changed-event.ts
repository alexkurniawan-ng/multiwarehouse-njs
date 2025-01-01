import { ChangeAddressRequestDto } from 'src/dtos/change-address.request.dto';

export class UserAddressChangedEvent {
  constructor(public readonly data: ChangeAddressRequestDto) {}

  toString(): string {
    return JSON.stringify({
      id: this.data.id,
      street: this.data.street,
      city: this.data.city,
      province: this.data.province,
      postalCode: this.data.postalCode,
    });
  }
}
