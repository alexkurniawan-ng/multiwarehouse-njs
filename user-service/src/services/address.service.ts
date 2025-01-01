import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChangeAddressRequestDto } from 'src/dtos/change-address.request.dto';
import { CreateAddressRequestDto } from 'src/dtos/create-address.request.dto';
import { DeleteAddressRequestDto } from 'src/dtos/delete-address.request.dto';
import { ResultModelResponseDto } from 'src/dtos/result.response.dto';
import { SetPrimaryAddressRequestDto } from 'src/dtos/set-primary-address.request.dto';
import { Address } from 'src/entities/address.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address) private addressRepository: Repository<Address>,
  ) {}

  public async createAddress(
    createAddressDto: CreateAddressRequestDto,
  ): Promise<void> {
    const { street, city, province, postalCode, userId } = createAddressDto;
    const newAddress = new Address();
    newAddress.street = street;
    newAddress.city = city;
    newAddress.province = province;
    newAddress.postalCode = postalCode;
    newAddress.userId = userId;
    const address = await this.getAddressByUserId(userId);
    if (address.length === 0) {
      newAddress.isDefault = true;
    } else {
      newAddress.isDefault = false;
    }
    await this.addressRepository.save(newAddress);
    console.log(`Address created with user ID: ${userId}`);
  }

  public async getAddress(userId: number): Promise<Address[]> {
    const address = await this.getAddressByUserId(userId);
    console.log(`Address found with user ID: ${userId} with address: `);
    address.forEach((address) => {
      console.log(address);
    });
    return address;
  }

  public async changeAddress(
    changeAddressDto: ChangeAddressRequestDto,
  ): Promise<void> {
    const { id, street, city, province, postalCode } = changeAddressDto;
    const address = await this.getAddressById(id);
    address.street = street;
    address.city = city;
    address.province = province;
    address.postalCode = postalCode;
    await this.addressRepository.save(address);
    console.log(`Address changed with ID: ${id}`);
  }

  public async setPrimaryAddress(
    primaryAddressDto: SetPrimaryAddressRequestDto,
  ): Promise<void> {
    const { addressId, userId } = primaryAddressDto;
    const addresses = await this.getAddressByUserId(userId);
    console.log(addresses);
    for (const address of addresses) {
      address.isDefault = address.id === addressId;
      console.log(
        `address ${addressId}: isdefault = ${address.id === addressId}`,
      );
      await this.addressRepository.save(address);
    }
    console.log(
      `Address with id: ${addressId} are successfully appointed primary`,
    );
  }

  public async deleteAddress(
    deleteAddressDto: DeleteAddressRequestDto,
  ): Promise<void> {
    const { id } = deleteAddressDto;
    await this.addressRepository.delete(id);
    console.log(`Address with id: ${id} deleted successfully`);
  }

  private async getAddressByUserId(userId: number): Promise<Address[]> {
    return await this.addressRepository.find({ where: { userId } });
  }

  private async getAddressById(id: number): Promise<Address> {
    return await this.addressRepository.findOne({ where: { id } });
  }
}

// TODO: User can set primary address
// TODO: User can delete and Edit address
