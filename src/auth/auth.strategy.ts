import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Obtener JWT del header
      ignoreExpiration: false, // Verificar expiración
      secretOrKey: configService.get<string>('SUPABASE_JWT_SECRET'), // Clave secreta
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
