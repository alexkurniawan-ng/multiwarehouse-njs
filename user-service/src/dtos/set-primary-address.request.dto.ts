import { IsNotEmpty, IsOptional } from 'class-validator';

export class SetPrimaryAddressRequestDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  addressId: number;

  @IsOptional()
  isDefault: boolean;
}
