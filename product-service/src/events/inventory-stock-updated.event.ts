export class InventoryStockUpdateEvent {
  constructor(
    public readonly productId: string,
    public readonly quantity: number,
    public readonly inventoryId: string,
  ) {}

  toString(): string {
    return JSON.stringify({
      productId: this.productId,
      quantity: this.quantity,
      inventoryId: this.inventoryId,
    });
  }
}
