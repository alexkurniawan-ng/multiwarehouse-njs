export class WarehouseCreatedEvent {
  constructor(
    public readonly warehouseId: string,
    public readonly name: string,
    public readonly description: string,
  ) {}

  toString(): string {
    return JSON.stringify({
      warehouseId: this.warehouseId,
      name: this.name,
      description: this.description,
    });
  }
}
