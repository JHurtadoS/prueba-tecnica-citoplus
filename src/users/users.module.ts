import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SupabaseService } from '../supabase/supabase.service';
import { AuthModule } from '../auth/auth.module';
import { LogsModule } from '../logsPrueba/logs.module';

@Module({
  imports: [forwardRef(() => AuthModule), forwardRef(() => LogsModule)], // Referencia cruzada
  controllers: [UsersController],
  providers: [UsersService, SupabaseService],
  exports: [UsersService],
})
export class UsersModule { }

