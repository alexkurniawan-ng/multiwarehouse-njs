import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { AppBadRequestException } from 'exceptions/app-bad-request.exception';
import { InventoryAdminTransferRequestDto } from 'src/dtos/inventory/inventory-admin-transfer.request.dto';
import { InventoryTotalProductResponseDto } from 'src/dtos/inventory/inventory-product-total.response.dto';
import { InventoryStockCheckResponseDto } from 'src/dtos/inventory/inventory-stock-check.response.dto';
import { InventoryStockRequestStatusRequestDto } from 'src/dtos/inventory/inventory-stock-request-status.request.dto';
import { InventoryStockRequestResponseDto } from 'src/dtos/inventory/inventory-stock-request-status.response.dto';
import { InventoryStockTakeRequestDto } from 'src/dtos/inventory/inventory-stock-take.request.dto';
import { InventoryTransferRequestDto } from 'src/dtos/inventory/inventory-transfer.request.dto';
import { ResultModelResponseDto } from 'src/dtos/result.response.dto';
import { Inventory } from 'src/entities/inventory.entity';
import { StockJournal } from 'src/entities/stock-journal.entity';
import { Warehouse } from 'src/entities/warehouse.entity';
import { MutationStatus } from 'src/enums/mutation-status.enum';
import { MutationType } from 'src/enums/mutation-type.enum';
import { WarehouseStockAlertEvent } from 'src/events/warehouse-stock-alert-event';
import { MoreThan, Not, Repository } from 'typeorm';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    @InjectRepository(StockJournal)
    private stockJournal: Repository<StockJournal>,
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
    @Inject('WAREHOUSE_SERVICE') private readonly warehouseClient: ClientKafka,
  ) {}

  public async getTotalInventoryByProductId(
    productId: string,
  ): Promise<InventoryTotalProductResponseDto> {
    const inventories = await this.inventoryRepository.find({
      where: { productId },
    });
    return this.convertToTotalInventory(inventories);
  }

  public async getStockRequest(): Promise<InventoryStockRequestResponseDto[]> {
    const stockJournals = await this.stockJournal.find({
      where: { status: MutationStatus.PENDING },
    });
    return this.convertToStockRequest(stockJournals);
  }

  public async changeStockRequestStatus(
    request: InventoryStockRequestStatusRequestDto,
  ): Promise<ResultModelResponseDto> {
    try {
      const stockJournal = await this.stockJournal.findOne({
        where: { id: request.stockJournalId },
      });
      if (stockJournal.status !== MutationStatus.PENDING) {
        throw new BadRequestException('Stock request is not in PENDING status');
      }
      stockJournal.status = request.status;
      await this.stockJournal.save(stockJournal);
      if (stockJournal.status === MutationStatus.APPROVED) {
        await this.stockMutation({
          orderId: stockJournal.orderId,
          sourceInventoryId: stockJournal.inventoryId,
          destinationInventoryId: stockJournal.destinationInventoryId,
          productId: stockJournal.inventory.productId,
          quantity: stockJournal.quantity,
          remarks: `Approved by admin with id: ${
            request.adminId
          } on ${new Date()}`,
        });
      }
    } catch (error) {
      console.log(error);
    }
    return new ResultModelResponseDto(true, 'Stock Request Approved');
  }

  public async initiateStockTake(
    request: InventoryStockTakeRequestDto,
  ): Promise<ResultModelResponseDto> {
    const { orderId, lat, lng, orderItems } = request;
    const warehouses = await this.warehouseRepository.find();
    const warehouse = await this.getNearestWarehouse(warehouses, lat, lng);
    try {
      orderItems.forEach(async (orderItem) => {
        // const inventory = await this.inventoryRepository.findOne({
        //   where: {
        //     warehouseId: warehouse.id,
        //     productId: orderItem.productId,
        //   },
        // });
        // const isStockAvailable = await this.checkAvailableStock(
        //   warehouse.id,
        //   orderItem.productId,
        //   orderItem.quantity,
        // );
        // if (!isStockAvailable.isAvailable) {
        //   const minStock = orderItem.quantity - isStockAvailable.quantity;
        //   const inventorySource = await this.inventoryRepository.findOne({
        //     where: {
        //       warehouseId: Not(warehouse.id),
        //       productId: orderItem.productId,
        //       quantity: MoreThan(minStock),
        //     },
        //   });
        //   await this.stockMutation({
        //     orderId,
        //     sourceInventoryId: inventorySource.id,
        //     destinationInventoryId: inventory.id,
        //     productId: orderItem.productId,
        //     quantity: minStock,
        //     remarks: `Stock Take for order ${orderId} to warehouse ${warehouse.name}`,
        //   });
        // }
        const inventory = warehouse.inventories.find(
          (inv) => inv.productId === orderItem.productId,
        );
        const isStockAvailable = inventory.quantity >= orderItem.quantity;
        if (!isStockAvailable) {
          const minStock = orderItem.quantity - inventory.quantity;
          let stockOnSourceWarehouse = 0;
          const InsufficientWarehouseId = [warehouse.id];

          while (stockOnSourceWarehouse < minStock) {
            const otherWarehouses = warehouses.filter(
              (wh) => !InsufficientWarehouseId.includes(wh.id),
            );
            if (otherWarehouses.length === 0)
              throw new BadRequestException('All warehouses are out of stock');
            const nearestWarehouse = await this.getNearestWarehouse(
              otherWarehouses,
              warehouse.lat,
              warehouse.lng,
            );
            const inventorySource = nearestWarehouse.inventories.find(
              (inv) => inv.productId === orderItem.productId,
            );
            stockOnSourceWarehouse = inventorySource.quantity;
            if (stockOnSourceWarehouse < minStock) {
              InsufficientWarehouseId.push(nearestWarehouse.id);
              continue;
            } else {
              if (inventorySource.quantity - minStock === 0) {
                // SEND EMAIL TO WAREHOUSE ADMIN ABOUT INSUFFICIENT STOCK
                this.warehouseClient.emit(
                  'warehouse-stock-alert-event',
                  new WarehouseStockAlertEvent(
                    inventorySource.warehouseId,
                    inventorySource.warehouse.name,
                    inventorySource.warehouse.adminWarehouses.map(
                      (admin) => admin.userId,
                    ),
                    inventorySource.id,
                    orderItem.productId,
                  ),
                );
              }
              await this.stockMutation({
                orderId,
                sourceInventoryId: inventorySource.id,
                destinationInventoryId: inventory.id,
                productId: orderItem.productId,
                quantity: minStock - stockOnSourceWarehouse,
                remarks: `Stock Take for order ${orderId} to warehouse ${warehouse.name}`,
              });
              break;
            }
          }
          // SEND EMAIL TO WAREHOUSE ADMIN ABOUT INSUFFICIENT STOCK
          this.warehouseClient.emit(
            'warehouse-stock-alert-event',
            new WarehouseStockAlertEvent(
              warehouse.id,
              warehouse.name,
              warehouse.adminWarehouses.map((admin) => admin.userId),
              inventory.id,
              orderItem.productId,
            ),
          );
        }

        await this.createJournal(
          MutationType.OUT,
          orderItem.quantity,
          inventory.id,
          orderId,
          null,
          MutationStatus.APPROVED,
          null,
        );
      });
    } catch (error) {
      console.log(error);
    }
    return new ResultModelResponseDto(true, 'Stock Take Initiated');
  }

  public async initiateTransferStockRequest(
    request: InventoryAdminTransferRequestDto,
  ): Promise<any> {
    const {
      adminId,
      sourceInventoryId,
      destinationInventoryId,
      productId,
      quantity,
    } = request;

    if (!(await this.validateAdminWarehouse(adminId, sourceInventoryId))) {
      throw new BadRequestException('Unauthorized');
    }

    const isStockAvailable = await this.validateInventoryStock(
      sourceInventoryId,
      productId,
      quantity,
    );

    if (!isStockAvailable)
      throw new AppBadRequestException('Insufficient stock');

    try {
      await this.createJournal(
        MutationType.TRANSFER,
        quantity,
        sourceInventoryId,
        null, // orderId
        destinationInventoryId,
        MutationStatus.PENDING,
        request.remarks ?? null,
      );
    } catch (error) {
      console.log(error);
    }
    return new ResultModelResponseDto(true, 'Stock Transfer Initiated');
  }

  public async stockMutation(
    request: InventoryTransferRequestDto,
  ): Promise<boolean> {
    const {
      orderId,
      sourceInventoryId,
      destinationInventoryId,
      productId,
      quantity,
    } = request;

    const isStockAvailable = await this.validateInventoryStock(
      sourceInventoryId,
      productId,
      quantity,
    );

    if (!isStockAvailable) {
      return isStockAvailable;
    }

    try {
      await this.createJournal(
        MutationType.TRANSFER,
        quantity,
        sourceInventoryId,
        orderId,
        destinationInventoryId ?? null,
        MutationStatus.APPROVED,
        request.remarks ?? null,
      );
      await this.mutateStock(sourceInventoryId, quantity, 'DECREASE');
      destinationInventoryId &&
        (await this.mutateStock(destinationInventoryId, quantity, 'INCREASE'));
    } catch (error) {
      console.log(error);
    }
    return true;
    // return new ResultModelResponseDto(true, 'Stock Transfer Initiated');
  }

  private async mutateStock(
    inventoryId: string,
    quantity: number,
    mutateOrder: string,
  ): Promise<Inventory> {
    const inventory = await this.inventoryRepository.findOne({
      where: { id: inventoryId },
    });
    mutateOrder === 'DECREASE'
      ? (inventory.quantity -= quantity)
      : (inventory.quantity += quantity);
    inventory.quantity += quantity;
    console.log(
      `Warehouse id: ${inventory.warehouseId} stock is ${mutateOrder} by ${quantity}`,
    );
    await this.inventoryRepository.save(inventory);
    return inventory;
  }

  private async createJournal(
    mutationType: string,
    quantity: number,
    inventoryId: string,
    orderId: string,
    destinationInventoryId: string,
    status: MutationStatus,
    remarks: string,
  ) {
    const stockJournal = new StockJournal();
    stockJournal.mutationType = mutationType;
    stockJournal.quantity = quantity;
    stockJournal.inventoryId = inventoryId;
    stockJournal.orderId = orderId ?? null;
    stockJournal.destinationInventoryId = destinationInventoryId ?? null;
    stockJournal.status = status;
    stockJournal.remarks = remarks ?? null;
    await this.stockJournal.save(stockJournal);
  }

  private async getNearestWarehouse(
    warehouses: Warehouse[],
    lat: number,
    lng: number,
  ): Promise<Warehouse> {
    let nearestWarehouse = warehouses[0];
    let nearestWarehouseDistance = 0;
    warehouses.forEach((warehouse) => {
      const distance = this.haversineDistance(
        lat,
        lng,
        warehouse.lat,
        warehouse.lng,
      );
      if (nearestWarehouseDistance === 0) {
        nearestWarehouseDistance = distance;
        nearestWarehouse = warehouse;
      } else if (nearestWarehouseDistance > distance) {
        nearestWarehouseDistance = distance;
        nearestWarehouse = warehouse;
      }
    });
    return nearestWarehouse;
  }

  private haversineDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number {
    // "lat": -6.1255857,
    // "lng": 106.6561203
    function toRad(x) {
      return (x * Math.PI) / 180;
    }
    const R = 6371;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lng1 - lng2);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return parseFloat(distance.toFixed(2));
  }

  private async checkAvailableStock(
    warehouseId: string,
    productId: string,
    quantity: number,
  ): Promise<InventoryStockCheckResponseDto> {
    const inventory = await this.inventoryRepository.findOne({
      where: { warehouseId, productId },
    });
    const isAvailable = inventory.quantity >= quantity;
    const stockCheck = new InventoryStockCheckResponseDto();
    stockCheck.isAvailable = isAvailable;
    stockCheck.quantity = inventory.quantity;
    return stockCheck;
  }

  private async validateAdminWarehouse(
    adminId: string,
    sourceInventoryId: string,
  ): Promise<boolean> {
    return (
      (
        await this.warehouseRepository.findOne({
          where: { id: sourceInventoryId },
        })
      ).adminWarehouses.filter((admin) => admin.userId === adminId).length > 0
    );
  }

  private async validateInventoryStock(
    inventoryId: string,
    productId: string,
    quantity: number,
  ): Promise<boolean> {
    return (
      (
        await this.inventoryRepository.findOne({
          where: { id: inventoryId, productId },
        })
      ).quantity >= quantity
    );
  }

  private convertToTotalInventory(
    inventories: Inventory[],
  ): InventoryTotalProductResponseDto {
    return {
      productId: inventories[0].productId,
      quantity: inventories.reduce((acc, curr) => acc + curr.quantity, 0),
    };
  }

  private convertToStockRequest(
    stockJournals: StockJournal[],
  ): InventoryStockRequestResponseDto[] {
    return stockJournals.map((stockJournal) => ({
      journalId: stockJournal.id,
      mutationType: stockJournal.mutationType,
      quantity: stockJournal.quantity,
      inventoryId: stockJournal.inventoryId,
      sourceWarehouse: stockJournal.inventory.warehouse.name,
      destinationInventoryId: stockJournal.destinationInventoryId,
      destinationWarehouse:
        stockJournal.destinationInventory?.warehouse.name ?? null,
      remarks: stockJournal.remarks,
      createdDate: stockJournal.createdDate,
    }));
  }
}
