import {
  Controller,
  Put,
  Body,
  UseGuards,
  BadRequestException,
  Post,
  Req,
  Param,
  Get,
  ParseUUIDPipe,
  Patch,
  UnauthorizedException,
  Query,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateRolesDto } from './dto/update-roles.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Put('roles')
  @UseGuards(AuthGuard)
  async updateRoles(@Body() updateRolesDto: UpdateRolesDto) {
    try {
      return await this.usersService.updateRoles(
        updateRolesDto.userId,
        updateRolesDto.roles,
      );
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Invalid input data');
    }
  }

  @Post('create')
  @UseGuards(AuthGuard)
  async createUser(@Body() createUserDto: CreateUserDto, @Req() req: any) {
    const userToken = req.headers.authorization?.split(' ')[1];
    return this.usersService.createUser(createUserDto, userToken);
  }

  @Post('admin/create')
  async createUserWithServiceRole(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.usersService.createUserWithServiceRole(createUserDto);
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to create user');
    }
  }

  @Get()
  @UseGuards(AuthGuard)
  async listUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Req() req: { user: { roles: string[] } },
  ) {
    if (!req.user.roles.includes('Admin')) {
      throw new ForbiddenException('You do not have permission to list users');
    }

    return this.usersService.listUsers(Number(page), Number(limit));
  }

  @Patch(':id/disable')
  @UseGuards(AuthGuard)
  async disableUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: { user: { roles: string[] } },
  ) {
    if (!req.user.roles.includes('Admin')) {
      throw new UnauthorizedException(
        'You do not have permission to disable users',
      );
    }

    return this.usersService.disableUser(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: { user: { sub: string; roles: string[] } },
  ) {
    console.log(req.user);

    const isAdmin = req.user.roles.includes('Admin');

    const isSelf = req.user.sub === id;

    if (!isAdmin && !isSelf) {
      throw new UnauthorizedException(
        'You do not have permission to update this user',
      );
    }

    return this.usersService.updateUser(id, updateUserDto);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getUserById(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: { user: { sub: string; email: string; roles: string[] } },
  ) {
    const authUserId = req.user.sub;
    const isAdmin = req.user.roles.includes('Admin');
    return this.usersService.getUserById(id, authUserId, isAdmin);
  }
}
