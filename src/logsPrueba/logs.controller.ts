import { Controller, ForbiddenException, Get, Logger, Query, Req, UseGuards } from '@nestjs/common';
// import { GetLogsDto } from './get-logs.dto';
import { LogsService } from './logs.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('logs')
export class LogsController {

    constructor(private readonly logsService: LogsService) { }

    private readonly logger = new Logger(AuthGuard.name); // Logger de NestJS

    @Get()
    // @UseGuards(AuthGuard)

    async getLogs(
        @Query('page') page: number = 1, // Parámetro de paginación (default: 1)
        @Query('limit') limit: number = 10, // Límite de resultados por página (default: 10)
        @Req() req: { user: { roles: string[] } }, // Usuario autenticado
    ) {


        return this.logsService.getLogs(Number(page), Number(limit));
    }

}
