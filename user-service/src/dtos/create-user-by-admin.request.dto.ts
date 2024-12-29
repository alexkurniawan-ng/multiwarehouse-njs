import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';
import { isValidRole } from 'src/validations/access.validation';

export class CreateUserByAdminRequestDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  fullName: string;

  @isValidRole()
  role: string;
}
