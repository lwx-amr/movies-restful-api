import { Test, TestingModule } from '@nestjs/testing';
import { WatchlistController } from './watchlist.controller';
import { WatchlistService } from './watchlist.service';
import { AddToWatchlistDto } from './dto/add-to-watchlist.dto';
import { ThrottlerModule } from '@nestjs/throttler';

describe('WatchlistController', () => {
  let controller: WatchlistController;
  let mockWatchlistService: Partial<WatchlistService>;

  beforeEach(async () => {
    mockWatchlistService = {
      addToList: jest.fn(),
      removeFromList: jest.fn(),
      findOneByUserId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot([
          {
            ttl: 60,
            limit: 10,
          },
        ]),
      ],
      controllers: [WatchlistController],
      providers: [
        {
          provide: WatchlistService,
          useValue: mockWatchlistService,
        },
      ],
    }).compile();

    controller = module.get<WatchlistController>(WatchlistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addToList', () => {
    it('should add a movie to the watchlist', async () => {
      const mockRequest = {
        user: {
          sub: 1,
        },
      };

      const addToWatchlistDto: AddToWatchlistDto = {
        movieId: 100,
      };

      const mockAddResponse = {
        userId: 1,
        movieId: 100,
      };

      (mockWatchlistService.addToList as jest.Mock).mockResolvedValue(mockAddResponse);

      const result = await controller.addToList(mockRequest, addToWatchlistDto);

      expect(mockWatchlistService.addToList).toHaveBeenCalledWith(1, 100);
      expect(result).toEqual(mockAddResponse);
    });
  });

  describe('removeFromList', () => {
    it('should remove a movie from the watchlist', async () => {
      const mockRequest = {
        user: {
          sub: 1,
        },
      };

      const movieId = 100;

      const mockRemoveResponse = {
        userId: 1,
        movieId: 100,
        removed: true,
      };

      (mockWatchlistService.removeFromList as jest.Mock).mockResolvedValue(mockRemoveResponse);

      const result = await controller.removeFromList(mockRequest, movieId);

      expect(mockWatchlistService.removeFromList).toHaveBeenCalledWith(1, movieId);
      expect(result).toEqual(mockRemoveResponse);
    });
  });

  describe('getUserWatchlist', () => {
    it('should retrieve user watchlist', async () => {
      const mockRequest = {
        user: {
          sub: 1,
        },
      };

      const mockWatchlistResponse = {
        userId: 1,
        movies: [
          { id: 100, title: 'Movie 1' },
          { id: 200, title: 'Movie 2' },
        ],
      };

      (mockWatchlistService.findOneByUserId as jest.Mock).mockResolvedValue(mockWatchlistResponse);

      const result = await controller.getUserWatchlist(mockRequest);

      expect(mockWatchlistService.findOneByUserId).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockWatchlistResponse);
    });
  });
});
