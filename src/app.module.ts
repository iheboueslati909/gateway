import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AppService } from "./app.service";
import { AuthService } from "./auth/auth.service";
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
        name: "USER_MS",
        transport: Transport.TCP,
        options: {
          host: "127.0.0.1",
          port: 3001,
        }
      },
      {
        name: "EVENTS_MS",
        transport: Transport.TCP,
        options: {
          host: "127.0.0.1",
          port: 3002,
        }
      }
    ]),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService,AuthService]
})
export class AppModule {}