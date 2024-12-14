import { IsOptional, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { toNumber } from '../../../utils/cast-helper';
import { Transform } from 'class-transformer';

export class ListMoviesQueryDto {
  @ApiProperty({ description: 'Page number for pagination', example: 1, required: false })
  @IsOptional()
  @Transform(({ value }) => toNumber(value))
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiProperty({ description: 'Number of movies per page', example: 10, required: false })
  @IsOptional()
  @Transform(({ value }) => toNumber(value))
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;
}
