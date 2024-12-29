import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AppUnauthorizedException } from 'exceptions/app-unauthorized.exception';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      algorithms: ['HS256'],
    });
  }

  async validate(payload: any) {
    console.log({ payload });
    if (payload.token_type !== 'access') {
      throw new AppUnauthorizedException('Invalid access token.');
    }
    const user = {
      id: payload.id,
      email: payload.email,
      roles: payload.roles,
    };
    return user;
  }
}
