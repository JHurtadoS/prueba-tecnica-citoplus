import { IsInt, Min } from 'class-validator';
// import { Type } from 'class-transformer';

export class GetLogsDto {
    // @Type(() => Number) // Transforma el valor recibido a un número
    @IsInt()
    @Min(1)
    page!: number;

    // @Type(() => Number) // Transforma el valor recibido a un número
    @IsInt()
    @Min(1)
    limit!: number;
}
