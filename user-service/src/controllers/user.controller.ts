import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { UpdateAddressRequestDto } from 'src/dtos/update-address.request.dto';
import { ChangePasswordRequestDto } from 'src/dtos/change-pasword.request.dto';
import { CreateAddressRequestDto } from 'src/dtos/create-address.request.dto';
import { CreateAdminBySuperAdminRequestDto } from 'src/dtos/create-admin-by-super-admin.request.dto';
import { DeleteAddressRequestDto } from 'src/dtos/delete-address.request.dto';
import { ForgotPasswordRequestDto } from 'src/dtos/forgot-password.request.dto';
import { GetAddressRequestDto } from 'src/dtos/get-address.request.dto';
import { GetUserRequestDto } from 'src/dtos/get-user.request.dto';
import { LoginRequestDto } from 'src/dtos/login.request.dto';
import { TokenResponseDto } from 'src/dtos/login.response.dto';
import { RegisterRequestDto } from 'src/dtos/register.request.dto';
import { ResetPasswordRequestDto } from 'src/dtos/reset-password.request.dto';
import { ResultModelResponseDto } from 'src/dtos/result.response.dto';
import { SetPrimaryAddressRequestDto } from 'src/dtos/set-primary-address.request.dto';
import { UserProfileResponseDto } from 'src/dtos/user-profile.response.dto';
import { Address } from 'src/entities/address.entity';
import { Role } from 'src/enums/role.enum';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { AddressService } from 'src/services/address.service';
import { UserService } from 'src/services/user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly addressService: AddressService,
  ) {}

  // LISTENER
  @MessagePattern('get_user_data')
  async getUser(data: GetUserRequestDto) {
    return this.userService.getUser(data);
  }

  @MessagePattern('get_user_address')
  async getUserAddress(data: GetUserRequestDto) {
    return this.userService.getUser(data);
  }

  @EventPattern('user_created_event')
  async handleUserCreated(@Payload() data: any) {
    return this.userService.sendVerifyEmail(data.value);
  }
  // @EventPattern('user_created_request')
  // async handleUserCreated(@Payload() data: any) {
  //   return this.userService.register(data.value);
  // }

  // @EventPattern('user_forgot_password_request')
  // async handleUserChangedPassword(@Payload() data: any) {
  //   return this.userService.forgotPassword(data.value);
  // }

  // @EventPattern('get_user_address_request')
  // async handleGetAddress(@Payload() data: any) {
  //   return this.addressService.getAddress(data.value.userId);
  // }

  // @EventPattern('user_address_created_event')
  // async handleAddressCreated(@Payload() data: any) {
  //   return this.addressService.createAddress(data.value);
  // }

  // @EventPattern('user_address_changed_request')
  // async handleAddressChanged(@Payload() data: any) {
  //   return this.addressService.changeAddress(data.value);
  // }

  // @EventPattern('user_address_deleted_request')
  // async handleAddressDeleted(@Payload() data: any) {
  //   return this.addressService.deleteAddress(data.value);
  // }

  // @EventPattern('user_address_primary_request')
  // async handleSetPrimaryAddress(@Payload() data: any) {
  //   return this.addressService.setPrimaryAddress(data.value);
  // }

  // REST API
  // == ADMIN ==
  @Post('create-admin')
  @Roles(Role.SuperAdmin)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiBearerAuth()
  async createAdminBySuperAdmin(
    @Body() body: CreateAdminBySuperAdminRequestDto,
  ): Promise<ResultModelResponseDto> {
    return await this.userService.createAdminBySuperAdmin(body);
  }

  @Get()
  @Roles(Role.SuperAdmin)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiBearerAuth()
  async getAllUserList(): Promise<UserProfileResponseDto[]> {
    return await this.userService.getAllUsers();
  }

  // == USER ==
  @Get()
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  async getUserProfile(@Req() request): Promise<UserProfileResponseDto> {
    return await this.userService.getUserProfile(request.user.id);
  }

  @Post('register')
  async register(
    @Body() body: RegisterRequestDto,
  ): Promise<ResultModelResponseDto> {
    return await this.userService.register(body);
  }

  @Post('resend-email')
  async reSendEmail(
    @Body() body: RegisterRequestDto,
  ): Promise<ResultModelResponseDto> {
    return await this.userService.reSendEmail(body);
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body() body: ForgotPasswordRequestDto,
  ): Promise<ResultModelResponseDto> {
    return await this.userService.forgotPassword(body);
  }

  @Post('reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body() body: ResetPasswordRequestDto,
  ): Promise<ResultModelResponseDto> {
    console.log({ body });
    return await this.userService.resetPassword(token, body);
  }

  @Put('change-password')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  async changePassword(
    @Req() request,
    @Body() body: ChangePasswordRequestDto,
  ): Promise<ResultModelResponseDto> {
    console.log({ body });
    return await this.userService.changePassword(request.user.id, body);
  }

  // ADDRESS
  @Post('get-address')
  async getAddress(@Body() body: GetAddressRequestDto): Promise<Address[]> {
    return await this.addressService.getAddress(body.userId);
  }

  @Post('create-address')
  async createAddress(
    @Body() body: CreateAddressRequestDto,
  ): Promise<ResultModelResponseDto> {
    return await this.addressService.createAddress(body);
  }

  @Post('update-address')
  async changeAddress(
    @Body() body: UpdateAddressRequestDto,
  ): Promise<ResultModelResponseDto> {
    return await this.addressService.updateAddress(body);
  }

  @Post('delete-address')
  async deleteAddress(
    @Body() body: DeleteAddressRequestDto,
  ): Promise<ResultModelResponseDto> {
    return await this.addressService.deleteAddress(body);
  }

  @Post('set-primary-address')
  async setPrimaryAddress(
    @Body() body: SetPrimaryAddressRequestDto,
  ): Promise<ResultModelResponseDto> {
    return await this.addressService.setPrimaryAddress(body);
  }
}
