import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly supabaseClient: SupabaseClient;
  private readonly supabaseAdminClient: SupabaseClient;

  constructor() {

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE;

    if (!supabaseUrl || !supabaseKey || !serviceRoleKey) {
      throw new Error('Missing Supabase environment variables');
    }


    this.supabaseClient = createClient(supabaseUrl, supabaseKey);


    this.supabaseAdminClient = createClient(supabaseUrl, serviceRoleKey);
  }


  getClient(): SupabaseClient {
    return this.supabaseClient;
  }


  getAdminClient(): SupabaseClient {
    return this.supabaseAdminClient;
  }


  getClientWithToken(token: string): SupabaseClient {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }

    return createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
  }
}
