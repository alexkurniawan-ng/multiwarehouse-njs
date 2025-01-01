import { IsNotEmpty } from 'class-validator';

export class SetPrimaryAddressRequestDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  addressId: number;
}
