import { Controller, Get, Req, Res, Inject, BadRequestException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  constructor(
    @Inject('SERVICE_A') private readonly userServiceClient: ClientProxy,  // Microservice A
    @Inject('SERVICE_B') private readonly orderServiceClient: ClientProxy, // Microservice B
  ) {}

  routeRequest(service: string): ClientProxy {
    switch (service) {
      case 'users':
        return this.userServiceClient;
      case 'orders':
        return this.orderServiceClient;
      default:
        throw new BadRequestException("No such service");
    }
  }

  @Get('*')
  async handleRequest(@Req() req: Request, @Res() res: Response) {
    const service = req.path.split('/')[1];

    const client = this.routeRequest(service);

    try {
      const response = await client.send({ cmd: req.method }, req.body).toPromise();
      return res.json(response);
    } catch (error) {
      return res.status(500).json({ message: 'Error processing request', error: error.message });
    }
  }
}
