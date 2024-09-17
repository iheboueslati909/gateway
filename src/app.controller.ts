import { Controller, Get, UseGuards } from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import { delay } from "rxjs/operators";
import { of } from "rxjs";
import { UserService } from './user/user.service';
import { OrderService } from './order/order.service';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
    private readonly orderService: OrderService,
    private readonly authService: AuthService
  ) {}
  
  routeRequest(service: string) {
    switch (service) {
      case 'user':
        return this.userService;
      case 'orders':
        return this.orderService;
      case 'auth':
        return this.authService;
      default:
        throw new Error('Unknown service');
    }
  }
  
  @Get("/ping-a")
  pingServiceA() {
    console.log("fggg")
    return this.appService.pingServiceA();
  }
}