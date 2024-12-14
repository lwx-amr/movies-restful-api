import { Test, TestingModule } from '@nestjs/testing';
import { MoviesClientService } from './movies-client.service';
import { MoviesClientInterface } from './interfaces/movies-client.interface';
import { MOVIES_CLIENT } from '../../utils/constants';
import { MoviesList } from './types/movies-list.type';
import { Genre } from './types/genre.type';

describe('MoviesClientService', () => {
  let service: MoviesClientService;
  let moviesClient: jest.Mocked<MoviesClientInterface>;

  beforeEach(async () => {
    const mockMoviesClient: jest.Mocked<MoviesClientInterface> = {
      fetchMovies: jest.fn(),
      fetchGenres: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesClientService,
        {
          provide: MOVIES_CLIENT,
          useValue: mockMoviesClient,
        },
      ],
    }).compile();

    service = module.get<MoviesClientService>(MoviesClientService);
    moviesClient = module.get(MOVIES_CLIENT);
  });

  describe('getPopularMovies', () => {
    const mockMoviesList: MoviesList = {
      movies: [
        {
          tmdbId: 1,
          title: 'Test Movie',
          genres: [1, 2],
          adult: false,
          backdropPath: '/backdrop.jpg',
          originalLanguage: 'en',
          originalTitle: 'Test Movie',
          overview: 'Test overview',
          popularity: 100,
          posterPath: '/poster.jpg',
          releaseDate: '2024-01-01',
          video: false,
          voteAverage: 7.5,
          voteCount: 1000,
        },
      ],
      currentPage: 1,
      totalPages: 10,
    };

    it('should call fetchMovies with correct page number', async () => {
      moviesClient.fetchMovies.mockResolvedValue(mockMoviesList);

      const result = await service.getPopularMovies(1);

      expect(moviesClient.fetchMovies).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockMoviesList);
    });

    it('should propagate errors from client', async () => {
      const error = new Error('API Error');
      moviesClient.fetchMovies.mockRejectedValue(error);

      await expect(service.getPopularMovies(1)).rejects.toThrow(error);
    });

    it('should not modify the response from client', async () => {
      moviesClient.fetchMovies.mockResolvedValue(mockMoviesList);

      const result = await service.getPopularMovies(1);

      expect(result).toBe(mockMoviesList);
    });
  });

  describe('getGenres', () => {
    const mockGenres: Genre[] = [
      { id: 1, name: 'Action' },
      { id: 2, name: 'Comedy' },
    ];

    it('should call fetchGenres', async () => {
      moviesClient.fetchGenres.mockResolvedValue(mockGenres);

      const result = await service.getGenres();

      expect(moviesClient.fetchGenres).toHaveBeenCalled();
      expect(result).toEqual(mockGenres);
    });

    it('should propagate errors from client', async () => {
      const error = new Error('API Error');
      moviesClient.fetchGenres.mockRejectedValue(error);

      await expect(service.getGenres()).rejects.toThrow(error);
    });

    it('should not modify the response from client', async () => {
      moviesClient.fetchGenres.mockResolvedValue(mockGenres);

      const result = await service.getGenres();

      expect(result).toBe(mockGenres);
    });
  });
});
