import { Controller, Get, Req, Res, Inject, BadRequestException, Post, Put, Delete, UseGuards, HttpStatus } from '@nestjs/common';
import { ClientGrpc, ClientGrpcProxy, ClientProxy } from '@nestjs/microservices';
import { Request, Response } from 'express';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { Public } from './auth/decorators/public.decorator';
import { AuthResponse, LoginRequest, UserService } from './proto/user-app';

@Controller()
@UseGuards(JwtAuthGuard)
export class AppController {
  private userServiceClient: UserService;


  constructor(
    @Inject('USER_MS') private readonly userServiceClientProxy: ClientGrpc,  // Microservice A
    @Inject('EVENTS_MS') private readonly orderServiceClientProxy: ClientGrpc, // Microservice B
    private readonly authService: AuthService
  ) { }

  onModuleInit() {
    // Ensure this is properly initialized
    this.userServiceClient = this.userServiceClientProxy.getService<UserService>('UserService');
    if (!this.userServiceClient) {
      console.error("UserService client not initialized properly.");
    }
  }

  @Public()
  @Post('auth/login')
  async handleLogin(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    try {
      const loginRequest: LoginRequest = {
        email: req.body.email,
        password: req.body.password,
      };

      const response = await this.userServiceClient.Login(loginRequest);

      res.status(HttpStatus.OK);
      return response;
    } catch (error) {
      console.error("Error during gRPC call:", error.message);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      return { message: 'Error processing login', error: error.message };
    }
  }

  @Public()
  @Post('auth/signup')
  async handleSignup(@Req() req: Request, @Res() res: Response) {
    try {
      const signupRequest = req.body;
      // Directly call gRPC SignUp method
      const response = await this.userServiceClient.SignUp(signupRequest);
      return res.json(response);
    } catch (error) {
      return res.status(500).json({ message: 'Error processing signup', error: error.message });
    }
  }

  @Get('*')
  async handleGetRequest(@Req() req: Request, @Res() res: Response) {
    const [serviceName, method] = req.path.split('/').slice(1);
    const client = this.routeRequest(serviceName);
    try {
      const response = await client[method](); // Dynamically call method
      return res.json(response);
    } catch (error) {
      return res.status(500).json({ message: 'Error processing request', error: error.message });
    }
  }

  @Delete('*')
  async handleDeleteRequest(@Req() req: Request, @Res() res: Response) {
    const [serviceName, method] = req.path.split('/').slice(1);
    const client = this.routeRequest(serviceName);
    try {
      const response = await client[method]();
      return res.json(response);
    } catch (error) {
      return res.status(500).json({ message: 'Error processing request', error: error.message });
    }
  }

  @Post('*')
  async handlePostRequest(@Req() req: Request, @Res() res: Response) {
    const [serviceName, method] = req.path.split('/').slice(1);
    const client = this.routeRequest(serviceName);
    try {
      const response = await client[method](req.body);
      return res.json(response);
    } catch (error) {
      return res.status(500).json({ message: 'Error processing request', error: error.message });
    }
  }

  @Put('*')
  async handlePutRequest(@Req() req: Request, @Res() res: Response) {
    const [serviceName, method] = req.path.split('/').slice(1);
    const client = this.routeRequest(serviceName);
    try {
      const response = await client[method](req.body);  // Passing request body
      return res.json(response);
    } catch (error) {
      return res.status(500).json({ message: 'Error processing request', error: error.message });
    }
  }

  private routeRequest(serviceName: string) {
    switch (serviceName) {
      case 'user': return this.userServiceClient;
      default:
        throw new Error('Unknown service');
    }
  }

}
