import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AppService } from "./app.service";
import { OrderModule } from './order/order.module';
import { UserModule } from './user/user.module';
import { OrderService } from "./order/order.service";
import { AuthService } from "./auth/auth.service";
import { UserService } from "./user/user.service";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "SERVICE_A",
        transport: Transport.TCP,
        options: {
          host: "127.0.0.1",
          port: 3001,
        }
      }
    ]),
    OrderModule,
    UserModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService,OrderService,AuthService,UserService]
})
export class AppModule {}