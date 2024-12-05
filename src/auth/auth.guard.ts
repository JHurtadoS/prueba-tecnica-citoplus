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
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      this.logger.warn('Authorization header is missing');
      throw new UnauthorizedException('Missing Authorization header');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = this.jwtService.verify(token);
      this.logger.debug(`Decoded JWT 1: ${JSON.stringify(decoded)}`);
      const roles = decoded.roles
        ? decoded.roles
        : await this.usersService.getUserRoles(decoded.sub);
      this.logger.debug(
        `User roles for 2 ${decoded.sub}: ${JSON.stringify(roles)}`,
      );
      request.user = { ...decoded, roles };

      this.logger.debug(`Decoded JWT: 3 ${JSON.stringify(request.user)}`);

      return true;
    } catch (err: any) {
      this.logger.error(`Token verification failed: ${err.message}`);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
