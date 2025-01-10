export class InventoryStockUpdateEvent {
  constructor(
    public readonly inventoryId: string,
    public readonly productId: string,
    public readonly quantity: number,
  ) {}

  toString(): string {
    return JSON.stringify({
      inventoryId: this.inventoryId,
      productId: this.productId,
      quantity: this.quantity,
    });
  }
}
