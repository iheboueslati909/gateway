import { Controller, Get, Req, Res, Inject, BadRequestException, Post, Put, Delete, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request, Response } from 'express';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { Public } from './auth/decorators/public.decorator';

@Controller()
@UseGuards(JwtAuthGuard)
export class AppController {
  constructor(
    @Inject('USER_MS') private readonly userServiceClient: ClientProxy,  // Microservice A
    @Inject('EVENTS_MS') private readonly orderServiceClient: ClientProxy, // Microservice B
    private readonly authService: AuthService
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

  @Public() //////////////// WHY USER SERVICE ?
  @Post('auth/login')
  async handleLogin(@Req() req: Request, @Res() res: Response) {
    const client = this.userServiceClient;
    try {
      const response = await client.send({ method: 'Login' }, req.body).toPromise();
      return res.json(response);
    } catch (error) {
      return res.status(500).json({ message: 'Error processing login', error: error.message });
    }
  }
  @Public()
  @Post('auth/signup')
  async handleSignup(@Req() req: Request, @Res() res: Response) {
    const client = this.userServiceClient;
    try {
      const response = await client.send({ method: 'Signup' }, req.body).toPromise();
      return res.json(response);
    } catch (error) {
      return res.status(500).json({ message: 'Error processing signup', error: error.message });
    }
  }

  @Get('*')
  async handleGetRequest(@Req() req: Request, @Res() res: Response) {
    const service = req.path.split('/')[1]+'_API';
    const client = this.routeRequest(service);
    const methodName = `${req.path.split('/')[2]}`;
    const parameter = req.path.split('/')[3];
    try {
      const response = await client.send({ method: methodName }, parameter ? { parameter } : {}).toPromise();
      return res.json(response);
    } catch (error) {
      return res.status(500).json({ message: 'Error processing request', error: error.message });
    }
  }

  @Delete('*')
  async handleDeleteRequest(@Req() req: Request, @Res() res: Response) {
    const service = req.path.split('/')[1]+'_API';
    const client = this.routeRequest(service);
    const methodName = `${req.path.split('/')[2]}`;
    const parameter = req.path.split('/')[3];

    try {
      const response = await client.send({ method: methodName }, parameter ? { parameter } : {}).toPromise();
      return res.json(response);
    } catch (error) {
      return res.status(500).json({ message: 'Error processing request', error: error.message });
    }
  }

  @Post('*')
  async handlePostRequest(@Req() req: Request, @Res() res: Response) {
    const service = req.path.split('/')[1]+'_API';
    const client = this.routeRequest(service);
    const methodName = `${req.path.split('/')[2]}`; 
    try {
      const response = await client.send({ method: methodName }, req.body).toPromise();
      return res.json(response);
    } catch (error) {
      return res.status(500).json({ message: 'Error processing request', error: error.message });
    }
  }

  @Put('*')
  async handlePutRequest(@Req() req: Request, @Res() res: Response) {
    const service = req.path.split('/')[1]+'_API';
    const client = this.routeRequest(service);
    const methodName = `${req.path.split('/')[2]}`;
    try {
      const response = await client.send({ method: methodName }, req.body).toPromise();
      return res.json(response);
    } catch (error) {
      return res.status(500).json({ message: 'Error processing request', error: error.message });
    }
  }

}
