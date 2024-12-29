import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class RegisterRequestDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  // @IsNotEmpty()
  // @IsStrongPassword()
  // password: string;

  // @IsNotEmpty()
  // @IsStrongPassword()
  // confirmPassword: string;

  @IsNotEmpty()
  fullName: string;
}
