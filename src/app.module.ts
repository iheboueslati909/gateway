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
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import * as path from 'path';

const ENV = process.env.NODE_ENV || 'dev';
dotenv.config({ path: path.resolve(process.cwd(), `.env.${ENV}`) });

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ClientsModule.register([
      {
        name: "SERVICE_A",
        transport: Transport.TCP,
        options: {
          host: "127.0.0.1",
          port: 3001,
        }
      },
      {
        name: "SERVICE_B",
        transport: Transport.TCP,
        options: {
          host: "127.0.0.1",
          port: 3002,
        }
      }
    ]),
    AuthModule,
    OrderModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService,OrderService,AuthService,UserService]
})
export class AppModule {}