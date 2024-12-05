import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LogsModule } from './logsPrueba/logs.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Configuración global
    AuthModule,
    UsersModule,
    LogsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
