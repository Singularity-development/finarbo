import { IsInt, Min, IsOptional, Max, IsString } from 'class-validator';

export class PageRequestDto {
  @IsInt()
  @Min(1, { message: 'Start must be at least 1' })
  @IsOptional()
  start?: number = 1;

  @IsInt()
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(5000, { message: 'Limit cannot exceed 5000' })
  @IsOptional()
  limit?: number = 100;

  @IsString()
  @IsOptional()
  sort?: string;
}
