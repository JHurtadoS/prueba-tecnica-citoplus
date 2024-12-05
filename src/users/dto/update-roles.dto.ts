import { IsArray, IsUUID, IsEnum } from 'class-validator';

export class UpdateRolesDto {
  @IsUUID()
  userId!: string;

  @IsArray()
  @IsEnum(['Admin', 'Editor', 'Viewer'], { each: true }) // Valida cada valor del array
  roles!: ('Admin' | 'Editor' | 'Viewer')[];
}
