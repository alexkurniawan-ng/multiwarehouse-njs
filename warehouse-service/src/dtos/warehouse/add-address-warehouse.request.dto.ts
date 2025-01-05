import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class AddAddressWarehouseRequestDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  street: string;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  province: string;

  @IsNotEmpty()
  postalCode: string;

  @IsNumber()
  @IsOptional()
  lat: number;

  @IsNumber()
  @IsOptional()
  lng: number;
}
