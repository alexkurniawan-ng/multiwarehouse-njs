import { registerDecorator } from 'class-validator';
import { Role } from 'src/enums/role.enum';
export function isValidRole() {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isValidRole',
      target: object.constructor,
      propertyName: propertyName,
      validator: {
        validate(value: any) {
          const roles = Object.values(Role).filter(
            (role) => role !== Role.SuperAdmin && role !== Role.Admin,
          );
          return roles.includes(value);
        },
        defaultMessage() {
          return 'INVALID_ROLE';
        },
      },
    });
  };
}
