import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { RegisterRequestDto } from 'src/dtos/register.request.dto';
import { ForgotPasswordRequestDto } from 'src/dtos/forgot-password.request.dto';
import { CreateAddressRequestDto } from 'src/dtos/create-address.request.dto';

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

  @Post('address')
  async createAddress(@Body() body: CreateAddressRequestDto) {
    return this.userService.createAddress(body);
  }
}
