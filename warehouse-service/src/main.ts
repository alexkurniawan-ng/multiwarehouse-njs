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
  await app.listen();

  const httpApp = await NestFactory.create(WarehouseModule, { cors: true });
  await httpApp.listen(3002, () => {
    console.log('Warehouse service is listening on port 3002');
  });
}
bootstrap();
