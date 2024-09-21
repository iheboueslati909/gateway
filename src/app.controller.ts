import { Controller, Get, Req, Res, Inject, BadRequestException, Post, Put, Delete } from '@nestjs/common';
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
      case 'users_API':
        return this.userServiceClient;
      case 'events_API':
        return this.orderServiceClient;
      default:
        throw new BadRequestException("No such service");
    }
  }

  @Get('*')
  async handleGetRequest(@Req() req: Request, @Res() res: Response) {
    const service = req.path.split('/')[1]+'_API';
    const client = this.routeRequest(service);
    const command = `${req.method.toUpperCase()}/${service.toUpperCase()}/${req.path.split('/').slice(2).join('/').toUpperCase()}`;
    try {
      const response = await client.send({ cmd: command }, req.body).toPromise();
      return res.json(response);
    } catch (error) {
      return res.status(500).json({ message: 'Error processing request', error: error.message });
    }
  }

  @Post('*')
  async handlePostRequest(@Req() req: Request, @Res() res: Response) {
    const service = req.path.split('/')[1]+'_API';
    const client = this.routeRequest(service);
    const command = `${req.method.toUpperCase()}/${service.toUpperCase()}/${req.path.split('/').slice(2).join('/').toUpperCase()}`;

    try {
      const response = await client.send({ cmd: command }, req.body).toPromise();
      return res.json(response);
    } catch (error) {
      return res.status(500).json({ message: 'Error processing request', error: error.message });
    }
  }

  @Put('*')
  async handlePutRequest(@Req() req: Request, @Res() res: Response) {
    const service = req.path.split('/')[1]+'_API';
    const client = this.routeRequest(service);
    const command = `${req.method.toUpperCase()}/${service.toUpperCase()}/${req.path.split('/').slice(2).join('/').toUpperCase()}`;

    try {
      const response = await client.send({ cmd: command }, req.body).toPromise();
      return res.json(response);
    } catch (error) {
      return res.status(500).json({ message: 'Error processing request', error: error.message });
    }
  }

  @Delete('*')
  async handleDeleteRequest(@Req() req: Request, @Res() res: Response) {
    const service = req.path.split('/')[1]+'_API';
    const client = this.routeRequest(service);
    const command = `${req.method.toUpperCase()}/${service.toUpperCase()}/${req.path.split('/').slice(2).join('/').toUpperCase()}`;

    try {
      const response = await client.send({ cmd: command }, req.body).toPromise();
      return res.json(response);
    } catch (error) {
      return res.status(500).json({ message: 'Error processing request', error: error.message });
    }
  }

}
