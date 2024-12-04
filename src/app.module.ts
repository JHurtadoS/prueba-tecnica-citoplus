import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { SupabaseService } from './supabase/supabase.service';
import { UsersModule } from './users/users.module';
import { LogsModule } from './logs/logs.module';

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
