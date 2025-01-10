import { Module } from '@nestjs/common';
import { ProductController } from './controllers/product.controller';
import { ProductService } from './services/product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseType } from 'typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Category } from './entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category]),
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<DatabaseType>('DB_TYPE'),
        url: configService.get<string>('DB_CONNECTION_STRING'),
        autoLoadEntities: true,
        migrationsRun: true,
        migrations: ['dist/migrations/*.js'],
        // logging: true,
      }),
    }),
    ClientsModule.register([
      {
        name: 'PRODUCT_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'product',
            brokers: ['localhost:29092'],
          },
          consumer: {
            groupId: 'product-consumer',
          },
        },
      },
      {
        name: 'WAREHOUSE_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'warehouse',
            brokers: ['localhost:29092'],
          },
          consumer: {
            groupId: 'warehouse-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
