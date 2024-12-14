import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { DatabaseSyncService } from './database-sync.service';
import { MoviesClientService } from '../movies-client/movies-client.service';
import { Movie } from '../movies/entities/movie.entity';
import { Genre } from '../movies/entities/genre.entity';

describe('DatabaseSyncService', () => {
  let service: DatabaseSyncService;
  let moviesClientService: jest.Mocked<MoviesClientService>;
  let movieRepository: jest.Mocked<Repository<Movie>>;
  let genreRepository: jest.Mocked<Repository<Genre>>;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    const mockMoviesClientService = {
      getGenres: jest.fn(),
      getPopularMovies: jest.fn(),
    };

    const mockMovieRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
    };

    const mockGenreRepository = {
      create: jest.fn(),
      save: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseSyncService,
        {
          provide: MoviesClientService,
          useValue: mockMoviesClientService,
        },
        {
          provide: getRepositoryToken(Movie),
          useValue: mockMovieRepository,
        },
        {
          provide: getRepositoryToken(Genre),
          useValue: mockGenreRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<DatabaseSyncService>(DatabaseSyncService);
    moviesClientService = module.get(MoviesClientService);
    movieRepository = module.get(getRepositoryToken(Movie));
    genreRepository = module.get(getRepositoryToken(Genre));
    configService = module.get(ConfigService);
  });

  describe('syncGenres', () => {
    it('should sync genres successfully', async () => {
      const mockGenres = [
        { id: 1, name: 'Action' },
        { id: 2, name: 'Comedy' },
      ];

      moviesClientService.getGenres.mockResolvedValue(mockGenres);
      genreRepository.create.mockImplementation((genre) => genre as Genre);
      genreRepository.save.mockResolvedValue(undefined);

      await service.syncGenres();

      expect(moviesClientService.getGenres).toHaveBeenCalledTimes(1);
      expect(moviesClientService.getGenres).toHaveBeenCalledWith();
      expect(genreRepository.create).toHaveBeenCalledTimes(2);
      expect(genreRepository.create).toHaveBeenNthCalledWith(1, { id: 1, name: 'Action' });
      expect(genreRepository.create).toHaveBeenNthCalledWith(2, { id: 2, name: 'Comedy' });
      expect(genreRepository.save).toHaveBeenCalledWith([
        { id: 1, name: 'Action' },
        { id: 2, name: 'Comedy' },
      ]);
    });

    it('should handle empty genres list', async () => {
      moviesClientService.getGenres.mockResolvedValue([]);
      genreRepository.save.mockResolvedValue(undefined);

      await service.syncGenres();

      expect(moviesClientService.getGenres).toHaveBeenCalledWith();
      expect(genreRepository.save).toHaveBeenCalledWith([]);
      expect(genreRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('syncMovies', () => {
    const mockMovies: any = [
      {
        tmdbId: 1,
        title: 'Movie 1',
        genres: [1, 2],
      },
      {
        tmdbId: 2,
        title: 'Movie 2',
        genres: [2, 3],
      },
    ];

    beforeEach(() => {
      configService.get.mockReturnValue(1);
    });

    it('should sync new movies successfully', async () => {
      moviesClientService.getPopularMovies.mockResolvedValue({
        movies: mockMovies,
        currentPage: 1,
        totalPages: 1,
      });

      movieRepository.find.mockResolvedValue([]);
      movieRepository.save.mockResolvedValue(undefined);

      await service.syncMovies();

      expect(moviesClientService.getPopularMovies).toHaveBeenCalledWith(1);
      expect(movieRepository.find).toHaveBeenCalledWith({
        where: { tmdbId: expect.any(Object) },
        select: ['tmdbId'],
      });
      expect(movieRepository.save).toHaveBeenCalledWith(
        mockMovies.map((movie) => ({
          ...movie,
          genres: movie.genres.map((id) => ({ id })),
        })),
      );
    });

    it('should skip existing movies', async () => {
      moviesClientService.getPopularMovies.mockResolvedValue({
        movies: mockMovies,
        currentPage: 1,
        totalPages: 3,
      });

      movieRepository.find.mockResolvedValue([{ tmdbId: 1 } as any]);

      await service.syncMovies();

      expect(movieRepository.find).toHaveBeenCalledWith({
        where: { tmdbId: expect.any(Object) },
        select: ['tmdbId'],
      });
      expect(movieRepository.save).toHaveBeenCalledWith([
        {
          ...mockMovies[1],
          genres: mockMovies[1].genres.map((id) => ({ id })),
        },
      ]);
    });
  });
});
