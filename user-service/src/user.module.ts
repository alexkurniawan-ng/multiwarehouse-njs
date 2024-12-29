import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import EmailService from './services/email.service';
import { DatabaseType } from 'typeorm';
import { PassportModule } from '@nestjs/passport';
import { AccessTokenStrategy } from './jwt-strategies/access-token.strategy';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User, Role]),
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<DatabaseType>('DB_TYPE'),
        url: configService.get<string>('DB_CONNECTION_STRING'),
        autoLoadEntities: true,
        migrationsRun: true,
        migrations: ['dist/migrations/*.js'],
        // logging: true,
      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
      }),
    }),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'user',
            brokers: ['localhost:29092'],
          },
          consumer: {
            groupId: 'user-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [UserController, AuthController],
  providers: [UserService, AuthService, EmailService, AccessTokenStrategy],
})
export class UserModule {}
