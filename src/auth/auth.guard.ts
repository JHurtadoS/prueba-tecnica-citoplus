import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name); // Logger de NestJS

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    // 1. Verificar que existe el header de autorización
    if (!authHeader) {
      this.logger.warn('Authorization header is missing');
      throw new UnauthorizedException('Missing Authorization header');
    }

    const token = authHeader.split(' ')[1];

    // 2. Intentar decodificar el token JWT
    try {
      const decoded = this.jwtService.verify(token);
      this.logger.debug(`Decoded JWT 1: ${JSON.stringify(decoded)}`); // Log del token decodificado
      // 3. Consultar roles del usuario
      const roles = decoded.roles
        ? decoded.roles
        : await this.usersService.getUserRoles(decoded.sub);
      this.logger.debug(
        `User roles for 2 ${decoded.sub}: ${JSON.stringify(roles)}`,
      ); // Log de los roles obtenidos

      // 4. Agregar información del usuario al request
      request.user = { ...decoded, roles };

      this.logger.debug(`Decoded JWT: 3 ${JSON.stringify(request.user)}`); // Log del token decodificado

      return true;
    } catch (err: any) {
      this.logger.error(`Token verification failed: ${err.message}`); // Log del error
      throw new UnauthorizedException('Invalid token');
    }
  }
}
