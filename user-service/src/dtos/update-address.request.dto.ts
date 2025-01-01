import { IsNotEmpty } from 'class-validator';

export class UpdateAddressRequestDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  street: string;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  province: string;

  @IsNotEmpty()
  postalCode: string;

  lat: number;

  lng: number;
}
