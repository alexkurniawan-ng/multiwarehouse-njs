import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAddressRequestDto } from 'src/dtos/create-address.request.dto';
import { ResultModelResponseDto } from 'src/dtos/result.response.dto';
import { Address } from 'src/entities/address.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address) private addressRepository: Repository<Address>,
  ) {}

  public async createAddress(
    createAddressDto: CreateAddressRequestDto,
  ): Promise<ResultModelResponseDto> {
    console.log('Creating address...');
    console.log({ createAddressDto });
    const { street, city, province, postalCode, userId } = createAddressDto;
    const newAddress = new Address();
    newAddress.street = street;
    newAddress.city = city;
    newAddress.province = province;
    newAddress.postalCode = postalCode;
    newAddress.userId = userId;
    const address = await this.getAddressById(userId);
    if (address.length === 0) {
      newAddress.isDefault = true;
    } else {
      newAddress.isDefault = false;
    }
    await this.addressRepository.save(newAddress);
    console.log(`Address created with user ID: ${userId}`);
    return new ResultModelResponseDto(false, 'Address already exists');
  }

  private async getAddressById(userId: number): Promise<Address[]> {
    return await this.addressRepository.find({ where: { userId } });
  }
}

// TODO: User can set primary address
// TODO: User can delete and Edit address
