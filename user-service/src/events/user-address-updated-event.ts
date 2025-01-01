import { UpdateAddressRequestDto } from 'src/dtos/update-address.request.dto';

export class UserAddressUpdatedEvent {
  constructor(public readonly data: UpdateAddressRequestDto) {}

  toString(): string {
    return JSON.stringify({
      id: this.data.id,
      street: this.data.street,
      city: this.data.city,
      province: this.data.province,
      postalCode: this.data.postalCode,
      lat: this.data.lat,
      lng: this.data.lng,
    });
  }
}
