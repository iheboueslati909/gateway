import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  // Create the HTTP server to handle regular HTTP requests like @Get()
  const app = await NestFactory.create(AppModule);

  const port = 8888;


  // Create and run the microservice to handle @MessagePattern
  const microservice = app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: port,
    },
  },
    { inheritAppConfig: true },
  );

  await app.startAllMicroservices();
  await app.listen(port);
  console.log(`HTTP server is running on http://localhost:${port}`);
  //await microservice.listen();
}

bootstrap();
