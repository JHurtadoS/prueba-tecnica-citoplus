import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LogsService } from '../logsPrueba/logs.service';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly supabaseService: SupabaseService,
    private readonly logsService: LogsService,
  ) { }

  async validateToken(token: string): Promise<any> {
    try {
      const payload = this.jwtService.verify(token);
      return payload; // Retorna el payload decodificado si es válido
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  async validateUser(email: string, password: string): Promise<string> {
    const supabase = this.supabaseService.getClient();

    // 1. Verificar credenciales
    const { data: user, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !user) {
      // Registrar intento fallido de inicio de sesión
      await this.logsService.logAction(
        '', // No hay usuario identificado
        '', // No hay objetivo afectado
        'LOGIN_FAILED',
        { email, error: error?.message },
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. Consultar los roles desde la tabla `profiles`
    const { data: profile } = await supabase
      .from('profiles')
      .select('roles')
      .eq('id', user.user.id)
      .single();

    if (!profile) {
      // Registrar que el perfil no se encontró
      await this.logsService.logAction(user.user.id, '', 'PROFILE_NOT_FOUND', {
        email: user.user.email,
      });
      throw new UnauthorizedException('User profile not found');
    }

    // 3. Registrar inicio de sesión exitoso
    await this.logsService.logAction(
      user.user.id, // ID del usuario que inició sesión
      user.user.id, // ID objetivo afectado (en este caso, el mismo usuario)
      'LOGIN_SUCCESS',
      { email: user.user.email, roles: profile.roles },
    );

    // 4. Crear el payload del token
    const payload = {
      sub: user.user.id,
      email: user.user.email,
      roles: profile.roles, // Incluir roles en el payload
    };

    return this.jwtService.sign(payload);
  }
}
