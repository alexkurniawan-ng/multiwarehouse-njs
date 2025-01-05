import { Address } from 'src/entities/address.entity';

export class UserProfileResponseDto {
  id: string;
  fullName: string;
  email: string;
  roles: string[];
  addresses?: Address[];
  profilePicture: string;
}
