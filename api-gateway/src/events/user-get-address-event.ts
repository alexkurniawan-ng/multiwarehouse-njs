import { GetAddressRequestDto } from 'src/dtos/get-address.request.dto';

export class UserGetAddressEvent {
  constructor(public readonly data: GetAddressRequestDto) {}

  toString(): string {
    return JSON.stringify({
      userId: this.data.userId,
    });
  }
}
