import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
    private readonly supabaseClient: SupabaseClient;
    private readonly supabaseAdminClient: SupabaseClient;

    constructor() {
        // Validar que las variables de entorno estén definidas
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_KEY;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE;

        if (!supabaseUrl || !supabaseKey || !serviceRoleKey) {
            throw new Error('Missing Supabase environment variables');
        }

        // Cliente para operaciones regulares
        this.supabaseClient = createClient(supabaseUrl, supabaseKey);

        // Cliente para operaciones administrativas
        this.supabaseAdminClient = createClient(supabaseUrl, serviceRoleKey);
    }

    // Cliente para operaciones regulares
    getClient(): SupabaseClient {
        return this.supabaseClient;
    }

    // Cliente para operaciones administrativas
    getAdminClient(): SupabaseClient {
        return this.supabaseAdminClient;
    }

    // Cliente con autenticación basada en token
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
