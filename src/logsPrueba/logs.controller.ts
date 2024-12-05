import { Controller, ForbiddenException, Get, Logger, Query, Req, UseGuards } from '@nestjs/common';

import { LogsService } from './logs.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('logs')
export class LogsController {

    constructor(private readonly logsService: LogsService) { }

    private readonly logger = new Logger(AuthGuard.name);

    @Get()

    async getLogs(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Req() req: { user: { roles: string[] } },
    ) {


        return this.logsService.getLogs(Number(page), Number(limit));
    }

}
