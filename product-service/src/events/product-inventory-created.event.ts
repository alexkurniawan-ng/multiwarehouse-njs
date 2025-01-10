export class ProductInventoryCreatedEvent {
  constructor(
    public readonly productId: string,
    public readonly quantity: number,
  ) {}

  toString(): string {
    return JSON.stringify({
      productId: this.productId,
      quantity: this.quantity,
    });
  }
}
