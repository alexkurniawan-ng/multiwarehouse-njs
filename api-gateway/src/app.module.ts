import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';

@Module({
  imports: [
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
      {
        name: 'WAREHOUSE_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'warehouse',
            brokers: ['localhost:29092'],
          },
          consumer: {
            groupId: 'warehouse-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {}
