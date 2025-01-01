import { DeleteAddressRequestDto } from 'src/dtos/delete-address.request.dto';

export class UserAddressDeletedEvent {
  constructor(public readonly data: DeleteAddressRequestDto) {}

  toString(): string {
    return JSON.stringify({
      id: this.data.id,
    });
  }
}
