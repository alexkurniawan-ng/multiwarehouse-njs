import { Body, Controller, Post } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { GetUserRequestDto } from 'src/dtos/get-user.request.dto';
import { LoginRequestDto } from 'src/dtos/login.request.dto';
import { TokenResponseDto } from 'src/dtos/login.response.dto';
import { AuthService } from 'src/services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginRequestDto): Promise<TokenResponseDto> {
    return await this.authService.login(body);
  }
}
