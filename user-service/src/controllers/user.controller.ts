import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { ChangePasswordRequestDto } from 'src/dtos/change-pasword.request.dto';
import { CreateAdminBySuperAdminRequestDto } from 'src/dtos/create-admin-by-super-admin.request.dto';
import { ForgotPasswordRequestDto } from 'src/dtos/forgot-password.request.dto';
import { GetUserRequestDto } from 'src/dtos/get-user.request.dto';
import { LoginRequestDto } from 'src/dtos/login.request.dto';
import { TokenResponseDto } from 'src/dtos/login.response.dto';
import { RegisterRequestDto } from 'src/dtos/register.request.dto';
import { ResetPasswordRequestDto } from 'src/dtos/reset-password.request.dto';
import { ResultModelResponseDto } from 'src/dtos/result.response.dto';
import { UserProfileResponseDto } from 'src/dtos/user-profile.response.dto';
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

  @MessagePattern('get_user')
  async getUser(data: GetUserRequestDto) {
    return this.userService.getUser(data);
  }

  @EventPattern('user_created_request')
  async handleUserCreated(@Payload() data: any) {
    return this.userService.register(data.value);
  }

  @EventPattern('user_forgot_password_request')
  async handleUserChangedPassword(@Payload() data: any) {
    return this.userService.forgotPassword(data.value);
  }

  @EventPattern('get_user_address_request')
  async handleGetAddress(@Payload() data: any) {
    return this.addressService.getAddress(data.value.userId);
  }

  @EventPattern('user_address_created_request')
  async handleAddressCreated(@Payload() data: any) {
    return this.addressService.createAddress(data.value);
  }

  @EventPattern('user_address_changed_request')
  async handleAddressChanged(@Payload() data: any) {
    return this.addressService.changeAddress(data.value);
  }

  @EventPattern('user_address_deleted_request')
  async handleAddressDeleted(@Payload() data: any) {
    return this.addressService.deleteAddress(data.value);
  }

  @EventPattern('user_address_primary_request')
  async handleSetPrimaryAddress(@Payload() data: any) {
    return this.addressService.setPrimaryAddress(data.value);
  }

  // REST API
  @Get()
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  async getUserProfile(@Req() request): Promise<UserProfileResponseDto> {
    return await this.userService.getUserProfile(request.user.id);
  }

  @Post('create-admin')
  @Roles(Role.SuperAdmin)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiBearerAuth()
  async createAdminBySuperAdmin(
    @Body() body: CreateAdminBySuperAdminRequestDto,
  ): Promise<ResultModelResponseDto> {
    return await this.userService.createAdminBySuperAdmin(body);
  }

  // @Post('forgot-password')
  // async forgotPassword(
  //   @Body() body: ForgotPasswordRequestDto,
  // ): Promise<ResultModelResponseDto> {
  //   return await this.userService.forgotPassword(body);
  // }

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
}
