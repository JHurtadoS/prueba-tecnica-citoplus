import { IsInt, Min } from 'class-validator';


export class GetLogsDto {

    @IsInt()
    @Min(1)
    page!: number;


    @IsInt()
    @Min(1)
    limit!: number;
}
