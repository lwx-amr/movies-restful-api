import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class AddToWatchlistDto {
  @ApiProperty({ description: 'The ID of the movie to add to the watchlist.', example: 101 })
  @IsNumber()
  @IsNotEmpty()
  movieId: number;
}
