import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateWarehouseRequestDto } from './dtos/create-warehouse-request.dto';
import { WarehouseCreatedEvent } from './events/warehouse-created-event';

@Injectable()
export class AppService {
  constructor(
    @Inject('WAREHOUSE_SERVICE') private readonly warehouseClient: ClientKafka,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  createWarehouse({ name, address }: CreateWarehouseRequestDto) {
    this.warehouseClient.emit(
      'warehouse-created-request',
      new WarehouseCreatedEvent('123', name, address),
    );
  }
}
