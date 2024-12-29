import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class CreateAdminBySuperAdminRequestDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  fullName: string;
}
