export class WarehouseUpdatedEvent {
  constructor(
    public readonly warehouseId: string,
    public readonly adminWarehouse: string[],
    public readonly name: string,
    public readonly description: string,
    public readonly street: string,
    public readonly city: string,
    public readonly province: string,
    public readonly postalCode: string,
    public readonly lat: number,
    public readonly lng: number,
  ) {}

  toString(): string {
    return JSON.stringify({
      warehouseId: this.warehouseId,
      adminWarehouse: this.adminWarehouse,
      name: this.name,
      description: this.description,
      street: this.street,
      city: this.city,
      province: this.province,
      postalCode: this.postalCode,
      lat: this.lat,
      lng: this.lng,
    });
  }
}
