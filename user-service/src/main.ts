import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:29092'],
        },
        consumer: {
          groupId: 'user-consumer',
        },
      },
    },
  );
  await app.listen();

  const httpApp = await NestFactory.create(UserModule);
  await httpApp.listen(3001, () => {
    console.log('User service is listening on port 3001');
  });
}
bootstrap();
