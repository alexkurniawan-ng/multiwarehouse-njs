import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ClientKafka, MessagePattern } from '@nestjs/microservices';
import { ApiBearerAuth } from '@nestjs/swagger';
import { InventoryAdminTransferRequestDto } from 'src/dtos/inventory/inventory-admin-transfer.request.dto';
import { InventoryTotalProductResponseDto } from 'src/dtos/inventory/inventory-product-total.response.dto';
import { InventoryStockRequestStatusRequestDto } from 'src/dtos/inventory/inventory-stock-request-status.request.dto';
import { InventoryStockRequestResponseDto } from 'src/dtos/inventory/inventory-stock-request-status.response.dto';
import { InventoryStockTakeRequestDto } from 'src/dtos/inventory/inventory-stock-take.request.dto';
import { ResultModelResponseDto } from 'src/dtos/result.response.dto';
import { InventoryService } from 'src/services/inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(
    private readonly inventoryService: InventoryService,
    @Inject('WAREHOUSE_SERVICE') private readonly warehouseClient: ClientKafka,
    @Inject('USER_SERVICE') private readonly userClient: ClientKafka,
  ) {}
  // LISTENER
  @MessagePattern('inventory-stock-take-request')
  async handleInventoryStockRequest(
    @Body() body: InventoryStockTakeRequestDto,
  ): Promise<ResultModelResponseDto> {
    return this.inventoryService.initiateStockTake(body);
  }

  @MessagePattern('inventory-stock-total-request')
  async handleInventoryStockTotal(
    @Param() body: { productId: string },
  ): Promise<InventoryTotalProductResponseDto> {
    return this.inventoryService.getTotalInventoryByProductId(body.productId);
  }
  // @Get('product/:productId')
  // @ApiBearerAuth()
  // public async getInventory(
  //   @Param() productId: string,
  // ): Promise<InventoryTotalProductResponseDto> {
  //   return this.inventoryService.getTotalInventoryByProductId(productId);
  // }

  // REST
  @Get('stock/pending')
  @ApiBearerAuth()
  public async getStockRequest(): Promise<InventoryStockRequestResponseDto[]> {
    return this.inventoryService.getStockRequest();
  }

  @Post('stock/status')
  @ApiBearerAuth()
  public async rejectStockRequest(
    @Body() body: InventoryStockRequestStatusRequestDto,
  ): Promise<ResultModelResponseDto> {
    return this.inventoryService.changeStockRequestStatus(body);
  }

  // AFTER PAYMENT
  @Post('stock-take')
  @ApiBearerAuth()
  public async orderStock(
    @Body() body: InventoryStockTakeRequestDto,
  ): Promise<ResultModelResponseDto> {
    return this.inventoryService.initiateStockTake(body);
  }

  // @Post('transfer')
  // @ApiBearerAuth()
  // public async transferStock(
  //   @Body() body: InventoryTransferRequestDto,
  // ): Promise<ResultModelResponseDto> {
  //   return this.inventoryService.initiateTransferStock(body);
  // }

  @Post('stock/request')
  @ApiBearerAuth()
  public async transferStockRequest(
    @Body() body: InventoryAdminTransferRequestDto,
  ): Promise<ResultModelResponseDto> {
    return this.inventoryService.initiateTransferStockRequest(body);
  }
}
