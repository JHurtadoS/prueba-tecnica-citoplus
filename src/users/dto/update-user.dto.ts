import {
  IsOptional,
  IsString,
  IsArray,
  IsBoolean,
  IsEnum,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsArray()
  @IsEnum(['Admin', 'Editor', 'Viewer'], { each: true })
  @IsOptional()
  roles?: ('Admin' | 'Editor' | 'Viewer')[];

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
