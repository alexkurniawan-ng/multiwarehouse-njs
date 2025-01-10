import { IsNotEmpty } from 'class-validator';

export class ProductImageResponse {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  image: string;
}
