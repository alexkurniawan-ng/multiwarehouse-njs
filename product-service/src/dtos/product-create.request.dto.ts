import { IsNotEmpty, IsOptional } from 'class-validator';

export class ProductCreateRequestDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  description: string;

  @IsNotEmpty()
  price: number;

  @IsOptional()
  images: string[];

  @IsNotEmpty()
  categoryId: string;

  @IsOptional()
  status: string;
}
