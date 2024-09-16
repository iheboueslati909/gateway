import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  // Create the HTTP server to handle regular HTTP requests like @Get()
  const app = await NestFactory.create(AppModule);
  

  // Start the HTTP server on the desired port
  const port = 8888;
  await app.listen(port);
  console.log(`HTTP server is running on http://localhost:${port}`);

  // Create and run the microservice to handle @MessagePattern
  const microservice = app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: port,
    },
  });

  await microservice.listen();
}

bootstrap();
