import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateWarehouseRequestDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsOptional()
  description: string;

  @IsNotEmpty()
  @IsOptional()
  street: string;

  @IsNotEmpty()
  @IsOptional()
  city: string;

  @IsNotEmpty()
  @IsOptional()
  province: string;

  @IsNotEmpty()
  @IsOptional()
  postalCode: string;

  @IsNumber()
  @IsOptional()
  lat: number;

  @IsNumber()
  @IsOptional()
  lng: number;
}
