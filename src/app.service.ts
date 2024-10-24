import { Injectable, Inject } from "@nestjs/common";
import { ClientProxy, GrpcMethod } from "@nestjs/microservices";
import { map } from "rxjs/operators";

@Injectable()
export class AppService {
  constructor(
    @Inject("USER_MS") private readonly clientServiceA: ClientProxy
  ) {}

  pingServiceA() {
    const startTs = Date.now();
    const pattern = { cmd: "ping" };
    const payload = {};
    return this.clientServiceA
      .send<string>(pattern, payload)
      .pipe(
        map((message: string) => ({ message, duration: Date.now() - startTs }))
      );
  }

  @GrpcMethod('HelloService', 'SayHello')
  sayHello(data: any): { message: string } {
    return { message: 'Hello, World!' };
  }
}
