import { NestFactory } from '@nestjs/core';
import { WarehouseModule } from './warehouse.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    WarehouseModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:29092'],
        },
        consumer: {
          groupId: 'warehouse-consumer',
        },
      },
    },
  );
  app.listen();
}
bootstrap();
