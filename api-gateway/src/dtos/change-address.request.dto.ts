import { IsNotEmpty } from 'class-validator';

export class ChangeAddressRequestDto {
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
}
