import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HttpClientProvider } from '../../../shared/http-client/http-client.provider';
import { TMDBMoviesClient } from './tmdb-movies-client';
import { TmdbMovie } from '../types/tmdb-movie.type';

describe('TMDBMoviesClient', () => {
  let client: TMDBMoviesClient;
  let httpClient: jest.Mocked<HttpClientProvider>;
  let configService: jest.Mocked<ConfigService>;

  const mockConfig = {
    'tmdb.apiKey': 'test-api-key',
    'tmdb.baseUrl': 'https://api.tmdb.org/3',
  };

  beforeEach(async () => {
    const mockHttpClient = {
      get: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn((key: string) => mockConfig[key]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TMDBMoviesClient,
        {
          provide: HttpClientProvider,
          useValue: mockHttpClient,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    client = module.get<TMDBMoviesClient>(TMDBMoviesClient);
    httpClient = module.get(HttpClientProvider);
    configService = module.get(ConfigService);
  });

  describe('constructor', () => {
    it('should initialize with correct configuration', () => {
      expect(configService.get).toHaveBeenCalledWith('tmdb.apiKey');
      expect(configService.get).toHaveBeenCalledWith('tmdb.baseUrl');
      expect(configService.get).toHaveBeenCalledTimes(2);
    });
  });

  describe('fetchMovies', () => {
    const mockTmdbResponse: any = {
      data: {
        page: 1,
        total_pages: 500,
        results: [
          {
            id: 1,
            title: 'Test Movie',
            original_title: 'Test Movie Original',
            overview: 'Test Overview',
            poster_path: '/poster.jpg',
            backdrop_path: '/backdrop.jpg',
            release_date: '2024-01-01',
            vote_average: 7.5,
            vote_count: 1000,
            popularity: 500.5,
            adult: false,
            video: false,
            original_language: 'en',
            genre_ids: [1, 2, 3],
          },
        ],
      },
    };

    it('should fetch movies with default page', async () => {
      httpClient.get.mockResolvedValue(mockTmdbResponse);

      const result = await client.fetchMovies();

      expect(httpClient.get).toHaveBeenCalledWith('https://api.tmdb.org/3/movie/popular?api_key=test-api-key&page=1');
      expect(httpClient.get).toHaveBeenCalledTimes(1);
      expect(result.movies[0]).toHaveProperty('tmdbId', 1);
    });

    it('should fetch movies with specified page', async () => {
      httpClient.get.mockResolvedValue(mockTmdbResponse);

      await client.fetchMovies(2);

      expect(httpClient.get).toHaveBeenCalledWith('https://api.tmdb.org/3/movie/popular?api_key=test-api-key&page=2');
      expect(httpClient.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('fetchGenres', () => {
    const mockGenresResponse: any = {
      data: {
        genres: [
          { id: 1, name: 'Action' },
          { id: 2, name: 'Comedy' },
        ],
      },
    };

    it('should fetch genres with correct URL', async () => {
      httpClient.get.mockResolvedValue(mockGenresResponse);

      await client.fetchGenres();

      expect(httpClient.get).toHaveBeenCalledWith('https://api.tmdb.org/3/genre/movie/list?api_key=test-api-key');
      expect(httpClient.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('formatMovies', () => {
    const mockTmdbMovie: TmdbMovie = {
      id: 1,
      title: 'Test Movie',
      original_title: 'Test Movie Original',
      overview: 'Test Overview',
      poster_path: '/poster.jpg',
      backdrop_path: '/backdrop.jpg',
      release_date: '2024-01-01',
      vote_average: 7.5,
      vote_count: 1000,
      popularity: 500.5,
      adult: false,
      video: false,
      original_language: 'en',
      genre_ids: [1, 2, 3],
    };

    it('should format movie data correctly with exact input match', () => {
      const result = client.formatMovies([mockTmdbMovie]);

      expect(result[0]).toEqual({
        tmdbId: 1,
        title: 'Test Movie',
        originalTitle: 'Test Movie Original',
        overview: 'Test Overview',
        posterPath: '/poster.jpg',
        backdropPath: '/backdrop.jpg',
        releaseDate: '2024-01-01',
        voteAverage: 7.5,
        voteCount: 1000,
        popularity: 500.5,
        adult: false,
        video: false,
        originalLanguage: 'en',
        genres: [1, 2, 3],
      });
    });

    it('Return null when there is no data', () => {
      const result = client.formatMovies([{} as TmdbMovie]);

      expect(result[0]).toEqual({
        tmdbId: null,
        title: null,
        originalTitle: null,
        overview: null,
        posterPath: null,
        backdropPath: null,
        releaseDate: null,
        voteAverage: null,
        voteCount: null,
        popularity: null,
        adult: null,
        video: null,
        originalLanguage: null,
        genres: null,
      });
    });
  });
});
