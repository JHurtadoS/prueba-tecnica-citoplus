import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class LogsService {
  constructor(private readonly supabaseService: SupabaseService) { }

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

  async getLogs(page: number, limit: number,): Promise<{ total: number; totalPages: number; logs: any[] }> {
    const supabase = this.supabaseService.getClient();


    console.log(supabase);

    const { count, error: countError } = await supabase
      .from('audit_logs')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      throw new Error(`Error fetching logs count: ${countError.message}`);
    }

    const totalPages = count ? Math.ceil(count / limit) : 0;
    const offset = (page - 1) * limit;

    const { data: logs, error: logsError } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (logsError) {
      throw new Error(`Error fetching logs: ${logsError.message}`);
    }

    return { total: count ?? 0, totalPages, logs };
  }

}
