import { IsNotEmpty, IsOptional } from 'class-validator';

export class InventoryTransferRequestDto {
  @IsNotEmpty()
  orderId: string;

  @IsNotEmpty()
  sourceInventoryId: string;

  @IsNotEmpty()
  destinationInventoryId: string;

  @IsNotEmpty()
  productId: string;

  @IsNotEmpty()
  quantity: number;

  @IsOptional()
  remarks?: string;
}
