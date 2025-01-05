import { IsNotEmpty } from 'class-validator';

export class DeleteWarehouseRequestDto {
  @IsNotEmpty()
  id: string;
}
