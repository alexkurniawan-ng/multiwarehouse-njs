import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  OnModuleInit,
  Post,
  Put,
} from '@nestjs/common';
import { WarehouseService } from '../services/warehouse.service';
import { ClientKafka, EventPattern } from '@nestjs/microservices';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateWarehouseRequestDto } from 'src/dtos/warehouse/create-warehouse.request.dto';
import { ResultModelResponseDto } from 'src/dtos/result.response.dto';
import { AddAddressWarehouseRequestDto } from 'src/dtos/warehouse/add-address-warehouse.request.dto';
import { DeleteWarehouseRequestDto } from 'src/dtos/warehouse/delete-warehouse.request.dto';
import { AssignAdminWarehouseRequestDto } from 'src/dtos/warehouse/assign-warehouse-admin.request.dto';
import { WarehouseListResponseDto } from 'src/dtos/warehouse/warehouse-list.response.dto';
import { UpdateWarehouseRequestDto } from 'src/dtos/warehouse/update-warehouse.request.dto';
import { GetWarehouseByTokenDto } from 'src/dtos/warehouse/get-warehouse.request.dto';

@Controller('warehouse')
export class WarehouseController implements OnModuleInit {
  constructor(
    private readonly warehouseService: WarehouseService,
    @Inject('USER_SERVICE') private readonly userClient: ClientKafka,
  ) {}

  // @EventPattern('warehouse-created-request')
  // handleWarehouseCreated(data: any) {
  //   console.log(data.value);
  //   this.warehouseService.handleWarehouseCreated(data.value);
  // }

  @Get()
  @ApiBearerAuth()
  async getWarehouseList(): Promise<WarehouseListResponseDto[]> {
    return this.warehouseService.getWarehouseList();
  }

  @Post('get-warehouse')
  @ApiBearerAuth()
  async getWarehouseByToken(
    @Body() body: GetWarehouseByTokenDto,
  ): Promise<WarehouseListResponseDto[]> {
    return this.warehouseService.getWarehouseByToken(body.token);
  }

  @Post()
  @ApiBearerAuth()
  async createWarehouse(
    @Body() body: CreateWarehouseRequestDto,
  ): Promise<ResultModelResponseDto> {
    return this.warehouseService.createWarehouse(body);
  }

  @Post('admin')
  @ApiBearerAuth()
  async assignAdminToWarehouse(
    @Body() body: AssignAdminWarehouseRequestDto,
  ): Promise<ResultModelResponseDto> {
    return this.warehouseService.assignAdminToWarehouse(body);
  }

  @Put('update')
  @ApiBearerAuth()
  async updateWarehouse(
    @Body() body: UpdateWarehouseRequestDto,
  ): Promise<ResultModelResponseDto> {
    return this.warehouseService.updateWarehouse(body);
  }

  @Put('address')
  @ApiBearerAuth()
  async addWarehouseAddress(
    @Body() body: AddAddressWarehouseRequestDto,
  ): Promise<ResultModelResponseDto> {
    return this.warehouseService.addAddressToWarehouse(body);
  }

  @Delete('delete')
  @ApiBearerAuth()
  async deleteWarehouse(
    @Body() body: DeleteWarehouseRequestDto,
  ): Promise<ResultModelResponseDto> {
    return this.warehouseService.deleteWarehouse(body.id);
  }

  onModuleInit() {
    this.userClient.subscribeToResponseOf('get-user-data');
    this.userClient.subscribeToResponseOf('get-user-token');
  }
}
