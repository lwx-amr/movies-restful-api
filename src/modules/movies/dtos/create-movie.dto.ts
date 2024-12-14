import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsArray, IsDateString, Min } from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({ description: 'The TMDB ID of the movie' })
  @IsNumber()
  tmdbId: number;

  @ApiProperty({ description: 'Whether the movie is for adults', default: false, required: false })
  @IsBoolean()
  adult?: boolean;

  @ApiProperty({ description: 'The path to the backdrop image', nullable: true, required: false })
  @IsString()
  backdropPath?: string;

  @ApiProperty({ description: 'The original language of the movie' })
  @IsString()
  originalLanguage: string;

  @ApiProperty({ description: 'The original title of the movie', nullable: true, required: false })
  @IsString()
  originalTitle?: string;

  @ApiProperty({ description: 'The overview or summary of the movie', nullable: true, required: false })
  @IsString()
  overview?: string;

  @ApiProperty({ description: 'The popularity score of the movie', nullable: true, required: false })
  @IsNumber()
  popularity?: number;

  @ApiProperty({ description: 'The path to the poster image', nullable: true, required: false })
  @IsString()
  posterPath?: string;

  @ApiProperty({
    description: 'The release date of the movie',
    nullable: true,
    required: false,
    example: '2024-01-01',
  })
  @IsDateString()
  releaseDate?: string;

  @ApiProperty({ description: 'The title of the movie' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Whether the movie has a video', default: false, required: false })
  @IsBoolean()
  video?: boolean;

  @ApiProperty({ description: 'The average vote score of the movie', nullable: true, required: false })
  @IsNumber()
  @Min(0)
  voteAverage?: number;

  @ApiProperty({ description: 'The vote count for the movie', nullable: true, required: false })
  @IsNumber()
  @Min(0)
  voteCount?: number;

  @ApiProperty({ description: 'Array of genre IDs associated with the movie', isArray: true })
  @IsArray()
  @IsNumber({}, { each: true })
  genres: number[];
}
