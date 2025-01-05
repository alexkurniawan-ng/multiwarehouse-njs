import { IsNotEmpty } from 'class-validator';

export class InventoryStockRequestStatusRequestDto {
  @IsNotEmpty()
  adminId: string;

  @IsNotEmpty()
  status: string;

  @IsNotEmpty()
  stockJournalId: string;
}
