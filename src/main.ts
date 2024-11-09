import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions,Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';

async function bootstrap() {
  // Initialize the main app for HTTP
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Retrieve configuration values from ConfigService
  const grpcHost = configService.get<string>('GRPC_HOST');
  const grpcPort = configService.get<number>('GRPC_PORT');
  const appPort = configService.get<number>('APP_PORT');
  const appHost = configService.get<string>('APP_HOST');

  // Apply pipes only to the HTTP server
  app.useGlobalPipes(new ValidationPipe());

  console.log("env =", process.env.NODE_ENV, " host:port =", appHost, ":", appPort);

  // Start the HTTP server and gRPC microservice
  const grpcApp = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'gateway',
      protoPath: join(__dirname, '../proto/gateway-app.proto'),
      url: `${grpcHost}:${grpcPort}`, // URL is now dynamically configured
    },
  });

  await app.startAllMicroservices();
  await app.listen(appPort);

}
bootstrap();
