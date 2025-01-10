import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ProductModule } from './product.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ProductModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:29092'],
        },
        consumer: {
          groupId: 'product-consumer',
        },
      },
    },
  );
  await app.listen();

  const httpApp = await NestFactory.create(ProductModule, { cors: true });
  await httpApp.listen(3003, () => {
    console.log('User service is listening on port 3003');
  });
}
bootstrap();
