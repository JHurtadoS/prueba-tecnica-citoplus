import { IsArray, IsUUID, IsEnum } from 'class-validator';

export class UpdateRolesDto {
  @IsUUID()
  userId!: string;

  @IsArray()
  @IsEnum(['Admin', 'Editor', 'Viewer'], { each: true })
  roles!: ('Admin' | 'Editor' | 'Viewer')[];
}
