import { Injectable, Inject } from "@nestjs/common";
import { ClientGrpc, ClientProxy, GrpcMethod } from "@nestjs/microservices";
import { map } from "rxjs/operators";

@Injectable()
export class AppService {
  constructor(
    //@Inject("USER_MS") private readonly clientServiceA: ClientGrpc
  ) {}

  @GrpcMethod('HelloService', 'SayHello')
  sayHello(data: any): { message: string } {
    return { message: 'Hello, World!' };
  }
}
