export class WarehouseCreatedEvent {
  constructor(
    public readonly warehouseId: string,
    public readonly name: string,
    public readonly address: string,
  ) {}

  toString(): string {
    return JSON.stringify({
      warehouseId: this.warehouseId,
      name: this.name,
      address: this.address,
    });
  }
}
