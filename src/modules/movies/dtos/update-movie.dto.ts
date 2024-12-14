import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateMovieDto } from './create-movie.dto';

export class CreateMovieWithoutGenresDto extends OmitType(CreateMovieDto, ['genres'] as const) {}

export class UpdateMovieDto extends PartialType(CreateMovieWithoutGenresDto) {}
