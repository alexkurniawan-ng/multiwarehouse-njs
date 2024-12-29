import { IsNotEmpty } from 'class-validator';

export class CreateAddressRequestDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  street: string;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  province: string;

  @IsNotEmpty()
  postalCode: string;
}
