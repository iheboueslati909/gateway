import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions,Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const grpcApp = await app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'gateway',
      protoPath: join(__dirname, '../proto/gateway-app.proto'),
      url: 'localhost:50000',  // un-hard code it
    },
  });
  const configService = app.get(ConfigService);

  const port = configService.get<number>('APP_PORT');
  const host = configService.get<string>('APP_HOST');

  app.useGlobalPipes(new ValidationPipe());
  console.log("env = ", process.env.NODE_ENV , " host:port = " , host,":",port);

  await app.startAllMicroservices();
  await app.listen(port, host); 
}

bootstrap();
