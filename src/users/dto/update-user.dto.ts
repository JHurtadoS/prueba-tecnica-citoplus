import { IsOptional, IsString, IsArray, IsBoolean, IsEnum } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    name?: string; // Nombre del usuario (opcional)

    @IsArray()
    @IsEnum(['Admin', 'Editor', 'Viewer'], { each: true })
    @IsOptional()
    roles?: ('Admin' | 'Editor' | 'Viewer')[]; // Roles del usuario (opcional)

    @IsBoolean()
    @IsOptional()
    is_active?: boolean; // Estado activo/inactivo del usuario (opcional)
}
