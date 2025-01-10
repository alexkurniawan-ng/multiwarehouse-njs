import { IsNotEmpty, IsOptional } from 'class-validator';

export class ProductUpdateRequestDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  name: string;

  @IsOptional()
  description: string;

  @IsNotEmpty()
  price: number;

  @IsOptional()
  image: string;

  @IsNotEmpty()
  categoryId: string;

  @IsOptional()
  status: string;
}
