import { Controller, Get, Body, Param, Patch, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { MoviesList } from './types/movies-list.type';
import { RateMovieDto } from './dtos/rate-movie.dto';
import { AccessTokenGuard } from '../../common/guards/access-token.guard';
import { MovieView } from './views/movie.view';
import { MovieDto } from './dtos/movie.dto';
import { SearchMoviesQueryDto } from './dtos/search-movies-query.dto';
import { ListMoviesQueryDto } from './dtos/list-movies-query.dto';
import { FilterMoviesQueryDto } from './dtos/filter-movies-query.dto';
import { CacheInterceptor } from '../../common/interceptors/cache.interceptor';
import { ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @ApiBearerAuth('Bearer')
  @UseGuards(AccessTokenGuard)
  @UseGuards(ThrottlerGuard)
  @ApiOperation({ summary: 'Get all movies with pagination' })
  @ApiResponse({
    status: 200,
    description: 'List of movies with pagination metadata.',
  })
  @UseInterceptors(CacheInterceptor)
  async findAll(@Query() query: ListMoviesQueryDto): Promise<MoviesList> {
    const { page = 1, limit = 10 } = query;
    return this.moviesService.findAll(page, limit);
  }

  @Get(':id')
  @ApiBearerAuth('Bearer')
  @UseGuards(AccessTokenGuard)
  @UseGuards(ThrottlerGuard)
  @ApiOperation({ summary: 'Get a movie by ID' })
  @ApiResponse({ status: 200, description: 'The movie data.' })
  @UseInterceptors(CacheInterceptor)
  async findOne(@Param('id') id: number): Promise<MovieDto> {
    const movie = await this.moviesService.findOne(id);
    return new MovieView(movie).renderOne();
  }

  @Patch(':id/rate')
  @ApiBearerAuth('Bearer')
  @UseGuards(AccessTokenGuard)
  @UseGuards(ThrottlerGuard)
  @ApiOperation({ summary: 'Rate a movie' })
  @ApiResponse({
    status: 200,
    description: 'The movie has been rated successfully.',
  })
  async rateMovie(@Param('id') id: number, @Body() rateMovieDto: RateMovieDto) {
    await this.moviesService.rateMovie(id, rateMovieDto);
    return { message: 'Movie rated successfully' };
  }

  @Get('list/filter')
  @ApiBearerAuth('Bearer')
  @UseGuards(AccessTokenGuard)
  @UseGuards(ThrottlerGuard)
  @ApiOperation({ summary: 'Filter movies based on criteria' })
  @ApiResponse({
    status: 200,
    description: 'Filtered list of movies.',
  })
  @ApiQuery({ name: 'adult', required: false, type: Boolean })
  @ApiQuery({ name: 'genre', required: false, type: String })
  @UseInterceptors(CacheInterceptor)
  async filterMovies(@Query() query: FilterMoviesQueryDto): Promise<MoviesList> {
    return this.moviesService.filterMovies(query);
  }

  @Get('list/search')
  @ApiBearerAuth('Bearer')
  @UseGuards(AccessTokenGuard)
  @UseGuards(ThrottlerGuard)
  @ApiOperation({ summary: 'Search movies by title or overview' })
  @ApiResponse({
    status: 200,
    description: 'Search results for movies.',
  })
  @ApiQuery({ name: 'query', required: true, type: String })
  @UseInterceptors(CacheInterceptor)
  async searchMovies(@Query() query: SearchMoviesQueryDto): Promise<MoviesList> {
    return this.moviesService.searchMovies(query.query, query.page, query.limit);
  }
}
