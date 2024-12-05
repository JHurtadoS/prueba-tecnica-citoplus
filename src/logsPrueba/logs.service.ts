import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class LogsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async logAction(
    userId: string,
    targetId: string,
    action: string,
    details: any,
  ): Promise<void> {
    const supabase = this.supabaseService.getAdminClient(); // Cliente administrativo con service_role

    const { error } = await supabase.from('audit_logs').insert({
      user_id: userId,
      target_id: targetId,
      action,
      details,
    });

    if (error) {
      console.error(`Error logging action: ${error.message}`);
    }
  }

  async getLogs(): Promise<any[]> {
    const supabase = this.supabaseService.getAdminClient();

    const { data: logs, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error fetching logs: ${error.message}`);
    }

    return logs;
  }
}
