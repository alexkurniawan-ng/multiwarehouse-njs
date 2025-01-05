export class WarehouseDeletedEvent {
  constructor(public readonly warehouseId: string) {}

  toString(): string {
    return JSON.stringify({
      warehouseId: this.warehouseId,
    });
  }
}
