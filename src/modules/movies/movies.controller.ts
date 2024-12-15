import { Controller, Get, Body, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Movie } from './entities/movie.entity';
import { ListMoviesQueryDto } from './dtos/list-movies-query.dto';
import { MoviesList } from './types/movies-list.type';
import { RateMovieDto } from './dtos/rate-movie.dto';
import { AccessTokenGuard } from '../../common/guards/access-token.guard';

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @ApiBearerAuth('Bearer')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Get all movies with pagination' })
  @ApiResponse({
    status: 200,
    description: 'List of movies with pagination metadata.',
  })
  async findAll(@Query() query: ListMoviesQueryDto): Promise<MoviesList> {
    const { page = 1, limit = 10 } = query;
    return this.moviesService.findAll(page, limit);
  }

  @Get(':id')
  @ApiBearerAuth('Bearer')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Get a movie by ID' })
  @ApiResponse({ status: 200, description: 'The movie data.', type: Movie })
  async findOne(@Param('id') id: number): Promise<Movie> {
    return this.moviesService.findOne(id);
  }

  @Patch(':id/rate')
  @ApiBearerAuth('Bearer')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Rate a movie' })
  @ApiResponse({
    status: 200,
    description: 'The movie has been rated successfully.',
  })
  async rateMovie(@Param('id') id: number, @Body() rateMovieDto: RateMovieDto) {
    await this.moviesService.rateMovie(id, rateMovieDto);
    return { message: 'Movie rated successfully' };
  }
}
