import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, Max } from 'class-validator';

export class RateMovieDto {
  @ApiProperty({ description: 'Rating for the movie', example: 4.5 })
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;
}
