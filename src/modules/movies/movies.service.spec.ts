import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateQueryBuilder } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';
import { RateMovieDto } from './dtos/rate-movie.dto';

describe('MoviesService', () => {
  let service: MoviesService;
  let movieRepository: jest.Mocked<Repository<Movie>>;

  beforeEach(async () => {
    const mockQueryBuilder = {
      setLock: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<UpdateQueryBuilder<Movie>>;

    const mockMovieRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      createQueryBuilder: jest.fn(() => mockQueryBuilder),
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

  describe('rateMovie', () => {
    it('should successfully rate a movie and calculate averageRating and ratingCount correctly', async () => {
      const id = 1;
      const rateMovieDto: RateMovieDto = { rating: 4.5 };
      const mockMovie = { id, title: 'Test Movie', ratingCount: 3, averageRating: 4.0 } as any;

      movieRepository.findOne.mockResolvedValue(mockMovie);

      const queryBuilder = movieRepository.createQueryBuilder();

      await service.rateMovie(id, rateMovieDto);

      expect(movieRepository.findOne).toHaveBeenCalledWith({ where: { id } });

      const setArgument = (queryBuilder as any).set.mock.calls[0][0];
      expect((setArgument as any).ratingCount()).toBe('ratingCount + 1');
      expect((setArgument as any).averageRating()).toBe('(averageRating * ratingCount + 4.5) / (ratingCount + 1)');

      expect(queryBuilder.setLock).toHaveBeenCalledWith('pessimistic_write');
      expect(queryBuilder.update).toHaveBeenCalledWith(Movie);
      expect(queryBuilder.where).toHaveBeenCalledWith('id = :id', { id });
      expect(queryBuilder.execute).toHaveBeenCalled();
    });

    it('should throw NotFoundException if the movie does not exist', async () => {
      const id = 999;
      const rateMovieDto: RateMovieDto = { rating: 4.5 };

      movieRepository.findOne.mockResolvedValue(null);

      await expect(service.rateMovie(id, rateMovieDto)).rejects.toThrow(new NotFoundException(`Movie with ID ${id} not found.`));

      expect(movieRepository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(movieRepository.createQueryBuilder().execute).not.toHaveBeenCalled();
    });
  });
});
