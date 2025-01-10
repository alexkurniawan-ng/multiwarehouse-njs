import {
  Inject,
  Injectable,
  InternalServerErrorException,
  OnApplicationBootstrap,
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
import { In, Repository } from 'typeorm';
import { ResultModelResponseDto } from 'src/dtos/result.response.dto';
import { AdminWarehouse } from 'src/entities/admin-warehouse.entity';
import { GetWarehouseByTokenDto } from 'src/dtos/warehouse/get-warehouse.request.dto';

@Injectable()
export class WarehouseService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
    @InjectRepository(AdminWarehouse)
    private adminWarehouseRepository: Repository<AdminWarehouse>,
    @Inject('USER_SERVICE') private readonly userClient: ClientKafka,
    @Inject('WAREHOUSE_SERVICE') private readonly warehouseClient: ClientKafka,
  ) {}

  async onApplicationBootstrap() {
    await this.createWarehouseIfNotExist();
  }

  public async getWarehouseList(): Promise<WarehouseListResponseDto[]> {
    const warehouses = await this.warehouseRepository.find({
      relations: ['adminWarehouses'],
    });
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

  public async getWarehouseByToken(
    token: string,
  ): Promise<WarehouseListResponseDto[]> {
    return new Promise((resolve, reject) => {
      this.userClient
        .send('get-user-token', new GetWarehouseByTokenDto(token))
        .subscribe(async (data) => {
          console.log({ data });
          // console.log(data.roles);

          if (
            data.roles.filter((role) => role.name === 'super_admin').length > 0
          ) {
            console.log('super admin');
            const warehouses = await this.warehouseRepository.find();
            const result = [];
            for (const warehouse of warehouses) {
              const adminWarehouses = await this.adminWarehouseRepository.find({
                where: { warehouseId: warehouse.id },
              });
              result.push({
                warehouseId: warehouse.id,
                adminWarehouse: adminWarehouses.map((admin) => admin.fullName),
                name: warehouse.name,
                description: warehouse.description,
                street: warehouse.street,
                city: warehouse.city,
                province: warehouse.province,
                postalCode: warehouse.postalCode,
                lat: warehouse.lat,
                lng: warehouse.lng,
              });
            }
            resolve(result);
          } else if (
            data.roles.filter((role) => role.name === 'admin').length > 0
          ) {
            console.log('admin');
            const adminWarehouses = await this.adminWarehouseRepository.find({
              where: {
                userId: data.userId,
              },
            });
            const warehouseIds = adminWarehouses.map(
              (admin) => admin.warehouseId,
            );
            const warehouses = await this.warehouseRepository.find({
              where: {
                id: In(warehouseIds),
              },
            });
            const result = [];
            for (const warehouse of warehouses) {
              const adminWarehouses = await this.adminWarehouseRepository.find({
                where: { warehouseId: warehouse.id },
              });
              result.push({
                warehouseId: warehouse.id,
                adminWarehouse: adminWarehouses.map((admin) => admin.fullName),
                name: warehouse.name,
                description: warehouse.description,
                street: warehouse.street,
                city: warehouse.city,
                province: warehouse.province,
                postalCode: warehouse.postalCode,
                lat: warehouse.lat,
                lng: warehouse.lng,
              });
            }
            resolve(result);
          } else {
            resolve([]);
          }
        }, reject);
    });
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

    const adminWarehouses = await this.adminWarehouseRepository.find({
      where: { warehouseId: warehouse.id },
    });
    this.warehouseClient.emit(
      'warehouse-updated-event',
      new WarehouseUpdatedEvent(
        warehouse.id,
        adminWarehouses.map((admin) => admin.userId),
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
    console.log({ request });
    const warehouse = await this.warehouseRepository.findOneBy({
      id: request.warehouseId,
    });
    if (!warehouse) {
      return new ResultModelResponseDto(false, 'Warehouse not found');
    }
    const adminWarehouses = await this.adminWarehouseRepository.find({
      where: { warehouseId: request.warehouseId },
    });
    if (adminWarehouses.length > 0) {
      adminWarehouses.forEach(async (admin) => {
        if (admin.userId === request.userId) {
          return new ResultModelResponseDto(
            false,
            'Admin already assigned to warehouse',
          );
        }
      });
    }

    try {
      this.userClient
        .send('get-user-data', new GetUserRequestDto(request.userId))
        .subscribe(async (data) => {
          console.log({ data });

          const { fullName, email } = data;
          const adminWarehouse = new AdminWarehouse();
          adminWarehouse.userId = request.userId;
          adminWarehouse.warehouseId = warehouse.id;
          adminWarehouse.fullName = fullName;
          adminWarehouse.email = email;
          await this.adminWarehouseRepository.save(adminWarehouse);
          console.log(
            `Warehouse ${warehouse.name} with id ${warehouse.id} assigned admin ${fullName} with id ${data.id}`,
          );
        });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'There is error when assigned admin to warehouse',
      );
    }
    const listAdmin = adminWarehouses.map((admin) => admin.userId);
    listAdmin.push(request.userId);

    this.warehouseClient.emit(
      'warehouse-updated-event',
      new WarehouseUpdatedEvent(
        warehouse.id,
        listAdmin,
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
    // console.log(`Admin assigned to warehouse with id: ${warehouse.id}`);
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

    const adminWarehouses = await this.adminWarehouseRepository.find({
      where: { warehouseId: warehouse.id },
    });
    this.userClient.emit(
      'warehouse-updated-event',
      new WarehouseUpdatedEvent(
        warehouse.id,
        adminWarehouses.map((admin) => admin.userId),
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

  async createWarehouseIfNotExist() {
    const count = await this.warehouseRepository.count();
    if (count === 0) {
      const warehouses = [
        {
          name: 'Warehouse Jakarta',
          description: 'Biggest warehouse',
          street: 'Jl. Raya Jakarta',
          city: 'Jakarta',
          province: 'DKI Jakarta',
          postalCode: '10110',
          lat: -6.215957,
          lng: 106.812642,
        },
        {
          name: 'Warehouse Bandung',
          description: 'Biggest warehouse',
          street: 'Jl. Raya Bandung',
          city: 'Bandung',
          province: 'Jawa Barat',
          postalCode: '40123',
          lat: -6.875467,
          lng: 107.614771,
        },
      ];
      for (const warehouse of warehouses) {
        const newWarehouse = new Warehouse();
        newWarehouse.name = warehouse.name;
        newWarehouse.description = warehouse.description;
        newWarehouse.street = warehouse.street;
        newWarehouse.city = warehouse.city;
        newWarehouse.province = warehouse.province;
        newWarehouse.postalCode = warehouse.postalCode;
        newWarehouse.lat = warehouse.lat;
        newWarehouse.lng = warehouse.lng;
        await this.warehouseRepository.save(newWarehouse);
      }
    }
  }
}
