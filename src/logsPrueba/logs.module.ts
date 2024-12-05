import { Module, forwardRef } from '@nestjs/common';
import { LogsService } from './logs.service';
import { SupabaseService } from '../supabase/supabase.service';
import { LogsController } from './logs.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({}),
  ],
  providers: [LogsService, SupabaseService],
  exports: [LogsService],
  controllers: [LogsController],
})
export class LogsModule { }
