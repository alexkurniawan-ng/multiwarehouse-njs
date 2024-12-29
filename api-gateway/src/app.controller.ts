import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateWarehouseRequestDto } from './dtos/create-warehouse-request.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  createWarehouse(@Body() createWarehouseRequest: CreateWarehouseRequestDto) {
    this.appService.createWarehouse(createWarehouseRequest);
  }
}
