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
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  async validateUser(email: string, password: string): Promise<string> {
    const supabase = this.supabaseService.getClient();

    const { data: user, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !user) {
      await this.logsService.logAction(
        '',
        '',
        'LOGIN_FAILED',
        { email, error: error?.message },
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('roles')
      .eq('id', user.user.id)
      .single();

    if (!profile) {

      await this.logsService.logAction(user.user.id, '', 'PROFILE_NOT_FOUND', {
        email: user.user.email,
      });
      throw new UnauthorizedException('User profile not found');
    }

    await this.logsService.logAction(
      user.user.id,
      user.user.id,
      'LOGIN_SUCCESS',
      { email: user.user.email, roles: profile.roles },
    );

    const payload = {
      sub: user.user.id,
      email: user.user.email,
      roles: profile.roles,
    };

    return this.jwtService.sign(payload);
  }
}
