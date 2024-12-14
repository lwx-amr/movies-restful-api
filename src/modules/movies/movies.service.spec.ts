import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dtos/create-movie.dto';
import { UpdateMovieDto } from './dtos/update-movie.dto';

describe('MoviesService', () => {
  let service: MoviesService;
  let movieRepository: jest.Mocked<Repository<Movie>>;

  beforeEach(async () => {
    const mockMovieRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(Movie),
          useValue: mockMovieRepository,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    movieRepository = module.get(getRepositoryToken(Movie));
  });

  describe('create', () => {
    it('should create and save a movie successfully', async () => {
      const createMovieDto = {
        tmdbId: 1,
        title: 'Test Movie',
        genres: [1, 2],
      } as CreateMovieDto;
      const createdMovie = { id: 1, ...createMovieDto } as any;

      movieRepository.findOne.mockResolvedValue(null);
      movieRepository.create.mockReturnValue(createdMovie);
      movieRepository.save.mockResolvedValue(createdMovie);

      const result = await service.create(createMovieDto);

      expect(movieRepository.findOne).toHaveBeenCalledWith({
        where: { tmdbId: createMovieDto.tmdbId },
      });
      expect(movieRepository.create).toHaveBeenCalledWith({
        ...createMovieDto,
        genres: [{ id: 1 }, { id: 2 }],
      });
      expect(movieRepository.save).toHaveBeenCalledWith(createdMovie);
      expect(result).toEqual(createdMovie);
    });

    it('should throw ConflictException if movie with the same TMDB ID exists', async () => {
      const createMovieDto = {
        tmdbId: 1,
        title: 'Test Movie',
        genres: [1, 2],
      } as CreateMovieDto;

      movieRepository.findOne.mockResolvedValue({ id: 1 } as Movie);

      await expect(service.create(createMovieDto)).rejects.toThrow(
        new ConflictException(`Movie with TMDB ID ${createMovieDto.tmdbId} already exists.`),
      );
    });
  });

  describe('findAll', () => {
    it('should return all movies', async () => {
      const movies: any = [
        { id: 1, title: 'Movie 1', tmdbId: 1, genres: [] },
        { id: 2, title: 'Movie 2', tmdbId: 2, genres: [] },
      ];

      movieRepository.find.mockResolvedValue(movies);

      const result = await service.findAll();

      expect(movieRepository.find).toHaveBeenCalledWith({ relations: ['genres'] });
      expect(result).toEqual(movies);
    });

    it('should throw NotFoundException if no movies are found', async () => {
      movieRepository.find.mockResolvedValue([]);

      await expect(service.findAll()).rejects.toThrow(new NotFoundException('No movies found.'));
    });
  });

  describe('findOne', () => {
    it('should return a movie by ID', async () => {
      const movie = { id: 1, title: 'Movie 1', tmdbId: 1, genres: [] } as any;

      movieRepository.findOne.mockResolvedValue(movie);

      const result = await service.findOne(1);

      expect(movieRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['genres'],
      });
      expect(result).toEqual(movie);
    });

    it('should throw NotFoundException if movie is not found', async () => {
      movieRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(new NotFoundException(`Movie with ID 1 not found.`));
    });
  });

  describe('update', () => {
    it('should update and return the updated movie', async () => {
      const updateMovieDto: UpdateMovieDto = { title: 'Updated Title' };
      const existingMovie = { id: 1, title: 'Old Title', tmdbId: 1, genres: [] } as Movie;
      const updatedMovie = { id: 1, title: 'Updated Title', tmdbId: 1, genres: [] } as Movie;

      movieRepository.findOne.mockResolvedValueOnce(existingMovie);
      movieRepository.findOne.mockResolvedValueOnce(updatedMovie);

      const result = await service.update(1, updateMovieDto);

      expect(movieRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(movieRepository.update).toHaveBeenCalledWith(1, updateMovieDto);
      expect(result).toEqual(updatedMovie);
    });

    it('should throw NotFoundException if movie is not found', async () => {
      movieRepository.findOne.mockResolvedValue(null);

      await expect(service.update(1, { title: 'Updated Title' })).rejects.toThrow(new NotFoundException(`Movie with ID 1 not found.`));
    });
  });

  describe('remove', () => {
    it('should remove a movie', async () => {
      const existingMovie = { id: 1, title: 'Movie 1', tmdbId: 1, genres: [] } as Movie;

      movieRepository.findOne.mockResolvedValue(existingMovie);

      await service.remove(1);

      expect(movieRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(movieRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if movie is not found', async () => {
      movieRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(new NotFoundException(`Movie with ID 1 not found.`));
    });
  });
});
