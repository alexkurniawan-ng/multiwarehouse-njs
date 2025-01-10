import { ProductImageResponse } from './product-image.response.dto';

export class ProductListResponseDto {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  categoryId: string;
  status: string;
  images: ProductImageResponse[];
}
