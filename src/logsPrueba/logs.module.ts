import { Module } from '@nestjs/common';
import { LogsService } from './logs.service';
import { SupabaseService } from '../supabase/supabase.service'; // Asegúrate de tener este servicio
import { LogsController } from './logs.controller';

@Module({
  providers: [LogsService, SupabaseService],
  exports: [LogsService],
  controllers: [LogsController], // Exportamos el servicio para usarlo en otros módulos
})
export class LogsModule {}
