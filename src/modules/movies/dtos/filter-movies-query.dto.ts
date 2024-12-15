import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { ListMoviesQueryDto } from './list-movies-query.dto';
import { Transform } from 'class-transformer';
import { toBoolean } from '../../../utils/cast-helper';

export class FilterMoviesQueryDto extends PartialType(ListMoviesQueryDto) {
  @IsOptional()
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  adult?: boolean;

  @IsOptional()
  @IsString()
  genre?: string;
}
