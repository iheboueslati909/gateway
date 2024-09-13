import { Controller, Get, UseGuards } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private client: ClientProxy;

  constructor(private readonly appService: AppService) {
    // Setup microservice client (e.g., for communication with the events microservice)
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP, // Example with TCP; adapt based on your communication protocol
      options: {
        host: '127.0.0.1',
        port: 3001,
      },
    });
  }

  @Get('forward')
  async forwardRequest() {
    // Forwarding the request to the events microservice after JWT validation
    const result = await this.client.send('process_event_request', {}).toPromise();
    return result;
  }
}