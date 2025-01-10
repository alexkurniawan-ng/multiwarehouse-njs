import { IsNotEmpty } from 'class-validator';

export class QuantityWarehouseRequestDto {
  @IsNotEmpty()
  warehouseId: string;

  @IsNotEmpty()
  quantity: number;
}
