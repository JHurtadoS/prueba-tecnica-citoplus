import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SupabaseService } from '../supabase/supabase.service';
import { AuthModule } from '../auth/auth.module';


@Module({
    imports: [AuthModule], // Importar AuthModule para usar AuthService
    controllers: [UsersController],
    providers: [UsersService, SupabaseService],
    exports: [UsersService],
})
export class UsersModule { }
