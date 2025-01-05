import { Module } from '@nestjs/common';
import { WarehouseController } from './controllers/warehouse.controller';
import { WarehouseService } from './services/warehouse.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { InventoryController } from './controllers/inventory.controller';
import { InventoryService } from './services/inventory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { Inventory } from './entities/inventory.entity';
import { AdminWarehouse } from './entities/admin-warehouse.entity';
import { StockJournal } from './entities/stock-journal.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseType } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Warehouse,
      Inventory,
      AdminWarehouse,
      StockJournal,
    ]),
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
        name: 'USER_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'user',
            brokers: ['localhost:29092'],
          },
          consumer: {
            groupId: 'user-consumer',
          },
        },
      },
      // {
      //   name: 'INVENTORY_SERVICE',
      //   transport: Transport.KAFKA,
      //   options: {
      //     client: {
      //       clientId: 'inventory',
      //       brokers: ['localhost:29092'],
      //     },
      //     consumer: {
      //       groupId: 'inventory-consumer',
      //     },
      //   },
      // },
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
  controllers: [WarehouseController, InventoryController],
  providers: [WarehouseService, InventoryService],
})
export class WarehouseModule {}
