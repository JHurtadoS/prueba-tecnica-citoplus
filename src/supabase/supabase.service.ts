import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
    private readonly supabaseClient;
    private readonly supabaseAdminClient;

    constructor() {
        // Cliente para operaciones regulares
        this.supabaseClient = createClient(
            process.env.SUPABASE_URL, // URL del proyecto
            process.env.SUPABASE_KEY, // Clave regular
        );

        // Cliente para operaciones administrativas
        this.supabaseAdminClient = createClient(
            process.env.SUPABASE_URL, // URL del proyecto
            process.env.SUPABASE_SERVICE_ROLE, // Clave de service_role
        );
    }

    getClient() {
        return this.supabaseClient;
    }

    getAdminClient() {
        return this.supabaseAdminClient;
    }

    getClientWithToken(token: string) {
        return createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_KEY, // Clave pública
            { global: { headers: { Authorization: `Bearer ${token}` } } }
        );
    }
}
