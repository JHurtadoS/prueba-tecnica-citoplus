import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { SupabaseService } from './supabase/supabase.service';
import { AuthModule } from './auth/auth.module';
import { LogsModule } from './logsPrueba/logs.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    LogsModule,
  ],
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService, SupabaseService],
})
export class AppModule { }
