export class GetWarehouseByTokenDto {
  constructor(public readonly token: string) {}

  toString() {
    return JSON.stringify({
      token: this.token,
    });
  }
}
