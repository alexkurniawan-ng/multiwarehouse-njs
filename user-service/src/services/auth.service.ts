import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginRequestDto } from 'src/dtos/login.request.dto';
import { TokenResponseDto } from 'src/dtos/login.response.dto';
import { AppBadRequestException } from 'exceptions/app-bad-request.exception';
import * as argon2 from 'argon2';
import { randomUUID } from 'crypto';
import { User } from 'src/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly jwtExpiry: string;
  private readonly passwordPepper: string;

  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {
    this.passwordPepper = this.configService.get<string>('PASSWORD_PEPPER');
    this.jwtExpiry = this.configService.get<string>('JWT_EXPIRY');
  }

  public async login(body: LoginRequestDto): Promise<TokenResponseDto> {
    const user = await this.userService.getUserByEmail(body.email);
    if (!user) throw new AppBadRequestException('User not found');

    const isValidPassword = await this.verifyPasswordWithHash(
      body.password,
      user.passwordHash,
      this.passwordPepper,
    );

    if (!isValidPassword) {
      throw new AppBadRequestException('Username or password invalid.');
    }
    return this.generateToken(user);
  }

  private generateToken(user: User): TokenResponseDto {
    const token = this.generateAccessToken(user);

    return {
      accessToken: token,
      userId: user.id,
      refreshToken: '',
      roles: user.roles.map((role) => role.name),
    };
  }

  private generateAccessToken(user: User): string {
    const claims = {
      id: user.id,
      email: user.email,
      roles: user.roles.map((role) => role.name),
      token_type: 'access',
    };
    return this.jwtService.sign(claims, {
      jwtid: randomUUID(),
    });
  }

  private async verifyPasswordWithHash(
    password: string,
    hash: string,
    pepper: string,
  ): Promise<boolean> {
    const secret = Buffer.from(pepper);
    return await argon2.verify(hash, password, { secret });
  }
}
