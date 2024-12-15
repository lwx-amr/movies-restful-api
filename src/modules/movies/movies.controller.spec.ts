import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { ListMoviesQueryDto } from './dtos/list-movies-query.dto';
import { FilterMoviesQueryDto } from './dtos/filter-movies-query.dto';
import { SearchMoviesQueryDto } from './dtos/search-movies-query.dto';
import { MoviesList } from './types/movies-list.type';
import { RateMovieDto } from './dtos/rate-movie.dto';
import { NotFoundException } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';

describe('MoviesController', () => {
  let controller: MoviesController;
  let moviesService: jest.Mocked<MoviesService>;

  beforeEach(async () => {
    const mockMoviesService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      rateMovie: jest.fn(),
      filterMovies: jest.fn(),
      searchMovies: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register(), ConfigModule],
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    moviesService = module.get(MoviesService);
  });

  describe('findAll', () => {
    it('should call findAll service method with pagination parameters and return a paginated list of movies', async () => {
      const query: ListMoviesQueryDto = { page: 2, limit: 5 };
      const paginatedMovies: MoviesList = {
        movies: [
          { id: 1, title: 'Test Movie', overview: 'Test Description' } as any,
          { id: 2, title: 'Another Movie', overview: 'Another Description' } as any,
        ],
        totalPages: 3,
        currentPage: 2,
      };

      moviesService.findAll.mockResolvedValue(paginatedMovies);

      const result = await controller.findAll(query);

      expect(moviesService.findAll).toHaveBeenCalledWith(query.page, query.limit);
      expect(result).toEqual(paginatedMovies);
    });

    it('should call findAll with default pagination parameters if none are provided', async () => {
      const query: ListMoviesQueryDto = {};
      const paginatedMovies: MoviesList = {
        movies: [
          { id: 1, title: 'Test Movie', overview: 'Test Description' } as any,
          { id: 2, title: 'Another Movie', overview: 'Another Description' } as any,
        ],
        totalPages: 5,
        currentPage: 1,
      };

      moviesService.findAll.mockResolvedValue(paginatedMovies);

      const result = await controller.findAll(query);

      expect(moviesService.findAll).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual(paginatedMovies);
    });
  });

  describe('filterMovies', () => {
    it('should call filterMovies service method with filter criteria and return filtered movies', async () => {
      const query: FilterMoviesQueryDto = { genre: 'Action' };
      const filteredMovies: MoviesList = {
        movies: [{ id: 1, title: 'Action Movie', overview: 'Great Action Movie' } as any],
        totalPages: 1,
        currentPage: 1,
      };

      moviesService.filterMovies.mockResolvedValue(filteredMovies);

      const result = await controller.filterMovies(query);

      expect(moviesService.filterMovies).toHaveBeenCalledWith(query);
      expect(result).toEqual(filteredMovies);
    });
  });

  describe('searchMovies', () => {
    it('should call searchMovies service method with query and pagination parameters and return search results', async () => {
      const query: SearchMoviesQueryDto = { query: 'Test', page: 1, limit: 10 };
      const searchResults: MoviesList = {
        movies: [{ id: 1, title: 'Test Movie', overview: 'Test Description' } as any],
        totalPages: 1,
        currentPage: 1,
      };

      moviesService.searchMovies.mockResolvedValue(searchResults);

      const result = await controller.searchMovies(query);

      expect(moviesService.searchMovies).toHaveBeenCalledWith(query.query, query.page, query.limit);
      expect(result).toEqual(searchResults);
    });

    it('should call searchMovies with default pagination if none is provided', async () => {
      const query: SearchMoviesQueryDto = { query: 'Test' };
      const searchResults: MoviesList = {
        movies: [{ id: 1, title: 'Test Movie', overview: 'Test Description' } as any],
        totalPages: 1,
        currentPage: 1,
      };

      moviesService.searchMovies.mockResolvedValue(searchResults);

      const result = await controller.searchMovies(query);

      expect(moviesService.searchMovies).toHaveBeenCalledWith(query.query, undefined, undefined);
      expect(result).toEqual(searchResults);
    });
  });

  describe('findOne', () => {
    it('should call findOne service method and return a movie by ID', async () => {
      const movie = { id: 1, title: 'Test Movie', overview: 'Test Description', genres: [{ id: 1, name: 'Horror' }] } as any;

      moviesService.findOne.mockResolvedValue(movie);

      const result = await controller.findOne(1);

      expect(moviesService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        ...movie,
        genres: ['Horror'],
      });
    });

    it('should propagate errors from service', async () => {
      const error = new Error('Movie not found');

      moviesService.findOne.mockRejectedValue(error);

      await expect(controller.findOne(1)).rejects.toThrow(error);
    });
  });

  describe('rateMovie', () => {
    it('should call the service method to rate a movie and return a success message', async () => {
      const id = 1;
      const rateMovieDto: RateMovieDto = { rating: 4.5 };

      moviesService.rateMovie.mockResolvedValue(undefined);

      const result = await controller.rateMovie(id, rateMovieDto);

      expect(moviesService.rateMovie).toHaveBeenCalledWith(id, rateMovieDto);
      expect(result).toEqual({ message: 'Movie rated successfully' });
    });

    it('should throw an error if the service method throws a NotFoundException', async () => {
      const id = 999;
      const rateMovieDto: RateMovieDto = { rating: 4.5 };

      moviesService.rateMovie.mockRejectedValue(new NotFoundException(`Movie with ID ${id} not found`));

      await expect(controller.rateMovie(id, rateMovieDto)).rejects.toThrow(new NotFoundException(`Movie with ID ${id} not found`));
      expect(moviesService.rateMovie).toHaveBeenCalledWith(id, rateMovieDto);
    });
  });
});
