import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class RegisterRequestDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  fullName: string;
}
