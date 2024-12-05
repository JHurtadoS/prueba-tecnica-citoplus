import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsArray,
  IsEnum,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsArray()
  @IsEnum(['Admin', 'Editor', 'Viewer'], { each: true })
  roles!: ('Admin' | 'Editor' | 'Viewer')[];
}
