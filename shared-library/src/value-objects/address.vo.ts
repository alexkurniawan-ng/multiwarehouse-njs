export class Address {
  constructor(
    private readonly street: string,
    private readonly city: string,
    private readonly state: string,
    private readonly zipCode: string,
  ) {}

  getFullAddress(): string {
    return `${this.street}, ${this.city}, ${this.state}, ${this.zipCode}`;
  }

  validate(): boolean {
    const isEmpty = (value: string) => value.trim() === '';
    const allFieldsValid = Object.values(this).every(
      (value) => !isEmpty(value),
    );
    return allFieldsValid;
  }
}
