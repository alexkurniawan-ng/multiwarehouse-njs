import { IsArray, IsNotEmpty } from 'class-validator';

export class InventoryStockTakeRequestDto {
  @IsNotEmpty()
  orderId: string;

  @IsNotEmpty()
  lat: number;

  @IsNotEmpty()
  lng: number;

  @IsArray()
  orderItems: InventoryStockTakeItemRequestDto[];
}

export class InventoryStockTakeItemRequestDto {
  @IsNotEmpty()
  productId: string;

  @IsNotEmpty()
  quantity: number;
}
