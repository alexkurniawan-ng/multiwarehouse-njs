import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateAddressRequestDto } from 'src/dtos/update-address.request.dto';
import { CreateAddressRequestDto } from 'src/dtos/create-address.request.dto';
import { DeleteAddressRequestDto } from 'src/dtos/delete-address.request.dto';
import { ResultModelResponseDto } from 'src/dtos/result.response.dto';
import { SetPrimaryAddressRequestDto } from 'src/dtos/set-primary-address.request.dto';
import { Address } from 'src/entities/address.entity';
import { UserAddressCreatedEvent } from 'src/events/user-address-created-event';
import { Repository } from 'typeorm';
import { UserAddressUpdatedEvent } from 'src/events/user-address-updated-event';
import { UserAddressDeletedEvent } from 'src/events/user-address-deleted-event';
import { UserAddressPrimaryUpdatedEvent } from 'src/events/user-address-primary-updated-event';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address) private addressRepository: Repository<Address>,
    @Inject('USER_SERVICE') private readonly userClient: ClientKafka,
  ) {}

  public async createAddress(
    createAddressDto: CreateAddressRequestDto,
  ): Promise<ResultModelResponseDto> {
    const { street, city, province, postalCode, userId, lat, lng } =
      createAddressDto;
    const newAddress = new Address();
    newAddress.street = street;
    newAddress.city = city;
    newAddress.province = province;
    newAddress.postalCode = postalCode;
    newAddress.userId = userId;
    newAddress.lat = lat;
    newAddress.lng = lng;
    const address = await this.getAddressByUserId(userId);
    if (address.length === 0) {
      newAddress.isDefault = true;
    } else {
      newAddress.isDefault = false;
    }
    await this.addressRepository.save(newAddress);
    this.userClient.emit(
      'user-address-created-event',
      new UserAddressCreatedEvent(newAddress),
    );
    console.log(`Address created with userId: ${userId}`);
    return new ResultModelResponseDto(true, 'Address Created');
  }

  public async getAddress(userId: string): Promise<Address[]> {
    const address = await this.getAddressByUserId(userId);
    console.log(`Address found with user ID: ${userId} with address: `);
    address.forEach((address) => {
      console.log(address);
    });
    return address;
  }

  public async updateAddress(
    updateAddressDto: UpdateAddressRequestDto,
  ): Promise<ResultModelResponseDto> {
    const { id, street, city, province, postalCode, lat, lng } =
      updateAddressDto;
    const address = await this.getAddressById(id);
    address.street = street;
    address.city = city;
    address.province = province;
    address.postalCode = postalCode;
    address.lat = lat;
    address.lng = lng;
    await this.addressRepository.save(address);
    this.userClient.emit(
      'user-address-updated-event',
      new UserAddressUpdatedEvent(address),
    );
    console.log(`Address successfully updated with id: ${id}`);
    return new ResultModelResponseDto(true, 'Address Updated');
  }

  public async setPrimaryAddress(
    primaryAddressDto: SetPrimaryAddressRequestDto,
  ): Promise<ResultModelResponseDto> {
    const { addressId, userId } = primaryAddressDto;
    const addresses = await this.getAddressByUserId(userId);
    console.log(addresses);
    for (const address of addresses) {
      if (address.isDefault !== (address.id === addressId)) {
        address.isDefault = address.id === addressId;
        await this.addressRepository.save(address);
        this.userClient.emit(
          'user-address-primary-updated-event',
          new UserAddressPrimaryUpdatedEvent({
            addressId: address.id,
            userId: address.userId,
            isDefault: address.isDefault,
          }),
        );
        console.log(
          `Address with id: ${addressId}, successfully appointed primary address`,
        );
      }
    }
    return new ResultModelResponseDto(
      true,
      `Address with id: ${addressId} are successfully appointed primary`,
    );
  }

  public async deleteAddress(
    deleteAddressDto: DeleteAddressRequestDto,
  ): Promise<ResultModelResponseDto> {
    const { id } = deleteAddressDto;
    await this.addressRepository.delete(id);
    this.userClient.emit(
      'user-address-deleted-event',
      new UserAddressDeletedEvent({ id }),
    );
    console.log(`Address successfully deleted with id: ${id}`);
    return new ResultModelResponseDto(true, 'Address Deleted');
  }

  private async getAddressByUserId(userId: string): Promise<Address[]> {
    return await this.addressRepository.find({ where: { userId } });
  }

  private async getAddressById(id: string): Promise<Address> {
    return await this.addressRepository.findOne({ where: { id } });
  }
}

// TODO: User can set primary address
// TODO: User can delete and Edit address
