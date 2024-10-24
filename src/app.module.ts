import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AppService } from "./app.service";
import { AuthService } from "./auth/auth.service";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { join } from "path";

const ENV = process.env.NODE_ENV || 'dev';
dotenv.config({ path: path.resolve(process.cwd(), `.env.${ENV}`) });

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ClientsModule.register([
      {
        name: "USER_MS",
        transport: Transport.GRPC,
        options: {
          package: 'userms', // Proto package name
          protoPath: join(__dirname, '../proto/user-app.proto'), // Path to user.proto file
          url: "127.0.0.1:3001", // gRPC server URL for UserService
        },
      },
      {
        name: "EVENTS_MS",
        transport: Transport.GRPC,
        options: {
          package: 'eventsms', // Proto package name
          protoPath: join(__dirname, '../proto/events-app.proto'), // Path to events.proto file
          url: "127.0.0.1:3002", // gRPC server URL for EventsService
        },
      },
    ]),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService,AuthService]
})
export class AppModule {}