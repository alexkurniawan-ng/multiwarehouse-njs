import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { AddAddressWarehouseRequestDto } from 'src/dtos/warehouse/add-address-warehouse.request.dto';
import { AssignAdminWarehouseRequestDto } from 'src/dtos/warehouse/assign-warehouse-admin.request.dto';
import { CreateWarehouseRequestDto } from 'src/dtos/warehouse/create-warehouse.request.dto';
import { GetUserRequestDto } from 'src/dtos/get-user.request.dto';
import { UpdateWarehouseRequestDto } from 'src/dtos/warehouse/update-warehouse.request.dto';
import { WarehouseListResponseDto } from 'src/dtos/warehouse/warehouse-list.response.dto';
import { Warehouse } from 'src/entities/warehouse.entity';
import { WarehouseCreatedEvent } from 'src/events/warehouse-created-event';
import { WarehouseDeletedEvent } from 'src/events/warehouse-deleted-event';
import { WarehouseUpdatedEvent } from 'src/events/warehouse-updated-event';
import { Repository } from 'typeorm';
import { ResultModelResponseDto } from 'src/dtos/result.response.dto';
import { AdminWarehouse } from 'src/entities/admin-warehouse.entity';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
    @InjectRepository(AdminWarehouse)
    private adminWarehouseRepository: Repository<AdminWarehouse>,
    @Inject('USER_SERVICE') private readonly userClient: ClientKafka,
  ) {}

  // getHello(): string {
  //   return 'Hello World!';
  // }

  // handleWarehouseCreated(warehouseCreatedEvent: WarehouseCreatedEvent) {
  //   console.log(warehouseCreatedEvent);
  //   this.userClient
  //     .send('get_user', new GetUserRequestDto(warehouseCreatedEvent.userId))
  //     .subscribe((data) => {
  //       console.log(
  //         `Warehouse ${data} with id ${data} created by user with id ${data}`,
  //       );
  //     });
  // }

  public async getWarehouseList(): Promise<WarehouseListResponseDto[]> {
    const warehouses = await this.warehouseRepository.find();
    return warehouses.map((warehouse) => {
      return {
        warehouseId: warehouse.id,
        adminWarehouse: warehouse.adminWarehouses.map((admin) => admin.userId),
        name: warehouse.name,
        description: warehouse.description,
        street: warehouse.street,
        city: warehouse.city,
        province: warehouse.province,
        postalCode: warehouse.postalCode,
        lat: warehouse.lat,
        lng: warehouse.lng,
      };
    });
  }

  public async getWarehouseById(id: string): Promise<WarehouseListResponseDto> {
    const warehouse = await this.warehouseRepository.findOneBy({ id });
    return {
      warehouseId: warehouse.id,
      adminWarehouse: warehouse.adminWarehouses.map((admin) => admin.userId),
      name: warehouse.name,
      description: warehouse.description,
      street: warehouse.street,
      city: warehouse.city,
      province: warehouse.province,
      postalCode: warehouse.postalCode,
      lat: warehouse.lat,
      lng: warehouse.lng,
    };
  }

  public async createWarehouse(
    request: CreateWarehouseRequestDto,
  ): Promise<ResultModelResponseDto> {
    const newWarehouse = new Warehouse();
    newWarehouse.name = request.name;
    newWarehouse.description = request.description;
    await this.warehouseRepository.save(newWarehouse);
    this.userClient.emit(
      'warehouse-created-event',
      new WarehouseCreatedEvent(
        newWarehouse.id,
        newWarehouse.name,
        newWarehouse.description,
      ),
    );
    console.log(`Warehouse created with id: ${newWarehouse.id}`);
    return new ResultModelResponseDto(true, 'Warehouse Created');
  }

  public async updateWarehouse(
    updateWarehouseRequestDto: UpdateWarehouseRequestDto,
  ): Promise<ResultModelResponseDto> {
    const warehouse = await this.warehouseRepository.findOneBy({
      id: updateWarehouseRequestDto.id,
    });
    warehouse.name = updateWarehouseRequestDto.name;
    warehouse.description = updateWarehouseRequestDto.description;
    warehouse.street = updateWarehouseRequestDto.street;
    warehouse.city = updateWarehouseRequestDto.city;
    warehouse.province = updateWarehouseRequestDto.province;
    warehouse.postalCode = updateWarehouseRequestDto.postalCode;
    warehouse.lat = updateWarehouseRequestDto.lat;
    warehouse.lng = updateWarehouseRequestDto.lng;
    await this.warehouseRepository.save(warehouse);
    this.userClient.emit(
      'warehouse-updated-event',
      new WarehouseUpdatedEvent(
        warehouse.id,
        warehouse.adminWarehouses.map((admin) => admin.userId),
        warehouse.name,
        warehouse.description,
        warehouse.street,
        warehouse.city,
        warehouse.province,
        warehouse.postalCode,
        warehouse.lat,
        warehouse.lng,
      ),
    );
    console.log(`Warehouse updated with id: ${warehouse.id}`);
    return new ResultModelResponseDto(true, 'Warehouse Updated');
  }

  public async deleteWarehouse(id: string): Promise<ResultModelResponseDto> {
    await this.warehouseRepository.delete(id);
    this.userClient.emit(
      'warehouse-deleted-event',
      new WarehouseDeletedEvent(id),
    );
    console.log(`Warehouse deleted with id: ${id}`);
    return new ResultModelResponseDto(true, 'Warehouse Deleted');
  }

  public async assignAdminToWarehouse(
    request: AssignAdminWarehouseRequestDto,
  ): Promise<ResultModelResponseDto> {
    const warehouse = await this.warehouseRepository.findOneBy({
      id: request.warehouseId,
    });
    if (!warehouse) {
      return new ResultModelResponseDto(false, 'Warehouse not found');
    }
    try {
      const adminWarehouse = new AdminWarehouse();
      adminWarehouse.userId = request.userId;
      adminWarehouse.warehouse = warehouse;
      adminWarehouse.warehouseId = warehouse.id;
      const isExist = warehouse.adminWarehouses.find(
        (item) => item.userId === request.userId,
      );
      if (!isExist) {
        warehouse.adminWarehouses.push(adminWarehouse);
        await this.adminWarehouseRepository.save(adminWarehouse);
        await this.warehouseRepository.save(warehouse);
      } else {
        return new ResultModelResponseDto(
          false,
          'Admin already assigned to warehouse',
        );
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'There is error when assigned admin to warehouse',
      );
    }
    this.userClient.emit(
      'warehouse-updated-event',
      new WarehouseUpdatedEvent(
        warehouse.id,
        warehouse.adminWarehouses.map((admin) => admin.userId),
        warehouse.name,
        warehouse.description,
        warehouse.street,
        warehouse.city,
        warehouse.province,
        warehouse.postalCode,
        warehouse.lat,
        warehouse.lng,
      ),
    );
    console.log(`Admin assigned to warehouse with id: ${warehouse.id}`);
    return new ResultModelResponseDto(
      true,
      'Admin assigned to warehouse successfully',
    );
  }

  public async addAddressToWarehouse(
    request: AddAddressWarehouseRequestDto,
  ): Promise<ResultModelResponseDto> {
    const warehouse = await this.warehouseRepository.findOneBy({
      id: request.id,
    });
    warehouse.street = request.street;
    warehouse.city = request.city;
    warehouse.province = request.province;
    warehouse.postalCode = request.postalCode;
    warehouse.lat = request.lat;
    warehouse.lng = request.lng;
    await this.warehouseRepository.save(warehouse);
    this.userClient.emit(
      'warehouse-updated-event',
      new WarehouseUpdatedEvent(
        warehouse.id,
        warehouse.adminWarehouses.map((admin) => admin.userId),
        warehouse.name,
        warehouse.description,
        warehouse.street,
        warehouse.city,
        warehouse.province,
        warehouse.postalCode,
        warehouse.lat,
        warehouse.lng,
      ),
    );
    console.log(`Warehouse updated with id: ${warehouse.id}`);
    return new ResultModelResponseDto(true, 'Warehouse Updated');
  }
}
