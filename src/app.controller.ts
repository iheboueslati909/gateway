import { Controller, Get, UseGuards } from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import { delay } from "rxjs/operators";
import { of } from "rxjs";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/ping-a")
  pingServiceA() {
    console.log("fggg")
    return this.appService.pingServiceA();
  }
}