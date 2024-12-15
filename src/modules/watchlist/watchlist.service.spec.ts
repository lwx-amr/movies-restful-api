import { Test, TestingModule } from '@nestjs/testing';
import { WatchlistService } from './watchlist.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Watchlist } from './entities/watchlist.entity';
import { MoviesService } from '../movies/movies.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('WatchlistService', () => {
  let service: WatchlistService;
  let mockWatchlistRepository: Partial<Repository<Watchlist>>;
  let mockMoviesService: Partial<MoviesService>;

  beforeEach(async () => {
    mockWatchlistRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn(),
        delete: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        execute: jest.fn(),
      }),
    };

    mockMoviesService = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WatchlistService,
        {
          provide: getRepositoryToken(Watchlist),
          useValue: mockWatchlistRepository,
        },
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
      ],
    }).compile();

    service = module.get<WatchlistService>(WatchlistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addToList', () => {
    it('should create a new watchlist and add a movie if watchlist does not exist', async () => {
      const userId = 1;
      const movieId = 100;
      const mockMovie = { id: movieId, title: 'Test Movie' };
      const mockWatchlist = {
        id: 1,
        user: { id: userId },
        movies: [],
      };

      (mockWatchlistRepository.findOne as jest.Mock).mockResolvedValue(null);
      (mockWatchlistRepository.create as jest.Mock).mockReturnValue(mockWatchlist);
      (mockMoviesService.findOne as jest.Mock).mockResolvedValue(mockMovie);
      (mockWatchlistRepository.save as jest.Mock).mockResolvedValue({
        ...mockWatchlist,
        movies: [mockMovie],
      });

      const result = await service.addToList(userId, movieId);

      expect(mockWatchlistRepository.create).toHaveBeenCalledWith({
        user: { id: userId },
        movies: [],
      });
      expect(mockWatchlistRepository.save).toHaveBeenCalledTimes(2);
      expect(result.movies).toContain(mockMovie);
    });

    it('should add a movie to an existing watchlist', async () => {
      const userId = 1;
      const movieId = 100;
      const mockMovie = { id: movieId, title: 'Test Movie' };
      const mockWatchlist = {
        id: 1,
        user: { id: userId },
        movies: [],
      };

      (mockWatchlistRepository.findOne as jest.Mock).mockResolvedValue(mockWatchlist);
      (mockMoviesService.findOne as jest.Mock).mockResolvedValue(mockMovie);
      (mockWatchlistRepository.save as jest.Mock).mockResolvedValue({
        ...mockWatchlist,
        movies: [mockMovie],
      });

      const result = await service.addToList(userId, movieId);

      expect(result.movies).toContain(mockMovie);
    });

    it('should throw NotFoundException if movie does not exist', async () => {
      const userId = 1;
      const movieId = 100;

      (mockWatchlistRepository.findOne as jest.Mock).mockResolvedValue({
        id: 1,
        user: { id: userId },
        movies: [],
      });
      (mockMoviesService.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.addToList(userId, movieId)).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if movie already in watchlist', async () => {
      const userId = 1;
      const movieId = 100;
      const mockMovie = { id: movieId, title: 'Test Movie' };
      const mockWatchlist = {
        id: 1,
        user: { id: userId },
        movies: [mockMovie],
      };

      (mockWatchlistRepository.findOne as jest.Mock).mockResolvedValue(mockWatchlist);
      (mockMoviesService.findOne as jest.Mock).mockResolvedValue(mockMovie);

      await expect(service.addToList(userId, movieId)).rejects.toThrow(ConflictException);
    });
  });

  describe('removeFromList', () => {
    it('should remove a movie from the watchlist', async () => {
      const userId = 1;
      const movieId = 100;
      const mockWatchlist = {
        id: 1,
        user: { id: userId },
        movies: [{ id: movieId }],
      };

      (mockWatchlistRepository.createQueryBuilder().getOne as jest.Mock).mockResolvedValue(mockWatchlist);

      await service.removeFromList(userId, movieId);

      expect(mockWatchlistRepository.createQueryBuilder().delete).toHaveBeenCalled();
      expect(mockWatchlistRepository.createQueryBuilder().from).toHaveBeenCalledWith('watchlists_movies_movies');
      expect(mockWatchlistRepository.createQueryBuilder().execute).toHaveBeenCalled();
    });

    it('should throw NotFoundException if movie not found in watchlist', async () => {
      const userId = 1;
      const movieId = 100;

      (mockWatchlistRepository.createQueryBuilder().getOne as jest.Mock).mockResolvedValue(null);

      await expect(service.removeFromList(userId, movieId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOneByUserId', () => {
    it('should retrieve user watchlist', async () => {
      const userId = 1;
      const mockWatchlist = {
        id: 1,
        user: { id: userId },
        movies: [{ id: 100, title: 'Movie 1' }],
      };

      (mockWatchlistRepository.findOne as jest.Mock).mockResolvedValue(mockWatchlist);

      const result = await service.findOneByUserId(userId);

      expect(result).toEqual(mockWatchlist);
      expect(mockWatchlistRepository.findOne).toHaveBeenCalledWith({
        where: { user: { id: userId } },
        relations: ['movies'],
      });
    });

    it('should throw NotFoundException if watchlist not found', async () => {
      const userId = 1;

      (mockWatchlistRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findOneByUserId(userId)).rejects.toThrow(NotFoundException);
    });
  });
});
