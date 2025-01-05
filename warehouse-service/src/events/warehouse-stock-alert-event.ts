export class WarehouseStockAlertEvent {
  constructor(
    public readonly warehouseId: string,
    public readonly warehouseName: string,
    public readonly adminIds: string[],
    public readonly inventoryId: string,
    public readonly productId: string,
  ) {}

  toString(): string {
    return JSON.stringify({
      warehouseId: this.warehouseId,
      warehouseName: this.warehouseName,
      adminIds: this.adminIds,
      inventoryId: this.inventoryId,
      productId: this.productId,
    });
  }
}
