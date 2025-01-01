import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { RegisterRequestDto } from 'src/dtos/register.request.dto';
import { ForgotPasswordRequestDto } from 'src/dtos/forgot-password.request.dto';
import { CreateAddressRequestDto } from 'src/dtos/create-address.request.dto';
import { GetAddressRequestDto } from 'src/dtos/get-address.request.dto';
import { ChangeAddressRequestDto } from 'src/dtos/change-address.request.dto';
import { DeleteAddressRequestDto } from 'src/dtos/delete-address.request.dto';
import { SetPrimaryAddressRequestDto } from 'src/dtos/set-primary-address.request.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  async register(@Body() body: RegisterRequestDto) {
    return this.userService.register(body);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordRequestDto) {
    return this.userService.forgotPassword(body);
  }

  @Post('get-address')
  async getAddress(@Body() body: GetAddressRequestDto) {
    return this.userService.getAddress(body);
  }

  @Post('create-address')
  async createAddress(@Body() body: CreateAddressRequestDto) {
    return this.userService.createAddress(body);
  }

  @Post('change-address')
  async changeAddress(@Body() body: ChangeAddressRequestDto) {
    return this.userService.changeAddress(body);
  }

  @Post('delete-address')
  async deleteAddress(@Body() body: DeleteAddressRequestDto) {
    return this.userService.deleteAddress(body);
  }

  @Post('set-primary-address')
  async setPrimaryAddress(@Body() body: SetPrimaryAddressRequestDto) {
    return this.userService.setPrimaryAddress(body);
  }
}
