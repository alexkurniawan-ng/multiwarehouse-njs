export class InventoryStockRequestResponseDto {
  journalId: string;
  mutationType: string;
  quantity: number;
  inventoryId: string;
  sourceWarehouse: string;
  destinationInventoryId: string;
  destinationWarehouse: string;
  remarks: string;
  createdDate: Date;
}
