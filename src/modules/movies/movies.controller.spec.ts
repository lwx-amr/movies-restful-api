import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dtos/create-movie.dto';
import { UpdateMovieDto } from './dtos/update-movie.dto';
import { ListMoviesQueryDto } from './dtos/list-movies-query.dto';
import { MoviesList } from './types/movies-list.type';
import { RateMovieDto } from './dtos/rate-movie.dto';
import { NotFoundException } from '@nestjs/common';

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
    };

    const module: TestingModule = await Test.createTestingModule({
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

  describe('create', () => {
    it('should call create service method and return the created movie', async () => {
      const createMovieDto = { title: 'Test Movie', overview: 'Test Description' } as CreateMovieDto;
      const createdMovie = { id: 1, ...createMovieDto } as any;

      moviesService.create.mockResolvedValue(createdMovie);

      const result = await controller.create(createMovieDto);

      expect(moviesService.create).toHaveBeenCalledWith(createMovieDto);
      expect(result).toEqual(createdMovie);
    });
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

  describe('findOne', () => {
    it('should call findOne service method and return a movie by ID', async () => {
      const movie = { id: 1, title: 'Test Movie', overview: 'Test Description' } as any;

      moviesService.findOne.mockResolvedValue(movie);

      const result = await controller.findOne(1);

      expect(moviesService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(movie);
    });

    it('should propagate errors from service', async () => {
      const error = new Error('Movie not found');

      moviesService.findOne.mockRejectedValue(error);

      await expect(controller.findOne(1)).rejects.toThrow(error);
    });
  });

  describe('update', () => {
    it('should call update service method and return the updated movie', async () => {
      const updateMovieDto: UpdateMovieDto = { title: 'Updated Title' };
      const updatedMovie = { id: 1, title: 'Updated Title', overview: 'Test Description' } as any;

      moviesService.update.mockResolvedValue(updatedMovie);

      const result = await controller.update(1, updateMovieDto);

      expect(moviesService.update).toHaveBeenCalledWith(1, updateMovieDto);
      expect(result).toEqual(updatedMovie);
    });

    it('should propagate errors from service', async () => {
      const error = new Error('Update failed');

      moviesService.update.mockRejectedValue(error);

      await expect(controller.update(1, { title: 'Updated Title' })).rejects.toThrow(error);
    });
  });

  describe('remove', () => {
    it('should call remove service method and return void', async () => {
      moviesService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(1);

      expect(moviesService.remove).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });

    it('should propagate errors from service', async () => {
      const error = new Error('Delete failed');

      moviesService.remove.mockRejectedValue(error);

      await expect(controller.remove(1)).rejects.toThrow(error);
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
