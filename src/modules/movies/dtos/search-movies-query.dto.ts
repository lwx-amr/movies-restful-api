import { PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ListMoviesQueryDto } from './list-movies-query.dto';

export class SearchMoviesQueryDto extends PartialType(ListMoviesQueryDto) {
  @IsString()
  query: string;
}
