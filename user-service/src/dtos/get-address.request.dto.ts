import { IsNotEmpty } from 'class-validator';

export class GetAddressRequestDto {
  @IsNotEmpty()
  userId: number;
}
