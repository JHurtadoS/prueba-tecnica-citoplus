import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../users/dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        const token = await this.authService.validateUser(loginDto.email, loginDto.password);
        if (!token) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return { accessToken: token };
    }
}
