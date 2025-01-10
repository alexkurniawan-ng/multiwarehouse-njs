import {
  Controller,
  Get,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { CategoryListResponseDto } from 'src/dtos/category-list.response.dto';
import { ProductListResponseDto } from 'src/dtos/product-list.response.dto';
import { ProductUpdateRequestDto } from 'src/dtos/product-update.request.dto';
import { ProductService } from 'src/services/product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // Kafka Consumer:
  @MessagePattern('inventory-stock-update-event')
  async handleInventoryStockUpdateEvent(data: any) {
    // inventoryId: this.inventoryId,
    // productId: this.productId,
    // quantity: this.quantity,
    await this.productService.handleInventoryStockUpdateEvent(data.value);
  }

  // Rest API:
  @Post('uploads')
  @UseInterceptors(FileInterceptor('files'))
  uploadFile(@UploadedFile() files: Express.Multer.File) {
    return {
      data: files.filename,
    };
  }

  @Get()
  public async getProducts(): Promise<ProductListResponseDto[]> {
    return await this.productService.getProducts();
  }

  @Get('category')
  public async getCategories(): Promise<CategoryListResponseDto[]> {
    return await this.productService.getCategories();
  }

  @Post()
  public async createProduct(
    body: ProductUpdateRequestDto,
  ): Promise<ProductListResponseDto> {
    return await this.productService.createProduct(body);
  }

  @Put('update/:id')
  public async updateProduct(
    body: ProductUpdateRequestDto,
  ): Promise<ProductListResponseDto> {
    return await this.productService.updateProduct(body);
  }
}
