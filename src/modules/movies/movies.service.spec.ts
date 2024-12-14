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
      count: jest.fn(),
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
    it('should return a paginated list of movies with metadata', async () => {
      const page = 1;
      const limit = 10;
      const totalCount = 25;
      const totalPages = Math.ceil(totalCount / limit);

      const mockMovies = [
        {
          id: 1,
          title: 'Test Movie 1',
          genres: [{ id: 1, name: 'Action' }],
        },
        {
          id: 2,
          title: 'Test Movie 2',
          genres: [{ id: 2, name: 'Comedy' }],
        },
      ];

      movieRepository.count.mockResolvedValue(totalCount);
      movieRepository.find.mockResolvedValue(mockMovies as any);

      const result = await service.findAll(page, limit);

      expect(movieRepository.count).toHaveBeenCalledTimes(1);
      expect(movieRepository.find).toHaveBeenCalledWith({
        relations: ['genres'],
        skip: (page - 1) * limit,
        take: limit,
      });

      expect(result).toEqual({
        movies: mockMovies.map((movie) => ({
          ...movie,
          genres: movie.genres.map((genre) => genre.id),
        })),
        currentPage: page,
        totalPages,
      });
    });

    it('should throw NotFoundException if requested page exceeds total pages', async () => {
      const page = 3;
      const limit = 10;
      const totalCount = 20;

      movieRepository.count.mockResolvedValue(totalCount);

      await expect(service.findAll(page, limit)).rejects.toThrow(new NotFoundException(`No movies found on page ${page}.`));

      expect(movieRepository.count).toHaveBeenCalledTimes(1);
      expect(movieRepository.find).not.toHaveBeenCalled();
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
