import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions,Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';

async function bootstrap() {
  //const app = await NestFactory.create(AppModule);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'gateway',
      protoPath: join(__dirname, '../proto/gateway-app.proto'),
      url: 'localhost:8888', 
    },
  });
  const configService = app.get(ConfigService);

  const port = configService.get<number>('APP_PORT');
  const host = configService.get<string>('APP_HOST');

  /*const microservice = app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: host,
      port: port,
    },
  },
    { inheritAppConfig: true },
  );
  */

  //supposed to make authguard work globally but it seems useless marking this for later research
  //app.useGlobalGuards(new JwtAuthGuard(new Reflector()));
  //await app.startAllMicroservices();
  app.useGlobalPipes(new ValidationPipe());
  //await app.listen(port);
  console.log("env = ", process.env.NODE_ENV , " host:port = " , host,":",port);
  //await microservice.listen();
}

bootstrap();
