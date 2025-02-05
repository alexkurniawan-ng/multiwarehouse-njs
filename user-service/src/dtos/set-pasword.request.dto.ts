import { IsNotEmpty, IsStrongPassword } from 'class-validator';

export class SetPasswordRequestDto {
  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  @IsStrongPassword()
  rePassword: string;
}
