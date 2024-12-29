import { IsNotEmpty, IsStrongPassword } from 'class-validator';

export class ChangePasswordRequestDto {
  @IsNotEmpty()
  oldPassword: string;

  @IsNotEmpty()
  @IsStrongPassword()
  newPassword: string;

  @IsNotEmpty()
  @IsStrongPassword()
  confirmNewPassword: string;
}
