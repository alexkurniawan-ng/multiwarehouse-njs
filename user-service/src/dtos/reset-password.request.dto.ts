import { IsNotEmpty, IsStrongPassword } from 'class-validator';

export class ResetPasswordRequestDto {
  @IsNotEmpty()
  @IsStrongPassword()
  newPassword: string;

  @IsNotEmpty()
  @IsStrongPassword()
  confirmNewPassword: string;
}
