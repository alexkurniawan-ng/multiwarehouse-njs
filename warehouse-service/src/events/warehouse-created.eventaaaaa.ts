export class WarehouseCreatedEventaaa {
  constructor(
    public readonly warehouseId: string,
    public readonly userId: string,
    public readonly name: string,
    public readonly address: string,
  ) {}
}
