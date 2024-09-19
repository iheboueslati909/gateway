import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const port = configService.get<number>('APP_PORT');
  const host = configService.get<string>('APP_HOST');

  const microservice = app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: host,
      port: port,
    },
  },
    { inheritAppConfig: true },
  );

  await app.startAllMicroservices();
  await app.listen(port);
  console.log("env = ", process.env.NODE_ENV , " host:port = " , host,":",port);
  //await microservice.listen();
}

bootstrap();
