import { last } from 'rxjs';
import { CreateAddressRequestDto } from 'src/dtos/create-address.request.dto';

export class UserAddressCreatedEvent {
  constructor(public readonly data: CreateAddressRequestDto) {}

  toString(): string {
    return JSON.stringify({
      userId: this.data.userId,
      street: this.data.street,
      city: this.data.city,
      province: this.data.province,
      postalCode: this.data.postalCode,
      lat: this.data.lat,
      lng: this.data.lng,
    });
  }
}
