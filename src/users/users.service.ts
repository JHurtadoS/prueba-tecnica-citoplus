// @ts-nocheck

import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Database } from '../supabase/database.types';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LogsService } from '../logsPrueba/logs.service';

type Profile = Database['public']['Tables']['profiles']['Row'];

@Injectable()
export class UsersService {
  constructor(private readonly supabaseService: SupabaseService) { }

  private readonly logger = new Logger(UsersService.name);

  async updateRoles(
    userId: string,
    roles: ('Admin' | 'Editor' | 'Viewer')[],
  ): Promise<Profile | null> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('profiles')
      .update({ roles })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    return data;
  }

  async createUser(
    createUserDto: CreateUserDto,
    userToken: string,
  ): Promise<{ authUser: any; profile: Profile }> {
    const supabase = this.supabaseService.getClientWithToken(userToken);


    const { data: authUser, error: authError } = await supabase.auth.signUp({
      email: createUserDto.email,
      password: createUserDto.password,
    });

    if (authError) {
      throw new BadRequestException(
        `Error creating auth user: ${authError.message}`,
      );
    }


    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authUser.user.id,
        name: createUserDto.name,
        roles: createUserDto.roles,
        is_active: true,
      })
      .select()
      .single();

    if (profileError) {
      throw new BadRequestException(
        `Error creating profile: ${profileError.message}`,
      );
    }

    return { authUser: authUser.user, profile };
  }

  async createUserWithServiceRole(createUserDto: CreateUserDto) {
    const supabaseAdmin = this.supabaseService.getAdminClient();


    const { data: authUser, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: createUserDto.email,
        password: createUserDto.password,
        email_confirm: true,
      });

    if (authError) {
      throw new BadRequestException(
        `Error creando usuario en auth.users: ${authError.message}`,
      );
    }


    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authUser.user.id,
        name: createUserDto.name,
        roles: createUserDto.roles,
        is_active: true,
      })
      .select()
      .single();

    if (profileError) {

      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      throw new BadRequestException(
        `Error creando perfil: ${profileError.message}`,
      );
    }

    return { authUser, profile };
  }

  async getUserById(userId: string, authUserId: string, isAdmin: boolean) {
    const supabase = this.supabaseService.getClient();



    const query = supabase.from('profiles').select('*').eq('id', userId);

    if (!isAdmin) {
      query.eq('id', authUserId);
    }

    const { data: user, error } = await query.single();

    if (error || !user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user;
  }

  async getUserRoles(userId: string): Promise<string[]> {
    this.logger.debug(`Fetching roles for user ID: ${userId}`);

    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('roles')
      .eq('id', userId)
      .limit(1);


    this.logger.debug(
      `Supabase response for userId ${userId}: data = ${JSON.stringify(data)}, error = ${error?.message}`,
    );

    if (error) {
      this.logger.error(
        `Error fetching roles for user ID ${userId}: ${error.message}`,
      );
      throw new Error(`Roles not found for user ID ${userId}`);
    }

    this.logger.debug(
      `Roles fetched for user ID ${userId}: ${JSON.stringify(data?.roles)}`,
    );
    return data?.roles || [];
  }

  async disableUser(userId: string): Promise<{ message: string }> {
    const supabase = this.supabaseService.getAdminClient();


    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('id, is_active')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (!user.is_active) {
      throw new BadRequestException(
        `User with ID ${userId} is already disabled`,
      );
    }


    const { error: profileUpdateError } = await supabase
      .from('profiles')
      .update({ is_active: false })
      .eq('id', userId);

    if (profileUpdateError) {
      throw new BadRequestException(
        `Error disabling user in profiles: ${profileUpdateError.message}`,
      );
    }


    const { error: authUpdateError } = await supabase.auth.admin.updateUserById(
      userId,
      {
        user_metadata: { is_active: false },
      },
    );

    if (authUpdateError) {
      throw new BadRequestException(
        `Error disabling user in auth.users: ${authUpdateError.message}`,
      );
    }

    return {
      message: `User with ID ${userId} has been disabled in profiles and auth.users`,
    };
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<{ message: string }> {
    const supabase = this.supabaseService.getAdminClient();


    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }


    const { error: profileUpdateError } = await supabase
      .from('profiles')
      .update(updateUserDto)
      .eq('id', userId);

    if (profileUpdateError) {
      throw new BadRequestException(
        `Error updating profile: ${profileUpdateError.message}`,
      );
    }

    return { message: `User with ID ${userId} has been updated` };
  }

  async listUsers(page: number, limit: number): Promise<any> {
    const supabase = this.supabaseService.getAdminClient();


    const offset = (page - 1) * limit;


    const {
      data: users,
      error: usersError,
      count,
    } = await supabase
      .from('profiles')
      .select('id, name, roles, is_active', { count: 'exact' })
      .range(offset, offset + limit - 1);

    if (usersError) {
      throw new ForbiddenException(
        `Error fetching users: ${usersError.message}`,
      );
    }

    // 3. Calcular total de páginas
    const totalPages = Math.ceil(count / limit);

    return {
      users,
      total: count,
      page,
      totalPages,
    };
  }
}
