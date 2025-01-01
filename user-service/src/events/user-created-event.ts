export class UserCreatedEvent {
  constructor(public readonly data: any) {}

  toString(): string {
    return JSON.stringify({
      id: this.data.id,
      email: this.data.email,
      fullName: this.data.fullName,
      roles: this.data.roles,
    });
  }
}
