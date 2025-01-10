import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { stat } from 'fs';
import { CategoryListResponseDto } from 'src/dtos/category-list.response.dto';
import { ProductCreateRequestDto } from 'src/dtos/product-create.request.dto';
import { ProductListResponseDto } from 'src/dtos/product-list.response.dto';
import { ProductUpdateRequestDto } from 'src/dtos/product-update.request.dto';
import { Category } from 'src/entities/category.entity';
import { ProductImage } from 'src/entities/product-image.entity';
import { Product } from 'src/entities/product.entity';
import { InventoryStockUpdateEvent } from 'src/events/inventory-stock-updated.event';
import { ProductInventoryCreatedEvent } from 'src/events/product-inventory-created.event';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService implements OnApplicationBootstrap {
  constructor(
    @Inject('PRODUCT_SERVICE') private readonly productClient: ClientKafka,
    @Inject('WAREHOUSE_SERVICE') private readonly warehouseClient: ClientKafka,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(ProductImage)
    private productImageRepository: Repository<ProductImage>,
  ) {}

  async onApplicationBootstrap() {
    await this.createCategoriesIfNotExist();
  }

  async handleInventoryStockUpdateEvent(data: InventoryStockUpdateEvent) {
    const { productId, quantity, inventoryId } = data;
    await this.productRepository.update({ id: productId }, { quantity });
    console.log(
      `Inventory stock with ID: ${inventoryId} updated for product ID: ${productId}`,
    );
  }

  async getProducts(): Promise<ProductListResponseDto[]> {
    const products = await this.productRepository.find({
      relations: ['productImages'],
    });
    return products.map((product) => {
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        categoryId: product.categoryId,
        status: product.status,
        images: product.productImages.map((image) => {
          return {
            id: image.id,
            image: image.image,
          };
        }),
      };
    });
  }

  async getCategories(): Promise<CategoryListResponseDto[]> {
    const categories = await this.categoryRepository.find();
    return categories.map((category) => {
      return {
        id: category.id,
        name: category.name,
        parentCategoryId: category.parentCategoryId,
      };
    });
  }

  async createProduct(body: ProductCreateRequestDto): Promise<void> {
    try {
      const product = new Product();
      product.name = body.name;
      product.description = body.description;
      product.price = body.price;
      product.categoryId = body.categoryId;
      product.quantity = 0;
      product.status = body.status;
      if (body.images) {
        const promises = body.images.map((image) => {
          const productImage = new ProductImage();
          productImage.image = image;
          productImage.product = product;
          return this.productImageRepository.save(productImage);
        });
        await Promise.all(promises);
      }
      await this.productRepository.save(product);

      this.productClient.emit(
        'product-created-event',
        new ProductInventoryCreatedEvent(product.id, product.quantity),
      );
    } catch (error) {
      console.log(error);
    }
  }

  async updateProduct(body: ProductUpdateRequestDto): Promise<void> {
    try {
      const product = await this.productRepository.findOne({
        where: { id: body.id },
      });
      product.name = body.name;
      product.description = body.description;
      product.price = body.price;
      product.categoryId = body.categoryId;
      product.status = body.status;
      await this.productRepository.save(product);
    } catch (error) {
      console.log(error);
    }
  }

  async createCategoriesIfNotExist(): Promise<void> {
    try {
      const existingCategories = await this.categoryRepository.find();
      if (existingCategories.length === 0) {
        console.log('creating categories...');
        const categories = [
          { name: 'Category 1', parentCategoryId: null },
          { name: 'Category 2', parentCategoryId: null },
          { name: 'Category 3', parentCategoryId: null },
        ];

        const promises = categories.map((category) =>
          this.categoryRepository.save(category),
        );

        const results = await Promise.all(promises);

        if (results.length > 0) {
          await this.createProductIfNotExist();
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async createProductIfNotExist(): Promise<void> {
    console.log('createProductIfNotExist');
    try {
      const existingCategories = await this.categoryRepository.find();
      if (existingCategories.length === 0) {
        const categories = [
          { name: 'Category 1', parentCategoryId: null },
          { name: 'Category 2', parentCategoryId: null },
          { name: 'Category 3', parentCategoryId: null },
        ];

        for (const category of categories) {
          await this.categoryRepository.save(category);
        }
      }

      const existingProducts = await this.productRepository.find();

      if (existingProducts.length === 0) {
        const products = [
          {
            name: 'Product 1',
            description: 'Description 1',
            price: 10000,
            quantity: 10,
            categoryId: '1',
            status: 'ACTIVE',
            image:
              'https://imageio.forbes.com/specials-images/imageserve/677b8fb840871a88a354aac4/0x0.jpg?format=jpg&crop=1110,624,x44,y0,safe&height=600&width=1200&fit=bounds',
          },
          {
            name: 'Product 2',
            description: 'Description 2',
            price: 20000,
            quantity: 20,
            categoryId: '1',
            status: 'ACTIVE',
            image:
              'https://down-id.img.susercontent.com/file/id-11134207-7rask-m2kcep5h02h665',
          },
          {
            name: 'Product 3',
            description: 'Description 3',
            price: 30000,
            quantity: 0,
            categoryId: '2',
            status: 'OUT OF STOCK',
            image:
              'https://media.dinomarket.com/docs/imgTD/2021-09/NInOLED_5_220921220927_ll.jpg.jpg',
          },
          {
            name: 'Product 4',
            description: 'Description 4',
            price: 40000,
            quantity: 40,
            categoryId: '2',
            status: 'ACTIVE',
            image:
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSt-Yq_kLyvqPLHg3ki0m7-OWHyz9jEBoQu0w&s',
          },
          {
            name: 'Product 5',
            description: 'Description 5',
            price: 50000,
            quantity: 50,
            categoryId: '3',
            status: 'ACTIVE',
            image:
              'https://gizmologi.id/wp-content/uploads/2024/10/PS5-Pro_Thumbnail-860x484.jpeg',
          },
        ];

        const events: ProductInventoryCreatedEvent[] = [];
        for (const product of products) {
          const randomCategory =
            existingCategories[
              Math.floor(Math.random() * existingCategories.length)
            ];
          product.categoryId = randomCategory.id;
          const newProduct = await this.productRepository.save(product);
          events.push(
            new ProductInventoryCreatedEvent(
              newProduct.id,
              newProduct.quantity,
            ),
          );
          console.log(
            `Product created: ${newProduct.name} with quantity: ${newProduct.quantity}`,
          );
        }

        this.productClient.emit('product-inventory-created-event', events);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
