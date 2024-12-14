import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dtos/create-movie.dto';
import { UpdateMovieDto } from './dtos/update-movie.dto';

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
    it('should call findAll service method and return a list of movies', async () => {
      const movies = [{ id: 1, title: 'Test Movie', overview: 'Test Description' } as any];

      moviesService.findAll.mockResolvedValue(movies);

      const result = await controller.findAll();

      expect(moviesService.findAll).toHaveBeenCalled();
      expect(result).toEqual(movies);
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
});
