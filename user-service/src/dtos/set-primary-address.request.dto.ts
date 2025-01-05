import { IsNotEmpty, IsOptional } from 'class-validator';

export class SetPrimaryAddressRequestDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  addressId: string;

  @IsOptional()
  isDefault: boolean;
}
