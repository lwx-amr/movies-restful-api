import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dtos/create-movie.dto';
import { UpdateMovieDto } from './dtos/update-movie.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Movie } from './entities/movie.entity';
import { ListMoviesQueryDto } from './dtos/list-movies-query.dto';
import { MoviesList } from './types/movies-list.type';

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new movie' })
  @ApiResponse({ status: 201, description: 'The movie has been created.', type: Movie })
  async create(@Body() createMovieDto: CreateMovieDto): Promise<Movie> {
    return this.moviesService.create(createMovieDto);
  }

  @Get()
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
  @ApiOperation({ summary: 'Get a movie by ID' })
  @ApiResponse({ status: 200, description: 'The movie data.', type: Movie })
  async findOne(@Param('id') id: number): Promise<Movie> {
    return this.moviesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a movie' })
  @ApiResponse({ status: 200, description: 'The updated movie.', type: Movie })
  async update(@Param('id') id: number, @Body() updateMovieDto: UpdateMovieDto): Promise<Movie> {
    return this.moviesService.update(id, updateMovieDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a movie' })
  @ApiResponse({ status: 204, description: 'The movie has been deleted.' })
  async remove(@Param('id') id: number): Promise<void> {
    return this.moviesService.remove(id);
  }
}
