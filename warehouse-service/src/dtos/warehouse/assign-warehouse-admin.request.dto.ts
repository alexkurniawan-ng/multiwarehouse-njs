import { IsNotEmpty } from 'class-validator';

export class AssignAdminWarehouseRequestDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  warehouseId: string;
}
