import { IsNotEmpty } from 'class-validator';

export class DeleteAddressRequestDto {
  @IsNotEmpty()
  id: number;
}
